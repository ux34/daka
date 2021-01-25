# ⏰daka 定时打卡
基于node-fetch提交表单，Action定时打卡（微哨） 

**自动签到**  程序会在每天早上7点自动打卡

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

![默认表单与在厦门的表单](https://gitee.com/umbrella34/blogImage/raw/master/img/image-20210125193708385.png)

> 看上面的图，程序里有2种情况的表单。在厦门的只给了1种情况 `自家房产 与家人同住 社区已报备`, 如果你符合，就在`"厦门":` 后面的双引号里填上你的社区名称及社区电话。不符合这2种情况可以联系我新增。
>
> 如果你不在厦门， `"厦门": ""` 这一行就不要动或者直接删除这一行

先复制

```json
{
  "学号": "你的学号",
  "密码": "你的密码",
  "位置": "微哨平时获取的位置",
  "厦门": ""
}
```

- 回到项目页面，依次点击 `Settings` --> `Secrets` --> `New secret`

![new-secret.png](https://gitee.com/umbrella34/blogImage/raw/master/img/sxTuBFtRvzSgUaA.png)

- 建立名为 `UX34` 的 secret，值为上面复制的内容，做出对于的修改，最后点击`Add secret`
- secret名字必须为`UX34`！不然js中拿不到数据
- 修改时不要误删英文双引号

![secret](https://gitee.com/umbrella34/blogImage/raw/master/img/image-20210125143311613.png)

### 3. 启用 Actions

> Actions 默认为关闭状态，Fork 之后需要手动执行一次，若成功运行其才会激活。

返回项目主页面，点击上方的 `Actions`，点击绿色按钮 `I understand my workflows, go ahead and enable them`

![启动Actions](https://gitee.com/umbrella34/blogImage/raw/master/img/image-20210125195239213.png)


至此，部署完毕。

## 🔍结果

当你完成上述流程，可以在 `Actions` 页面点击 `auto sign` --> `build` --> `Run sign` 查看运行日志，注意 `提交结果` 的提示。


### 打卡成功

`Run sign` 里的输出

```sh
提交登录表单

第1次重定向

第2次重定向

第3次重定向

登录成功

获取用户信息成功

提交结果>>  ***"errcode":0,"errmsg":"","data":"提交成功"***
```

如果你今天已经打卡了，最后一行会变成这样

```sh
提交结果>>  ***"errcode":500,"errmsg":"不能重复回答同一问卷","data":***
```

### 打卡失败

如果你没看到 `提交结果`，那么就说明打卡失败了，点击  `Run sign` 里看看，也许能看到你的错误。



## 🧬参数

在 `Settings` --> `Secrets` 里添加的参数，`Name` 必须为下列的参数名称之一，`Value` 则填写对应获取的值

**注**：Secrets本应该是键值对的，一个名称对应一个参数。但考虑到GitHub的访问速度和多参数填写的复杂度。直接用一个JSON来存储所有值。

| 参数名称     | 是否必填 | 默认值 | 说明                                 |
| ------------ | -------- | ------ | ------------------------------------ |
| UX34         | ✅        |        | 打卡过程中需要用到的数据             |
| 属性↓        |          |        |                                      |
| UX34[”学号“] | ✅        |        | 你的学号                             |
| UX34[”密码“] | ✅        |        | 你的密码                             |
| UX34[”位置“] | ✅        |        | 你的位置，可以看看之前微哨上填的是啥 |
| UX34[”厦门“] | ❌        |        | 在厦门的填，社区名称+社区电话        |

## ❗️协议

使用 daka 即表明，您知情并同意：

- 此代码通过模拟浏览器使用学号密码登录微哨网页，提交表单完成打卡。
- 用户Secrets上的信息被储存于 Github 服务器，只供本项目使用。若 Github 服务器被攻破，则您的 Secrets有遭到泄露的风险。除此之外，开发者无权获取您的 Secrets；即使是用户，一旦创建完成Secrets，也无法再次从中查看信息
- daka 不会对您的任何损失负责，包括但不限于打卡失败、被辅导员叫去问话等