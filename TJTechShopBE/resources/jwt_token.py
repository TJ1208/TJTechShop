from datetime import datetime, timezone, timedelta

from flask import jsonify, request, abort
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity, create_access_token, create_refresh_token, \
    set_access_cookies, set_refresh_cookies, unset_jwt_cookies
from flask_smorest import Blueprint

from models.token_blocklist import TokenBlocklistModel
from models.user import UserModel
from resources.db import bcrypt, db

blp = Blueprint("JwtToken", __name__, description="Operations on user token")


@blp.get("/token")
@jwt_required()
def token():
    claims = get_jwt()
    return jsonify(claims)


@blp.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    response = jsonify(access_token=access_token)
    set_access_cookies(response, access_token)
    return response, 200


@blp.post("/login")
def login_user():
    data = UserModel(**request.get_json())
    user = UserModel.query.filter(UserModel.email == data.email).first()

    if not user:
        abort(404,
              description=f"No account exists for: {data.email}")
    elif bcrypt.check_password_hash(user.password, data.password):
        additional_claims = {"first_name": user.first_name, "last_name": user.last_name, "role": user.role_id}
        access_token = create_access_token(identity=user.email, additional_claims=additional_claims)
        refresh_token = create_refresh_token(identity=user.email)
        response = jsonify(access_token=access_token, refresh_token=refresh_token)
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)
        return response, 200
    else:
        abort(400,
              description=f"Password entered was incorrect.")


@blp.delete("/logout")
@jwt_required()
def modify_token():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    db.session.add(TokenBlocklistModel(jti=jti, created_at=now))
    db.session.commit()
    return jsonify(msg="JWT revoked")
