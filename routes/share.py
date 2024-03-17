# 共有ページ
from flask import render_template, Blueprint

bp = Blueprint("share", __name__)

@bp.route("/share", methods=["GET"])
def share():
	return render_template("share.html", load_three_js = True)
