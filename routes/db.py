# データベース
from flask import Blueprint, jsonify, request
import sqlite3
import os

# Blueprintの定義
database_bp = Blueprint('database_bp', __name__)

# データベースファイル名
DB_name = "test.db"

# db_file_path = os.path.join('/path/to/directory', 'example.db')


# SQLiteデータベースの初期化
def initialize_database():
    con = sqlite3.connect(DB_name)
    cur = con.cursor()
    cur.execute('''CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, mail TEXT, pas TEXT)''')
    con.commit()
    con.close()

@database_bp.route('/users', methods=['GET'])
def get_users():
    con = sqlite3.connect(DB_name)
    cur = con.cursor()
    cur.execute("SELECT * FROM users")
    users = cur.fetchall()
    con.close()
    return jsonify(users)

@database_bp.route('/users', methods=['POST'])
def add_user():
    new_user = request.get_json()
    con = sqlite3.connect(DB_name)
    cur = con.cursor()
    cur.execute("INSERT INTO users (name, email) VALUES (?, ?)", (new_user['name'], new_user['email']))
    con.commit()
    con.close()
    return jsonify({"message": "User added successfully"})

@database_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    updated_user = request.get_json()
    con = sqlite3.connect(DB_name)
    cur = con.cursor()
    cur.execute("UPDATE users SET name = ?, email = ? WHERE id = ?", (updated_user['name'], updated_user['email'], user_id))
    con.commit()
    con.close()
    return jsonify({"message": "User updated successfully"})

@database_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    con = sqlite3.connect(DB_name)
    cur = con.cursor()
    cur.execute("DELETE FROM users WHERE id = ?", (user_id,))
    con.commit()
    con.close()
    return jsonify({"message": "User deleted successfully"})
