from flask import render_template, Blueprint, request, redirect, url_for
import sqlite3
import json

# Blueprintを作成
bp = Blueprint("pufterFavorite", __name__)

@bp.route('/pufterFavorite/<int:id>', methods=['POST'])
def pufterFavorite(id):
    # フォローするユーザー名とアクション（フォローするかフォロー解除するか）を取得
    title = request.form.get('title')
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


    if title is None or action not in ['unfavorite', 'favorite']:
        return render_template('pufterFavorite.html', message='無効なリクエストです。')

    # データベースに接続してフォロー状態を変更
    conn = sqlite3.connect('test.db')
    c = conn.cursor()

    login_id = c.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()[0]  # ログインユーザーのIDを取得
    print("ログイン", login_id)
    print("プロジェクト", id)
    if action == 'favorite':
        c.execute("INSERT INTO favorite (login_id, project_id) VALUES (?, ?)", (login_id, id,))
    else:
        c.execute("DELETE FROM favorite WHERE login_id = ? AND project_id = ?", (login_id, id,))

    conn.commit()
    conn.close()

    # 元のページにリダイレクト
    return redirect(url_for('pufter.pufter', project_id=id))