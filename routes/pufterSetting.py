from flask import render_template, Blueprint, request, redirect, url_for, flash
import sqlite3
import json

bp = Blueprint("pufterSetting", __name__)

@bp.route("/pufterSetting/<int:id>")
def pufterSetting(id):
    # クッキーからデータを取得
    cookie_data = request.cookies.get("key")
    if cookie_data is not None:
        cookie_data = json.loads(cookie_data)
    else:
        return """
		<script>
		    alert('権限がありません。');
		    window.location.href = '/login'; // リダイレクト
		</script>
		"""
    
    # クッキーから取得したメールアドレスを使用して、ユーザー名を取得
    email = cookie_data.get('email', None)
    
    
    con = sqlite3.connect('test.db')
    c = con.cursor()
    c.execute("SELECT u.id FROM users u JOIN projects p ON p.user_id = u.id WHERE u.email=? AND p.id=?", (email,id,))
    pufterpufter = c.fetchone()
    con.commit()
    con.close()
    print("aaaaaaa",pufterpufter)

    if not pufterpufter:
        return """
		<script>
		    alert('権限がありません。');
		    window.location.href = '/login'; // リダイレクト
		</script>
		"""

    # SQLiteデータベースへの接続
    con = sqlite3.connect('test.db')
    c = con.cursor()


    try:
        # ユーザーのidを取得するクエリ
        c.execute("SELECT id FROM users WHERE email=?", (email,))
        user = c.fetchone()
        if user is None:
            flash('ユーザーが見つかりません', 'error')
            return redirect('/pufter')  # エラーページにリダイレクト
        user_id = user[0]  # ユーザーのidを取得

        # projectsテーブルとuserテーブルを結合してvisibilityを取得するクエリ
        c.execute("SELECT p.visibility FROM projects p JOIN users u ON p.user_id = u.id WHERE u.email=?", (email,))
        project = c.fetchone()
        if project is None:
            flash('プロジェクトが見つかりません', 'error')
            return redirect('/pufter')  # エラーページにリダイレクト
        visibility = project[0]  # 公開設定を取得
    except Exception as e:
        flash(f'データベースエラーが発生しました: {str(e)}', 'error')
        return redirect('/pufter')  # エラーページにリダイレクト
    finally:
        con.close()

    return render_template("pufterSetting.html", id=id, result={"visibility": visibility})
 