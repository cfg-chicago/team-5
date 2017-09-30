
from flask import abort, Blueprint, jsonify
from app.utils import prepare_json_response
from app import db, cache

from app.models.test import Courses

import requests


mod = Blueprint("v1_search", __name__, url_prefix="/v1/search")


@mod.route("/user/<int:userid>", methods=["GET"])
@cache.memoize(3600)
def user_api(userid):
    cur = db.cursor()
    distplay = {'errors' : []}
    response = {}
    data = {}
    if request.method == 'GET':

        username = session['username']
        cur.execute('SELECT firstname, lastname, grade, points, birth, profile FROM User where username = %s', (username, ))
        result = cur.fetchall()
        if len(result) == 0:
            response.status_code = 404
            return response

        data['username'] = username
        data['firstname'] = result[0]['firstname']
        data['lastname'] = result[0]['lastname']
        data['grade'] = result[0]['grade']
        data['points'] = result[0]['points']
        data['birth'] = result[0]['birth']
        data['profile'] = result[0]['profile']

    return jsonify(
        prepare_json_response(
            message="OK",
            success=True,
            data=data
        )
    ) 
