from flask import render_template, Blueprint, request
import sqlite3


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

@bp.route("/entryCheck", methods=["POST"])
def entryCheck():
    # フォームから送信されたデータを取得
    result = request.form
    email = result['email']
    password = result['pas']
    password_check = result['check']

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
                    (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, username TEXT, introduction TEXT)''')
    execute_query('''CREATE TABLE IF NOT EXISTS follows (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    follower_id INTEGER,
                    followed_id INTEGER,
                    FOREIGN KEY (follower_id) REFERENCES users (id),
                    FOREIGN KEY (followed_id) REFERENCES users (id)
                )''')

    # データベースへの登録
    execute_query("INSERT INTO users (email, password) VALUES (?, ?)", (email, password))

    # ユーザー情報の取得と表示
    rows = execute_query("SELECT email, password FROM users", fetchall=True)
    for row in rows:
        print("Email:", row[0])
        print("Password:", row[1])

    return render_template('entryCheck.html', err=err_msg, result=result)
