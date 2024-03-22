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
        "mail":"メールアドレス",
        "pas":"パスワード"
    }
    # エラーメッセージ格納テーブル
    err = {}

    # フォームから送信されたデータを取得
    result = request.form
    mail = result['mail']
    password = result['pas']

    # データベースからメールアドレスとパスワードのチェック
    conn = sqlite3.connect('test.db')
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE email = ? AND password = ?", (mail, password))
    user = c.fetchone()
    conn.close()

    # ユーザーが存在しないか、パスワードが一致しない場合はログイン失敗
    if user is None:
        return jsonify({'error': 'メールアドレスまたはパスワードが正しくありません。'})

    # cookie保存する値を作成
    cookie_data = {'mail':mail}

    # Cookie有効時間(一ヶ月)
    limit = 60
    expires = int(datetime.datetime.now().timestamp()) + limit

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
    # Cookie生成
    res = make_response(render_template("loginCheck.html",result=result))
    res.set_cookie("key",value=json.dumps(cookie_data),expires=expires)

    return res

