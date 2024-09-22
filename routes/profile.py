from flask import Blueprint, render_template, request
import sqlite3
import json

bp = Blueprint("profile", __name__)

def fetch_followers_count(username):
    result = {}
    con = sqlite3.connect('test.db')
    c = con.cursor()

    c.execute("SELECT COUNT(followed_id) FROM follows INNER JOIN users ON follows.follower_id = users.id WHERE users.username = ?", (username,))
    following_count = c.fetchone()[0]

    result["following_count"] = following_count

    c.execute("SELECT COUNT(follower_id) FROM follows INNER JOIN users ON follows.followed_id = users.id WHERE users.username = ?", (username,))
    follower_count = c.fetchone()[0]

    result["follower_count"] = follower_count

    con.close()
    return result

def is_following(logged_in_user_id, profile_user_id):
    con = sqlite3.connect('test.db')
    c = con.cursor()
    c.execute("SELECT COUNT(*) FROM follows WHERE follower_id = ? AND followed_id = ?", (logged_in_user_id, profile_user_id))
    is_following = c.fetchone()[0] > 0
    con.close()
    return is_following

@bp.route('/profile/<username>')
def profile(username):
    profile_info = {}

    con = sqlite3.connect('test.db')
    c = con.cursor()

    c.execute("SELECT username, introduction, icon_path FROM users WHERE username=?", (username,))
    user_data = c.fetchone()

    if user_data:
        profile_info['username'] = user_data[0]
        profile_info['introduction'] = user_data[1]
        profile_info['icon_path'] = user_data[2]

    result = fetch_followers_count(username)

    cookie_data = request.cookies.get("key")
    if cookie_data:
        cookie_data = json.loads(cookie_data)
        email = cookie_data.get('email')

        c = con.cursor()
        c.execute("SELECT id, icon_path FROM users WHERE email = ? ORDER BY username", (email,))
        login_user = c.fetchone()
        print(login_user)
        result["icon_path"] = login_user[1]


        logged_in_user_id = c.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()[0]
        profile_user_id = c.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone()[0]
        following = is_following(logged_in_user_id, profile_user_id)
        is_own_profile = logged_in_user_id == profile_user_id
    else:
        email = ""
        user_data = (None,)
        result["icon_path"] = ""
        following = False
        following = False
        is_own_profile = False

    c.execute("SELECT id, title, thumb_path FROM projects WHERE user_id = ? AND visibility='public'", (profile_user_id,))
    projects = c.fetchall()
    c.execute("SELECT COUNT(*) FROM projects WHERE user_id = ? AND visibility='public'", (profile_user_id,))
    count = c.fetchone()
     # いいねしたプロジェクトの取得
    c.execute("SELECT p.id, p.title, p.thumb_path FROM projects p INNER JOIN favorite f ON p.id = f.project_id WHERE f.login_id = ?", (profile_user_id,))
    
    liked_projects = c.fetchall()

    print("ファボした作品",liked_projects)
    print("投稿した作品数",count[0])
    con.close()

    return render_template("profile.html", profile_info=profile_info, result=result, following=following, is_own_profile=is_own_profile, projects=projects, liked_projects=liked_projects, count=count[0])
