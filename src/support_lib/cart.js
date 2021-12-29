export const calculateRemainingCart = function(orders, cart) {
    const itemListInCart = cart.itemList
    const itemListInOrders = orders.itemList
    const remainingItemList = []

    for (var item of itemListInCart) {
        if (itemListInOrders.filter(function(i) {
            var product = ''
            if (item.book) product = item.book
            else if (item.coffee) product = item.coffee
            else if (item.food) product = item.food

            return product._id.toString() == item._id.toString()

        }).length) {
            continue
        }

        remainingItemList.push(item)
    }
    return remainingItemList

}