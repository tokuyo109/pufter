from flask import Flask, render_template, Blueprint, request, url_for
from flask_mail import Mail, Message
import sqlite3
import secrets

app = Flask(__name__)

# Flask-Mailの設定
app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # GmailのSMTPサーバー
app.config['MAIL_PORT'] = 587  # GmailのTLSポート
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'hal.pufter@gmail.com'  # Gmailのメールアドレス
app.config['MAIL_PASSWORD'] = 'nkcz tlyh nojb dgay'  # Gmailのパスワード

mail = Mail(app)  # Flask-Mailの拡張機能をアプリケーションに追加

bp = Blueprint("entryCheck", __name__)

def connect_database():
    return sqlite3.connect('test.db')

def execute_query(query, params=None, fetchall=False):
    con = connect_database()
    c = con.cursor()
    if params:
        c.execute(query, params)
    else:
        c.execute(query)
    if fetchall:
        result = c.fetchall()
    else:
        result = None
    con.commit()
    con.close()
    return result

def generate_activation_token():
    # ランダムなトークンを生成して返す
    return secrets.token_urlsafe(32)


@bp.route("/entryCheck", methods=["POST"])
def entryCheck():
    # フォームから送信されたデータを取得
    result = request.form
    email = result['email']
    password = result['password']
    password_check = result['password_check']

    # バリデーションを行う
    err_msg = {}
    if '@' not in email:
        err_msg['email'] = 'メールアドレスが無効です。'
    if len(password) < 6:
        err_msg['pas'] = 'パスワードは6文字以上で入力してください。'
    if password != password_check:
        err_msg['check'] = 'パスワードが一致しません。'

    # エラーメッセージがある場合は登録ページに戻り、エラーを表示する
    if err_msg:
        return render_template('entry.html', err=err_msg, result=result)

    # テーブルの作成（もしくはすでに存在する場合はスキップ）
    execute_query('''CREATE TABLE IF NOT EXISTS users
                    (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, username TEXT, introduction TEXT, activation_token TEXT)''')
    execute_query('''CREATE TABLE IF NOT EXISTS follows (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    follower_id INTEGER,
                    followed_id INTEGER,
                    FOREIGN KEY (follower_id) REFERENCES users (id),
                    FOREIGN KEY (followed_id) REFERENCES users (id)
                )''')

    # データベースへの登録とアクティベーション・トークンの追加
    activation_token = generate_activation_token()  # この関数はアクティベーション・トークンを生成する必要があります
    execute_query("INSERT INTO users (email, password, activation_token) VALUES (?, ?, ?)", (email, password, activation_token))

    # メールの送信
    activation_link = url_for('activate.activate', token=activation_token, _external=True)
    msg = Message('アカウントの有効化', sender='hal.pufter@gmail.com', recipients=[email])
    msg.body = f'アカウントを有効化するには、以下のリンクをクリックしてください：\n{activation_link}'
    mail.send(msg)

    return render_template('entryCheck.html', err=err_msg, result=result)
