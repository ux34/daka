const sendMail = require('./mail'); // 邮箱提醒模块
const { login, getUserInfo, submit } = require('./request'); // 需要使用到的请求
const getForm = require('./form'); //返回需要提交的表单

// 开始执行
(async () => {
  try {
    // 解析环境变量中的JSON字符串
    let info = JSON.parse(process.env["INFO"]);
    // 默认为0：离校不在厦门
    if (info['类型'] === undefined) {
      info['类型'] = 0
    }
    if (
      !(
        [0,1,2].includes(info['类型'])
        && info['学号']
        && info['密码']
        && info['位置']
      )) {
      throw new Error('GitHub Secrets 信息不完整，[类型, 学号, 密码, 位置]为必填项，请按文档说明填写');
    }
    // 家在厦门需要多填一个社区
    if (info['类型'] === 1) {
      if (!info['社区']) {
        throw new Error('GitHub Secrets 信息不完整，家在厦门需要多填一个社区，请按文档说明填写');
      }
    }

    // 登录获取cookie
    let cookie = await login(info);
    if (!cookie) {
      throw new Error('获取用户信息失败');
    }
    // 通过cookie获取用户信息，减少 Secrets 的配置项
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
    sendMail('打卡成功', result);
  } catch (error) {
    // 错误处理
    sendMail('打卡失败', error.message);
    return '打卡失败：' + error.message;
  }

})();