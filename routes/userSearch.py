from flask import render_template, Blueprint, request, jsonify, make_response, redirect
import sqlite3
import datetime
import json

# Blueprintを作成
bp = Blueprint("userSearch", __name__)

@bp.route('/userSearch', methods=['GET'])
def userSearch():
    # 入力されたものを格納
    if request.args.get('text') != None:
        query = request.args.get('text')
    else:
        query = ""


    # クッキーからログインしているユーザーのメールアドレスを取得
    cookie_data = request.cookies.get("key")
    if cookie_data is not None:
        cookie_data = json.loads(cookie_data)
        email = cookie_data.get('email')
    else:
        email = ""

    con = sqlite3.connect('test.db')
    c = con.cursor()

  # ユーザ名を使って曖昧検索を行う（自分自身を除く）
    c.execute("SELECT * FROM users WHERE username LIKE ? AND email != ?", ('%' + query + '%', email))
    users = c.fetchall()

    con.close()

    result = [user[3] for user in users]  # ユーザ名のみ取得
    print(result)
    return render_template("userSearch.html", result=result)

