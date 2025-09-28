# ===== ビルダーフェーズ =====
# 依存関係のインストールとアプリケーションのビルドを行うステージ
FROM node:20-alpine AS builder

# 作業ディレクトリを設定
WORKDIR /app

# --- ▼▼▼ ここから修正 ▼▼▼ ---
# ビルド時に外部から変数を受け取るためのARG（引数）を定義します
ARG API_URL_INTERNAL
ARG NEXT_PUBLIC_API_URL

# 受け取ったARGを、このビルドステージ内で使えるENV（環境変数）として設定します
ENV API_URL_INTERNAL=$API_URL_INTERNAL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
# --- ▲▲▲ ここまで修正 ▲▲▲ ---

# 最初にpackage.json関連ファイルだけをコピーして依存関係をインストール
COPY package*.json ./
RUN npm ci

# アプリケーションのソースコードをコピー
COPY . .

# Next.jsアプリをビルドします (ここで上記のENVが使われます)
RUN npm run build

# ===== ランナーフェーズ =====
# ビルドしたアプリを実際に実行するステージ
FROM node:20-alpine AS runner

WORKDIR /app

# ビルダーフェーズから、最適化された実行ファイルのみをコピー
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# アプリケーションが3000番ポートで待ち受けることをDockerに伝える
EXPOSE 3000

# コンテナ起動時に実行されるコマンド
CMD ["node", "server.js"]