# user_management
用户信息管理，增删改查

# 解决clone失败问题
Cloning into 'user_management'...
fatal: unable to access 'https://github.com/itfafafa/user_management.git/': Failed to connect to 127.0.0.1 port 1081 after 2066 ms: Connection refused

```bash
1.查看git配置 命令： git config --global -l
结果：
$ git config --global -l
user.name=***
user.email=***
credential.http://git.roadtel.top.provider=***
credential.http://service.haoyitec.cn:50006.provider=***
http.https://github.com.proxy=socks5://127.0.0.1:1081
// 最后一行配置指定了在访问https://github.com时使用的代理服务器127.0.0.1:1081，
所有对https://github.com的请求都将通过代理服务器127.0.0.1:1081进行连接

2.删除github代理 命令： git config --global --unset http.https://github.com.proxy
删除后即可clone
```

