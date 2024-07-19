from flask import Blueprint, request, render_template, url_for, redirect
from flask_mail import Mail, Message
import sqlite3
import secrets
import datetime

bp = Blueprint("resetPasswordCheck", __name__)
mail = Mail()

def execute_query(query, params=None, fetchall=False):
    con = sqlite3.connect('test.db')
    c = con.cursor()
    if params:
        c.execute(query, params)
    else:
        c.execute(query)
    print("Query executed successfully:", query)
    if fetchall:
        result = c.fetchall()
    else:
        result = None
    con.commit()
    con.close()
    return result

@bp.route("/resetPasswordCheck", methods=["POST"])
def resetPasswordCheck():
    email = request.form['email']
    err_msg = {}

    con = sqlite3.connect('test.db')
    c = con.cursor()
    c.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = c.fetchone()
    con.close()

    if user is None:
        err_msg['email'] = 'このメールアドレスは登録されていません'
        return render_template('resetPasswordMailInput.html', err=err_msg, result=request.form)

    if '@' not in email:
        err_msg['email'] = 'メールアドレスが無効です。'

    if err_msg:
        return render_template('resetPasswordMailInput.html', err=err_msg, result=request.form)

    reset_token = secrets.token_urlsafe(10)
    token_time = datetime.datetime.now() + datetime.timedelta(minutes=10)
    print(token_time)

    execute_query("UPDATE users SET reset_token = ?, token_time = ? WHERE email = ?", (reset_token, token_time, email,))


    reset_link = url_for('resetPassword.resetPassword', token=reset_token, _external=True)
    msg = Message('パスワードリセット', sender='', recipients=[email])
    msg.body = f'パスワードをリセットするには、以下のリンクをクリックしてください：\n{reset_link}\n\nこのリンクの有効期限は10分です。'
    mail.send(msg)

    return render_template('resetPasswordCheck.html')
