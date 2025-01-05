"use strict";
const express = require("express");
const app = express();

let bbs = []; // 本来はDBMSを使用するが，今回はこの変数にデータを蓄える
const MAX_POSTS = 25; // 表示件数の最大値

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// BBS 関連のルート
app.post("/check", (req, res) => {
  console.log(`[CHECK] BBS posts count: ${bbs.length}`);
  res.json({ number: bbs.length });
});

app.post("/read", (req, res) => {
  let limit = parseInt(req.body.limit) || MAX_POSTS;
  limit = Math.min(limit, bbs.length);
  const start = Math.max(0, bbs.length - limit);
  const result = bbs.slice(start);
  console.log(`[READ] Sending ${result.length} posts to client`);
  res.json({ messages: result });
});

let postCounter = 1;

app.post("/post", (req, res) => {
  const name = req.body.name;
  const message = req.body.message;
  const timestamp = new Date().toISOString();

  const newPost = {
    id: postCounter++,
    name: name,
    message: message,
    timestamp: timestamp,
  };

  bbs.push(newPost);
  console.log(`[POST] New post added:`, newPost);

  // 投稿がMAX_POSTSを超えた場合、古い投稿を削除
  if (bbs.length > MAX_POSTS) {
    console.log(`[POST] Max posts reached. Removing oldest post.`);
    bbs.splice(0, 1);
  }

  res.json({
    number: bbs.length,
    post: newPost,
  });
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));