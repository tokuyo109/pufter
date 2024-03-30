# 新規会員登録ページ
# プロフィール編集チェックページ
from flask import render_template, Blueprint, request, jsonify, make_response
import sqlite3
import datetime
import json

bp = Blueprint("entry", __name__)

@bp.route("/entry", methods=["GET"])
def entry():
	err={}
	result={}
	return render_template("entry.html",result=result, err=err)