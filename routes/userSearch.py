from flask import render_template, Blueprint, request, jsonify, make_response, redirect
import sqlite3
import datetime
import json

# Blueprintを作成
bp = Blueprint("userSearch", __name__)

@bp.route('/userSearch', methods=['GET'])
def userSearch():
    # 入力された検索クエリを取得
    query = request.args.get('text', '')

    # ログインしているユーザーのメールアドレスを取得
    cookie_data = request.cookies.get("key")
    if cookie_data is not None:
        cookie_data = json.loads(cookie_data)
        email = cookie_data.get('email')
    else:
        # セッションが切れている場合はログインページにリダイレクト
        return """
        <script>
            alert('セッションが切れています。ログインし直してください');
            window.location.href = '/login'; // リダイレクト
        </script>
        """

    # データベースからユーザーを検索（自分自身は除く）
    conn = sqlite3.connect('test.db')
    c = conn.cursor()
    c.execute("SELECT id FROM users WHERE email = ? ORDER BY username", (email,))
    login_user_id = c.fetchone()[0]  # ログインユーザーのIDを取得

    # データベースから各ユーザーのフォロー状態と公開設定を取得
    follow_status_query = "SELECT username, CASE WHEN id IN (SELECT followed_id FROM follows WHERE follower_id = ?) THEN 1 ELSE 0 END, visibility FROM users WHERE username LIKE ? AND id != ? ORDER BY username"
    c.execute(follow_status_query, (login_user_id, '%' + query + '%', login_user_id))
    search_results = c.fetchall()

    conn.close()

    # 非公開設定されているユーザーを除外する
    result = {}
    for user in search_results:
        username = user[0]
        is_following = bool(user[1])
        visibility = user[2]

        # 非公開設定のユーザーは表示しない
        if visibility == 'private':
            continue

        result[username] = is_following

    return render_template("userSearch.html", result=result)
