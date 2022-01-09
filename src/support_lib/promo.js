export const checkNumberOfUsesLimit = function(orders, promo) {
    var limit = promo.limitEachDay
    var today = new Date()
    var today_date = today.getDate()
    var today_month = today.getMonth()
    var today_year = today.getFullYear()
    var res = 0
    for (var order of orders) {
        var date = new Date(order.createdAt).getDate()
        var month = new Date(order.createdAt).getMonth()
        var year = new Date(order.createdAt).getFullYear()
        if (date == today_date && month == today_month && year == today_year) res++;
    } 
    if (res >= parseInt(limit)) return true;
    return false;
    
       
}