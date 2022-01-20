
import Book from '../app/models/Book.js';
import Food from '../app/models/Food.js';
import Coffee from '../app/models/Coffee.js';

export const get_news_by_type = function(news) {
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
    return get_new

}

export const mergeNewsAndProduct = function(products, news) {

    var get_new = null;

    get_new = get_news_by_type(news)

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
            "sum_items_during_saleoff": get_new.sum_items_during_saleoff,
            "quantity": product.quantity - get_new.sum_items_during_saleoff
           
        }
        items.push(new_product)
    }
    return [items, get_new];
    
}

export const updateNewsAndMergeNewsAndProduct = function(products, news) {

    var get_new = null;

    get_new = get_news_by_type(news)

    const items = []


    for (let product of products) {

       

       
        if (!get_new || product.price < get_new.condition * 1000) {

            product["saleoff_status"] = 0;
            product["saleoff_price"] = 0;
            product["no_sold"] += product["no_sold_during_saleoff"]
            product["no_sold_during_saleoff"] = 0
            product["discountPercentage"] = 0
            if(product["sum_items_during_saleoff"])
                product["quantity"] += parseInt(product["sum_items_during_saleoff"])
            product["sum_items_during_saleoff"] = 0
            if (product["eventStartTime"]) {
                delete product["eventStartTime"]
            }
            if (product["eventStartDate"]) {
                delete product["eventStartDate"]
            }
            if (product["eventEndTime"]) {
                delete product["eventEndTime"]
            }
            if (product["eventEndDate"]) {
                delete product["eventEndDate"]
            }

    

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
            "sum_items_during_saleoff": get_new.sum_items_during_saleoff,
            "quantity":  product.quantity + product.sum_items_during_saleoff - get_new.sum_items_during_saleoff,
            "no_sold_during_saleoff": 0,
            "no_sold": product.no_sold + product.no_sold_during_saleoff
           
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
    return res;
}

export const check_intersection_news = function(newsEle, allNews) {
    let get_new;
    for (let item of allNews) {
        if(newsEle["_id"]) {
            if(item._id.toString() == newsEle._id.toString()) {
                continue;
            }
        }

        var eventEndTime = item.eventEndTime
        var eventEndDate = item.eventEndDate

        var minute_end = eventEndTime.split(":")[1]
        var hour_end = eventEndTime.split(":")[0]
        var second_end = 0
        var year_end = eventEndDate.split("-")[0]
        var month_end = eventEndDate.split("-")[1]
        var day_end = eventEndDate.split("-")[2]

        let datum = new Date(Date.UTC(year_end, month_end,day_end, hour_end, minute_end, second_end));
        var timestamp_end = datum.getTime()

        var eventStartTime = item.eventStartTime
        var eventStartDate = item.eventStartDate

        var minute_start = eventStartTime.split(":")[1]
        var hour_start = eventStartTime.split(":")[0]
        var second_start = 0
        var year_start = eventStartDate.split("-")[0]
        var month_start = eventStartDate.split("-")[1]
        var day_start = eventStartDate.split("-")[2]

        datum = new Date(Date.UTC(year_start, month_start,day_start, hour_start, minute_start, second_start));
        var timestamp_start = datum.getTime()

        var date_now = new Date()
        datum = new Date(Date.UTC(date_now.getFullYear().toString(), (date_now.getMonth() + 1).toString(),date_now.getDate().toString(), (date_now.getHours()).toString(), date_now.getMinutes().toString(), date_now.getSeconds().toString()));
        var timestamp_now = datum.getTime()

        let eventStartTimeEle = newsEle.eventStartTime
        let eventStartDateEle = newsEle.eventStartDate

        minute_start = eventStartTimeEle.split(":")[1]
        hour_start = eventStartTimeEle.split(":")[0]
        second_start = 0
        year_start = eventStartDateEle.split("-")[0]
        month_start = eventStartDateEle.split("-")[1]
        day_start = eventStartDateEle.split("-")[2]

        datum = new Date(Date.UTC(year_start, month_start,day_start, hour_start, minute_start, second_start));
        var timestamp_news_ele = datum.getTime()

       

        if ( timestamp_now <= timestamp_end && timestamp_now >= timestamp_start && timestamp_news_ele <= timestamp_end) {
            get_new = item;
            return [true, get_new];
        }
    }
    return [false, null];
}

export const deleteNewsAndUpdateProducts = function(products, news, deletedNews) {

    var get_new = null;

    get_new = get_news_by_type(news)

    const items = []


    for (let product of products) {

        if (product.price >= deletedNews.condition*1000) {
            product["saleoff_status"] = 0;
            product["saleoff_price"] = 0;
            product["no_sold"] += product["no_sold_during_saleoff"]
            product["no_sold_during_saleoff"] = 0
            product["discountPercentage"] = 0
            if(product["sum_items_during_saleoff"])
                product["quantity"] += parseInt(product["sum_items_during_saleoff"])
            product["sum_items_during_saleoff"] = 0
            if (product["eventStartTime"]) {
                delete product["eventStartTime"]
            }
            if (product["eventStartDate"]) {
                delete product["eventStartDate"]
            }
            if (product["eventEndTime"]) {
                delete product["eventEndTime"]
            }
            if (product["eventEndDate"]) {
                delete product["eventEndDate"]
            }
        }



       
        if (!get_new || get_new.condition*1000 > product.price) {
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
            "sum_items_during_saleoff": get_new.sum_items_during_saleoff,
            "quantity": product.quantity - get_new.sum_items_during_saleoff
           
        }
        items.push(new_product)
    }
    return [items, get_new];
    
}