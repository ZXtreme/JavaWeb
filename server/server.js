const express = require('express');
const path = require('path');
const cors = require('cors')
const app = express();
app.use(cors());
app.use('/goods', express.static(path.join(__dirname, './goods_images')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const bcrypt = require('bcryptjs')
const secretKey = '^_^'
const { expressjwt } = require('express-jwt')
const jwtAuth = expressjwt({ secret: secretKey, algorithms: ['HS256'] })
const fs = require('fs')

const multer = require('multer')
//磁盘存储引擎
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, __dirname + '/goods_images')//存储路径
  },
  filename: function(req, file, cb) {
    file.originalname = req.body.goodsname + '.png'
    cb(null, file.originalname)//文件命名
  }
})
const upload = multer({ storage: storage })
//没有文件传输时使用upload.none()，file为上传时文件的属性名

// 导入登录和注册的路由
const loginRegister = require('./router/login-register.js')
app.use(loginRegister)

const db = require('./utils/mysql.js')
app.post('/insert', [jwtAuth, upload.single('file')], (req, res) => {
  // 验证管理员权限
  if (req.auth.id !== 10000) return res.send({
    status: 403,
    msg: '权限不足'
  })
  // 更新数据库
  db.query('insert into goods set ?', req.body, (err, result) => {
    if (err) {
      return res.send({
        status: 403,
        msg: err.message
      })
    }
    res.send({
      status: 200,
      msg: '新增商品成功!'
    })
  })
})
app.post('/update', [jwtAuth, upload.single('file')], (req, res) => {
  // 验证管理员权限
  if (req.auth.id !== 10000) return res.send({
    status: 403,
    msg: '权限不足'
  })
  const sqlStr = 'update goods set description=?,price=?,store_num=?,sold_num=?,selling=? where goodsname = ?'
  const info = req.body
  // 更新数据库
  db.query(sqlStr, [info.description, info.price, info.store_num, info.sold_num, info.selling, info.goodsname], (err) => {
    if (err) return res.send({
      status: 403,
      msg: err.message
    })
    res.send({
      status: 200,
      msg: '商品信息修改成功!若更新了商品图片,图片将会在刷新浏览器后改变。'
    })
  })
})
app.post('/delete', jwtAuth, (req, res) => {
  // 验证管理员权限
  if (req.auth.id !== 10000) return res.send({
    status: 403,
    msg: '权限不足'
  })
  const id = req.body.id
  const sqlStr = 'delete from goods where goodsname = ?'
  // 更新数据库
  db.query(sqlStr, id, (err, result) => {
    if (err) return res.send({
      status: 403,
      msg: err.message
    })
    fs.unlink('./goods_images/' + id + '.png')
    res.send({
      status: 200,
      msg: 'ok'
    })
  })
})


app.get('/getinfo', jwtAuth, (req, res) => {
  res.send({
    status: 200,
    msg: 'ok',
    info: req.auth
  })
})
app.get('/getgoods', (req, res) => {
  // 查询数据库, 将所有处于在售状态的商品返回
  const sqlStr = 'select * from goods where selling=1'
  db.query(sqlStr, (err, result) => {
    if (err) return res.send({
      status: 500,
      goods: null
    })
    return res.send({
      status: 200,
      goods: result
    })
  })
})
app.get('/getfullgoods', (req, res) => {
  // 返回goods表的信息
  const sqlStr = 'select * from goods'
  db.query(sqlStr, (err, result) => {
    if (err) return res.send({
      status: 500,
      goods: null
    })
    return res.send({
      status: 200,
      goods: result
    })
  })
})


app.get('/getlog', jwtAuth, (req, res) => {
  // 直接返回loggin表中的数据
  const sqlStr = 'select * from logging'
  db.query(sqlStr, (err, result) => {
    if (err) return res.send({
      status: 500,
      logs: null
    })
    return res.send({
      status: 200,
      logs: result
    })
  })
})

// 格式化时间函数, 返回当前时间, 并格式化成yyyy-mm-dd hh:mm:ss格式
var formatDate = function() {

  // 判断数据是否小于10, 小于10则补0使格式一致
  var addZeros = function(num) {
    if (num < 10) return '0' + num;
    return num
  }

  const date = new Date()
  let year = date.getFullYear()
  let month = addZeros(date.getMonth() + 1)
  let day = addZeros(date.getDate())
  let hour = addZeros(date.getHours())
  let minute = addZeros(date.getMinutes())
  let second = addZeros(date.getSeconds())
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}
const nodemailer = require('nodemailer');

app.post('/soldgoods', jwtAuth, (req, res) => {
  const { id, username, email } = req.auth
  const { goodsname, description, num, addr } = req.body

  // 先判断库存是否足够
  const sqpStr = 'select * from goods where goodsname=?'
  db.query(sqpStr, [goodsname], (err, result) => {
    result = JSON.parse(JSON.stringify(result))
    if (err) return res.send({
      status: 500,
      msg: '服务器内部错误, 购买失败。'
    })
    if (result[0].store_num < num) return res.send({
      status: 201,
      msg: '库存不足, 购买失败。'
    })

    // 更新库存
    const sqlStr1 = 'update goods set store_num=? where goodsname=?'
    db.query(sqlStr1, [result[0].store_num - num, goodsname], (err) => {
      if (err) return res.send({
        status: 500,
        msg: '服务器内部错误, 购买失败。'
      })

      // 增加日志记录
      const sqlStr2 = 'insert into logging set ?'
      const insertInfo = {
        id, username, goodsname,
        time: formatDate(),
        buynums: num,
        profit: result[0].price * num
      }
      db.query(sqlStr2, insertInfo, (err) => {
        if (err) return res.send({
          status: 500,
          msg: '服务器内部错误, 购买失败。'
        })

        // 发送邮件
        const _formatDate = insertInfo.time
        var transporter = nodemailer.createTransport({
          service: 'qq',
          port: 465,
          secure: true,
          auth: { user: '2781282164@qq.com', pass: 'tudxfssmknzddfgi' }
        })
        var mailOptions = {
          from: '2781282164@qq.com',
          to: email,
          subject: '购物之家 - 订单确认',
          html: `<p>Hi ${username},</p>
                <p>恭喜,您已 于${_formatDate} 付款成功,商品购买成功!</p>
                <p>订单信息如下:</p>
                <p>商品名称:${description}<br/>商品数量:${num}<br/>下单账号:${id}<br/>地址信息:${addr}</p>
                <p>我们将会在购买成功后7-10个工作日内发货,感谢您的耐心等待。</p>
                <p>谢谢,<br/>购物之家团队</p>
                `
        }
        transporter.sendMail(mailOptions, (err) => {
          if (err) return res.send({
            status: 201,
            msg: '购买失败, 账号邮箱非法。'
          })
          res.send({
            status: 200,
            msg: '购买成功, 我们已发送订单详情至您的邮箱, 请注意查收。'
          })
        })
      })
    })
  })
})

app.listen(80, () => {
  console.log("server listening on port 80");
})