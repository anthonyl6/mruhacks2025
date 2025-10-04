from flask import Blueprint, Flask, render_template, abort
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from jinja2 import TemplateNotFound
from dotenv import load_dotenv
from auth import auth_bp
from os import getenv
from datetime import timedelta

ACCESS_EXPIRES = timedelta(hours=1)


load_dotenv()

app = Flask(__name__)
app.register_blueprint(auth_bp, url_prefix='/auth')


app.config["JWT_SECRET_KEY"] = getenv("SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = ACCESS_EXPIRES

jwt = JWTManager(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

if __name__ == "__main__":
    app.run(debug=True)