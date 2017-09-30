
from flask import abort, Blueprint, jsonify
from app.utils import prepare_json_response
from app import db, cache

from app.models.test import Courses

import requests


mod = Blueprint("v1_search", __name__, url_prefix="/v1/search")


@mod.route("/all_terms", methods=["GET"])
@cache.memoize(3600)
def all_terms():
    q = db.session.query(Terms).order_by(Terms.stream)
    payload = [a.serialize for a in q.all()]
    data = {'results': payload}
    return jsonify(
        prepare_json_response(
            message="OK",
            success=True,
            data=data
        )
    ) 
