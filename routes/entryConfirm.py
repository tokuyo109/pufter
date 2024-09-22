from flask import Flask, render_template, Blueprint, request
from flask_mail import Mail
import sqlite3
import datetime

app = Flask(__name__)

# Flask-Mailの設定
app.config['MAIL_SERVER'] = ''  # GmailのSMTPサーバー
app.config['MAIL_PORT'] = ''  # GmailのTLSポート
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = ''  # Gmailのメールアドレス
app.config['MAIL_PASSWORD'] = ''  # Gmailのパスワード

mail = Mail(app)  # Flask-Mailの拡張機能をアプリケーションに追加

bp = Blueprint("entryConfirm", __name__)

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

@bp.route("/entryConfirm", methods=["POST"])
def entryConfirm():
    # フォームから送信されたセキュリティコードを取得
    security_code = request.form['security_code']

    # セキュリティコードを確認する
    con = sqlite3.connect('test.db')
    c = con.cursor()
    c.execute("SELECT * FROM assume WHERE security_code=?", (security_code,))
    user = c.fetchone()
    con.close()

    if not user:
        err_msg = {'security_code': 'セキュリティコードが正しくありません。'}
        return render_template('entryCheck.html', err=err_msg)

    # デバッグ用の出力
    print("DBの有効時間", user[4])

    # セキュリティコードが正しい場合、有効期限を確認する
    expiration_time = datetime.datetime.strptime(user[4], "%Y-%m-%d %H:%M:%S.%f")  # 文字列から日時オブジェクトに変換
    current_time = datetime.datetime.now()  # 現在時刻を取得
    print("現在時刻：", current_time)
    print("有効時間：", expiration_time)

    if current_time > expiration_time:
        # 有効期限が切れている場合の処理
        err_msg = {'security_code': 'セキュリティコードの有効期限が切れています。'}
        return render_template('entryCheck.html', err=err_msg)

    # セキュリティコードが正しく、有効期限内の場合はアカウントを有効化し、データベースを更新するなどの処理を行う
    # ユーザーの情報を取得
    email = user[1]
    password = user[2]

    # usersテーブルにユーザー情報を格納
    execute_query("INSERT INTO users (email, password) VALUES (?, ?)", (email, password,))

    # assumeテーブルから削除
    execute_query("DELETE FROM assume WHERE security_code=?", (security_code,))

    return """<script>
        alert("アカウントが有効化されました。");
        window.location.href = '/login';
        </script>
        """