<script setup>
import { ref } from 'vue'
import axios from 'axios'

const userForm = ref({ email: '', password: '' })
const emit = defineEmits(['change-page', 'login-success']) // ★ 親に伝える言葉の種類を増やすよ

async function login() {
  try {
    const response = await axios.post('http://localhost:3000/login', userForm.value);
    alert(response.data.message);
    // ★ 成功したら、親に「ログイン成功したよ！これがトークン！」って伝える
    emit('login-success', response.data.token);
  } catch (error) {
    alert(error.response.data.error);
  }
}
</script>

<template>
  <div>
    <h2>ログイン</h2>
    <div class="form-group">
      <input type="email" placeholder="メールアドレス" v-model="userForm.email" />
    </div>
    <div class="form-group">
      <input type="password" placeholder="パスワード" v-model="userForm.password" />
    </div>
    <button @click="login">ログインする</button>
    <p>
      まだ登録してないお兄ちゃんは
      <a href="#" @click.prevent="emit('change-page', 'register')">こちらでユーザー登録♡</a>
    </p>
  </div>
</template>

<style scoped>
/* (見た目の部分はRegisterViewと大体一緒だよ！) */
.form-group{margin-bottom:1em}input{width:100%;padding:8px;box-sizing:border-box}button{width:100%;padding:10px;background-color:#ff87ab;color:#fff;border:none;border-radius:4px;cursor:pointer}p{text-align:center;margin-top:1em}a{color:#ff87ab}
</style>