# 編集ページ
from flask import render_template, Blueprint

bp = Blueprint("new_editor", __name__)

@bp.route("/new_editor", methods=["GET"])
def new_editor():
	return render_template("new_editor.html", load_three_js = True)
