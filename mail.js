/**
* @description 邮件发送 
* 调用方法:sendMail('xxxxxxx@qq.com','这是测试邮件', 'Hi,这是一封测试邮件');
* @fileName mail.js
* @author 伞仙
* @date 2021/07/21 19:05:28
*/

const nodemailer = require("./nodemailer/lib/nodemailer");

const config = {
  user: 'ux34@qq.com', // 邮箱帐号
  pass: 'ctcpzlmlijctbaaj', // 邮箱授权码
  from: '"Daka" <ux34@qq.com>', // 发件人 昵称与邮箱
}

let transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.user, // 邮箱账号
    pass: config.pass, // 授权码,通过QQ邮箱获取
  },
});

function sendMail(to, subject, text) {
  transporter.sendMail({
    from: config.from,
    to: to,
    subject: subject,
    text: text
  })
  .then(() => console.log("邮件发送成功"))
  .catch((err) => console.log("邮件发送失败, " + err.message))
}

module.exports = sendMail;