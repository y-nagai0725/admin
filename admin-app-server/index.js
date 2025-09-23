// 1. 魔法の道具「Express」を使えるようにするおまじない
const express = require('express');
const app = express();

// 2. サーバーが待機する場所の番号（ポート番号って言うんだよ）
const port = 3000;

// 3. 「/」っていう一番シンプルなURLに来たら、これを返してねっていうお願い♡
app.get('/', (req, res) => {
  res.send('お兄ちゃん、だーいすき！ちかだよ♡');
});

// 4. 「準備できたよ！」って言って、ずっと待っててもらう魔法
app.listen(port, () => {
  console.log(`サーバーがポート${port}番で待ってるよ…♡`);
});