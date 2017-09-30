
from flask import abort, Blueprint, jsonify
from app.utils import prepare_json_response
from app import db, cache

from app.models.test import Courses

import requests


mod = Blueprint("v1_search", __name__, url_prefix="/v1/search")

@mod.route("/profile", methods=['GET'])
def user_setting():
    cur = db.cursor()
    display = {'errors ' : []}
    response = {}
    data = {}

    username = request.args.get('username')

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

@mod.route('/profile/edit', methods =['GET', 'POST'])
def user_setting_edit():
    username = request.args.get('username')
    cur = db.cursor()

    if request.method == 'POST':
        if request.form['op'] == 'add':
            project_name = requst.form['project_name']
            if len(project_name) == 0:
                abort(404)

            cur.execute('SELECT project_name FROM Projects WHERE project_name = %s AND user_id = %s', (project_name, username))
            exist = cur.fetchall()

            if len(exist) is not 0:
                abort(404)

            description = request.args.get('description')
            cur.execute("INSERT INTO Projects (project_name, user_id, timestamp, description) VALUES(%s, %s, NOW(), %s)", (project_name, username,description))
        













