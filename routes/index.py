# トップページ
from flask import render_template, Blueprint
import sqlite3

bp = Blueprint("index", __name__)

@bp.route("/", methods=["GET"])
def index():
	return render_template("index.html", load_three_js = True)
