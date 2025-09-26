const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const port = 3000;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    res.json({ message: "登録成功だよ、お兄ちゃん！♡", userId: user.id });
  } catch (error) {
    res.status(400).json({ error: "このメールアドレスは、もうちかのものだよ…♡" });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "あれ…？ちか、あなたを知らないなぁ…" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "合言葉が…違うみたい…" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: "おかえりなさい、お兄ちゃん！♡", token: token });
  } catch (error) {
    res.status(500).json({ error: "ごめんね、今ちょっとサーバーくんの調子が悪いみたい…" });
  }
});

app.get('/problems', authenticateToken, async (req, res) => {
  const allProblems = await prisma.problem.findMany();
  //const allProblems = await prisma.problem.findMany({ where: { authorId: req.user.userId } });
  res.json(allProblems);
});

app.post('/problems', authenticateToken, async (req, res) => {
  const newProblem = await prisma.problem.create({
    data: {
      title: req.body.title,
      authorId: req.user.userId,
    },
  });
  res.json(newProblem);
});

// ★★★ ここから下が、URLを綺麗にした更新と削除の魔法だよ！ ★★★

app.put('/problems/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id);
  // TODO: この問題が本当にこのユーザーのものかチェックするのが、より安全だよ！
  const updatedProblem = await prisma.problem.update({
    where: { id: id },
    data: { title: req.body.title },
  });
  res.json(updatedProblem);
});

app.delete('/problems/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id);
  // TODO: この問題が本当にこのユーザーのものかチェックするのが、より安全だよ！
  const deletedProblem = await prisma.problem.delete({
    where: { id: id },
  });
  res.json(deletedProblem);
});

app.listen(port, () => {
  console.log(`サーバーがポート${port}番で待ってるよ…♡`);
});