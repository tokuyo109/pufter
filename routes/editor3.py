# 編集ページ
from flask import render_template, Blueprint

bp = Blueprint("editor3", __name__)

@bp.route("/editor3", methods=["GET"])
def editor3():
	return render_template("editor3.html", load_three_js = True)
