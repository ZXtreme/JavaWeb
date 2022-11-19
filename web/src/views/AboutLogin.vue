<template>
  <div class="super">
    <div class="container">
      <div class="form-box" ref="formBox">
        <div class="register-box hidden" ref="registerBox">
          <h1>register</h1>
          <input type="text" placeholder="用户名">
          <input type="email" placeholder="邮箱">
          <input type="password" placeholder="密码">
          <input type="password" placeholder="确认密码">
          <button @click="register">注册</button>
        </div>
        <div class="login-box" ref="loginBox">
          <h1>login</h1>
          <input type="text" placeholder="账号">
          <input type="password" placeholder="密码">
          <button @click="login">登录</button>
        </div>
      </div>
      <div class="con-box left">
        <h2>欢迎来到购物之家</h2>
        <p>hello</p>
        <img src="../assets/login.png" alt="">
        <p>已有账号</p>
        <button id="login" @click="tologin">去登录</button>
      </div>
      <div class="con-box right">
        <h2>欢迎来到购物之家</h2>
        <p>hello</p>
        <img src="../assets/login.png" alt="">
        <p>没有账号?</p>
        <button id="register" @click="toregister">去注册</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  methods: {
    ...mapMutations(['setinfo']),
    tologin() {
      this.$refs.formBox.style.transform = 'translateX(0%)'
      this.$refs.registerBox.classList.add('hidden')
      this.$refs.loginBox.classList.remove('hidden')
    },
    toregister() {
      this.$refs.formBox.style.transform = 'translateX(80%)'
      this.$refs.loginBox.classList.add('hidden')
      this.$refs.registerBox.classList.remove('hidden')
    },
    async login() {
      // 收集填写的表单信息
      const child = this.$refs.loginBox.children
      const id = child[1].value
      const password = child[2].value

      // 发送post请求
      const { data } = await this.$http({
        method: 'POST',
        url: '/login',
        headers: {
          Authorization: localStorage.getItem('token')
        },
        data: {
          username: id, password
        }
      })

      // 展示后端的处理结果
      const { status, msg, token, result } = data
      alert(msg)
      if (status === 200) {
        // 本地存储登录成功的token以及账号信息
        localStorage.setItem('token', token)
        localStorage.setItem('id', result.id)
        this.setinfo(result)

        // 判断是否为管理员账号, 管理员则跳转至后台主界面, 普通用户则跳转至购物主界面
        if (result.id === 10000) this.$router.replace('/management')
        else this.$router.replace('/')
      }
    },
    async register() {
      // 收集填写的表单信息
      const child = this.$refs.registerBox.children
      const username = child[1].value
      const email = child[2].value
      const password = child[3].value
      const again = child[4].value

      // 进行简单信息校验
      if (password !== again) {
        alert('两次输入的密码不一致')
        return
      }
      if (username.length <= 3 || username.length >= 12) {
        alert('用户名的长度应为3-12位')
        return
      }
      if (email.indexOf('@') === -1) {
        alert('输入的邮箱非法')
        return
      }
      if (password.length < 6 || password.length > 16) {
        alert('密码的长度应为6-16位')
        return
      }

      // 发送post请求
      const { data } = await this.$http({
        method: 'POST',
        url: '/register',
        headers: {
          Authorization: localStorage.getItem('token')
        },
        data: {
          username, email, password
        }
      })

      // 展示后端的处理结果
      if (data.status === 200) {
        alert('注册成功,您的账号为' + data.account)
        for (let i = 1; i <= 4; i++) {
          child[i].value = ''
        }
      } else {
        alert(data.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.super {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(200deg, #f3e7e9, #e3eeff);
}

.container {
  background-color: #fff;
  width: 650px;
  height: 415px;
  border-radius: 5px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
  position: relative;
}

.form-box {
  position: absolute;
  top: -10%;
  left: 5%;
  background-color: #d3b7d8;
  width: 320px;
  height: 500px;
  border-radius: 5px;
  box-sizing: 2px 0 10px rgba(0, 0, 0, .1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  transition: .5s ease-in-out;
}

.register-box,
.login-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.hidden {
  display: none;
  transition: .5s;
}

h1 {
  text-align: center;
  margin-bottom: 25px;
  text-transform: uppercase;
  color: #fff;
  letter-spacing: 5px;
}

input {
  background-color: transparent;
  width: 70%;
  color: #fff;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, .4);
  padding: 10px 0;
  text-indent: 10px;
  margin: 8px 0;
  font-size: 14px;
  letter-spacing: 2px;

  &::placeholder {
    color: #fff;
  }

  &:focus {
    color: #a262ad;
    outline: none;
    border-bottom: 1px solid #a262ad;
    transition: .5s;
  }
}

.form-box button {
  width: 70%;
  margin-top: 35px;
  background-color: #f6f6f6;
  outline: none;
  border-radius: 8px;
  padding: 13px;
  color: #a262ad;
  letter-spacing: 2px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #a262ad;
    color: #f6f6f6;
    transition: background-color 0.5 ease;
  }
}

.con-box {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.con-box.left {
  left: -2%;
}

.con-box.right {
  right: -2%;
}

.con-box {
  h2 {
    color: #8e9aaf;
    font-size: 25px;
    font-weight: bold;
    letter-spacing: 3px;
    text-align: center;
    margin-bottom: 4px;
  }

  p {
    font-size: 12px;
    letter-spacing: 2px;
    color: #8e9aaf;
    text-align: center;
  }

  span {
    color: #d3b7d8;
  }

  img {
    width: 150px;
    height: 150px;
    opacity: .9;
    margin: 40px 0;
  }

  button {
    margin-top: 3%;
    background-color: #fff;
    color: #a262ad;
    border: 1px solid #d3b7d8;
    padding: 6px 10px;
    border-radius: 5px;
    letter-spacing: 1px;
    outline: none;
    cursor: pointer;

    &:hover {
      background-color: #d3b7d8;
      color: #fff;
    }
  }

}
</style>
