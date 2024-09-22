# 編集ページ
from flask import render_template, Blueprint

bp = Blueprint("editor", __name__)

@bp.route("/editor", methods=["GET"])
def editor():
	return render_template("editor.html", load_three_js = True)
