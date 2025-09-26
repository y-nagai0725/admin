<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const problems = ref([]);
const newProblemTitle = ref("");
const editingProblemId = ref(null);
const editingTitle = ref("");
const emit = defineEmits(["logout"]);

async function fetchProblems() {
  try {
    const response = await axios.get("http://localhost:3000/problems");
    problems.value = response.data;
  } catch (error) {
    console.error("問題リストの取得に失敗しちゃった…", error);
    emit("logout");
  }
}

async function addProblem() {
  if (newProblemTitle.value.trim() === "") return;
  try {
    const response = await axios.post("http://localhost:3000/problems", {
      title: newProblemTitle.value,
    });
    problems.value.push(response.data);
    newProblemTitle.value = "";
  } catch (error) {
    console.error("問題の追加に失敗しちゃった…", error);
  }
}

async function deleteProblem(id) {
  try {
    await axios.delete(`http://localhost:3000/problems/${id}`);
    problems.value = problems.value.filter((p) => p.id !== id);
  } catch (error) {
    console.error("問題の削除に失敗しちゃった…", error);
  }
}

function startEditing(problem) {
  editingProblemId.value = problem.id;
  editingTitle.value = problem.title;
}

function cancelEditing() {
  editingProblemId.value = null;
  editingTitle.value = "";
}

async function saveUpdate(problemId) {
  try {
    const response = await axios.put(
      `http://localhost:3000/problems/${problemId}`,
      {
        title: editingTitle.value,
      }
    );
    const index = problems.value.findIndex((p) => p.id === problemId);
    if (index !== -1) {
      problems.value[index] = response.data;
    }
    cancelEditing();
  } catch (error) {
    console.error("問題の更新に失敗しちゃった…", error);
  }
}

onMounted(fetchProblems);
</script>

<template>
  <div>
    <header class="problems-header">
      <h2>もんだいリスト</h2>
      <button @click="emit('logout')" class="logout-btn">ログアウト</button>
    </header>

    <div class="add-form">
      <input
        v-model="newProblemTitle"
        @keyup.enter="addProblem"
        placeholder="新しい問題を入力してね♡"
      />
      <button @click="addProblem">追加</button>
    </div>

    <p v-if="problems.length === 0" class="no-problems">
      まだ問題はないみたい…！最初の問題を追加してね♡
    </p>
    <ul v-else>
      <li v-for="problem in problems" :key="problem.id">
        <div v-if="editingProblemId !== problem.id">
          <span>{{ problem.title }}</span>
          <div>
            <button class="edit-btn" @click="startEditing(problem)">
              編集
            </button>
            <button class="delete-btn" @click="deleteProblem(problem.id)">
              削除
            </button>
          </div>
        </div>
        <div v-else class="edit-form">
          <input v-model="editingTitle" @keyup.enter="saveUpdate(problem.id)" />
          <div>
            <button class="save-btn" @click="saveUpdate(problem.id)">
              保存
            </button>
            <button class="cancel-btn" @click="cancelEditing">中止</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.problems-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

input {
  width: 100%;
  padding-top: 8px;
  padding-right: 8px;
  padding-bottom: 8px;
  padding-left: 8px;
  box-sizing: border-box;
  border-width: 1px;
  border-style: solid;
  border-color: #ccc;
  border-radius: 4px;
}

button {
  padding-top: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  color: white;
  border-style: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #ff87ab;
}

p.no-problems {
  text-align: center;
  color: #888;
  margin-top: 2em;
  margin-right: 0;
  margin-bottom: 2em;
  margin-left: 0;
}

.add-form {
  margin-top: 1.5em;
  margin-right: 0;
  margin-bottom: 1.5em;
  margin-left: 0;
  display: flex;
  gap: 8px;
}

.add-form input {
  flex-grow: 1;
}

.add-form button {
  width: auto;
  flex-shrink: 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #f9f9f9;
  margin-bottom: 8px;
  padding-top: 8px;
  padding-right: 12px;
  padding-bottom: 8px;
  padding-left: 12px;
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  border-color: #eee;
}

li > div {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

li span {
  flex-grow: 1;
}

.edit-form input {
  flex-grow: 1;
}

.logout-btn {
  width: auto;
  background-color: #aaa;
}

.edit-btn,
.save-btn,
.cancel-btn,
.delete-btn {
  width: auto;
  padding-top: 4px;
  padding-right: 12px;
  padding-bottom: 4px;
  padding-left: 12px;
  flex-shrink: 0;
}

.edit-btn {
  background-color: #87ceeb;
}

.save-btn {
  background-color: #98fb98;
}

.cancel-btn {
  background-color: #d3d3d3;
}

.delete-btn {
  background-color: #ffaaaa;
}
</style>