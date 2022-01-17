const YAML = require('yamljs') // yaml 解析
const sendMail = require('./mail') // 邮箱发送
const daka = require('./daka') // 一次打卡流程

// 同步倒计时/秒
const syncTimeout = second => new Promise((resolve) => {
  setTimeout(() => resolve(), 1000 * second)
})

// 获取用户设置的变量
const getInfo = () => {
  console.log('\n获取环境变量')
  // 用户设置的环境变量
  const infoStr = process.env['INFO']
  let info = {}
  // 解析
  try {
    // 传入的是json
    if (infoStr.includes('{') && infoStr.includes('}')) {
      info = JSON.parse(infoStr)
    } 
    // 传入的是yaml
    else {
      info = YAML.parse(infoStr)
    }
  } catch (error) {
    throw new Error('GitHub Secrets 填写错误，不是正确的格式 (json | yaml), 请按 README.md 文档说明填写')
  }

  // 验证数据
  if (!([0, 1, 2, 3].includes(info['类型']) && info['学号'] && info['密码'] && info['位置'])) {
    throw new Error('GitHub Secrets 信息不完整，[类型, 学号, 密码, 位置]为必填项，请按 README.md 文档说明填写')
  }

  // 1:离校在厦门 || 3:离校在厦门租房  需要多填一个社区
  if ([1, 3].includes(info['类型'])) {
    if (!info['社区']) {
      throw new Error('GitHub Secrets 信息不完整，离校在厦门需要多填写一个社区，请按 README.md 文档说明填写')
    }
  }
  console.log('获取环境变量成功')

  // 获取邮箱
  console.log('\n获取邮箱')
  info['邮箱'] = info['邮箱']?info['邮箱']:process.env['MAIL']

  // 验证邮箱
  if (info['邮箱']) {
    const mailReg = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$")
    if (!mailReg.test(info['邮箱'])) {
      console.log('获取邮箱失败, 邮箱格式错误')
      info['邮箱'] = null
    } else {
      console.log('获取邮箱成功')
    }
  } else {
    console.log('获取邮箱失败, 未填写邮箱')
  }

  return info
}



// 本地test

/* process.env['INFO'] =
`
类型: 0
学号: 1000000000
密码: password
位置: 福建省xxxxx
邮箱: 1xxxx@qq.com
`
 */

const main = async () => {
  
  // 获取环境变量
  let info = getInfo()
  
  // 版本检查 防止代码过期仍然还在运行 可删除
  // info['邮箱'] && sendMail(info['邮箱'], '打卡代码已失效', '打卡代码已失效, 请到 Github 中更新或删除')
  // return

  // 感觉太容易打卡失败了, 这次调整成最大失败 5 次
  let maximum = 5 // 最大重复次数
  let taskNum = 0 // 任务执行次数
  let status = false // 打卡状态
  let mailMsg = `<h3>${info['学号']} 同学你好!</h3><hr/>` // 返回的邮件内容

  // 递归打卡
  async function recursionDaka() {
    taskNum++
    console.log(`\n第 ${taskNum} 次打卡: (${new Date()})\n`)
    mailMsg += `<h4>第 ${taskNum} 次打卡: </h4><div style="color: #b4b4b4;font-size: 0.6em;">${new Date()}</div>`
    try {
      let msg = await daka(info) // 执行一次打卡流程
      status = true
      mailMsg += `<div style="color:#18a058;font-size:1.2em;">[打卡成功]<br/>${msg}</div>`
    } catch (error) {
      console.log('打卡失败: ', error.message)
      mailMsg += `<div style="color:#d03050;font-size:1.2em;">[打卡失败]<br/>${error.message}</div><hr/>`
      if (taskNum + 1 > maximum) return // 执行次数上限结束
      console.log('将在1分钟后继续...')
      await syncTimeout(60) // 间隔1分钟, 不能太频繁请求
      await recursionDaka()
    }
  }

  await recursionDaka()

  console.log(status?'\n打卡成功\n':'\n打卡失败\n')
  console.log(mailMsg)
  info['邮箱'] && sendMail(info['邮箱'], status?'打卡成功':'打卡失败', mailMsg)

}

main()
