from flask import Blueprint, render_template, request
import sqlite3
import json

bp = Blueprint("followView", __name__)

def get_following_users(email):
    con = sqlite3.connect('test.db')
    c = con.cursor()

    # ログインユーザーのIDを取得
    login_user_id = c.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()[0]

    # フォローしているユーザーのIDとユーザー名を取得
    c.execute("""
        SELECT u.id, u.username, u.icon_path
        FROM follows f
        INNER JOIN users u ON f.followed_id = u.id
        WHERE f.follower_id = ?
    """, (login_user_id,))
    following_users = c.fetchall()

    con.close()
    return following_users

@bp.route("/followView/<int:page>", methods=["GET"])
@bp.route("/followView", defaults={"page": 1}, methods=["GET"])
def followView(page):
    cookie_data = request.cookies.get("key")
    if cookie_data:
        cookie_data = json.loads(cookie_data)
        email = cookie_data.get('email')
        following_users = get_following_users(email)

        # ヘッダー用のアイコンを送信
        con = sqlite3.connect('test.db')
        c = con.cursor()
        c.execute("SELECT id, icon_path FROM users WHERE email = ? ORDER BY username", (email,))
        login_user = c.fetchone()
        result = {"icon_path": login_user[1]}

        max_page = 21                   # 表示件数
        page = int(page)                # 表示するページ
        sidx = (page - 1) * max_page    # 表示する範囲のスタート値
        eidx = sidx + max_page          # 表示する範囲のエンド値

        # フォローしているユーザーのIDをリスト化
        following_user_ids = [user[0] for user in following_users]

        if following_user_ids:
            # フォローしているユーザーのプロジェクトを取得
            c.execute("""
                SELECT p.id, p.user_id, p.title, p.thumb_path
                FROM projects p
                WHERE p.user_id IN ({seq}) AND p.visibility="public"
            """.format(seq=','.join(['?']*len(following_user_ids))), following_user_ids)
            res_projects = c.fetchall()
        else:
            res_projects = []

        res_projects = res_projects[sidx:eidx] # 表示する件数の範囲を絞る
        new_projects = []   # 渡すデータ

        # 作品情報にユーザー名とアイコンパスを追加
        for project in res_projects:
            user_id = project[1]
            c.execute('SELECT username, icon_path FROM users WHERE id = ?', (user_id,))
            user_record = c.fetchone()
            if user_record is not None:
                user_name = user_record[0]
                icon_path = user_record[1]
                rec_project = (project[0], user_name, icon_path, project[2], project[3]) #サムネイルファイル名 => project[4]
                new_projects.append(rec_project)

        # ページネーション: 総ページ数計算
        c.execute("""
            SELECT COUNT(*) 
            FROM projects 
            WHERE user_id IN ({seq})
            AND visibility="public"
        """.format(seq=','.join(['?']*len(following_user_ids))), following_user_ids)
        total_rec = c.fetchone()[0]
        if total_rec % max_page == 0: # レコード数が表示件数で割れる場合
            total_page = total_rec // max_page
        else:
            total_page = total_rec // max_page + 1

        con.close()
        return render_template('followView.html', following_users=following_users, projects=new_projects, page=page, total_page=total_page, result=result)
    else:
        return """
        <script>
            alert('フォローしたユーザーを見るには、ログインが必要です。');
            window.location.href = '/login'; // リダイレクト
        </script>
        """