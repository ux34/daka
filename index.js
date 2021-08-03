const sendMail = require('./mail'); // 邮箱发送
const { login, getUserInfo, submit } = require('./request'); // 需要使用到的请求
const getForm = require('./form'); //返回需要提交的表单

// 同步倒计时/秒
const syncTimeout = second => new Promise((resolve) => {
  setTimeout(() => resolve(), 1000 * second)
});

// 本地test
/* 
process.env["INFO"] = `
{
  "类型": 0,
  "学号": "1xxxxxxxxx",
  "密码": "xxxxxxxx",
  "位置": "福建省xxxxxxxxx"
}
`;
process.env["MAIL"] = 'ux34@qq.com';

 */

// 开始执行
(async () => {
  // 获取通知邮箱
  let mail = process.env["MAIL"];
  const mailReg = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$");
  if (!mailReg.test(mail)) {
    console.log('不是正确的邮箱，将取消发送邮箱，请修改')
    mail = null
  }
  try {
    // 解析环境变量中的JSON字符串
    let info = JSON.parse(process.env["INFO"]);
    // 默认为0：离校不在厦门
    // 开学将默认更新为2：在校
    if (info['类型'] === undefined) {
      info['类型'] = 0
    }
    if (
      !(
        [0,1,2,3].includes(info['类型'])
        && info['学号']
        && info['密码']
        && info['位置']
      )) {
      throw new Error('GitHub Secrets 信息不完整，[类型, 学号, 密码, 位置]为必填项，请按文档说明填写');
    }
    // 1:家在厦门 || 3:厦门租房  需要多填一个社区
    if ([1,3].includes(info['类型'])) {
      if (!info['社区']) {
        throw new Error('GitHub Secrets 信息不完整，家在厦门需要多填一个社区，请按文档说明填写');
      }
    }

    // 登录获取cookie
    let cookie = await login(info).catch(err => {
      console.log('登录失败：' + err.message)
      mail && sendMail(mail, '登录失败，将再5分钟后重新尝试', err.message)
      return null
    })
    if (!cookie) {
      // 登录失败5分钟后再次尝试登录
      // 同步倒计时5分钟
      await syncTimeout(5*60)

      // 再次失败就不管了
      // 不知道什么原因经常请求失败
      cookie = await login(info)
    }
    // 直接通过cookie获取用户信息，减少 Secrets 的配置项
    let userInfo = await getUserInfo(cookie);
    if (!userInfo) {
      throw new Error('获取用户信息失败');
    }
    
    info['姓名'] = userInfo['username'];
    info['path'] = userInfo['path'];
    info['组织'] = userInfo['organization'];
    info['性别'] = userInfo['gender'];
    info['电话'] = userInfo['cellphone'];
    if (
      !(
        info['姓名']
        && info['path']
        && info['组织']
        && info['性别']
        && info['电话']
      )
      ) {
      throw new Error('用户信息不完整，请检查手机微哨【个人资料】的完成度');
    }
  
    let form = getForm(info);
    // 提交表单
    let result = await submit(cookie, JSON.stringify(form)).catch(err => {
      throw new Error('提交表单失败：' + err.message)
    })
    console.log('打卡成功：' + result);
    // 发过结果到通知邮件
    
    mail && sendMail(mail, '打卡成功', result);
  } catch (error) {
    // 错误处理
    console.log('打卡失败：' + error.message);
    // 发过失败的结果到通知邮件
    mail && sendMail(mail, '打卡失败', error.message);
  }

})();