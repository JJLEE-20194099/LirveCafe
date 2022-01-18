
import Book from '../app/models/Book.js';
import Food from '../app/models/Food.js';
import Coffee from '../app/models/Coffee.js';

export const mergeNewsAndProduct = function(products, news) {

    var get_new = null;

    for (let item of news) {
        var eventStartTime = item.eventStartTime
        var eventStartDate = item.eventStartDate
        var eventEndTime = item.eventEndTime
        var eventEndDate = item.eventEndDate

        var minute_end = eventEndTime.split(":")[1]
        var hour_end = eventEndTime.split(":")[0]
        var second_end = 0
        var year_end = eventEndDate.split("-")[0]
        var month_end = eventEndDate.split("-")[1]
        var day_end = eventEndDate.split("-")[2]

        var minute_start = eventStartTime.split(":")[1]
        var hour_start = eventStartTime.split(":")[0]
        var second_start = 0
        var year_start = eventStartDate.split("-")[0]
        var month_start = eventStartDate.split("-")[1]
        var day_start = eventStartDate.split("-")[2]

        let datum = new Date(Date.UTC(year_end, month_end,day_end, hour_end, minute_end, second_end));
        var timestamp_end = datum.getTime()

        datum = new Date(Date.UTC(year_start, month_start,day_start, hour_start, minute_start, second_start));
        var timestamp_start = datum.getTime()

        var date_now = new Date()
        datum = new Date(Date.UTC(date_now.getFullYear().toString(), (date_now.getMonth() + 1).toString(),date_now.getDate().toString(), (date_now.getHours()).toString(), date_now.getMinutes().toString(), date_now.getSeconds().toString()));
        var timestamp_now = datum.getTime()

        if (timestamp_start <= timestamp_now && timestamp_now <= timestamp_end) {
            get_new = item
            break
        }
    
    }

    const items = []


    for (let product of products) {

       
        if (!get_new || product.price < get_new.condition * 1000) {
            items.push(product);
            continue;
        }

        let discountPercentage = Math.floor(Math.random() * get_new.discountPercentage) + 1

        let new_product = {
            ...product,
            "discountPercentage": discountPercentage,
            "eventStartTime": get_new.eventStartTime,
            "eventStartDate": get_new.eventStartDate,
            "eventEndTime": get_new.eventEndTime,
            "eventEndDate": get_new.eventEndDate,
            "saleoff_price": parseInt(product.price * (1 - discountPercentage / 100)),
            "saleoff_status": 1,
           
        }
        items.push(new_product)
    }
    return [items, get_new];
    
}

export const getUpdateSaleoffPromises = function(books, coffee, food) {
    const res = []

    for (let item of books) {
        res.push(() => Book.updateOne({_id: item._id}, item))
    }

    for (let item of coffee) {
        
        res.push(() => Coffee.updateOne({_id: item._id}, item))
    }

    for (let item of food) {
        res.push(() => Food.updateOne({_id: item._id}, item))
    }
    console.log(res)
    return res;
}