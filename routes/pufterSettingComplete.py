from flask import render_template, Blueprint, request, make_response, redirect, url_for, flash
import sqlite3
import json

bp = Blueprint("pufterSettingComplete", __name__)

@bp.route("/pufterSettingComplete/<int:id>", methods=["POST"])
def pufterSettingComplete(id):
    # フォームデータを取得
    visibility = request.form.get('visibility')

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
        # 公開設定を更新するクエリを実行
        c.execute("UPDATE projects SET visibility=? WHERE id=?", (visibility, id))
        con.commit()
    except Exception as e:
        flash(f'データベースエラーが発生しました: {str(e)}', 'error')
        return redirect('/pufter')  # エラーページにリダイレクト
    finally:
        con.close()
        
    # con = sqlite3.connect('test.db')
    # c = con.cursor()
    
    # c.execute("SELECT visibility FROM projects WHERE id=?", (id, ))
    # aaa = c.fetchone()
    # con.commit()
    # con.close()
    # print("aaaaaaa",aaa)
    

    # 設定ページにリダイレクト
    return """
		<script>
		    alert('保存されました。');
		    window.location.href = '/mypage'; // リダイレクト
		</script>
		"""
