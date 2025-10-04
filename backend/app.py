from flask import Blueprint, Flask, render_template, abort
from flask_bcrypt import Bcrypt
from jinja2 import TemplateNotFound
from dotenv import load_dotenv
from auth import auth_bp

load_dotenv()

app = Flask(__name__)
app.register_blueprint(auth_bp, url_prefix='/auth')

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

if __name__ == "__main__":
    app.run(debug=True)