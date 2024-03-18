from flask import render_template, Blueprint, request, jsonify
import sqlite3
import secrets

# Blueprintを作成
bp = Blueprint("loginCheck", __name__)
tokens = {}  # ユーザーIDとトークンのマッピングを保持する変数

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
        return jsonify({'error': 'メールアドレスまたはパスワードが正しくありません。'}), 401

    # ログイン成功
    # トークンを生成して返す
    token = secrets.token_urlsafe(16)
    tokens[token] = user[0]  # ユーザーIDをトークンに関連付ける

    # ログイン成功時にテンプレートをレンダリングしてHTMLを返す
    return render_template('loginCheck.html', mail=mail)

