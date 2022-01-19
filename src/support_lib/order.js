
import Book from '../app/models/Book.js';
import Coffee from '../app/models/Coffee.js';
import Food from '../app/models/Food.js';
export const getUpdateProductWarehousePromise = function(orders) {
    const updatePromises = [];
    for(var item of orders.itemList) {
        if (item.food) {
            let food;
            if (!item.food.saleoff_status) {
                food = item.food;
                food.quantity = item.food.quantity - item.quantity
                food.no_sold = food.no_sold + item.quantity
                updatePromises.push(() => Food.updateOne({_id: food._id}, food))
            } else {
                food = item.food;
                food.no_sold_during_saleoff = food.no_sold_during_saleoff + item.quantity
                food.sum_items_during_saleoff = food.sum_items_during_saleoff - item.quantity
                updatePromises.push(() => Food.updateOne({_id: food._id}, food))
            }
           
        } else if (item.coffee) {
            let coffee;
            if (!item.coffee.saleoff_status) {
                coffee = item.coffee;
                coffee.quantity = item.coffee.quantity - item.quantity
                coffee.no_sold = coffee.no_sold + item.quantity
                updatePromises.push(() => Coffee.updateOne({_id: coffee._id}, coffee))
            } else {
                coffee = item.coffee;
                coffee.no_sold_during_saleoff = coffee.no_sold_during_saleoff + item.quantity
                coffee.sum_items_during_saleoff = coffee.sum_items_during_saleoff - item.quantity
                updatePromises.push(() => Coffee.updateOne({_id: coffee._id}, coffee))
            }
        } else if (item.book) {
            let book;
            if (!item.book.saleoff_status) {
                book = item.book;
                book.quantity = item.book.quantity - item.quantity
                book.no_sold = book.no_sold + item.quantity
                updatePromises.push(() => Book.updateOne({_id: book._id}, book))
            } else {
                book = item.book;
                book.no_sold_during_saleoff =  book.no_sold_during_saleoff + item.quantity
                book.sum_items_during_saleoff = book.sum_items_during_saleoff - item.quantity
                updatePromises.push(() => Book.updateOne({_id: book._id}, book))
            }
        }
    }
  
    return updatePromises
}