# THREE.jsのテスト用ページ
from flask import render_template, Blueprint

bp = Blueprint("three-test", __name__)

@bp.route("/three_test", methods=["GET"])
def three_test():
	return render_template("three-test.html", load_three_js = True)
