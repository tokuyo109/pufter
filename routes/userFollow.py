from flask import render_template, Blueprint, request, redirect, url_for
import sqlite3
import json

# Blueprintを作成
bp = Blueprint("userFollow", __name__)

@bp.route('/userFollow', methods=['POST'])
def userFollow():
    # フォローするユーザー名とアクション（フォローするかフォロー解除するか）を取得
    username = request.form.get('username')
    action = request.form.get('action')

    # ログインしているユーザーのメールアドレスを取得
    cookie_data = request.cookies.get("key")
    print("cookie_data:", cookie_data)

    # デフォルトのデータを設定
    if cookie_data:
        cookie_data = json.loads(cookie_data)
    else:
        return """<script>
            alert('フォローするには、ログインが必要です。');
            window.location.href = '/login'; // リダイレクト</script>
        """

    # クッキーから取得したメールアドレスを使用して、ユーザー名を取得
    email = cookie_data.get('email', None)


    if username is None or action not in ['follow', 'unfollow']:
        return render_template('userFollow.html', message='無効なリクエストです。')

    # データベースに接続してフォロー状態を変更
    conn = sqlite3.connect('test.db')
    c = conn.cursor()

    login_user_id = c.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()[0]  # ログインユーザーのIDを取得
    followed_user_id = c.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone()[0]

    if action == 'follow':
        c.execute("INSERT INTO follows (follower_id, followed_id) VALUES (?, ?)", (login_user_id, followed_user_id,))
        message = f'{username}をフォローしました。'
    else:
        c.execute("DELETE FROM follows WHERE follower_id = ? AND followed_id = ?", (login_user_id, followed_user_id,))
        message = f'{username}のフォローを解除しました。'

    conn.commit()
    conn.close()

    # フォローしたユーザーのプロフィールページにリダイレクト
    return render_template('userFollow.html', message=message, redirect_url=url_for('profile.profile', username=username))