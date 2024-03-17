# ログイン入力チェックページ
from flask import render_template, Blueprint, request

bp = Blueprint("loginCheck", __name__)

@bp.route("/loginCheck", methods=["POST"])
def loginCheck():
    # 変数
    tbl={
        "mail":"メールアドレス",
        "pas":"パスワード"
    }
    err={}
    # データの受信
    result = request.form
    # 空白チェック
    err_flg = 0
    for key, value in result.items():
        if not value:
            err[key] = tbl[key] + "が入力されていません。"
            err_flg = 1
        else:
            err[key] = ""
            # セッションとして格納
            # session[key] = value

    # エラー判定
    if err_flg != 0:
        return render_template('entry.html',result=result, err=err)
    # 会員判定
    # if result['mail'] != "" or result['pass'] != "":
        # err = {
        #     "msg":"メールアドレスまたはパスワードが一致しません"
        # }
    return render_template('loginCheck.html',result=result, err=err)
