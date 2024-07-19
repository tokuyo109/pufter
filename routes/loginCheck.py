from flask import Flask, render_template, Blueprint, request
from flask_mail import Mail, Message
import sqlite3
import datetime
import secrets

app = Flask(__name__)

# Flask-Mailの設定
app.config['MAIL_SERVER'] = ''  # GmailのSMTPサーバー
app.config['MAIL_PORT'] = ''  # GmailのTLSポート
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = ''  # Gmailのメールアドレス
app.config['MAIL_PASSWORD'] = ''  # Gmailのパスワード

mail = Mail(app)  # Flask-Mailの拡張機能をアプリケーションに追加

# Blueprintを作成
bp = Blueprint("loginCheck", __name__)

@bp.route("/loginCheck", methods=["POST"])
def loginCheck():
    # フォームから送信されたデータを取得
    result = request.form
    email = result['email']
    password = result['pas']
    print("Form data received:", result)  # デバッグ用

    # データベースからメールアドレスとパスワードのチェック
    con = sqlite3.connect('test.db')
    c = con.cursor()
    c.execute("SELECT * FROM users WHERE email = ? AND password = ?", (email, password,))
    user = c.fetchone()
    con.close()
    print("User fetched from DB:", user)  # デバッグ用

    # ユーザーが存在しないか、パスワードが一致しない場合はログイン失敗
    if user is None:
        err_msg = {'check': 'メールアドレスまたはパスワードが正しくありません。'}
        print("Login failed")  # デバッグ用
        return render_template("login.html", result=result, err=err_msg)

    # ログイン成功時、6桁のセキュリティコードを生成
    security_code = ''.join(secrets.choice('0123456789') for i in range(6))

    # セキュリティコードを含むメールを送信
    msg = Message('セキュリティコードの確認', sender='', recipients=[email])
    msg.body = f'以下のセキュリティコードを使用してログインを完了してください。\n\nセキュリティコード: {security_code}\n\nこのコードは5分間有効です。'
    mail.send(msg)

    # セキュリティコードの有効期限を設定（5分後）
    expiration_time = datetime.datetime.now() + datetime.timedelta(minutes=5)

    # データベースにセキュリティコードと有効期限を保存
    con = sqlite3.connect('test.db')
    c = con.cursor()
    c.execute("UPDATE users SET security_code=?, expiration_time=? WHERE email=?", (security_code, expiration_time.strftime("%Y-%m-%d %H:%M:%S.%f"), email,))
    con.commit()
    con.close()
    print("Security code sent and saved in DB")  # デバッグ用

    # loginCheck.htmlに遷移
    return render_template("loginCheck.html", email=email)