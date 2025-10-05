from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from schema import PlaidItems, check_plaid_item_id, search_user
import plaid
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.auth_get_request import AuthGetRequest
from plaid.model.processor_stripe_bank_account_token_create_request import ProcessorStripeBankAccountTokenCreateRequest
from plaid.api import plaid_api
from plaid.configuration import Configuration
from plaid.api_client import ApiClient
import stripe
import os
from datetime import datetime

# Plaid configuration
PLAID_CLIENT_ID = os.getenv("PLAID_CLIENT_ID")
PLAID_SECRET = os.getenv("PLAID_SECRET")
PLAID_ENV = os.getenv("PLAID_ENV", "sandbox")  # Default to sandbox

# Stripe configuration
stripe.api_key = os.getenv("STRIPE_KEY")

# Initialize Plaid client
configuration = Configuration(
    host=plaid.Environment.Sandbox if PLAID_ENV == "sandbox" else plaid.Environment.Production,
    api_key={
        'clientId': PLAID_CLIENT_ID,
        'secret': PLAID_SECRET,
    }
)
api_client = ApiClient(configuration)
client = plaid_api.PlaidApi(api_client)

payments_bp = Blueprint('payments', __name__, template_folder='templates')

def create_link_token(user_id, country_code="CA"):
    try:
        request = LinkTokenCreateRequest(
            client_id=PLAID_CLIENT_ID,
            secret=PLAID_SECRET,
            client_name="Mojo Payments",
            language="en",
            country_codes=[CountryCode(country_code)],
            user=LinkTokenCreateRequestUser(client_user_id=user_id),
            products=[Products('auth'), Products('transactions')]
        )
        response = client.link_token_create(request)
        return response.to_dict().get('link_token')
    except plaid.ApiException as e:
        print(f"Plaid error in create_link_token: {e}")
        return None

def get_plaid_auth(access_token):
    try:
        request = AuthGetRequest(access_token=access_token)
        response = client.auth_get(request)
        auth_data = response.to_dict()

        print(f"Plaid Auth response: {auth_data}")

        accounts = auth_data.get('accounts', [])
        numbers = auth_data.get('numbers', {})

        for account in accounts:
            if account.get('type') == 'depository' and account.get('subtype') in ['checking', 'savings']:
                account_id = account['account_id']
                
                # Handle ACH (US)
                for ach in numbers.get('ach', []):
                    if ach['account_id'] == account_id:
                        print(f"Found US ACH account: {ach}")
                        return {
                            'account_id': account_id,
                            'account_number': ach['account'],
                            'routing_number': ach['routing'],
                            'currency': account['balances']['iso_currency_code']
                        }

                # Handle EFT (Canada)
                for eft in numbers.get('eft', []):
                    if eft['account_id'] == account_id:
                        print(f"Found Canadian EFT account: {eft}")
                        return {
                            'account_id': account_id,
                            'account_number': eft['account'],
                            'routing_number': f"{eft['institution']}{eft['branch']}",
                            'currency': account['balances']['iso_currency_code']
                        }

                print(f"No ACH or EFT numbers found for account: {account_id}")

        print(f"No suitable depository account found for access_token: {access_token}")
        return None

    except plaid.ApiException as e:
        print(f"Plaid Auth error: {e}")
        return None

def create_stripe_bank_token(access_token, account_id):
    """
    Create a Stripe bank account token or ID, falling back to direct creation if Plaid processor fails.
    Args:
        access_token (str): Plaid access_token.
        account_id (str): Plaid account_id.
    Returns:
        str: Stripe bank account token or ID, or None if failed.
    """
    try:
        # Try Plaid's Stripe processor token endpoint
        request = ProcessorStripeBankAccountTokenCreateRequest(
            access_token=access_token,
            account_id=account_id
        )
        response = client.processor_stripe_bank_account_token_create(request)
        print(f"Stripe bank token created: {response['stripe_bank_account_token']}")
        return response['stripe_bank_account_token']
    except Exception as e:
        print(e)

@payments_bp.route("/bank", methods=["POST"])
@jwt_required()
def add_bank():
    if request.method == "POST":
        username = get_jwt_identity()
        user = search_user(username)
        
        # Create Plaid link token
        link_token = create_link_token(username)
        if not link_token:
            return jsonify({"message": "Error getting link token!"}), 403

        # Add the link token
        user.link_tokens.append(link_token)
        user.save()

        return jsonify({"message": "Got link token!", "link_token": link_token}), 200

@payments_bp.route('/send', methods=['POST'])
@jwt_required()
def send():
    if request.method != 'POST':
        return jsonify({"message": "POST only!"}), 405

    # Validate input
    if "send_username" not in request.json or "amount" not in request.json:
        return jsonify({"message": "Missing send_username or amount!"}), 400
    
    send_username = request.json.get("send_username")
    try:
        amount = float(request.json.get("amount")) * 100  # Convert CAD to cents
        if amount <= 0:
            raise ValueError
    except ValueError:
        return jsonify({"message": "Amount must be a positive number!"}), 400
    
    # Get sender and receiver
    username = get_jwt_identity()
    sender = search_user(username)
    receiver = search_user(send_username)
    
    if not sender or not receiver:
        return jsonify({"message": "Sender or receiver not found!"}), 404
    
    if not sender.plaid_items or not receiver.plaid_items:
        return jsonify({"message": "Both users must link a bank account!"}), 403
    
    # Get sender's bank details
    sender_plaid = sender.plaid_items[0]  # Assume first item
    sender_bank = get_plaid_auth(sender_plaid.access_token)
    if not sender_bank:
        return jsonify({"message": "Failed to retrieve sender bank details!", "details": f"No suitable depository account for access_token: {sender_plaid.access_token}"}), 500
    
    # Get receiver's bank details
    receiver_plaid = receiver.plaid_items[0]
    receiver_bank = get_plaid_auth(receiver_plaid.access_token)
    if not receiver_bank:
        return jsonify({"message": "Failed to retrieve receiver bank details!", "details": f"No suitable depository account for access_token: {receiver_plaid.access_token}"}), 500
    
    # Create Stripe bank account tokens
    try:
        sender_token = create_stripe_bank_token(sender_plaid.access_token, sender_bank['account_id'])
        receiver_token = create_stripe_bank_token(receiver_plaid.access_token, receiver_bank['account_id'])
        if not sender_token or not receiver_token:
            return jsonify({"message": "Failed to create Stripe bank tokens!", "details": "Invalid or missing bank tokens"}), 500
    except plaid.ApiException as e:
        print(f"Plaid error: {e}")
        return jsonify({"message": "Error creating bank tokens!", "details": str(e)}), 500
    
    # Simulate transfer in Stripe Test mode using PaymentIntent
    try:
        # Create a Customer for the sender
        sender_customer = stripe.Customer.create(
            description=f"Sender: {username}"
        )
        
        # Attach the sender's bank account to the customer
        stripe.Customer.modify(
            sender_customer.id,
            source=sender_token
        )
        
        # Retrieve the bank account as a payment method
        payment_methods = stripe.Customer.list_payment_methods(
            sender_customer.id,
            type="bank_account"
        )
        if not payment_methods.data:
            return jsonify({"message": "No valid bank account found for sender!"}), 500
        sender_payment_method = payment_methods.data[0].id
        
        # Create a PaymentIntent for the sender's debit
        payment_intent = stripe.PaymentIntent.create(
            amount=int(amount),
            currency="usd",  # Sandbox uses USD
            customer=sender_customer.id,
            payment_method_types=["ach_debit"],
            payment_method=sender_payment_method,
            confirm=True,  # Confirm immediately for testing
            description=f"Transfer from {username} to {send_username}"
        )
        
        # Create a payout to the receiver
        payout = stripe.Payout.create(
            amount=int(amount),
            currency="usd",
            method="standard",
            destination=receiver_token,
            description=f"Payout to {send_username}"
        )
        
        # Update balances
        sender.balance -= amount / 100  # Convert back to CAD
        receiver.balance += amount / 100
        sender.save()
        receiver.save()
        
        return jsonify({"message": "Money sent successfully (POC)!", "amount": amount / 100}), 200
    except stripe.StripeError as e:
        print(f"Stripe error: {e}")
        return jsonify({"message": "Transfer failed!", "details": str(e)}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"message": "Unexpected error!", "details": str(e)}), 500

@payments_bp.route('/receive', methods=['POST'])
@jwt_required()
def receive():
    if request.method == 'POST':
        username = get_jwt_identity()
        user = search_user(username)
        return jsonify({"message": "Account details sent.", "balance": user.balance}), 200
    else:
        return jsonify({"message": "POST not allowed!"}), 405

@payments_bp.route("/exchange_public_token", methods=["POST"])
@jwt_required()
def exchange_public_token():
    if not client:
        return jsonify({"message": "Plaid client is not initialized on server."}), 500

    username = get_jwt_identity()
    user = search_user(username)
    public_token = request.json.get("public_token")
    if not public_token:
        return jsonify({"message": "Public token is required in request body."}), 400

    try:
        exchange_request = ItemPublicTokenExchangeRequest(public_token=public_token)
        exchange_response = client.item_public_token_exchange(exchange_request)

        access_token = exchange_response.access_token
        item_id = exchange_response.item_id
        institution_id = request.json["institution"]["institution_id"]
        institution_name = request.json["institution"]["name"]
        status = request.json["status"]

        if check_plaid_item_id(user, item_id):
            return jsonify({"message": "Account already exists!"}), 403
        
        plaid_item = PlaidItems(
            username=username,
            item_id=item_id,
            access_token=access_token,
            institution_id=institution_id,
            institution_name=institution_name,
            status=status,
            date_connected=datetime.now()
        )
        plaid_item.save()
        user.plaid_items.append(plaid_item)
        user.save()

        return jsonify({
            "message": "Public token exchanged and credentials saved.",
            "item_id": item_id
        }), 200
    except plaid.ApiException as e:
        print(f"Plaid API error during public token exchange: {e}")
        return jsonify({"message": "Error exchanging public token with Plaid.", "details": str(e)}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"message": "An unexpected server error occurred."}), 500