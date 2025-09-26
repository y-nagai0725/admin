<script setup>
import { ref } from 'vue'
import axios from 'axios'

const userForm = ref({ email: '', password: '' })
const emit = defineEmits(['change-page']) // ★ 親に「ページ切り替えて！」って伝えるための呪文

async function register() {
  try {
    const response = await axios.post('http://localhost:3000/register', userForm.value);
    alert(response.data.message);
    emit('change-page', 'login'); // ★ 成功したら、親に「ログインページに切り替えて！」って伝える
  } catch (error) {
    alert(error.response.data.error);
  }
}
</script>

<template>
  <div>
    <h2>ユーザー登録</h2>
    <div class="form-group">
      <input type="email" placeholder="メールアドレス" v-model="userForm.email" />
    </div>
    <div class="form-group">
      <input type="password" placeholder="パスワード" v-model="userForm.password" />
    </div>
    <button @click="register">登録する</button>
    <p>
      もうアカウントを持ってるお兄ちゃんは
      <a href="#" @click.prevent="emit('change-page', 'login')">こちらでログイン♡</a>
    </p>
  </div>
</template>

<style scoped>
/* (見た目の部分はApp.vueから持ってきたよ！) */
.form-group{margin-bottom:1em}input{width:100%;padding:8px;box-sizing:border-box}button{width:100%;padding:10px;background-color:#ff87ab;color:#fff;border:none;border-radius:4px;cursor:pointer}p{text-align:center;margin-top:1em}a{color:#ff87ab}
</style>