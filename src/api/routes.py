"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)




# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.


@api.route("/token", methods=["POST"])
def generate_token():


    email = request.json.get("email", None)
    password = request.json.get("password", None)

    email = email.lower()
    user = User.query.filter_by(email = email, password = password).first()

    # test that the user exists
    if user is None:
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=str(user.id))
    # sessionStorage.setItem
    response = {
        "acces_token": access_token,
        "user_id": user.id,
        "msg": f'Welcome {user.email}!'
    }

    return jsonify(response)




# @api.route('/private', methods=["GET"])
# @jwt_required
# def private():
#     # Access the identity of the current user with get_jwt_identity
#     current_user = get_jwt_identity()
#     return jsonify(logged_in_as=current_user), 200





@api.route('/signup', methods=["POST"])
def register_user():

    email = request.json.get("email", None)
    password = request.json.get("password", None)

    email = email.lower()
    user = User.query.filter_by(email=email).first()

    if user is not None and user.email ==email:
        response = {
            'msg': 'User already exists'
        }
        return jsonify(response), 403
    
    user = User()
    user.email = email
    user.password = password
    user.is_active = True
    db.session.add(user)
    db.session.commit()

    response = {
        'msg': f'Congratulations, {user.email}! You have successfully signed up!'
    }
    return jsonify(response), 200













@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200
