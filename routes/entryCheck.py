# 新規会員登録入力チェックページ
from flask import render_template, Blueprint, request

bp = Blueprint("entryCheck", __name__)

@bp.route("/entryCheck", methods=["POST"])
def entryCheck():

    # 変数
    tbl={
        "mail":"メールアドレス",
        "pas":"パスワード",
        "check":"再入力のパスワード"
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
        return render_template('entry.html', result=result, err=err)
    # 入力されたパスワードが一致するか
    if result['pas'] != result['check'] :
        err = {
            "msg":"入力されたパスワードが一致しません。"
        }
        return render_template('entry.html', result=result, err=err)

    return render_template('entryCheck.html', err=err)
