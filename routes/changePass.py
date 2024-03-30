# 新規会員登録ページ
# プロフィール編集チェックページ
from flask import render_template, Blueprint, request, jsonify, make_response
import sqlite3
import datetime
import json

bp = Blueprint("changePass", __name__)

@bp.route("/changePass", methods=["GET"])
def changePass():
    result={}
    err={}

    result = request.form
    return render_template("changePass.html",result=result, err=err)