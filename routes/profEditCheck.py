# プロフィール編集チェックページ
from flask import render_template, Blueprint, request, jsonify, redirect, url_for
import sqlite3
import datetime
import json
import os
from werkzeug.utils import secure_filename

bp = Blueprint("profEditCheck", __name__)

# アップロードされたファイルを保存するディレクトリ
UPLOAD_FOLDER = 'static/img/uploads/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def delete_old_file(file_path):
    if os.path.exists(file_path):
        os.remove(file_path)

@bp.route("/profEditCheck", methods=["POST"])
def profEditCheck():
    # クッキーからデータを取得
    cookie_data = request.cookies.get("key")

    # デフォルトのデータを設定
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

    # SQLiteデータベースへの接続
    con = sqlite3.connect('test.db')
    c = con.cursor()

    # フォームから送信されたデータを取得
    username = request.form['username']
    introduction = request.form['introduction']
    visibility = request.form.get('visibility')  # ラジオボタンの選択値を取得
    icon = request.files['icon']

    if icon and allowed_file(icon.filename):
        # タイムスタンプをファイル名に追加して安全なファイル名を取得
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        filename = secure_filename(f"{timestamp}_{icon.filename}")
        icon_path = os.path.join(UPLOAD_FOLDER, filename)
        icon.save(icon_path)
    else:
        # デフォルトのアイコンパスまたは既存のアイコンパスを設定する
        icon_path = None

    # データベースにデータを挿入
    if icon_path:
        c.execute('''SELECT icon_path FROM users WHERE email=?''', (email,))
        old_icon_path = c.fetchone()[0]
        if old_icon_path:
            delete_old_file(old_icon_path)
        c.execute('''UPDATE users
                     SET username=?, introduction=?, visibility=?, icon_path=?
                     WHERE email=?''', (username, introduction, visibility, icon_path, email))
    else:
        c.execute('''UPDATE users
                     SET username=?, introduction=?, visibility=?
                     WHERE email=?''', (username, introduction, visibility, email))

    # データベースへの変更をコミットし、接続を閉じる
    con.commit()
    con.close()

    return redirect("/mypage")
