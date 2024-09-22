from flask import redirect, Blueprint, render_template, request, url_for, make_response
import json
import sqlite3

bp = Blueprint("share", __name__)

@bp.route("/share/<page>", methods=["GET"])
@bp.route("/share", defaults={"page": 1}, methods=["GET"])
def share(page):
    # クッキーからデータを取得
    cookie_data = request.cookies.get("key")
    print("cookie_data:", cookie_data)

    # クッキーが存在しない場合、emailを空に設定
    if cookie_data is None:
        email = ""
        user_data = (None,)
        result = {"icon_path": ""}
    else:
        email = json.loads(cookie_data).get("email")
        con = sqlite3.connect('test.db')
        c = con.cursor()
        c.execute("SELECT id, icon_path FROM users WHERE email = ? ORDER BY username", (email,))
        login_user = c.fetchone()
        print(login_user)
        result = {"icon_path": login_user[1]}

    print("email:", email)

    # データベースからユーザー情報を取得
    con = sqlite3.connect('test.db')
    c = con.cursor()
    c.execute("SELECT username FROM users WHERE email = ?", (email,))
    user_data = c.fetchone()
    con.close()
    print("ユーザーデータ:", user_data)

    # データベースから全ての作品情報を取得
    con = sqlite3.connect('test.db')
    c = con.cursor()

    try:
        max_page = 21                   # 表示件数
        page = float(page)                # 表示するページ
        page_int = int(page)

        if page != page_int:  # 少数で受け取った場合整数に変換する 
            return redirect(url_for('share.share',page = page_int))
        
        page = page_int                 # 整数に変換    
    except ValueError:                  #　pageに無効な文字が与えられたとき
        return f"""
        <script>
            alert('不正なURLです');
            window.location.href = '/share'; // リダイレクト
        </script>
        """
    
    # ページネーション:総ページ数計算
    c.execute('SELECT COUNT(*) FROM projects WHERE visibility="public"')  
    total_rec = c.fetchone()[0]
    if total_rec % max_page == 0: # レコード数が表示件数で割れる場合
        total_page = total_rec // max_page
    else:
        total_page = total_rec // max_page + 1

    if total_rec != 0:
        if page < 1: # page 1未満を指定されたら 1にして返す
            page = 1
            return redirect(url_for('share.share',page=page))
        if page > total_page:  
            page = total_page
            return redirect(url_for('share.share',page=page))

    sidx = (page - 1) * max_page    # 表示する範囲のスタート値
    eidx = sidx + max_page          # 表示する範囲のエンド値

    c.execute('SELECT id, user_id, title, thumb_path FROM projects WHERE visibility="public"') # 作品id ,名前を取得するためのuser_id,作品titleを取得
    res_projects = c.fetchall()
    res_projects = res_projects[sidx:eidx] # 表示する件数の範囲を絞る
    new_projects = []   # 渡すデータ用
        
    # 作品情報にユーザー名とアイコンパスを追加
    for project in res_projects:
        user_id = project[1]
        c.execute('SELECT username, icon_path FROM users WHERE id = ?', (user_id,))
        user_record = c.fetchone()
        if user_record is not None:
            user_name = user_record[0]
            icon_path = user_record[1]
            #改良量の余地あり
            rec_project = (project[0], user_name, icon_path, project[2], project[3]) #record内容　: id, user_name, icon_path, title, thumb_path
            new_projects.append(rec_project)
    print(new_projects)

    con.close()

    # 入力された検索クエリを取得
    query = request.args.get('text', '')

    # データベースから作品を検索
    con = sqlite3.connect('test.db')
    c = con.cursor()
    
    try:
        search_page = float(request.args.get('search_page', 1))
        search_page_int = int(search_page)

        if search_page != search_page_int:  # 少数で受け取った場合整数に変換する
            return redirect(url_for('share.share', text=query, search_page=search_page_int))
        
        search_page = search_page_int  
    except ValueError:
        return """
        <script>
            alert('不正なページ番号です');
            window.location.href = '/share?text={}'; // クエリを保持してリダイレクト
        </script>
        """.format(query)
    
    # ページネーション:検索結果の総ページ数計算
    count_search_query = """
        SELECT COUNT(*)
        FROM projects p
        WHERE p.title LIKE ?
        AND
        visibility='public'
    """
    c.execute(count_search_query, ('%' + query + '%',))
    total_search_rec = c.fetchone()[0]
    if total_search_rec % max_page == 0:
        total_search_page = total_search_rec // max_page
    else:
        total_search_page = total_search_rec // max_page + 1

    # 7/12追記 無限ループが起こる
    # # urlでpageの数値を1未満やtotal_search_page以上にされたときに値を直して返す
    if total_search_rec != 0:
        if search_page < 1:
            search_page = 1
            return redirect(url_for('share.share', text=query, search_page=search_page))
        
        if search_page > total_search_page:
            search_page = total_search_page
            return redirect(url_for('share.share', text=query, search_page=search_page))
    else: 
        if search_page != 1:
            return redirect(url_for('share.share', text=query))
        
    sidx = (search_page - 1) * max_page
    eidx = sidx + max_page

    project_search_query = """
        SELECT p.id, p.user_id, p.title, p.thumb_path, u.username, u.icon_path 
        FROM projects p
        LEFT JOIN users u ON p.user_id = u.id
        WHERE p.title LIKE ?
        AND
        p.visibility='public'
        ORDER BY p.title
        LIMIT ? OFFSET ?
    """
    c.execute(project_search_query, ('%' + query + '%', max_page, sidx))
    search_results = c.fetchall()
    print("検索結果:", search_results)

    
    con.close()

    # 検索結果にユーザー名とアイコンパスを含めた作品情報を構築
    search_projects = []
    for project in search_results:
        project_id = project[0]
        user_name = project[4]
        icon_path = project[5]
        title = project[2]
        thumb_path = project[3]
        
        search_projects.append({
            "project_id": project_id,
            "username": user_name,
            "icon_path": icon_path,
            "title": title,
            "thumb_path": thumb_path
        })

    # ユーザー情報に username がない場合は入力を促す
    if email:
        if user_data[0] == None or user_data[0] == "":
            return """<script>
        alert("ユーザー登録してください。");
        window.location.href = '/profEdit';
        </script>
        """
        else:
            return render_template("share.html", search_results=search_projects, result=result, query=query, editor=True, projects=new_projects, page=page, total_page=total_page, search_page=search_page, total_search_page=total_search_page)
    else:
        # 非ログイン時にリザルトを初期化
        result = ""

    # username が入力されている場合はシェアページにリダイレクト
    return render_template("share.html", search_results=search_projects, result=result, query=query, editor=True, projects=new_projects, page=page, total_page=total_page, search_page=search_page, total_search_page=total_search_page)