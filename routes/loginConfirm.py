from flask import Flask, render_template, Blueprint, request, make_response, url_for
from flask_mail import Mail
import sqlite3
import datetime
import json

app = Flask(__name__)

# Flask-Mailの設定
app.config['MAIL_SERVER'] = ''  # GmailのSMTPサーバー
app.config['MAIL_PORT'] = ''  # GmailのTLSポート
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = ''  # Gmailのメールアドレス
app.config['MAIL_PASSWORD'] = ''  # Gmailのパスワード

mail = Mail(app)  # Flask-Mailの拡張機能をアプリケーションに追加

bp = Blueprint("loginConfirm", __name__)

# クッキーを設定する関数
def set_cookie(response, email):
    cookie_data = {'email': email}
    limit = 2592000  # Cookie有効時間(1ヶ月)
    expires = int(datetime.datetime.now().timestamp()) + limit
    response.set_cookie("key", value=json.dumps(cookie_data), expires=expires)
    print("Set-Cookie Header:", response.headers.getlist("Set-Cookie"))  # デバッグ用
    return response

@bp.route("/loginConfirm", methods=["POST"])
def loginConfirm():
    # フォームから送信されたデータを取得
    email = request.form['email']
    security_code = request.form['security_code']
    print("Security code received:", security_code)  # デバッグ用

    # データベースからセキュリティコードと有効期限を取得
    con = sqlite3.connect('test.db')
    c = con.cursor()
    c.execute("SELECT security_code, expiration_time FROM users WHERE email = ?", (email,))
    user = c.fetchone()
    print("Security code and expiration time from DB:", user)  # デバッグ用

    if user is None:
        con.close()
        err_msg = 'ユーザーが見つかりません。'
        print("User not found")  # デバッグ用
        return render_template("loginCheck.html", email=email, err=err_msg)

    db_security_code, db_expiration_time = user

    # データベースにデータが入ってない場合
    if db_expiration_time == None:
        con.close()
        err_msg = 'セキュリティコードが無効か、有効期限が切れています。'
        print("Invalid or expired security code")  # デバッグ用
        return render_template("loginCheck.html", email=email, err=err_msg)
        
    db_expiration_time = db_expiration_time.split('.')[0]  # 小数点以下を削除
    db_expiration_time = datetime.datetime.strptime(db_expiration_time, "%Y-%m-%d %H:%M:%S")

    # セキュリティコードが一致しない、または有効期限が切れている場合はエラー
    current_time = datetime.datetime.now()
    if security_code != db_security_code or current_time > db_expiration_time:
        con.close()
        err_msg = 'セキュリティコードが無効か、有効期限が切れています。'
        print("Invalid or expired security code")  # デバッグ用
        return render_template("loginCheck.html", email=email, err=err_msg)

    # ログイン成功した時、DBからセキュリティコード情報削除。
    c.execute("UPDATE users SET security_code = NULL, expiration_time = NULL WHERE email = ?", (email,))
    con.commit()
    con.close()
    
    # セキュリティコードが正しい場合、クッキーを設定
    response = make_response("""<script>
        alert("ログインが成功しました。");
        window.location.href = '/share';  // ログイン成功後のリダイレクト先
        </script>
        """)
    response = set_cookie(response, email)
    print(response)
    return response