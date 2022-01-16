
import Book from '../app/models/Book.js';
import Food from '../app/models/Food.js';
import Coffee from '../app/models/Coffee.js';
import {
    singleMongooseDocumentToObject
} from './mongoose.js'

export const getProduct = function (data) {
    const fdrPromises = [];
    const quantity_list = [];
    const id_list = [];
    for(var i = 0; i < data.foods.length; i++) {
        
        let food = data.foods[i]
        let id = food.food_id;
        let quantity = parseInt(food.quantity);
        quantity_list.push(quantity);
        id_list.push(id)
        fdrPromises.push(() => Food.findById(id))
    }

    for(var j = 0; j < data.drinks.length; j++) {
        let drink = data.drinks[j]
        let id = drink.drink_id;
        let quantity = parseInt(drink.quantity);
        quantity_list.push(quantity);
        id_list.push(id)
        fdrPromises.push(() => Coffee.findById(id))
        
    }



    return [fdrPromises, quantity_list, id_list]
}