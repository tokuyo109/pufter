from flask import render_template, Blueprint, request, jsonify, make_response, redirect
import sqlite3
import datetime
import json


bp = Blueprint("mypage", __name__)

@bp.route("/mypage")
def mypage():
    # クッキーからデータを取得
    cookie_data = request.cookies.get("key")

    # デフォルトのデータを設定
    if cookie_data is not None:
        cookie_data = json.loads(cookie_data)
    else:
        cookie_data = {'mail': 'No Data'}

    # SQLiteデータベースへの接続
    con = sqlite3.connect('test.db')
    c = con.cursor()

    # クエリを実行して結果を取得
    c.execute("SELECT username, introduction FROM users")
    rows = c.fetchall()

    # もし結果が空であればユーザ登録を行う
    if not rows or all(row[0] is None for row in rows):
        con.commit()
        con.close()
        # アラートを表示するJavaScriptを生成して返す
        return """
        <script>
            alert('ユーザ名を設定してください。');
            window.location.href = '/profEdit'; // リダイレクト
        </script>
        """

    # クッキーから取得したメールアドレスを使用して、ユーザー名を取得
    email = cookie_data.get('mail', None)
    # メールアドレスに基づいてデータベースからユーザー名を取得するクエリを実行
    c.execute("SELECT username FROM users WHERE email=?", (email,))
    row = c.fetchone()
    print(row)
    fetched_username = row[0]
    print("取得したユーザー名:", fetched_username)
    # usersテーブルの全てのレコードを取得するクエリを実行
    c.execute("SELECT * FROM users")
    
    # 取得した結果を取得
    rows = c.fetchall()
    
    # 結果の表示
    for row in rows:
        print(row)
    # データベースへの変更をコミットし、接続を閉じる
    con.commit()
    con.close()

    return render_template('mypage.html',fetched_username=fetched_username)
