# プロフィール編集ページ
from flask import render_template, Blueprint, request, jsonify, make_response, redirect
import sqlite3
import json

bp = Blueprint("profEdit", __name__)

@bp.route("/profEdit", methods=["GET"])
def profEdit():
    result = {}

    # クッキーからデータを取得
    cookie_data = request.cookies.get("key")

    # デフォルトのデータを設定
    if cookie_data is not None:
        cookie_data = json.loads(cookie_data)
    else:
        return """
        <script>
            alert('不正なリンクです');
            window.location.href = '/login'; // リダイレクト
        </script>
        """

    # クッキーから取得したメールアドレスを使用して、ユーザー名を取得
    email = cookie_data.get('email', None)
    
    # SQLiteデータベースへの接続
    con = sqlite3.connect('test.db')
    c = con.cursor()

    # ユーザー名、自己紹介、Twitter ID、公開設定を取得するクエリを実行
    c.execute("SELECT username, introduction, visibility, icon_path FROM users WHERE email=?", (email,))
    rows = c.fetchone()  # データベースからの取得結果

    # 取得した結果を配列に格納
    result["username"] = rows[0]
    result["introduction"] = rows[1]
    result["visibility"] = rows[2]
    result["icon_path"] = rows[3]

    print(result["introduction"])

    # データベースからの取得結果が空の場合は空の辞書を返す
    if result["username"] is None:
        result["username"] = ""
        result["introduction"] = ""

    print(result["introduction"])
    # データベースへの変更をコミットし、接続を閉じる
    con.commit()
    con.close()

    # テンプレートに非公開アカウントの設定も渡す
    return render_template("profEdit.html", result=result)
