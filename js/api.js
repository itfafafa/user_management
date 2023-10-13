const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
//1.导入 mysql 模块
const mysql = require('mysql')
//2.建立 MySQL 数据库的连接关系
const db = mysql.createPool({
  host: '******', //数据库的 IP 地址
  user: '******', //登录数据库的账号
  password: '******', //登录数据库密码
  database: '******', //指定要操作哪个数据库
})
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// 库
app.get('/userInfo', (req, res) => {
  //设置响应头  设置允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*')
  const sqlStr = 'select * from mytestsql'
  db.query(sqlStr, (err, results) => {
    if (err) return console.log(err.message) //查询数据失败
    res.send(results)
  })
})

// 增
app.post('/addUser', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  // 插入数据快捷方式
  // const user = { username: 'Spoder-Man2', userage: 'pcc4321'}
  const user = req.body
  //定义待执行 SQL 语句
  const sqlStr = 'insert into mytestsql set ?'
  //执行 SQL 语句
  db.query(sqlStr, user, (err, results) => {
    if (err) return console.log(err.message)
    if (results.affectedRows === 1) {
      res.send({
        status: 0,
        msg: '新增成功！',
        data: []
      })
    }
  })
})

// 批量删
app.delete('/delUser', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const id = req.query.userId
  // const sqlStr = 'delete from mytestsql where id=?'
  const sqlStr = 'delete from mytestsql where id in ' + '(' + id + ')'
  db.query(sqlStr, (err, results) => {
    if (err) return console.log(err.message)
    //注意：执行 delete 语句之后，结果也是一个对象，也会包含 affectedRows 属性
    console.log(results.affectedRows)
    // if (results.affectedRows === 1) {
      console.log(sqlStr)
      // console.log('删除数据成功')
      res.send({
        status: 0,
        msg: '删除成功！',
        data: []
      })
    // }
  })
})

// 改
app.post('/editUser', (req, res) => {
  const user = req.body
  //定义待执行 SQL 语句
  const sqlStr = 'update mytestsql set ? where id=?'
  //执行 SQL 语句
  db.query(sqlStr, [user, user.id], (err, results) => {
    if (err) return console.log(err.message)
    if (results.affectedRows === 1) {
      res.send({
        status: 0,
        msg: '编辑成功！',
        data: []
      })
    }
  })
})

// 查
app.get('/seachUser', (req, res) => {
  var username = req.query.username
  const sqlStr = 'select * from mytestsql where username like "' + '%' + username + '%' + '"'//+username+
  db.query(sqlStr, (err, results) => {
    if (err) return console.log(err.message) //查询数据失败
    res.send(results)
  })
})

app.listen(80, () => {
  console.log('express server running at http://127.0.0.1')
})