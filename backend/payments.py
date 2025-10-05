from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from schema import PlaidItems, check_plaid_item_id, search_user
import plaid
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.api import plaid_api
from plaid.configuration import Configuration
from plaid.api_client import ApiClient
import os


# Plaid configuration
PLAID_CLIENT_ID = os.getenv("PLAID_CLIENT_ID")
PLAID_SECRET = os.getenv("PLAID_SECRET")
PLAID_ENV = os.getenv("PLAID_ENV", "sandbox")  # Default to sandbox

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

def create_link_token(user_id):
    try:
        request = LinkTokenCreateRequest(
            client_id=PLAID_CLIENT_ID,
            secret=PLAID_SECRET,
            client_name="Mojo Payments",
            language="en",
            country_codes=[CountryCode('CA')],
            user=LinkTokenCreateRequestUser(client_user_id=user_id),
            products=[Products('transactions')]
        )
        response = client.link_token_create(request)
        return response['link_token']
    except plaid.ApiException as e:
        print(f"Plaid error: {e}")
        return None

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
    if request.method == 'POST':
        if "send_username" not in request.json:
            return jsonify({"message": "Specify the user to send money to!"}), 403
        
        if "amount" not in request.json:
            return jsonify({"message": "Specify an amount to send in CAD!"}), 403
        
        send_username = request.json.get("send_username")
        amount = request.json.get("amount")
        
        try:
            amount = int(amount)
        except:
            return jsonify({"message": "Amount must be a int!"}), 403
        
        username = get_jwt_identity()
        user = search_user(username)
        
        # Create Plaid link token
        link_token = create_link_token(username)

        if not link_token:
            return jsonify({"message": "Error creating link token."}), 500

        return jsonify({"message": "Link token created.", "link_token": link_token}), 200
    else:
        return jsonify({"message": "POST not allowed!"}), 405
    
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
    """
    Exchanges a Plaid public_token (received from the frontend after Link success)
    for a Plaid access_token and item_id. These are stored on the backend.
    """
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

        print(request.json)

        access_token = exchange_response.access_token
        item_id = exchange_response.item_id
        institution_id = request.json["institution"]["institution_id"]
        institution_name = request.json["institution"]["name"]
        status = request.json["status"]
        #products = exchange_response.products

      
        # Create Plaid item if it doesn't already exist
        if check_plaid_item_id(user, item_id):
            return jsonify({"message": "Account already exists!"}), 403
        
        plaid_item = PlaidItems(username=username, item_id=item_id, access_token=access_token, institution_id=institution_id, institution_name=institution_name, status=status)
        plaid_item.save()

        user.plaid_items.append(plaid_item)
        user.save()

        return jsonify({
            "message": "Public token exchanged and credentials saved.",
            "item_id": item_id # You might return item_id, but usually not access_token to frontend
        }), 200

    except plaid.ApiException as e:
        print(f"Plaid API error during public token exchange: {e}")
        print(f"Plaid error details: {e.body}")
        return jsonify({
            "message": "Error exchanging public token with Plaid.",
            "details": e.body # Include Plaid's error body for debugging
        }), 500
    except Exception as e:
        print(f"An unexpected server error occurred during public token exchange: {e}")
        return jsonify({"message": "An unexpected server error occurred."}), 500