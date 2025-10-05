from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_user_details, add_checkout_secret
import plaid
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
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
            client_name="Your App Name",
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
            return jsonify({"message": "Amount must be a float!"}), 403
        
        username = get_jwt_identity()
        details = get_user_details(username)

        if not details:
            return jsonify({"message": "Error grabbing user details!"}), 500
        
        # Create Plaid link token
        link_token = create_link_token(username)

        if not link_token:
            return jsonify({"message": "Error creating link token."}), 500

        if not add_checkout_secret(details, link_token):
            return jsonify({"message": "Error saving the link token."}), 500

        return jsonify({"message": "Link token created.", "link_token": link_token}), 200
    else:
        return jsonify({"message": "POST not allowed!"}), 405
    
@payments_bp.route('/receive', methods=['POST'])
@jwt_required()
def receive():
    if request.method == 'POST':
        username = get_jwt_identity()
        details = get_user_details(username)

        if not details:
            return jsonify({"message": "Error grabbing user details!"}), 500

        return jsonify({"message": "Account details sent.", "balance": details["balance"]}), 200
    else:
        return jsonify({"message": "POST not allowed!"}), 405