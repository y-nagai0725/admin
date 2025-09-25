const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const prisma = new PrismaClient();
const port = 3000;

// 【Read機能】ぜんぶの問題を読み出す専用のお部屋♡
app.get('/problems', async (req, res) => {
  const allProblems = await prisma.problem.findMany();
  res.json(allProblems);
});

// 【Read機能】1つだけの問題をIDで指定して読み出すお部屋♡
app.get('/problems/:id', async (req, res) => {
  // URLで指定されたID番号を受け取るよ
  const id = parseInt(req.params.id);
  // そのIDの問題を1つだけ探すよ
  const problem = await prisma.problem.findUnique({
    where: { id: id },
  });
  res.json(problem);
});

// 【Create機能】新しい問題を作る専用のお部屋♡
app.post('/problems', async (req, res) => {
  const newProblem = await prisma.problem.create({
    data: {
      // 送られてきたデータの中から、titleを取り出して使うよ
      title: req.body.title,
    },
  });
  res.json(newProblem);
});

// 【Update機能】問題を書き換える専用のお部屋♡
app.put('/problems/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const updatedProblem = await prisma.problem.update({
    where: { id: id },
    // ★★★ フロントから送られてきたtitleで書き換えるように変更！ ★★★
    data: { title: req.body.title },
  });
  res.json(updatedProblem);
});

// 【Delete機能】問題を消しちゃう専用のお部屋♡
app.delete('/problems/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const deletedProblem = await prisma.problem.delete({
    where: { id: id },
  });
  res.json(deletedProblem);
});

app.listen(port, () => {
  console.log(`サーバーがポート${port}番で待ってるよ…♡`);
});