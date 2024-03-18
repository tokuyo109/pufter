from flask import render_template, Blueprint, request, jsonify, session, redirect, url_for
import sqlite3
import secrets

bp = Blueprint("mypage", __name__)
tokens = {}  # ユーザーIDとトークンのマッピングを保持する変数

@bp.route("/mypage")
def mypage():
    # トークンからユーザーIDを取得
    token = session.get('token')
    user_id = tokens.get(token)

    # トークンが存在しないか、無効であればログインページにリダイレクト
    if token is None or user_id is None:
        return redirect('/login')  # ログインページにリダイレクト

    # ユーザーIDからメールアドレスを取得
    conn = sqlite3.connect('example.db')
    c = conn.cursor()
    c.execute("SELECT email FROM users WHERE id = ?", (user_id,))
    row = c.fetchone()

    # ユーザーが見つからない場合のエラーハンドリング
    if row is None:
        conn.close()
        return jsonify({'error': 'ユーザーが見つかりませんでした。'}), 404

    mail = row[0]
    conn.close()

    return render_template('mypage.html', mail=mail)