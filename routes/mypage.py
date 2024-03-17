# マイページ
from flask import render_template, Blueprint

bp = Blueprint("mypage", __name__)

@bp.route("/mypage", methods=["GET"])
def mypage():

	return render_template("mypage.html")
