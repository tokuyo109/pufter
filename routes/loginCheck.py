from flask import render_template, Blueprint, request, jsonify, make_response, redirect
import sqlite3
import datetime
import json

# Blueprintを作成
bp = Blueprint("loginCheck", __name__)

@bp.route("/loginCheck", methods=["POST"])
def loginCheck():
    # それぞれの変数
    tbl ={
        "email":"メールアドレス",
        "pas":"パスワード"
    }
    # バリデーションを行う（ここではシンプルな例）
    err_msg = {}

    # フォームから送信されたデータを取得
    result = request.form
    email = result['email']
    password = result['pas']

    # データベースからメールアドレスとパスワードのチェック
    conn = sqlite3.connect('test.db')
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE email = ? AND password = ?", (email, password))
    user = c.fetchone()
    conn.close()

    # ユーザーが存在しないか、パスワードが一致しない場合はログイン失敗
    if user is None:
        err_msg['check'] = 'メールアドレスまたはパスワードが正しくありません。'
        return render_template("login.html",result=result, err=err_msg)

    # cookie保存する値を作成
    cookie_data = {'email':email}

    # Cookie有効時間(一分)
    limit = 60
    expires = int(datetime.datetime.now().timestamp()) + limit

    # Cookie生成
    res = make_response(render_template("loginCheck.html",result=result))
    res.set_cookie("key",value=json.dumps(cookie_data),expires=expires)

    return res

