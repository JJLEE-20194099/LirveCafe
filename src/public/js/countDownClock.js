// food calculate time
var clockSaleFood = $_1('#saleClockFood')
var clockDivFood = $_1('#saleClockFood .clockdiv')
var end_clock_food = $_1('#saleClockFood .endClock')

var show_book_clock = parseInt($_1("#show_book_clock").value)
var show_food_clock = parseInt($_1("#show_food_clock").value)
var show_drink_clock = parseInt($_1("#show_drink_clock").value)

function getTimeRemaining(endtime) {
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
        total,
        days,
        hours,
        minutes,
        seconds
    };
}

function getTimeRemaining2(total) {
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
        days,
        hours,
        minutes,
        seconds
    };
}

function updateTimeToView(clockForNow, clockDiv) {

    clockDiv.querySelector('.days').innerText = clockForNow.days
    clockDiv.querySelector('.hours').innerText = clockForNow.hours
    clockDiv.querySelector('.minutes').innerText = clockForNow.minutes
    clockDiv.querySelector('.seconds').innerText = clockForNow.seconds
}



if (show_food_clock) {
    var end_clock_food_date = end_clock_food.querySelector('.endDate').innerText
    var end_clock_food_time = end_clock_food.querySelector('.endTime').innerText

    var end_clock_food_parse = Date.parse(`${end_clock_food_date}T${end_clock_food_time}`)

    // thời gian còn lại kể từ thời điểm hiện tại tới lúc hết sự kiện
    var timeRemainingFood = end_clock_food_parse - Date.parse(new Date())

    var clockForFood = getTimeRemaining2(timeRemainingFood)
    updateTimeToView(clockForFood, clockDivFood)
    const deadlineFood = new Date(Date.parse(new Date()) +
        timeRemainingFood
    );
    
initializeClock(clockDivFood, deadlineFood, clockSaleFood, foodItems);
}

if (show_drink_clock) {
    // drink calculate time
    var clockSaleDrink = $_1('#saleClockDrink')
    var clockDivDrink = $_1('#saleClockDrink .clockdiv')
    var end_clock_drink = $_1('#saleClockDrink .endClock')

    var end_clock_drink_date = end_clock_drink.querySelector('.endDate').innerText
    var end_clock_drink_time = end_clock_drink.querySelector('.endTime').innerText

    var end_clock_drink_parse = Date.parse(`${end_clock_drink_date}T${end_clock_drink_time}`)

    // thời gian còn lại kể từ thời điểm hiện tại tới lúc hết sự kiện
    var timeRemainingDrink = end_clock_drink_parse - Date.parse(new Date())
    var clockForDrink = getTimeRemaining2(timeRemainingDrink)
    updateTimeToView(clockForDrink, clockDivDrink)

    const deadlineDrink = new Date(Date.parse(new Date()) +
        timeRemainingDrink
    );
    initializeClock(clockDivDrink, deadlineDrink, clockSaleDrink, drinkItems);
    
}

if (show_book_clock) {

    // book calculate time
    var clockSaleBook = $_1('#saleClockBook')
    var clockDivBook = $_1('#saleClockBook .clockdiv')
    var end_clock_book = $_1('#saleClockBook .endClock')

    var end_clock_book_date = end_clock_book.querySelector('.endDate').innerText
    var end_clock_book_time = end_clock_book.querySelector('.endTime').innerText

    var end_clock_book_parse = Date.parse(`${end_clock_book_date}T${end_clock_book_time}`)

    // thời gian còn lại kể từ thời điểm hiện tại tới lúc hết sự kiện
    var timeRemainingBook = end_clock_book_parse - Date.parse(new Date())
    var clockForBook = getTimeRemaining2(timeRemainingBook)
    updateTimeToView(clockForBook, clockDivBook)
    const deadlineBook = new Date(Date.parse(new Date()) +
        timeRemainingBook
    );
    initializeClock(clockDivBook, deadlineBook, clockSaleBook, bookItems);
}





// khởi tạo đồng hồ
function initializeClock(clock, endtime, clockSale, productItems) {
    // const clock = document.getElementById(selectorClock);
    const daysSpan = clock.querySelector('.days');
    const hoursSpan = clock.querySelector('.hours');
    const minutesSpan = clock.querySelector('.minutes');
    const secondsSpan = clock.querySelector('.seconds');

    function updateClock() {
        const t = getTimeRemaining(endtime);
        daysSpan.innerHTML = t.days;
        hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
        minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
        secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

        if (t.total <= 0) {
            handleEndSale(clockSale, productItems)
            clearInterval(timeinterval);
        }
    }

    updateClock();
    const timeinterval = setInterval(updateClock, 1000);
}

// xử lý khi kết thúc sự kiện 
function handleEndSale(clockSale, productItems) {
    clockSale.remove()

    productItems.forEach((item) => {

        var hotSale = item.querySelector('.hotsale')

        if (hotSale) {
            var saleValue = item.querySelector('.item-price .price-sale-value')
            var realValue = item.querySelector('.item-price .price-real-value')
            var saleDiv = item.querySelector('.hotsale')
            var overSale = item.querySelector('.justOverSale')
            var discount = item.querySelector('.discount-value')
            saleValue.classList.add('gone')
            realValue.classList.remove('gone')
            discount.classList.add('gone')
            overSale.classList.add('active')
            saleDiv.remove()

            setTimeout(() => {
                overSale.classList.remove('active')
            }, 5000)
        }
    })


}
