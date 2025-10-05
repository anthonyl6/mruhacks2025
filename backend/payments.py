from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_user_details, add_checkout_secret
import stripe
import os

stripe.api_key = os.getenv("STRIPE_KEY")
payments_bp = Blueprint('payments', __name__, template_folder='templates')

def create_checkout(amount):
    if type(amount) != float:
        return None
    
    intent = stripe.PaymentIntent.create(
        amount=amount,  # $20.00 in cents
        currency='cad',
        payment_method_types=['bank'],  # Or others like 'us_bank_account'
    )
    # Return intent.client_secret to frontend for confirmation via Stripe.js
    return intent.client_secret

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
        
        checkout_secret = create_checkout(amount=amount)

        if not add_checkout_secret(details, checkout_secret):
            return jsonify({"message": "Error saving the checkout."}), 200

        return jsonify({"message": "Checkout created.", "secret": checkout_secret}), 200
    else:
        return jsonify({"message": "POST not allowed!"}), 405
    
@payments_bp.route('/recieve', methods=['POST'])
@jwt_required()
def recieve():
    if request.method == 'POST':
        username = get_jwt_identity()
        details = get_user_details(username)

        if not details:
            return jsonify({"message": "Error grabbing user details!"}), 500
        


        return jsonify({"message": "Account details sent.", "balance": details["balance"]}), 200
    else:
        return jsonify({"message": "POST not allowed!"}), 405