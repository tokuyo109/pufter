# 編集ページのエンドポイント
from flask import render_template, Blueprint

bp = Blueprint("contents", __name__)

@bp.route("/contents", methods=["POST"])
def contents():
    

	return render_template("contents.html", editor=True)
