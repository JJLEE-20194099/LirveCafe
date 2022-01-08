
import Book from '../app/models/Book.js';
import Coffee from '../app/models/Coffee.js';
import Food from '../app/models/Food.js';
export const updateProductWarehouse = function(orders) {
    const updatePromises = [];
    for(var item of orders.itemList) {
        if (item.food) {
            var food = item.food;
            food.quantity = item.food.quantity - item.quantity
            food.no_sold = food.no_sold + item.quantity
            updatePromises.push(Food.updateOne({_id: food._id}, food))
        } else if (item.coffee) {
            var coffee = item.coffee;
            coffee.quantity = item.coffee.quantity - item.quantity
            coffee.no_sold = coffee.no_sold + item.quantity
            updatePromises.push(Coffee.updateOne({_id: coffee._id}, coffee))
        } else if (item.book) {
            var book = item.book;
            book.quantity = item.book.quantity - item.quantity
            book.no_sold = book.no_sold + item.quantity
            updatePromises.push(Book.updateOne({_id: book._id}, book))
        }
    }
  
    return updatePromises
}