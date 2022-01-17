/**
 * @description 一次打卡的流程
 * @fileName daka.js
 * @author 伞仙
 * @date 2022/01/15 10:32:33
 */

const getForm = require('./form')

const axios = require('axios')
const http = axios.create()
http.defaults.timeout = 10000
// 定义在 node.js 中 follow 的最大重定向数目
http.defaults.maxRedirects = 0
// 使302不报错
http.defaults.validateStatus = (status) =>
  (status >= 200 && status < 300) || status == 302
http.defaults.headers['user-agent'] =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36'

// 一次打卡的流程
async function daka(info) {
  // 获取身份令牌
  const token = await login(info)
  // 获取用户的其他信息
  let userInfo = await getUserInfo(token)
  if (!userInfo) {
    throw new Error('获取用户信息失败')
  }
  // 检查用户信息
  info['姓名'] = userInfo['username']
  info['path'] = userInfo['path']
  info['组织'] = userInfo['organization']
  info['性别'] = userInfo['gender']
  info['电话'] = userInfo['cellphone']
  if ( !( info['姓名'] && info['path'] && info['组织'] && info['性别'] && info['电话'] ) ) {
    throw new Error('用户信息不完整，请检查手机微哨【个人资料】的完成度')
  }

  // 提交打卡的反馈信息
  const msg = await submit(token, getForm(info))
  console.log(msg)
  return msg
}

async function login(info) {
  console.log('1. 提交登录表单')
  let { oauth2cookie, location } = await http({
    method: 'post',
    url: 'https://api.weishao.com.cn/login?source=%2Foauth%2Fauthorize%3Fclient_id%3DpqZ3wGM07i8R9mR3%26redirect_uri%3Dhttps%253A%252F%252Fyq.weishao.com.cn%252Fcheck%252Fquestionnaire%26response_type%3Dcode%26scope%3Dbase_api%26state%3Druijie',
    data: `schoolcode=xmut&username=${info['学号']}&password=${info['密码']}&verifyValue=&verifyKey=${info['学号']}_xmut&ssokey=`,
  }).then((res) => {
    let oauth2cookie = res.headers['set-cookie'][0].match(/^(.*?);/)[1]
    let location = res.headers['location']
    return { oauth2cookie, location }
  })

  console.log('oauth2cookie: ', oauth2cookie)

  // 重定向一 /check/questionnaire
  console.log('重定向一: ', location)
  location = await http({
    method: 'get',
    url: location,
  }).then((res) => res.headers['location'])

  // 重定向二 /oauth/authorize
  console.log('重定向二: ', location)
  location = await http({
    method: 'get',
    url: location,
    headers: { cookie: oauth2cookie },
  }).then((res) => res.headers['location'])

  // 重定向三 /check/questionnaire
  console.log('重定向三: ', location)
  const cookie = await http({
    method: 'get',
    url: location,
  }).then((res) => res.headers['set-cookie'][0].match(/^(.*?);/)[1])
  console.log('登录cookie: ', cookie)
  return cookie
}

async function getUserInfo(token) {
  console.log('2. 获取用户信息')
  return await http({
    method: 'get',
    url: 'https://yq.weishao.com.cn/userInfo',
    headers: { cookie: token }
  }).then(res => res.data.data)
}

async function submit(token, data) {
  console.log('3. 发送打卡请求')
  return await http({
    method: 'post',
    headers: { 'content-type': 'application/json', 'cookie': token },
    url: 'https://yq.weishao.com.cn/api/questionnaire/questionnaire/addMyAnswer',
    data: JSON.stringify(data)
  }).then((res) => res.data.errmsg)
}

module.exports = daka