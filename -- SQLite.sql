
-- SQLite
-- CREATE TABLE projects (id INTEGER PRIMARY KEY, user_id INTERGER NOT NULL, json_url TEXT, visibility TEXT NOT NULL DEFAULT 'private');
-- INSERT INTO projects(user_id,json_url) VALUES(2,"www.example.com");

-- SELECT * FROM projects;

-- カラム名をjson_path に変更

-- バックアップの作成
-- CREATE TABLE projects_backup AS SELECT * FROM projects;

-- 元のテーブルを削除して新しくテーブルを作り直す
-- DROP TABLE projects;

-- CREATE TABLE projects ( 
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     user_id INTEGER NOT NULL,
--     json_path TEXT NOT NULL,
--     visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'public')),
--     FOREIGN KEY (user_id) REFERENCES user(id)
-- )

-- バックアップからデータを戻す
-- INSERT INTO projects (id,user_id,json_path,visibility) SELECT id,user_id,json_url,visibility FROM projects_backup;


-- INSERT INTO projects (user_id,json_path) VALUES(1,'~path~');
-- INSERT INTO projects (user_id,json_path,visibility) VALUES(1,'~path~','public');

-- -- バックアップテーブルを削除する
-- DROP TABLE projects_backup;

-- -- テーブル一覧を表示
-- SELECT name FROM sqlite_master WHERE type='table';

--  CHECK制約テスト 
-- INSERT INTO projects(user_id,json_path,visibility) VALUES(1,'~path~','none')
-- 外部キー参照テスト
-- INSERT INTO projects(user_id,json_path) VALUES(100,'~path~')

-- SELECT * FROM projects;

-- projectテーブルに"title"を追加する
-- SELECT * FROM projects;
-- ALTER TABLE projects
-- ADD COLUMN title TEXT NOT NULL DEFAULT 'newProject';
-- SELECT * FROM projects;

SELECT * FROM projects;
ALTER TABLE projects
ADD COLUMN thumb_path TEXT NOT NULL DEFAULT 'noImage';
SELECT * FROM projects;