# user_management
用户信息管理，增删改查

## 项目运行

```bash
# 克隆项目
git clone https://github.com/itfafafa/user_management.git

# 进入项目目录
cd user_management

# 安装依赖
npm install

# 或镜像安装依赖
npm install --registry=https://registry.npmmirror.com

# 建立数据库连接
在 api.js 中修改相关配置
const db = mysql.createPool({
  host: '******', //数据库的 IP 地址
  user: '******', //登录数据库的账号
  password: '******', //登录数据库密码
  database: '******', //指定要操作哪个数据库
})
数据库表字段 id username userage

# 启动服务
cd js
nodemon api.js

# 使用
用浏览器打开 index.html 文件即可操作
```

## 解决clone失败问题
Cloning into 'user_management'...
fatal: unable to access 'https://github.com/itfafafa/user_management.git/': Failed to connect to 127.0.0.1 port 1081 after 2066 ms: Connection refused

```bash
- 查看git配置 命令： git config --global -l
结果：
$ git config --global -l
user.name=***
user.email=***
credential.http://git.roadtel.top.provider=***
credential.http://service.haoyitec.cn:50006.provider=***
http.https://github.com.proxy=socks5://127.0.0.1:1081
// 最后一行配置指定了在访问https://github.com时使用的代理服务器127.0.0.1:1081，
所有对https://github.com的请求都将通过代理服务器127.0.0.1:1081进行连接

- 删除github代理 命令： git config --global --unset http.https://github.com.proxy
删除后即可clone
```

