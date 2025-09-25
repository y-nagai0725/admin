<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const problems = ref([]);
const newProblemTitle = ref("");
// ★★★ 更新フォーム用の箱を２つ追加！ ★★★
const updateId = ref(""); // 更新したいIDを入れる箱
const updateTitle = ref(""); // 新しい問題文を入れる箱

async function fetchProblems() {
  const response = await axios.get("http://localhost:3000/problems");
  problems.value = response.data;
}

onMounted(fetchProblems);

async function addProblem() {
  if (newProblemTitle.value.trim() === "") return;
  const response = await axios.post("http://localhost:3000/problems", {
    title: newProblemTitle.value,
  });
  problems.value.push(response.data);
  newProblemTitle.value = "";
}

async function deleteProblem(id) {
  await axios.delete(`http://localhost:3000/problems/${id}`);
  problems.value = problems.value.filter((p) => p.id !== id);
}

// ★★★ 問題を更新するための魔法を追加！ ★★★
async function updateProblem() {
  if (updateId.value === "" || updateTitle.value.trim() === "") return;

  const id = parseInt(updateId.value);
  const response = await axios.put(`http://localhost:3000/problems/${id}`, {
    title: updateTitle.value,
  });

  // 画面のリストの中から、更新した問題を見つけ出す
  const index = problems.value.findIndex((p) => p.id === id);
  if (index !== -1) {
    // 見つけたら、画面のリストも新しい情報に書き換える
    problems.value[index] = response.data;
  }

  // 入力欄を空っぽに戻す
  updateId.value = "";
  updateTitle.value = "";
}
</script>

<template>
  <header>
    <h1>ちかとお兄ちゃんの秘密のタイピングアプリ♡</h1>
  </header>

  <main>
    <div class="add-form">
      <input
        type="text"
        v-model="newProblemTitle"
        placeholder="新しい問題文を入力してね♡"
        @keyup.enter="addProblem"
      />
      <button @click="addProblem">追加する♡</button>
    </div>

    <div class="update-form">
      <input type="number" v-model="updateId" placeholder="書き換えるID" />
      <input
        type="text"
        v-model="updateTitle"
        placeholder="新しい問題文"
        @keyup.enter="updateProblem"
      />
      <button @click="updateProblem">更新する</button>
    </div>

    <h2>もんだいリスト</h2>
    <ul>
      <li v-for="problem in problems" :key="problem.id">
        <span>ID:{{ problem.id }} ==> {{ problem.title }}</span>
        <button class="delete-btn" @click="deleteProblem(problem.id)">
          削除
        </button>
      </li>
    </ul>
  </main>
</template>

<style scoped>
/* (省略) ... li, .delete-btn, header, ul のスタイルは一緒だよ ... */
.add-form,
.update-form {
  /* ★★★ update-formにもスタイルを適用 ★★★ */
  margin-bottom: 1em;
  display: flex;
  gap: 8px;
}
.add-form input,
.update-form input {
  /* ★★★ update-formにもスタイルを適用 ★★★ */
  padding: 8px;
}
.update-form input[type="number"] {
  width: 100px;
}
.update-form input[type="text"] {
  flex-grow: 1;
}
.add-form input {
  flex-grow: 1;
}
.add-form button,
.update-form button {
  /* ★★★ update-formにもスタイルを適用 ★★★ */
  padding: 8px 16px;
}
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f0f0f0;
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 4px;
  color: #000;
}
.delete-btn {
  background-color: #ffaaaa;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}
header {
  line-height: 1.5;
}
ul {
  list-style: none;
  padding: 0;
}
</style>