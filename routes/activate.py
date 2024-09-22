from flask import Blueprint, redirect, url_for, flash
import sqlite3

bp = Blueprint("activate", __name__)


@bp.route("/activate/<token>", methods=["GET"])
def activate(token):
    user = execute_query("SELECT * FROM users WHERE activation_token = ?", (token,), fetchall=True)
    if user:
        if not user[0][5]:  # activation_tokenが空の場合
            execute_query("UPDATE users SET activation_token = NULL WHERE activation_token = ?", (token,))
            alert_message = 'アカウントが有効化されました。ログインしてください。'
            return f'<script>alert("{alert_message}"); window.location.replace("{url_for('login')}");</script>'
        else:
            alert_message = 'このリンクはすでに使用されています。'
            return f'<script>alert("{alert_message}"); window.location.replace("{url_for('entryCheck.entryCheck')}");</script>'
    else:
        alert_message = '無効なリンクです。'
        return f'<script>alert("{alert_message}"); window.location.replace("{url_for('entry.entry')}");</script>'


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
    