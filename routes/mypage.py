from flask import render_template, Blueprint, request, jsonify, make_response, redirect
import sqlite3
import datetime
import json


bp = Blueprint("mypage", __name__)

@bp.route("/mypage")
def mypage():
    # 結果の格納場所
    result = {}
    # クッキーからデータを取得
    cookie_data = request.cookies.get("key")

    # デフォルトのデータを設定
    if cookie_data is not None:
        cookie_data = json.loads(cookie_data)
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

    # クッキーから取得したメールアドレスを使用して、ユーザー名を取得
    email = cookie_data.get('email', None)
    # ユーザー名と自己紹介を取得するクエリを実行
    c.execute("SELECT username, introduction FROM users WHERE email=?", (email,))
	
    # 取得した結果を取得
    rows = c.fetchall()  # データベースからの取得結果
    print(rows)

    # 取得した結果が空でなければ辞書に変換
    if rows:
        result["username"] = rows[0][0]
        result["introduction"] = rows[0][1]
	
    # 結果の表示
    for row in rows:
        print(row)
    # データベースへの変更をコミットし、接続を閉じる
    con.commit()
    con.close()

    return render_template('mypage.html',result=result)
