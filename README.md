# ⏰daka 定时打卡

基于node-fetch提交表单，Action定时打卡（微哨） 

**自动打卡** 在校版 带邮件提醒 

## 📝前言

此案例仅供学习交流，如有不当之处请邮件通知我 `ux34@qq.com` 删除。

常常因为忘记打卡而感到烦恼，而打卡内容却基本没变过，为什么不写个程序自动打卡呢？

程序只是个懒人工具，情况有变还需要到手机APP上手动修改。

**如果觉得本项目对你有帮助，请顺手点个`Star`吧**

## 📐部署

1. Fork 仓库
2. 添加信息 至 Secrets
3. 启用 Actions

### 1. Fork 仓库

- 项目地址：[https://github.com/umbrella34/daka](https://github.com/umbrella34/daka)
- 点击右上角 `Fork` 到自己的账号下

![fork](https://gitee.com/umbrella34/blogImage/raw/master/img/qpXowZmIWeEUyrJ.png)

### 2. 添加 信息 至 Secrets

- 回到项目页面，依次点击 `Settings` --> `Secrets` --> `New secret`

![new-secret](https://gitee.com/umbrella34/blogImage/raw/master/img/sxTuBFtRvzSgUaA.png)

![image-20210311125859890](https://gitee.com/umbrella34/blogImage/raw/master/img/image-20210311125859890.png)

```
INFO

{
  "学号": "你的学号",
  "密码": "你的密码",
  "位置": "学校位置"
}
```

邮件提醒功能（可选）

[获取QQ邮箱授权码](http://ux34.cn/pages/723554/#%E8%8E%B7%E5%8F%96%E6%8E%88%E6%9D%83%E7%A0%81)

```
EMIL

{
  "user": "邮箱账号",
  "pass": "邮箱授权码",
  "to": "通知的邮箱"
}
```



### 3. 启用 Actions

> Actions 默认为关闭状态，Fork 之后需要手动执行一次，若成功运行其才会激活。

返回项目主页面，点击上方的 `Actions`，点击绿色按钮 `I understand my workflows, go ahead and enable them`. 

进去后点击左边的 `auto sign`, 在点击 `enable workflow`即可。

![启动Actions](https://gitee.com/umbrella34/blogImage/raw/master/img/image-20210125195239213.png)

![开启工作流](https://gitee.com/umbrella34/blogImage/raw/master/img/image-20210125210230591.png)

至此，部署完毕。

## 🔍结果

先手动运行一次看看运行结果。

![手动运行](https://gitee.com/umbrella34/blogImage/raw/master/img/image-20210125215418205.png)

当你完成上述流程，可以在 `Actions` 页面点击 `auto sign` --> `build` --> `Run sign` 查看运行日志.

![查看运行结果](https://gitee.com/umbrella34/blogImage/raw/master/img/image-20210125212841095.png)



## ❗️协议

使用 daka 即表明，您知情并同意：

- 此代码通过模拟浏览器使用学号密码登录微哨网页，提交表单完成打卡。
- 用户Secrets上的信息被储存于 Github 服务器，只供本项目使用。若 Github 服务器被攻破，则您的 Secrets有遭到泄露的风险。除此之外，开发者无权获取您的 Secrets；即使是用户，一旦创建完成Secrets，也无法再次从中查看信息
- daka 不会对您的任何损失负责，包括但不限于打卡失败、被辅导员叫去问话等