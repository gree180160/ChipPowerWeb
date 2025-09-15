<template>
  <div class="login-container">
    <div class="login-left">
      <h1 class="title">芯动力—电子元器件分析平台</h1>
      <form class="login-form">
        <input type="text" placeholder="请输入账号" class="input-field" />
        <input type="password" placeholder="请输入密码" class="input-field" />
        <button type="submit" class="login-button">登录</button>
      </form>
      <p class="copyright">2025 © 深圳市风菱电子有限公司</p>
    </div>
    <div class="login-right">
      <img src="https://example.com/satellite.jpg" alt="卫星" class="satellite-img" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
};
</script>

<style scoped>
.login-container {
  display: flex;
  height: 100vh;
}

.login-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.title {
  font-size: 24px;
  margin-bottom: 30px;
}

.login-form {
  display: flex;
  flex-direction: column;
  width: 280px;
}

.input-field {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-button {
  padding: 10px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.copyright {
  margin-top: 50px;
  font-size: 14px;
}

.login-right {
  flex: 1;
  background-color: green;
  display: flex;
  justify-content: center;
  align-items: center;
}

.satellite-img {
  max-width: 80%;
  max-height: 80%;
}
</style>