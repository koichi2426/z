# Z

> シンプルなSNSアプリケーション

## 概要 (Overview)

zは、Twitter（現 X）のようなシンプルなSNSアプリケーションです。

## UIプレビュー (Screenshot)

アプリケーションを起動すると、以下のようなホーム画面が表示されます。

<img width="3420" height="1970" alt="image" src="https://github.com/user-attachments/assets/1a3355bf-dfc4-48d6-922a-1af0b9bc06b5" />




## 起動方法 (Getting Started)

DockerとDocker Composeがインストールされていれば、以下の簡単なステップでアプリケーションを起動できます。

1.  **リポジトリをクローン**

    ```bash
    git clone https://github.com/koichi2426/z
    ```

2.  **プロジェクトディレクトリに移動**

    ```bash
    cd z
    ```

3.  **envファイルをルートディレクトリに配置**
4.  **データベースにマイグレーションファイルの内容を適用**
    ```bash
    docker-compose -f docker-compose.yml run --rm backend python -m alembic upgrade head
    ```

5.  **Dockerコンテナをビルドして起動**

    ```bash
    docker-compose up --build -d
    ```
    開発用なら以下
    ```bash
    docker-compose -f docker-compose.dev.yml up --build
    ```

      * `--build`: イメージを再ビルドします（初回起動時やDockerfile変更時に必要）。
      * `-d`: バックグラウンドでコンテナを起動します（デタッチモード）。

6.  **ブラウザでアクセス**
    起動後、ブラウザで以下のURLにアクセスしてください。
    [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)

7.  **コンテナの停止**
    アプリケーションを停止する場合は、以下のコマンドを実行します。

    ```bash
    docker-compose down
    ```


## データベースのマイグレーション手順 (Alembic)

`infrastructure/database/models.py`のテーブル定義を変更した際に、その変更をデータベースに反映させるための手順です。

1.  **マイグレーションファイルを作成**

    `models.py`の変更内容と現在のデータベースの状態を比較し、差分を適用するためのスクリプトを自動生成します。
    ```bash
    docker-compose -f docker-compose.dev.yml run --rm backend python -m alembic revision --autogenerate -m "変更内容のコメント"
    ```

2.  **データベースに変更を適用**

    ```bash
    docker-compose -f docker-compose.dev.yml run --rm backend python -m alembic upgrade head
    ```


## データベースの確認方法

データベースに正しくテーブルが作成され、データが保存されているかを確認する手順です。

1.  **MySQLコンテナに入る**

    ```bash
    docker-compose -f docker-compose.dev.yml exec db /bin/sh
    ```

2.  **MySQLにログインする**

    ```bash
    mysql -u root -p
    ```

3.  **使用するデータベースを選択する**

    ```bash
    USE method_selector_db;
    ```

4.  **テーブル一覧を表示する**
    ```bash
    SHOW TABLES;
    ```

5.  *テーブルの中身を確認する**
    （例として`datasets`テーブルを表示します。他のテーブル名に変えても使えます）
    ```bash
    SELECT * FROM datasets;
    ```


## アーキテクチャ
<img width="16212" height="13444" alt="image" src="https://github.com/user-attachments/assets/d28fd8bd-e4e9-4c13-b9b7-e62e6df55ea0" />

