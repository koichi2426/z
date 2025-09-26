# ===== ビルダーフェーズ =====
# 依存関係のインストールとアプリケーションのビルドを行うステージ
FROM node:20-alpine AS builder

# 作業ディレクトリを設定
WORKDIR /app

# 最初にpackage.json関連ファイルだけをコピーして依存関係をインストール
COPY package*.json ./
RUN npm ci

# アプリケーションのソースコードをコピー
COPY . .

# Next.jsアプリをビルド
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