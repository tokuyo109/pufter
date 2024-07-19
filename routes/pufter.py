from flask import render_template, Blueprint, jsonify, request, send_from_directory, redirect, url_for
import random, string, json, os, sqlite3 ,base64

bp = Blueprint("pufter", __name__)

# ランダムな文字列を返す
def randomString(n):
    randlst = [random.choice(string.ascii_letters + string.digits) for _ in range(n)]
    return ''.join(randlst)

# ログインしているかどうかを返す
def isLogin():
    cookie_data = request.cookies.get("key")
    if cookie_data:
        e_mail = json.loads(cookie_data).get("email")
        return e_mail is not None
    return False

# ユーザーIDを取得する
def getUserId(email):
    con = sqlite3.connect("test.db")
    c = con.cursor()
    c.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = c.fetchone()
    con.close()
    if user:
        return user[0]
    return None

def getIconPath(email):
    con = sqlite3.connect("test.db")
    c = con.cursor()
    c.execute("SELECT icon_path FROM users WHERE email = ?", (email,))
    icon_path = c.fetchone()[0]
    con.close()
    return icon_path

# プロジェクトを作成する
def createProject():
    cookie_data = request.cookies.get("key")
    email = json.loads(cookie_data).get("email")

    # プロジェクトデータを作成する
    con = sqlite3.connect("test.db")
    c = con.cursor()
    user_id = getUserId(email)
    json_name = f"{randomString(10)}.json"
    visibility = "private"
    # thumb_name = f"{json_name.rsplit('.', 1)[0]}.png"
    thumb_name = "noImage"
    title = "NewProject"
    c.execute("INSERT INTO projects (user_id, json_path, visibility, title) VALUES (?, ?, ?, ?)", (user_id, json_name, visibility, title))
    con.commit()

    project_id = c.lastrowid
    con.close()
    
    json_path = os.path.join("static", "json", "projects", json_name)
    os.makedirs(os.path.dirname(json_path), exist_ok=True)

    with open(json_path, "w") as json_file:
        json.dump({}, json_file)

    # プロジェクトデータを返す
    return {
        "id": project_id,
        "user_id": user_id,
        "json_path": json_name,
        "visibility": "private",
        "thumb_path":thumb_name, #thumbnail
        "title": title,
        "can_edit": True
    }

# プロジェクトを取得する
def getProject(project_id):
    # 該当するプロジェクトデータを取得する
    con = sqlite3.connect("test.db")
    c = con.cursor()
    c.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
    project_data = c.fetchone()
    con.close()

    # プロジェクトが存在するか
    can_edit = False
    if project_data:
        # ユーザーがプロジェクトの作成者か
        cookie_data = request.cookies.get("key")
        if cookie_data:
            email = json.loads(cookie_data).get("email")
            user_id = getUserId(email)
            can_edit = (project_data[1] == user_id)

        return {
            "id": project_data[0],
            "user_id": project_data[1],
            "json_path": project_data[2],
            "visibility": project_data[3],
            "title": project_data[4],
            "thumb_path": project_data[5],
            "can_edit": can_edit
        }
    return None

# プロジェクトのタイトルを更新する
def updateTitle(project_id, title):
    project_data = getProject(project_id)

    if project_data is None:
        return jsonify({"message": "タイトルを保存できませんでした"}), 404

    con = sqlite3.connect("test.db")
    c = con.cursor()
    c.execute("UPDATE projects SET title = ? WHERE id = ?", (title, project_id))
    con.commit()
    con.close()

    return jsonify({"message": "タイトルを保存しました"})

# 編集ページのエンドポイント
@bp.route("/pufter", defaults={"project_id": None, "music_url": None}, methods=["GET"])
@bp.route("/pufter/<project_id>", defaults={"music_url": None}, methods=["GET"])
@bp.route("/pufter/<project_id>/<music_url>", methods=["GET"])
def pufter(project_id, music_url):
    is_login = isLogin()
    project_data = None
    
    if project_id:
        project_data = getProject(project_id)
        if project_data is None:
            return redirect(url_for("index.index"))
    else:
        if is_login:
            project_data = createProject()
        else:
            return redirect(url_for("index.index"))
    
    if music_url is None:
        music_url = "https://www.youtube.com/watch?v=T2kS1gAbxhc"

    cookie_data = request.cookies.get("key")
    email = None
    favorite = False
    if cookie_data:
        email = json.loads(cookie_data).get("email")
        user_id = getUserId(email)
        favorite = is_favorite(user_id, project_id)

    result_data = {
        "is_login": is_login,
        "music_url": music_url,
        "project_id": project_data["id"],
        "user_id": project_data["user_id"],
        "json_path": project_data["json_path"],
        "visibility": project_data["visibility"],
        # 編集ページ動かすために一旦コメントアウトしてます。by水野
        "title": project_data["title"],
        "thumb_path":project_data["thumb_path"],
        "icon_path": getIconPath(email) if email else None,
        "favorite": favorite
    }

    print("ログインID",user_id)
    print("投稿者ID",result_data["user_id"])

    return render_template("pufter.html", project_data=result_data, login_user_id=user_id)

# プロジェクトを取得するAPI
@bp.route('/api/serve_json/<file_name>', methods=['GET'])
def serve_json(file_name):
    json_directory = os.path.join("static", "json", "projects")
    file_path = os.path.join(json_directory, file_name)

    if os.path.exists(file_path):
        return send_from_directory(json_directory, file_name)
    else:
        return jsonify({"error": "ファイルが見つかりません"}), 404

# プロジェクトを保存するAPI
@bp.route("/api/save_json", methods=["POST"])
def save_json():
    cookie_data = request.cookies.get("key")
    email = json.loads(cookie_data).get("email")
    user_id = getUserId(email)
    
    data = request.get_json()
    file_name = data.get("file_name")
    if not file_name:
        return jsonify({"message": "ファイル名が見つかりません"}), 400
    
    con = sqlite3.connect("test.db")
    c = con.cursor()
    c.execute("SELECT user_id FROM projects WHERE json_path = ?", (file_name,))
    project_user_id = c.fetchone()
    con.close()
    
    if project_user_id and project_user_id[0] != user_id:
        return jsonify({"message": "このプロジェクトを編集する権限がありません"}), 403
    
    json_path = os.path.join("static", "json", "projects", file_name)
    os.makedirs(os.path.dirname(json_path), exist_ok=True)

    # JSONデータからファイル名を削除して、ファイル内容として保存
    data.pop("file_name", None)
    
    with open(json_path, "w", encoding="utf-8") as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4)
        
    return jsonify({"message": "保存が完了しました", "file_name": file_name})

#サムネイルを保存するAPI
@bp.route("/api/save_thumb", methods=["POST"])
def save_thumb():
    try:
        data = request.get_json() 

        if not data:
            return jsonify({"messgae":"jsonデータが見つかりません"}), 400
        
        thumb_name = data.get("thumb_name") #保存ファイル名 : 99_xxxxxxxxxx.png
        project_id = data.get("project_id") # project _id
        thumb_data = data.get("image")      #画像データ 

        if not thumb_data:
            return jsonify({"message": "サムネイルデータが見つかりません"}), 400
        if not project_id:
            return jsonify({"message": "プロジェクトIDが見つかりません"}), 400
        if not thumb_name:
            return jsonify({"message": "サムネイル名が見つかりません"}), 400

        con = sqlite3.connect("test.db")
        c = con.cursor()

        # 現在のサムネイルパスを取得
        c.execute("SELECT thumb_path FROM projects WHERE id = ?", (project_id,))
        current_thumb_path = c.fetchone()[0] # 初めての場合　'noImage'

        # database: thumb_pathを更新
        c.execute("UPDATE projects SET thumb_path = ? WHERE id = ?", (thumb_name, project_id))
        con.commit()
        con.close()

        thumb_path = os.path.join("static", "img", "projects", "thumb", thumb_name)
        os.makedirs(os.path.dirname(thumb_path), exist_ok=True)

        # 古いサムネイルを削除（'noImage'でない場合）
        if current_thumb_path != 'noImage':
            old_thumb_path = os.path.join("static", "img", "projects", "thumb", current_thumb_path)
            if os.path.exists(old_thumb_path):
                os.remove(old_thumb_path)

        # 画像データを保存
        thumb_data = thumb_data.split(",")[1]  # "data:image/png;base64," を除去
        with open(thumb_path, "wb") as thumb_file:
            thumb_file.write(base64.b64decode(thumb_data))

        return jsonify({"message": "サムネイルの保存が完了しました", "thumb_name": thumb_name})
    except sqlite3.Error as e:
        return jsonify({"message": f"データベースエラー: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"message": f"サムネイルの保存中にエラーが発生しました: {str(e)}"}), 500

# タイトルを更新するAPI
@bp.route("/api/<project_id>/<title>", methods=["GET"])
def update_title(project_id, title):
    return updateTitle(project_id, title)

# いいね状態を確認する関数
def is_favorite(user_id, project_id):
    con = sqlite3.connect("test.db")
    c = con.cursor()
    c.execute("SELECT COUNT(*) FROM favorite WHERE login_id = ? AND project_id = ?", (user_id, project_id))
    count = c.fetchone()[0]
    con.close()
    return count > 0