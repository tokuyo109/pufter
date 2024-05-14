# プロフィール編集チェックページ
from flask import render_template, Blueprint, request, jsonify, redirect
import sqlite3
import datetime
import json

bp = Blueprint("profEditCheck", __name__)

@bp.route("/profEditCheck", methods=["POST"])
def profEditCheck():
    # クッキーからデータを取得
    cookie_data = request.cookies.get("key")

    # デフォルトのデータを設定
    if cookie_data is not None:
        cookie_data = json.loads(cookie_data)
        email = cookie_data.get('email')
    else:
        return """
        <script>
            alert('セッションが切れています。ログインし直してください');
            window.location.href = '/login'; // リダイレクト
        </script>
        """

    # SQLiteデータベースへの接続
    con = sqlite3.connect('test.db')
    c = con.cursor()

    # フォームから送信されたデータを取得
    username = request.form['username']
    introduction = request.form['introduction']
    # twitterid = request.form['twitterid']
    visibility = request.form.get('visibility')  # ラジオボタンの選択値を取得

    # データベースにデータを挿入
    # c.execute('''UPDATE users
    #              SET username=?, introduction=?, twitterid=?, visibility=?
    #              WHERE email=?''', (username, introduction, twitterid, visibility, email))

    c.execute('''UPDATE users
                 SET username=?, introduction=?, visibility=?
                 WHERE email=?''', (username, introduction, visibility, email))

    # データベースへの変更をコミットし、接続を閉じる
    con.commit()
    con.close()

    return redirect("/mypage")
