# 共有ページ
from flask import render_template, Blueprint, request, jsonify, make_response, redirect
import sqlite3
import datetime
import json

bp = Blueprint("share", __name__)

@bp.route("/share", methods=["GET"])
def share():
	# クッキーからログインしているユーザーのメールアドレスを取得
	cookie_data = request.cookies.get("key")	
	if cookie_data is not None:
		cookie_data = json.loads(cookie_data)
		email = cookie_data.get('email')
	else:
		return """
		<script>
		    alert('セッションが切れています。ログインし直してください');
		    window.location.href = '/login'; // リダイレクト
		</script>
		"""
	# SQLiteデータベースへの接続
	con = sqlite3.connect('test.db')
	c = con.cursor()

    # クエリを実行して結果を取得
	c.execute("SELECT username, introduction FROM users WHERE email=?", (email,))
	rows = c.fetchall()

	# もし結果が空であればユーザ登録を行う
	if not rows or all(row[0] is None for row in rows):
		con.commit()
		con.close()
		# アラートを表示するJavaScriptを生成して返す
		return """
		<script>
		    alert('ユーザ名を設定してください。');
		    window.location.href = '/profEdit'; // リダイレクト
		</script>
		"""
		
	return render_template("share.html")
