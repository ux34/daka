# ⏰daka 定时打卡

基于node-fetch提交表单，Action定时打卡

**XMUT微哨自动打卡-暑假版**


## 📝前言

此案例仅供学习交流，如有不当之处请邮件通知我 `ux34@qq.com` 删除。

常常因为忘记打卡而感到烦恼，而打卡内容却基本没变过，为什么不写个程序自动打卡呢？

程序只是个懒人工具，情况有变还需要到手机APP上手动修改。

**如果觉得本项目对你有帮助，请顺手点个`Star`吧**

## 🎮使用须知

使用前需要用户自行配置 Secrets，需要填写类型及微哨的学号、密码、位置。

新版本不在局限于一种打卡表单，将在校版和离校版结合分为3种类型。

- 类型 **0**：默认 离校不在厦门
- 类型 **1**：离校在厦门，需要多填写一个 `社区` 字段
- 类型 **2**：在校，暑假留校住宿 || 开学后

**默认填写：**

> 如果你当日不符合默认填写的选项，请到微哨APP上自行修改！

```
你目前是否有发热?(>=37.3度)
：否

你是否有...疑似症状?
：否

近三日内是否有离开现居住地的意向？
：否
```

**离校在厦门的默认填写：**

```
离校在厦门的选项分叉过多，这边只做了一种常见的选项（如有其他情况可联系我添加）

住房类型？
：自家房产

是否与家人（亲属）同住？
：是

是否向所在社区报备？
：是
```

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

> 请根据自身情况复制并修改对应的内容

#### 1、离校不在厦门

```json
{
  "类型": 0,
  "学号": "你的学号",
  "密码": "你的密码",
  "位置": "你的位置"
}
```

#### 2、离校在厦门

```json
{
  "类型": 1,
  "学号": "你的学号",
  "密码": "你的密码",
  "位置": "你的位置",
  "社区": "所在街道社区名称及社区电话"
}
```

#### 3、在校

```json
{
  "类型": 2,
  "学号": "你的学号",
  "密码": "你的密码",
  "位置": "你的位置"
}
```

#### 邮件提醒功能（可选）

> 2021-7-21 发件人不再需要自行配置，内置一个账户，现只需要填写接收通知的邮箱。

配置这个需要另外再 `New secret`，Name为 `MAIL`

![邮箱配置](https://gitee.com/umbrella34/blogImage/raw/master/img/image-20210721220837184.png)

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