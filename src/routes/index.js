import bookRoute from './book.js';
import coffeeRoute from './coffee.js';
import foodRoute from './food.js';
import workingspaceRoute from './workingspace.js';
import newsRoute from './news.js';
import userRoute from './user.js'; 
import ownRoute from './own.js'; 
import authRoute from './auth.js';
import homeRoute from './test.js';
import emailRoute from './email.js';
import promoRoute from './promo.js';
import cartRoute from './cart.js';
import authMiddleware from '../app/middleware/AuthMiddleware.js';
import notiMiddleware from '../app/middleware/NotiMiddleware.js';
import orderRoute from './order.js';
import notiRoute from './noti.js';

const routeObj = {
    route: function (app) {
        app.use('/books', authMiddleware.getCurrentUserInfo, notiMiddleware.getNotiInfo, bookRoute);
        app.use('/food', authMiddleware.getCurrentUserInfo, notiMiddleware.getNotiInfo, foodRoute);
        app.use('/coffee', authMiddleware.getCurrentUserInfo, notiMiddleware.getNotiInfo, coffeeRoute);
        app.use('/workingspaces', authMiddleware.getCurrentUserInfo, notiMiddleware.getNotiInfo, workingspaceRoute);
        app.use('/news', authMiddleware.getCurrentUserInfo, notiMiddleware.getNotiInfo, newsRoute);
        app.use('/users', authMiddleware.getCurrentUserInfo, notiMiddleware.getNotiInfo, userRoute);
        app.use('/own', authMiddleware.getCurrentUserInfo, notiMiddleware.getNotiInfo, ownRoute);
        app.use('/auth', authRoute);
        app.use('/email', authMiddleware.getCurrentUserInfo, notiMiddleware.getNotiInfo, emailRoute);
        app.use('/promos', authMiddleware.getCurrentUserInfo, notiMiddleware.getNotiInfo, promoRoute);
        app.use('/carts', authMiddleware.getCurrentUserInfo, notiMiddleware.getNotiInfo,cartRoute);
        app.use('/', authMiddleware.getCurrentUserInfo, notiMiddleware.getNotiInfo, homeRoute);
        app.use('/orders', authMiddleware.getCurrentUserInfo, notiMiddleware.getNotiInfo, orderRoute);
        app.use('/notis', authMiddleware.getCurrentUserInfo, notiMiddleware.getNotiInfo,notiRoute);
    },
}
export default routeObj;
