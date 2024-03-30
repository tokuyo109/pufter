from flask import Blueprint, render_template
import sqlite3

bp = Blueprint("profile", __name__)

def fetch_followers_count(username):
    result ={}
    # SQLiteデータベースへの接続
    con = sqlite3.connect('test.db')
    c = con.cursor()

    # SQLiteデータベースからフォロー数を取得
    c.execute("SELECT COUNT(followed_id) FROM follows INNER JOIN users ON follows.follower_id = users.id WHERE users.username = ?", (username,))
    following_count = c.fetchone()[0]  # フォローしているユーザーの数を取得
    
    # 取得したフォロー数をresult辞書に追加
    result["following_count"] = following_count

    # SQLiteデータベースからフォロワー数を取得
    c.execute("SELECT COUNT(follower_id) FROM follows INNER JOIN users ON follows.followed_id = users.id WHERE users.username = ?", (username,))
    follower_count = c.fetchone()[0]  # フォローされているユーザーの数を取得
    
    # 取得したフォロワー数をresult辞書に追加
    result["follower_count"] = follower_count
    
    # データベース接続を閉じる
    con.close()

    return result

@bp.route('/profile/<username>')
def profile(username):
    profile_info = {}  # プロフィール情報を格納する空の辞書

    # SQLiteデータベースへの接続
    conn = sqlite3.connect('test.db')
    c = conn.cursor()

    # ユーザー名に基づいてプロフィール情報を取得するクエリを実行
    c.execute("SELECT username, introduction, twitterid FROM users WHERE username=?", (username,))
    user_data = c.fetchone()  # ユーザーの情報を取得

    # ユーザーが存在する場合はプロフィール情報を設定
    if user_data:
        profile_info['username'] = user_data[0]
        profile_info['introduction'] = user_data[1]
        profile_info['twitterid'] = user_data[2]

    # フォロワー数を取得
    result = fetch_followers_count(username)

    # データベース接続を閉じる
    conn.close()

    return render_template("profile.html", profile_info=profile_info, result=result)
