
var clockDiv = $_1('#clockdiv')
var clockSale = $('#saleClock')

var days = Number(clockDiv.querySelector('.days').innerText)
var hours = Number(clockDiv.querySelector('.hours').innerText)
var minutes = Number(clockDiv.querySelector('.minutes').innerText)
var seconds = Number(clockDiv.querySelector('.seconds').innerText)

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

function initializeClock(id, endtime) {
    const clock = document.getElementById(id);
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
            handleEndSale()
            clearInterval(timeinterval);
        }
    }

    updateClock();
    const timeinterval = setInterval(updateClock, 1000);
}

const deadline = new Date(Date.parse(new Date()) +
    days * 24 * 3600 * 1000 +
    hours * 3600 * 1000 +
    minutes * 60 * 1000 +
    seconds * 1000
);
initializeClock('clockdiv', deadline);


// xử lý khi kết thúc sự kiện
const handleEndSale = () => {
    clockSale.remove()

    foodItems.forEach((item) => {

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