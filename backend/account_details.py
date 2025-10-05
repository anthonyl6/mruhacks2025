from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from schema import get_user_details

account_bp = Blueprint('account', __name__, template_folder='templates')

@account_bp.route('/details', methods=['GET'])
@jwt_required()
def details():
    if request.method == 'GET':
        username = get_jwt_identity()
        details = get_user_details(username)
        if not details:
            return jsonify({"message": "Error grabbing user details!"}), 500

        return jsonify({"message": "Account details sent.", "balance": details["balance"], "username": details["username"], "transactions": str(details["transactions"])}), 200
    else:
        return jsonify({"message": "POST not allowed!"}), 405