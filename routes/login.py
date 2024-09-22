# ログインページ
from flask import render_template, Blueprint, request, redirect

bp = Blueprint("login", __name__)

@bp.route("/login", methods=["GET"])
def login():
    cookie_data = request.cookies.get("key")
    if cookie_data:
        return redirect('/share')
    else:
        # 空のボックス作成
        result={}
        err = {}
        return render_template('login.html', result=result, err=err)
