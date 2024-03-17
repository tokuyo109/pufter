# ログインページ
from flask import render_template, Blueprint

bp = Blueprint("login", __name__)

@bp.route("/login", methods=["GET"])
def login():
    # 空のボックス作成
    result={}
    err = {}
    return render_template('login.html',result=result, err=err)
