const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const decreSeat = $('#basic-info .seat-num .decre-btn')
const increSeat = $('#basic-info .seat-num .incre-btn')

const inputSeat = $('#basic-info .seat-num input')

decreSeat.onclick = function () { 
    let a = parseInt(inputSeat.value)
    
    if(a > 1){
        inputSeat.value = a - 1;
    } 
}

increSeat.onclick = function () {
    let a = parseInt(inputSeat.value)
    inputSeat.value = a + 1;

}

inputSeat.onchange = (e) => {

    let a = parseInt(e.target.value)
 
    if(Number.isInteger(a) && a > 0){
        e.target.value = a
    }
    else{
        e.target.value = 1
    }
}

// ----------------------------------------------------------------

const oneDayBtn = $('#basic-info .date-time #one-day') 
const multiDaysBtn = $('#basic-info .date-time #multi-days') 

const oneDayDiv = $('#basic-info .one-day')
const multiDaysDiv = $('#basic-info .multi-days')

oneDayBtn.onchange = function (e) {
    if(e.target.checked) {
        oneDayDiv.classList.add('active')
        multiDaysDiv.classList.remove('active')
    }
}

multiDaysBtn.onchange = function (e) {
    if(e.target.checked) {
        oneDayDiv.classList.remove('active')
        multiDaysDiv.classList.add('active')
    }
}
