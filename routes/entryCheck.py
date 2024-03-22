# 新規会員登録入力チェックページ
from flask import render_template, Blueprint, request
import sqlite3

bp = Blueprint("entryCheck", __name__)

@bp.route("/entryCheck", methods=["POST"])
def entryCheck():
    # フォームから送信されたデータを取得
    mail = request.form['mail']
    password = request.form['pas']
    password_check = request.form['check']

    # バリデーションを行う（ここではシンプルな例）
    err_msg = {}
    if '@' not in mail:
        err_msg['mail'] = 'メールアドレスが無効です。'
    if len(password) < 6:
        err_msg['pas'] = 'パスワードは6文字以上で入力してください。'
    if password != password_check:
        err_msg['check'] = 'パスワードが一致しません。'

    # エラーメッセージがある場合は登録ページに戻り、エラーを表示する
    if err_msg:
        return render_template('entry.html', err=err_msg, result=request.form)

    # SQLiteデータベースへの接続
    conn = sqlite3.connect('test.db')
    c = conn.cursor()

    # テーブルの作成（もしくはすでに存在する場合はスキップ）
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT)''')
    # テーブルの作成（もしくはすでに存在する場合はスキップ）
    # c.execute('''ALTER TABLE users ADD COLUMN username TEXT''')
    # c.execute('''ALTER TABLE users ADD COLUMN introduction TEXT''')


    # データベースへの変更をコミットし、接続を閉じる
    conn.commit()
    conn.close()

    # エラーがない場合はデータベースに登録する
    conn = sqlite3.connect('test.db')
    c = conn.cursor()

    c.execute("INSERT INTO users (email, password) VALUES (?, ?)", (mail, password))

    conn.commit()
    conn.close()

    # 登録完了後はentryCheck.htmlにリダイレクトする
    
    # SQLiteデータベースへの接続
    conn = sqlite3.connect('test.db')
    c = conn.cursor()
    
    # SELECT文を実行してデータを取得
    c.execute("SELECT email, password FROM users")
    rows = c.fetchall()
    
    # 取得したデータを表示
    for row in rows:
        print("Email:", row[0])
        print("Password:", row[1])
    
    # 接続を閉じる
    conn.close()
    return render_template('entryCheck.html', err=err_msg, result=request.form)
