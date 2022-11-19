const express = require('express')
const router = express.Router()
const db = require('../utils/mysql.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const secretKey = '^_^'

// 登录
router.post('/login', (req, res) => {
  const username = req.body.username
  const password = req.body.password

  // 根据账号查询数据库表, 获取账号所有信息用于校验和返回信息
  const sqlStr = 'select * from account where id = ?'
  db.query(sqlStr, username, (err, result) => {

    // 错误处理, 数据库查询错误
    if (err) {
      res.send({
        status: 500,
        msg: err.message
      })

      // 错误处理, 账号不存在
    } else if (result.length === 0) {
      res.send({
        status: 201,
        msg: '账号不存在!'
      })

      // 成功查询数据库并获取信息
    } else {
      // 按同一个密钥对密码加密, 比较密文是否相同
      const isSame = bcrypt.compareSync(password, result[0].password)
      if (isSame) {

        // 校验成功, 生成token, 返回相关信息
        const userinfo = { ...result[0], password: '' }
        const tokenStr = jwt.sign(userinfo, secretKey, { expiresIn: '12h' })
        res.send({
          status: 200,
          msg: '登录成功！',
          token: 'Bearer ' + tokenStr,
          result: userinfo
        })
      } else {
        res.send({
          status: 201,
          msg: '密码错误!'
        })
      }
    }
  })
})

// 注册
router.post('/register', (req, res) => {
  const username = req.body.username
  const email = req.body.email
  let password = req.body.password
  // 密码加密存储
  password = bcrypt.hashSync(password, 10)

  // 找到数据库中的最大账号
  db.query('select max(id) from account', (err, result) => {
    if (err) {
      res.send({
        status: 500,
        msg: err.message
      })
      return
    }
    result = JSON.parse(JSON.stringify(result))
    let newAccount

    // 生成新账号并保证与之前所有账号不一致
    if (result[0]['max(id)'] === null) newAccount = 10000
    else newAccount = result[0]['max(id)'] + 1

    // 往数据库中新增账号信息
    db.query("insert into account values(?,?,?,?)", [newAccount, username, password, email], (err, result) => {
      if (err) {
        res.send({
          status: 500,
          msg: err.message
        })
      } else {
        res.send({
          status: 200,
          msg: '注册成功！',
          account: newAccount
        })
      }
    })
  })
})

module.exports = router
