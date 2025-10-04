from flask import Blueprint, Flask, abort, request, url_for, make_response
from jinja2 import TemplateNotFound
from db import get_collection

auth_bp = Blueprint('auth', __name__, template_folder='templates')

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        users_collection = get_collection()

        # Check if the username already exists
        if users_collection.find_one({'username': username}):
            return make_response("Failed to authenticate!", 403)
        else:
            users_collection.insert_one({'username': username, 'password': password})
            return make_response("Login successful!", 200)
