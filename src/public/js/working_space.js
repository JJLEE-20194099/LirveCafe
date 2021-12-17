// handle confirm food-drink
const confirmFodr = $_1('#working-space .food-drink-confirm input[type=checkbox]')
const fodrSession = $_1('#working-space #food-drink-order')

confirmFodr.onchange = function (e) {
    if (e.target.checked) {
        fodrSession.classList.add('active')
    } else {
        fodrSession.classList.remove('active')
    }
}

//  pick foods and drinks
const fodrBtns = $$_1('#food-drink-order #ordering-nav .nav-item')

const foodBtn = $_1('#working-space #food-drink-order #food-btn')
const drinkBtn = $_1('#working-space #food-drink-order #drink-btn')

const divFoodList = $_1('#food-drink-order #ws-food-scroll')
const divDrinkList = $_1('#food-drink-order #ws-drink-scroll')
let activeFodrBtn = $_1('#food-drink-order #ordering-nav .nav-item.active')

let totalMoney = $_1('#ordered .fodr-total  span')

foodBtn.onclick = () => {
    activeFodrBtn = $_1('#food-drink-order #ordering-nav .nav-item.active')

    if (activeFodrBtn !== foodBtn) {
        activeFodrBtn.classList.remove('active')
        foodBtn.classList.add('active')

        divDrinkList.classList.remove('active')
        divFoodList.classList.add('active')
    }
}

drinkBtn.onclick = () => {

    activeFodrBtn = $_1('#food-drink-order #ordering-nav .nav-item.active')

    if (activeFodrBtn !== drinkBtn) {
        activeFodrBtn.classList.remove('active')
        drinkBtn.classList.add('active')

        divFoodList.classList.remove('active')
        divDrinkList.classList.add('active')
    }
}

const foodOrderingItems = $$_1("#food-drink-order #ws-food-scroll .fodr-item")
const drinkOrderingItems = $$_1("#food-drink-order #ws-drink-scroll .fodr-item")

let foodOrderedList = $_1('#food-drink-order #ordered #food-ordered')
let foodOrderedItems = $$_1('#food-drink-order #ordered #food-ordered .fodr-item')

let drinkOrderedList = $_1('#food-drink-order #ordered #drink-ordered')
let drinkOrderedItems = $$_1('#food-drink-order #ordered #drink-ordered .fodr-item')


// reset total money 

const resetTotalMoney = function () {
    let allOrderedRealItems = $$_1('#food-drink-order #ordered .fodr-item.active')
    let total = 0;
    allOrderedRealItems.forEach((item) => {
        total += parseInt(item.querySelector('.fodr-cost span').innerText.replaceAll('.', ''))
    })

    totalMoney.innerText = (new Intl.NumberFormat().format(total))

}


// handle add and remove food
foodOrderingItems.forEach((item, index) => {

    let input = item.querySelector("input")
    input.onchange = (e) => {

        const valueItem = parseInt(item.querySelector('.fodr-cost span').innerText.replaceAll('.', ''))
        if (e.target.checked === true) {
            foodOrderedItems[index].classList.add('active')
            resetTotalMoney()
        } else {
            foodOrderedItems[index].classList.remove('active')
            resetTotalMoney()
        }
    }
})

// handle add and remove drink
drinkOrderingItems.forEach((item, index) => {

    let input = item.querySelector("input")
    input.onchange = (e) => {
        const valueItem = parseInt(item.querySelector('.fodr-cost span').innerText.replaceAll('.', ''))
        if (e.target.checked === true) {
            drinkOrderedItems[index].classList.add('active')
            resetTotalMoney()
        } else {
            drinkOrderedItems[index].classList.remove('active')
            resetTotalMoney()
        }
    }
})

// toàn bộ các sản phẩm bên đã chọn, kể cả sản phẩm ko hiện lên (display :none) 
const allOrderedItems = $$_1('#food-drink-order #ordered .fodr-item')

// toàn bộ các sản phẩm bên đã chọn thực (được hiện lên)
let allOrderedRealItems = $$_1('#food-drink-order #ordered .fodr-item.active')


const resetValue = function (baseValue, number) {
    a = baseValue * number
    // return(new Intl.NumberFormat().format(a))
    return a;
}


// render picked item
allOrderedItems.forEach((item, index) => {
    const decreBtn = item.querySelector('#decre-btn')
    const increBtn = item.querySelector('#incre-btn')
    const input = item.querySelector('input')
    const costSpan = item.querySelector('.fodr-cost span')
    const baseValue = parseInt(costSpan.innerText.replaceAll('.', ''))
    const noFood = foodOrderedItems.length

    let oldValue = 0;

    decreBtn.onclick = function (e) {
        e.preventDefault()
        let a = parseInt(input.value)

        if (a > 1) {
            input.value = a - 1;
            costSpan.innerText = resetValue(baseValue, a - 1)
        } else {
            if (index < noFood) {
                foodOrderingItems[index].querySelector('input').checked = false
            } else {
                drinkOrderingItems[index - noFood].querySelector('input').checked = false
            }
            item.classList.remove('active')
        }
        resetTotalMoney()
    }

    increBtn.onclick = function (e) {
        e.preventDefault()
        let a = parseInt(input.value)
        input.value = a + 1;
        costSpan.innerText = resetValue(baseValue, a + 1)

        resetTotalMoney()

    }

    input.onfocus = (e) => {
        oldValue = e.target.value
    }

    input.onchange = (e) => {

        let a = parseInt(e.target.value)

        e.target.value = a

        if (Number.isInteger(a) && a > 0) {
            costSpan.innerText = resetValue(baseValue, a)
        } else {
            input.value = 1
            costSpan.innerText = resetValue(baseValue, 1)
        }
        resetTotalMoney()
    }

})

// const submitBtn = $_1('#working-space .submit-order button')


$_1('#working-space .submit-order button').onclick = function (e) {

    var check = {
        username: $_1('#username').value,
        email: $_1('#basic-info .email input').value,
        eventBooker: $_1('#basic-info .name input').value,
        title: $_1('#basic-info .event-title input').value,
        no_seating: $_1('#basic-info .seat-num input').value,
        phone: $_1('.phoneNum input').value,
        description: $_1('#basic-info .description textarea').value,
        eventStartDate: $_1('#basic-info .start-time input').value.substring(0, 10),
        eventStartTime: $_1('#basic-info .start-time input').value.substring(11, 17),
        eventEndDate: $_1('#basic-info .end-time input ').value.substring(0, 10),
        eventEndTime: $_1('#basic-info .end-time input ').value.substring(11, 17),
    }

    if (check.username && check.email && check.eventBooker && check.title &&
        check.no_seating && check.phone && check.eventEndDate && check.eventStartDate &&
        check.eventStartTime && check.eventEndTime) {
        e.preventDefault();
        var allOrderedRealItems_food = $$_1('#food-ordered .fodr-item.active')
        var allOrderedRealItems_drink = $$_1('#drink-ordered .fodr-item.active')
        var foods = [];
        var drinks = [];


        allOrderedRealItems_food.forEach((item) => {
            let a = {
                food_id: item.querySelector('.fodr-id span').innerText,
                quantity: item.querySelector('.fodr-number input').value
            }
            foods.push(a)

        })

        allOrderedRealItems_drink.forEach((item) => {
            let a = {
                drink_id: item.querySelector('.fodr-id span').innerText,
                quantity: item.querySelector('.fodr-number input').value
            }
            drinks.push(a)

        })

        const dataWS = {
            username: $_1('#username').value,
            email: $_1('#basic-info .email input').value,
            eventBooker: $_1('#basic-info .name input').value,
            title: $_1('#basic-info .event-title input').value,
            no_seating: $_1('#basic-info .seat-num input').value,
            image: $_1('#basic-info .image input').value,
            phone: $_1('.phoneNum input').value,
            description: $_1('#basic-info .description textarea').value,
            eventStartDate: $_1('#basic-info .start-time input').value.substring(0, 10),
            eventStartTime: $_1('#basic-info .start-time input').value.substring(11, 17),
            eventEndDate: $_1('#basic-info .end-time input ').value.substring(0, 10),
            eventEndTime: $_1('#basic-info .end-time input ').value.substring(11, 17),
            foods: foods,
            drinks: drinks,
            total: parseInt(parseInt($_1('#ordered .fodr-total span').innerText.replaceAll('.', '')) * 1000)
        }


        $(document).ready(function () {
            $.ajax({
                url: "/workingspaces/save",
                method: "POST",
                data: dataWS,
                success: function (res) {
                    console.log(res)
                }
            })
        })


    }


}