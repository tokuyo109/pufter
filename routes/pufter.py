# 編集ページのエンドポイント
from flask import render_template, Blueprint

bp = Blueprint("pufter", __name__)

@bp.route("/pufter", methods=["GET"])
def pufter():
	return render_template("pufter.html", editor=True)
