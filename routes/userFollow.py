from flask import render_template, Blueprint, request, jsonify, make_response, redirect
import sqlite3
import datetime
import json

# Blueprintを作成
bp = Blueprint("userFollow", __name__)

@bp.route('/userFollow', methods=['POST'])
def userFollow():
    # フォローするユーザー名とアクション（フォローするかフォロー解除するか）を取得
    username = request.form.get('username')
    action = request.form.get('action')

    print("Username:", username)
    print("Action:", action)


    # ログインしているユーザーのメールアドレスを取得
    cookie_data = request.cookies.get("key")
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

    if username is None or action not in ['follow', 'unfollow']:
        return render_template('userFollow.html', message='無効なリクエストです。')

    # データベースに接続してフォロー状態を変更
    conn = sqlite3.connect('test.db')
    c = conn.cursor()

    c.execute("SELECT id FROM users WHERE email = ?", (email,))
    login_user_id = c.fetchone()[0]  # ログインユーザーのIDを取得
    followed_user_id = c.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone()[0]

    if action == 'follow':
        c.execute("INSERT INTO follows (follower_id, followed_id) VALUES (?, ?)", (login_user_id, followed_user_id))
        message = f'{username}をフォローしました。'
    else:
        c.execute("DELETE FROM follows WHERE follower_id = ? AND followed_id = ?", (login_user_id, followed_user_id))
        message = f'{username}のフォローを解除しました。'

    conn.commit()
    conn.close()

    return render_template('userFollow.html', message=message)