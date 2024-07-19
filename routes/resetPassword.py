# 新規会員登録ページ
# プロフィール編集チェックページ
from flask import render_template, Blueprint, request, jsonify, make_response
import sqlite3
import datetime
import json

bp = Blueprint("resetPassword", __name__)

def execute_query(query, params=None, fetchall=False):
    con = sqlite3.connect('test.db')
    c = con.cursor()
    if params:
        c.execute(query, params)
    else:
        c.execute(query)
    if fetchall:
        result = c.fetchall()
    else:
        result = None
    con.commit()
    con.close()
    return result

@bp.route("/resetPassword/<token>", methods=["GET", "POST"])
def resetPassword(token):
    # トークンの取得確認
    con = sqlite3.connect('test.db')
    c = con.cursor()
    c.execute("SELECT reset_token, token_time FROM users WHERE reset_token = ?", (token,))
    user = c.fetchone()
    con.close()

    if not user or token != user[0]:
        return '''<script>
                alert("無効なURLです");
                window.location.href = '/login'; // リダイレクト
                </script>'''
    
    # トークンの有効期限をチェック
    token_from_db = user[0]
    current_time = datetime.datetime.now()
    print("token_time_from_db",user[1])
    token_time_from_db = datetime.datetime.strptime(user[1].split(".")[0], "%Y-%m-%d %H:%M:%S")
    if token_from_db != token or current_time > token_time_from_db:
        return '''<script>
                alert("無効なURLです");
                window.location.href = '/login'; // リダイレクト
                </script>'''

    if request.method == "POST":
        new_password = request.form['new_password']
        confirm_password = request.form['confirm_password']

        if len(new_password) < 6:
            err_msg = {'password': 'パスワードは6文字以上で入力してください。'}
            return render_template('resetPasswordSend.html', token=token, err=err_msg)

        if new_password != confirm_password:
            err_msg = {'password': 'パスワードが一致しません。'}
            return render_template('resetPasswordSend.html', token=token, err=err_msg)

        # トークンを無効にする
        execute_query("UPDATE users SET password = ?, reset_token = NULL, token_time = NULL WHERE reset_token = ?", (new_password, token,))

        return '''<script>
                alert("パスワードがリセットされました。ログインしてください。");
                window.location.href = '/login'; // リダイレクト
                </script>'''

    return render_template('resetPasswordSend.html', token=token)
