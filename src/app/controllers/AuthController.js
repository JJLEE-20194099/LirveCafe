import User from '../models/User.js'
import Book from '../models/Book.js';
import Coffee from '../models/Coffee.js';
import Food from '../models/Food.js';
import { 
    mongooseDocumentsToObject,
    singleMongooseDocumentToObject,
} from '../../support_lib/mongoose.js';

import Vonage  from '@vonage/server-sdk'

import otpGenerator from 'otp-generator';

// const vonage = new Vonage({
//   apiKey: "3784dde2",
//   apiSecret: "bYpbXqGawIqV9PIn"
// }, {debug: true})

const AuthController = {

    // GET auth/index
    index: function(req, res, next) {

        if (req.signedCookies) {
            if (req.signedCookies.userId) {
                res.redirect('/')
                return true;
            }
            
        }

        res.render('auth/index');
    },

    // GET auth/logout

    logout: function(req, res, next) {
        res.clearCookie("userId");
        res.redirect('/');
    },

    // POST auth/login

    login: function(req, res, next) {
        const {key, password} = req.body;
        const errors = [];

        const checkLogin = function(item) {
            if (password !== item.password) {
                return false;
            }

            if (key !== item.username && 
                key !== item.phone &&
                key !== item.email    
            ) return false;

            return true;
        }

        User.find({})
            .then((users) => {
                users = mongooseDocumentsToObject(users);
                if (users.filter(checkLogin).length) {
                    const user = users.filter(checkLogin)[0]
                    res.cookie('userId', user._id, {
                        signed: true
                    })
                    res.redirect('/')
                    
                    // const from = 'Vonage APIs'
                    // const to = '+84969973012'.replace(/\D/g,'')
                    // let text = "Hello, you get 5 free milk teas on the opening day of new drinks from lirvecafehust Address: Alley 75 Giai Phong, Hanoi";
                    // vonage.message.sendSms(from, to, text,
                    //     (err, responseData) => {
                    //     if (err) {
                    //         console.log(err);
                    //     } else {
                    //         if(responseData.messages[0]['status'] === "0") {
                    //             console.log("Message sent successfully.");
                    //         } else {
                    //             console.log(responseData);
                    //         }
                    //     }
                    // })
                   
                    const data =  {
                        user: user,
                        // validToken: otpGenerator.generate(6, { upperCase: false, specialChars: false})
                    }

                    
                       // res.render('auth/2fa', {data: data});                    
                } else {
                    errors.push('username or phone or email or password is not correct');
                   
                    res.render('auth/index', {
                       errors: errors,
                       values: req.body
                    });
                }
            })
            .catch(next)




    }
}

export default  AuthController;