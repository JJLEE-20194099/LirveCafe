import otpGenerator from 'otp-generator';

import mailer from '../utils/mailer.js';

const EmailController = {
    // POST /email/send-token

    sendToken: async (req, res, next) => {
       
        try {
            const { email, username, address } = req.body;
            const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
            const subject = `Mã xác thực thanh toán tới từ LivreCaféHust`
            const body = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">LivreCaféHust</a>
              </div>
              <p style="font-size:1.1em; color: black">Hi ${username}</p>
              <p style="color: black">Thank you for choosing LivreCaféHust. Use the following OTP to complete your payment procedures. OTP is valid for 5 minutes</p>
              <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
              <p style="font-size:0.9em;">Regards,<br />LivreCaféHust</p>
              <p style="color: black">Your address: ${address}</p>
              <hr style="border:none;border-top:1px solid #eee" />
              <div style="padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                <pLivreCaféHust Inc</p>
                <p>Ngõ 75 ngách 60 số nhà 31 Giải Phóng</p>
                <p>Ha Noi, VietName</p>
              </div>
            </div>  
          </div>`
            
            await mailer.sendMail( email, subject, body )

            res.send({token: otp, isError: false});
            console.log(otp)
        } catch(error) {
            console.log(error);
            res.send({error: error, isError: true});
        }
    },

    sendOrderNotice: async (req, order) => {
       
      try {
          const { email, username, address } = req.body;
          const subject = `Thông báo đơn hàng của bạn tới từ LivreCaféHust`
          const body = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
          <div style="width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
              <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">LivreCaféHust</a>
            </div>
            <p style="font-size:1.1em; color: black">Hi ${username}</p>
            <p style="color: black">Thank you for choosing LivreCaféHust.</p>
            <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">See yahhhhh</h2>
            <p style="font-size:0.9em;">Regards,<br />LivreCaféHust</p>
            <p style="color: black">Your address: ${address}</p>
            <hr style="border:none;border-top:1px solid #eee" />
            <div style="padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
              <pLivreCaféHust Inc</p>
              <p>Ngõ 75 ngách 60 số nhà 31 Giải Phóng</p>
              <p>Ha Noi, VietName</p>
            </div>
          </div>  
        </div>`
          
          await mailer.sendMail( email, subject, body )

         
      } catch(error) {
          console.log(error);
      }
  },

    

}

export default EmailController;