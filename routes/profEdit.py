# プロフィール編集ページ
from flask import render_template, Blueprint

bp = Blueprint("profEdit", __name__)

@bp.route("/profEdit", methods=["GET"])
def profEdit():
	return render_template("profEdit.html")
