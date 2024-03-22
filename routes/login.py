# ログインページ
from flask import render_template, Blueprint, request, jsonify, redirect
import datetime
import json
bp = Blueprint("login", __name__)

@bp.route("/login", methods=["GET"])
def login():
    cookie_data = request.cookies.get("key")
    if cookie_data:
        return redirect('/mypage')
    else:
        # 空のボックス作成
        result={}
        err = {}
        return render_template('login.html', result=result, err=err)
