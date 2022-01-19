// console.log(foodItems);

foodItems.forEach((item) => {

    var hotSale = item.querySelector('.hotsale')

    if (hotSale) {
        var soldNo = Number(item.querySelector('.hotsale .soldNo').innerText)
        var sumNo = Number(item.querySelector('.hotsale .sumNo').innerText)
        var saleText = item.querySelector('.sale-text')
        var saleMessage;

        var percentSold = soldNo / sumNo * 100

        if (percentSold >= 0 && percentSold <= 5) {
            saleMessage = "Vừa mở bán"
        } else if (percentSold > 5 && percentSold < 90) {
            saleMessage = `Đã bán ${soldNo}`
        } else {
            saleMessage = "Sắp bán hết"
        }
        saleText.innerText = saleMessage;

        var soldProgress = item.querySelector('.dealProgress')

        Object.assign(soldProgress.style, {
            width: `${percentSold}%`
        })
    }
})

drinkItems.forEach((item) => {

    var hotSale = item.querySelector('.hotsale')

    if (hotSale) {
        var soldNo = Number(item.querySelector('.hotsale .soldNo').innerText)
        var sumNo = Number(item.querySelector('.hotsale .sumNo').innerText)
        var saleText = item.querySelector('.sale-text')
        var saleMessage;

        var percentSold = soldNo / sumNo * 100

        if (percentSold >= 0 && percentSold <= 5) {
            saleMessage = "Vừa mở bán"
        } else if (percentSold > 5 && percentSold < 90) {
            saleMessage = `Đã bán ${soldNo}`
        } else {
            saleMessage = "Sắp bán hết"
        }
        saleText.innerText = saleMessage;

        var soldProgress = item.querySelector('.dealProgress')

        Object.assign(soldProgress.style, {
            width: `${percentSold}%`
        })
    }
})

bookItems.forEach((item) => {

    var hotSale = item.querySelector('.hotsale')

    if (hotSale) {
        var soldNo = Number(item.querySelector('.hotsale .soldNo').innerText)
        var sumNo = Number(item.querySelector('.hotsale .sumNo').innerText)
        var saleText = item.querySelector('.sale-text')
        var saleMessage;

        var percentSold = soldNo / sumNo * 100

        if (percentSold >= 0 && percentSold <= 5) {
            saleMessage = "Vừa mở bán"
        } else if (percentSold > 5 && percentSold < 90) {
            saleMessage = `Đã bán ${soldNo}`
        } else {
            saleMessage = "Sắp bán hết"
        }
        saleText.innerText = saleMessage;

        var soldProgress = item.querySelector('.dealProgress')

        Object.assign(soldProgress.style, {
            width: `${percentSold}%`
        })
    }
})
