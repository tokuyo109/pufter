from flask import Flask, render_template, Blueprint, request, url_for
from flask_mail import Mail, Message
import sqlite3
import secrets
import datetime

app = Flask(__name__)

# Flask-Mailの設定
app.config['MAIL_SERVER'] = ''  # GmailのSMTPサーバー
app.config['MAIL_PORT'] = ''  # GmailのTLSポート
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = ''  # Gmailのメールアドレス
app.config['MAIL_PASSWORD'] = ''  # Gmailのパスワード

mail = Mail(app)  # Flask-Mailの拡張機能をアプリケーションに追加

bp = Blueprint("entryCheck", __name__)

def execute_query(query, params=None, fetchall=False):
    con = sqlite3.connect('test.db')
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

@bp.route("/entryCheck", methods=["POST"])
def entryCheck():
    # フォームから送信されたデータを取得
    result = request.form
    email = result['email']
    password = result['password']
    password_check = result['password_check']

    check_user = execute_query("SELECT * FROM users WHERE email=?", (email,), fetchall=True)
    print("チェック",check_user)

    # バリデーションを行う
    err_msg = {}
    if '@' not in email:
        err_msg['email'] = 'メールアドレスが無効です。'
    if password != password_check:
        err_msg['check'] = 'パスワードが一致しません。'
    if check_user:
        err_msg['check'] = "すでに登録されています。"
    if err_msg:
        return render_template('entry.html', err=err_msg)


    # 既に登録されているメールアドレスかどうかをチェック
    existing_user = execute_query("SELECT * FROM assume WHERE email=?", (email,), fetchall=True)
    security_code = ''.join(secrets.choice('0123456789') for i in range(6))  # 6桁の数字を生成
    expiration_time = datetime.datetime.now() + datetime.timedelta(minutes=5)  # 現在時刻から5分後の時刻を取得
    print("現在時刻：",expiration_time)

    if existing_user:
        # 既に登録されている場合はアップデートを行う
        execute_query("UPDATE assume SET password=?, security_code=?, expiration_time=? WHERE email=?", (password, security_code, expiration_time, email,))
    else:
        # 新規登録の場合はデータベースに登録
        execute_query("INSERT INTO assume (email, password, security_code, expiration_time) VALUES (?, ?, ?, ?)", (email, password, security_code, expiration_time,))

    # メールの送信
    msg = Message('アカウントの有効化', sender='', recipients=[email])
    msg.body = f'▼新規会員登録セキュリティコード\n{security_code}\n\n※上記セキュリティコードは発行から5分以内に有効です。'
    mail.send(msg)

    return render_template('entryCheck.html', result=result)
