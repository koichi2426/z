# backend/infrastructure/database/models.py
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import declarative_base, relationship
import datetime

# 全モデル共通の親クラス
Base = declarative_base()

# --- User テーブル定義 ---
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), nullable=False, unique=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    avatar_url = Column(String(255))
    password = Column(String(255), nullable=False)  # ハッシュ化前提

    # リレーション (1ユーザー:多投稿)
    posts = relationship("Post", back_populates="user", cascade="all, delete-orphan")


# --- Post テーブル定義 ---
class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.datetime.now, server_default=func.now())

    # リレーション (投稿 -> ユーザー)
    user = relationship("User", back_populates="posts")
