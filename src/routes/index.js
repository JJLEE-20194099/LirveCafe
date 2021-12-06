import bookRoute from './book.js';
import coffeeRoute from './coffee.js';
import eventRoute from './event.js';
import newsRoute from './news.js';
import userRoute from './user.js'; 
import ownRoute from './own.js'; 
import authRoute from './auth.js';
import homeRoute from './test.js';
import emailRoute from './email.js';
import promoRoute from './promo.js';
import cartRoute from './cart.js';
import authMiddleware from '../app/middleware/AuthMiddleware.js';
import orderRoute from './order.js';
import notiRoute from './noti.js';

const routeObj = {
    route: function (app) {
        app.use('/books', authMiddleware.getCurrentUserInfo, bookRoute);
        app.use('/coffee', authMiddleware.getCurrentUserInfo, coffeeRoute);
        app.use('/events', authMiddleware.getCurrentUserInfo, eventRoute);
        app.use('/news', authMiddleware.getCurrentUserInfo, newsRoute);
        app.use('/users', authMiddleware.getCurrentUserInfo, userRoute);
        app.use('/own', authMiddleware.getCurrentUserInfo, ownRoute);
        app.use('/auth', authRoute);
        app.use('/email', authMiddleware.getCurrentUserInfo, emailRoute);
        app.use('/promos', authMiddleware.getCurrentUserInfo, promoRoute);
        app.use('/carts', cartRoute);
        app.use('/', authMiddleware.getCurrentUserInfo, homeRoute);
        app.use('/orders', authMiddleware.getCurrentUserInfo, orderRoute);
        app.use('/notis', notiRoute);
    },
}
export default routeObj;
