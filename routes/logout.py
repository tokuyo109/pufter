# ログアウトページ
from flask import Blueprint, redirect, make_response, url_for

bp = Blueprint("logout", __name__)

@bp.route("/logout", methods=["GET"])
def logout():
    # クッキーを削除する
    response = make_response("""
    <script>
        alert('ログアウトしました');
        window.location.href = '/login';
    </script>
    """)
    response.set_cookie("key", expires=0)  # クッキーを削除
    return response