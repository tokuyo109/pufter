# パスワードリセットページ
from flask import render_template, Blueprint, request, jsonify, make_response
import sqlite3
import datetime
import json

bp = Blueprint("resetPasswordMailInput", __name__)

@bp.route("/resetPasswordMailInput", methods=["GET"])
def resetPasswordMailInput():
    result={}
    err={}

    result = request.form
    return render_template("resetPasswordMailInput.html",result=result, err=err)