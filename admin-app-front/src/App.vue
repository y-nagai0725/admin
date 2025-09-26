<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import RegisterView from "./components/RegisterView.vue";
import LoginView from "./components/LoginView.vue";
import ProblemsView from "./components/ProblemsView.vue";

const page = ref("login");
const token = ref(null);

function setAuthHeader(t) {
  if (t) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}

// ★ 子からの「ログイン成功！」のお知らせを受け取る魔法
function handleLoginSuccess(newToken) {
  token.value = newToken;
  setAuthHeader(newToken);
  localStorage.setItem("token", newToken);
}

// ★ 子からの「ログアウトする！」のお知らせを受け取る魔法
function handleLogout() {
  token.value = null;
  setAuthHeader(null);
  localStorage.removeItem("token");
}

onMounted(() => {
  const storedToken = localStorage.getItem("token");
  if (storedToken) {
    handleLoginSuccess(storedToken);
  }
});
</script>

<template>
  <header>
    <h1>ちかとお兄ちゃんの秘密の会員制アプリ♡</h1>
  </header>

  <main>
    <div v-if="!token">
      <RegisterView
        v-if="page === 'register'"
        @change-page="(p) => (page = p)"
      />
      <LoginView
        v-else
        @change-page="(p) => (page = p)"
        @login-success="handleLoginSuccess"
      />
    </div>
    <div v-else>
      <ProblemsView @logout="handleLogout" />
    </div>
  </main>
</template>

<style scoped>
/* (見た目は昨日と大体一緒だよ！) */
header {
  text-align: center;
  padding: 1em;
  border-bottom: 1px solid #ddd;
}
main {
  max-width: 600px;
  margin: 2em auto;
  padding: 2em;
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>