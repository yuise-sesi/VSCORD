import streamlit as st
import pandas as pd
from datetime import datetime

# アプリのタイトル
st.set_page_config(page_title="暇つぶしマッチング", layout="centered")
st.title("🤝 趣味の仲間探し・マッチング")

# 簡易的なデータ保存（本来はデータベースを使いますが、今回はセッション内で保持）
if 'posts' not in st.session_state:
    st.session_state.posts = []

# --- 募集投稿フォーム ---
with st.expander("📢 新しく仲間を募集する"):
    with st.form("post_form", clear_on_submit=True):
        name = st.text_input("名前（ニックネーム）")
        hobby = st.selectbox("趣味・ジャンル", ["ゲーム", "カフェ巡り", "スポーツ", "勉強", "その他"])
        message = st.text_area("一言メッセージ（例：今からApexできる人！）")
        
        submitted = st.form_submit_button("投稿する")
        if submitted:
            if name and message:
                new_post = {
                    "id": len(st.session_state.posts) + 1,
                    "name": name,
                    "hobby": hobby,
                    "message": message,
                    "time": datetime.now().strftime("%H:%M"),
                    "count": 0
                }
                st.session_state.posts.insert(0, new_post) # 新しい順に表示
                st.success("投稿されました！")
            else:
                st.error("名前とメッセージを入力してください。")

# --- 募集一覧表示 ---
st.subheader("👀 今募集中の暇な人")

if not st.session_state.posts:
    st.write("現在募集はありません。最初の投稿をしてみましょう！")
else:
    for i, post in enumerate(st.session_state.posts):
        with st.container():
            col1, col2 = st.columns([4, 1])
            with col1:
                st.markdown(f"### {post['hobby']}：{post['name']}")
                st.write(f"「{post['message']}」")
                st.caption(f"投稿時間: {post['time']}")
            with col2:
                # 参加ボタン
                if st.button(f"参加！", key=f"btn_{i}"):
                    st.balloons()
                    st.session_state.posts[i]['count'] += 1
                    st.success(f"{post['name']}さんに通知を送りました！")
            
            st.markdown(f"参加予定数: **{post['count']}** 名")
            st.divider()