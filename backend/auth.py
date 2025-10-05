from flask import Blueprint, request, jsonify
from flask_bcrypt import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from jinja2 import TemplateNotFound
from db import get_user, insert_user, create_session, init_new_user

auth_bp = Blueprint('auth', __name__, template_folder='templates')

@auth_bp.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        if "username" not in request.json:
            return jsonify({"message": "Please provide a username!"}), 403
        
        if "password" not in request.json:
            return jsonify({"message": "Please provide a password!"}), 403


        username = request.json['username']
        password = request.json['password']

        print(username)
        print(password)
        

        # Check if the username already exists
        if get_user(username=username):
            return jsonify({"message": "Failed to authenticate!"}), 403
        else:
            status = insert_user(username=username, hash=generate_password_hash(password, 10))
            if not status:
                return jsonify({"message": "Error registering!"}), 500
            
            # Init user
            if not init_new_user(username):
                return jsonify({"message": "Error initializing new user!"}), 500
            
            return jsonify({"message": "Registered successfully!"}), 200
    else:
        return jsonify({"message": "POST not allowed!"}), 405
    
@auth_bp.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        if "username" not in request.json:
            return jsonify({"message": "Please provide a username!"}), 403
        
        if "password" not in request.json:
            return jsonify({"message": "Please provide a password!"}), 403
        
        username = request.json['username']
        password = request.json['password']

        # Check if the username and password match
        user = get_user(username=username)
        if not user:
            return jsonify({"message": "Unknown username and password!"}), 403

        if check_password_hash(user["password"], password):
            token = create_session(user, create_access_token(username))
            if not token:
                return jsonify({"message": "Login failed!"}), 500
            
            return jsonify({"message": "Login successful!", "token": token}), 200
        
        return jsonify({"message": "Unknown username and password!"}), 403

@auth_bp.route("/logout", methods=["POST", "GET"])
@jwt_required()
def logout():
    return jsonify({"message": "Logged out!"}), 403   
    
@auth_bp.route('/check', methods=['GET', "POST"])
@jwt_required()
def check():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200