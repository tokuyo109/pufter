# Flaskのアプリケーションを管理するファイル

from flask import Flask
from importlib import import_module
from flask_mail import Mail, Message
from pathlib import Path

app = Flask(__name__)
app.secret_key = 'pufter'

# Flask-Mailの設定
app.config['MAIL_SERVER'] = ''  # GmailのSMTPサーバー
app.config['MAIL_PORT'] = ''  # GmailのTLSポート
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = ''  # Gmailのメールアドレス
app.config['MAIL_PASSWORD'] = ''  # Gmailのパスワード

mail = Mail(app)  # Flask-Mailの拡張機能をアプリケーションに追加


# FlaskアプリケーションにBlueprintを登録する関数
# 現在はサブディレクトリに対応していない
def register_blueprints(app, directory_path, package_name):
    for path in Path(directory_path).rglob('*py'):
        # __init__.pyファイルはBlueprintと関係が無い
        if path.name == '__init__.py':
            continue
        
        # 拡張子を取り除いたファイル名 例: index
        module_name = path.relative_to(directory_path).with_suffix('')

        # モジュールをインポートする
        # 例: routes.index routesディレクトリ内のindexモジュールをインポートする
        module = import_module(f'{package_name}.{module_name}')
        
        # Blueprintインスタンスが存在すれば、インポートする
        if hasattr(module, 'bp'):
            app.register_blueprint(module.bp)

register_blueprints(
    app            = app,
    directory_path = './routes',
    package_name   = 'routes'
)

# @app.errorhandler(ValueError)
# def handle_value_error(error):
#     response = jsonify({'error': str(error)})
#     response.status_code = 400  # 適切なステータスコードを設定
#     return response

# 404 Not Found.
@app.errorhandler(404)
def error404(error):
    return f"HTTPステータスcode: {str(error.code)}。指定されたページが見つかりませんでした。", 404

# 405 Not Found.
@app.errorhandler(405)
def error405(error):
    return f"HTTPステータスcode: {str(error.code)}。アクセス拒否されています。", 405

# データベースが動かないとき
@app.errorhandler(500)
def error500(error):
    return f"HTTPステータスcode: {str(error.code)}。内部サーバーエラー", 500


if __name__ == '__main__':
    app.run(host="localhost", port=5000, debug=True)
