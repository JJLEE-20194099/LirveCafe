export const getNoNewNotis = function (notis) {
    var cnt = 0
    if (notis) {
        for (var i = 0; i < notis.length; i++) {
            if (notis[i].isRead == 0) cnt++;
        }
    }
    return cnt
}

export const createNotiOrNot = function(users, promos, promo) {
    promos.sort(function (a, b) {
        if (!a.discountAmount)
            a.disCountAmount = 0;
        if (!b.disCountAmount)
            b.disCountAmount = 0;

        if (!a.discountPercentage)
            a.disCountPercentage = 0;
        if (!b.disCountPercentage)
            b.disCountPercentage = 0;

        if (a.discountAmount && b.discountAmount) {
            if (a.discountAmount == b.discountAmount)
                return b.condition - a.condition
            return a.discountAmount - b.discountAmount
        }

        if (a.discountPercentage && b.discountPercentage) {
            if (a.discountPercentage == b.discountPercentage)
                return b.condition - a.condition
            return a.discountPercentage - b.discountPercentage
        }

        if (a.discountPercentage && b.discountAmount)
            return 1;



        return -1;


    })

    var res = []

    for (var user of users) {
        var level = user.level || 0
        const limitPromo = parseInt(level * promos.length / 6)
        var available_promos = promos.slice(0, limitPromo)     
        let check = false
        for (var pro of available_promos) {
            if (pro._id.toString() == promo._id.toString()) {
                check = true
                break
            }
        }
        if (check) res.push(user)

    }
    return res  
}