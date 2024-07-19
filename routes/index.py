# トップページ
from flask import redirect, Blueprint, render_template, request, url_for, make_response
import json
import sqlite3
bp = Blueprint("index", __name__)

@bp.route("/", methods=["GET"])
def index():
	# クッキーからデータを取得
	cookie_data = request.cookies.get("key")
	print("cookie_data:", cookie_data)

	# クッキーが存在しない場合、emailを空に設定
	if cookie_data is None:
		email = ""
		result = ""
	else:
		email = json.loads(cookie_data).get("email")
		con = sqlite3.connect('test.db')
		c = con.cursor()
		c.execute("SELECT id, icon_path FROM users WHERE email = ? ORDER BY username", (email,))
		login_user = c.fetchone()
		print(login_user)
		result = {"icon_path": login_user[1]}
        
	return render_template("index.html", result=result, load_three_js = True)
