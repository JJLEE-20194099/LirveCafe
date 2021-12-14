const $_1 = document.querySelector.bind(document)
const $$_1 = document.querySelectorAll.bind(document)

const decreSeat = $_1('#basic-info .seat-num .decre-btn')
const increSeat = $_1('#basic-info .seat-num .incre-btn')

const inputSeat = $_1('#basic-info .seat-num input')

decreSeat.onclick = function (e) {
    e.preventDefault()
    let a = parseInt(inputSeat.value)

    if (a > 1) {
        inputSeat.value = a - 1;
    }
}

increSeat.onclick = function (e) {
    e.preventDefault()
    let a = parseInt(inputSeat.value)
    inputSeat.value = a + 1;

}

inputSeat.onchange = (e) => {

    let a = parseInt(e.target.value)

    if (Number.isInteger(a) && a > 0) {
        e.target.value = a
    }
    else {
        e.target.value = 1
    }
}

// ----------------------------------------------------------------
var nowTime = function () {

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    var minute = today.getMinutes()
    minute = (minute >= 10) ? minute : '0' + minute
    var time = today.getHours() + ":" + minute

    var dateTime = date + 'T' + time;

    return dateTime
}


const startTimeInput = $_1('#basic-info .start-time input')
const endTimeInput = $_1('#basic-info .end-time input')

startTimeInput.onclick = (e) => {
    dateTime = nowTime()
    e.target.min = dateTime

}

endTimeInput.onclick = (e) => {

    e.target.min = (startTimeInput.value === '') ? nowTime() : startTimeInput.value
}


