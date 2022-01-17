/**
* @description 邮件发送 
* 调用方法:sendMail('xxxxxxx@qq.com','这是测试邮件(标题)', 'Hi,这是一封测试邮件(内容)');
* @fileName mail.js
* @author 伞仙
* @date 2021/07/21 19:05:28
*/

const nodemailer = require('nodemailer')

// 献祭小号
const config = {
  user: 'ux34@qq.com', // 邮箱帐号
  pass: 'ctcpzlmlijctbaaj', // 邮箱授权码
  from: '"Daka" <ux34@qq.com>' // 发件人 昵称与邮箱
}

let transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.user, // 邮箱账号
    pass: config.pass // 授权码,通过QQ邮箱获取
  }
})


/**
 * 邮件发送
 * @param {string} to 接收人
 * @param {string} subject 标题
 * @param {string} text 内容
 */
function sendMail(to, subject, text) {
  console.log('\n邮件发送中...')
  transporter.sendMail({
    from: config.from,
    to: to,
    subject: subject,
    // text: text,
    html: `<div style="border: 1px solid #dcdcdc;color: #676767;width: 600px; margin: 0 auto; padding-bottom: 50px;position: relative;">
<div style="height: 60px; background: #393d49; line-height: 60px; color: #58a36f; font-size: 18px;padding-left: 10px;">Daka</div>
<div style="padding: 25px">
  <div style="padding-bottom: 20px;">${text}</div>
  <div style="padding: 5px; background: #f2f2f2;">如果你想停止该任务, 或不想收到此邮件, 请前往 <a href="https://github.com/umbrella34/daka">Github</a> 中设置</div>
</div>
<div style="background: #fafafa; color: #b4b4b4;text-align: center; line-height: 45px; height: 45px; position: absolute; left: 0; bottom: 0;width: 100%;">系统邮件，请勿直接回复</div>
</div>`
  })
  .then(() => console.log('邮件发送成功!'))
  .catch(err => console.log('邮件发送失败, ' + err.message))
}

module.exports = sendMail