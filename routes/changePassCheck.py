# 新規会員登録入力チェックページ
from flask import render_template, Blueprint, request
import sqlite3

bp = Blueprint("changePassCheck", __name__)

@bp.route("/changePassCheck", methods=["POST"])
def changePassCheck():
    # バリデーションを行う（ここではシンプルな例）
    err_msg = {}

    # 入力されたメールアドレスを格納
    email = request.form['email']
    # アカウントが登録されているか
    con = sqlite3.connect('test.db')
    c = con.cursor()

    # データベースからメールアドレスをチェック
    c.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = c.fetchone()

    con.close()

    # ユーザーが存在しない場合はログイン失敗
    if user is None:
        err_msg['email'] = 'このメールアドレスは登録されていません'
        return render_template('changePass.html', err=err_msg, result=request.form)

    # フォームから送信されたデータを取得
    password = request.form['pas']
    password_check = request.form['check']

    if '@' not in email:
        err_msg['email'] = 'メールアドレスが無効です。'
    if len(password) < 6:
        err_msg['pas'] = 'パスワードは6文字以上で入力してください。'
    if password != password_check:
        err_msg['check'] = 'パスワードが一致しません。'

    # エラーメッセージがある場合は登録ページに戻り、エラーを表示する
    if err_msg:
        return render_template('changePass.html', err=err_msg, result=request.form)


    # エラーがない場合はデータベースに登録する
    conn = sqlite3.connect('test.db')
    c = conn.cursor()

    c.execute("UPDATE users SET password=? WHERE email=?", (password, email))

    conn.commit()
    conn.close()

    # 登録完了後はchangePassCheck.htmlにリダイレクトする
    
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
    return render_template('changePassCheck.html')
