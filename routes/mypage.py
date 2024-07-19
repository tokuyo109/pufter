# プロフィール編集チェックページ
from flask import render_template, Blueprint, request, jsonify, redirect, url_for
import sqlite3
import datetime
import json
import os
from werkzeug.utils import secure_filename

bp = Blueprint("mypage", __name__)

@bp.route("/mypage/<page>", methods=["GET"])
@bp.route("/mypage",defaults={"page":1}, methods=["GET"])
def mypage(page):
    # 結果の格納場所
    result = {}
    # クッキーからデータを取得
    cookie_data = request.cookies.get("key")

    # デフォルトのデータを設定
    if cookie_data is not None:
        cookie_data = json.loads(cookie_data)
    else:
        return """
		<script>
		    alert('ログインしてください');
		    window.location.href = '/login'; // リダイレクト
		</script>
		"""

    # SQLiteデータベースへの接続
    con = sqlite3.connect('test.db')
    c = con.cursor()

    # クッキーから取得したメールアドレスを使用して、ユーザー名を取得
    email = cookie_data.get('email', None)
    # ユーザー名と自己紹介を取得するクエリを実行
    c.execute("SELECT username, introduction, icon_path FROM users WHERE email=?", (email,))
	
    # 取得した結果を取得
    rows = c.fetchall()  # データベースからの取得結果

    # 取得した結果が空でなければ辞書に変換
    if rows:
        result["username"] = rows[0][0]
        result["introduction"] = rows[0][1]
        result["icon_path"] = rows[0][2]

	
    # 結果の表示
    for row in rows:
        print(row)
        
    # SQLiteデータベースからフォロー数を取得
    c.execute("SELECT id FROM users WHERE email = ?", (email,))
    login_user_id = c.fetchone()[0]  # ログインユーザーのemailを取得
    c.execute("SELECT COUNT(followed_id) FROM follows WHERE follower_id = ?", (login_user_id,))
    following_count = c.fetchone()[0]  # フォローしているユーザーの数を取得

    # 取得したフォロー数をresult辞書に追加
    result["following_count"] = following_count
    
    # SQLiteデータベースからフォロワー数を取得
    c.execute("SELECT COUNT(follower_id) FROM follows WHERE followed_id = ?", (login_user_id,))
    follower_count = c.fetchone()[0]  # フォローされているユーザーの数を取得

    # 取得したフォロワー数をresult辞書に追加
    result["follower_count"] = follower_count
    
    try:
        max_page = 12                   # 表示件数
        page = float(page)                # 表示するページ
        page_int = int(page)

        if page != page_int:
            return redirect(url_for('mypage.mypage',page = page_int))
        page = page_int

    except ValueError:
        return f"""
            <script>
            alert('不正なURLです');
            window.location.href = '/mypage';
        </script>
        """
    c.execute("SELECT id FROM users WHERE email = ?", (email,)) #メールアドレスからユーザidの取得
    res = c.fetchone()
    user_id = res[0]

    # ページネーション:総ページ数計算
    c.execute('SELECT COUNT(*) FROM projects WHERE user_id = ?',(user_id,))  
    total_rec = c.fetchone()[0]
    if total_rec % max_page == 0: #レコード数が表示件数で割れる場合
        total_page = total_rec // max_page
    else:
        total_page = total_rec // max_page + 1

    if total_rec != 0:
        if page < 1: # page 1未満を指定されたら 1にして返す
            page = 1
            return redirect(url_for('myapage.mypage',page=page))
        if page > total_page:  
            page = total_page
            return redirect(url_for('mypage.mypage',page=page))

    sidx = (page - 1) * max_page    # 表示する範囲のスタート値
    eidx = sidx + max_page          # 表示する範囲のエンド値

    c.execute("SELECT id, title, thumb_path FROM projects WHERE user_id = ?",(user_id,)) #projectsテーブルのuser_idに合致する id ,title,thumb_pathを取得
    res_projects = c.fetchall()
    res_projects = res_projects[sidx:eidx]  #表示する件数の範囲を絞る(渡すデータ)

    print(res)

    # いいねしたプロジェクトの取得
    c.execute("SELECT p.id, p.title, p.thumb_path FROM projects p INNER JOIN favorite f ON p.id = f.project_id WHERE f.login_id = ?", (login_user_id,))
    
    liked_projects = c.fetchall()

    con.commit()
    con.close()

    return render_template('mypage.html', result=result, projects=res_projects, liked_projects=liked_projects, total_page=total_page, page=page, count=total_rec)