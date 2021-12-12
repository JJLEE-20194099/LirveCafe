

// handle confirm food-drink
const confirmFodr = $('#working-space .food-drink-confirm input[type=checkbox]')
const fodrSession = $('#working-space #food-drink-order')

confirmFodr.onchange = function (e) {
    if(e.target.checked){
        fodrSession.classList.add('active')
    }
    else {
        fodrSession.classList.remove('active')
    }
}

//  pick foods and drinks
const fodrBtns = $$('#food-drink-order #ordering-nav .nav-item')

const foodBtn = $('#working-space #food-drink-order #food-btn')
const drinkBtn = $('#working-space #food-drink-order #drink-btn')

const divFoodList = $('#food-drink-order #ws-food-scroll')
const divDrinkList = $('#food-drink-order #ws-drink-scroll')
let activeFodrBtn = $('#food-drink-order #ordering-nav .nav-item.active')

let totalMoney = $('#ordered .fodr-total  span')

foodBtn.onclick = () => {
    activeFodrBtn = $('#food-drink-order #ordering-nav .nav-item.active')

    if(activeFodrBtn !== foodBtn){
        activeFodrBtn.classList.remove('active')
        foodBtn.classList.add('active')

        divDrinkList.classList.remove('active')
        divFoodList.classList.add('active')
    }
}

drinkBtn.onclick = () => {

    activeFodrBtn = $('#food-drink-order #ordering-nav .nav-item.active')

    if(activeFodrBtn !== drinkBtn){
        activeFodrBtn.classList.remove('active')
        drinkBtn.classList.add('active')

        divFoodList.classList.remove('active')
        divDrinkList.classList.add('active')
    }
}

const foodOrderingItems = $$("#food-drink-order #ws-food-scroll .fodr-item")
const drinkOrderingItems = $$("#food-drink-order #ws-drink-scroll .fodr-item")

let foodOrderedList = $('#food-drink-order #ordered #food-ordered') 
let foodOrderedItems = $$('#food-drink-order #ordered #food-ordered .fodr-item')

let drinkOrderedList = $('#food-drink-order #ordered #drink-ordered') 
let drinkOrderedItems = $$('#food-drink-order #ordered #drink-ordered .fodr-item')


// reset total money 

const resetTotalMoney = function () {
    let allOrderedRealItems = $$('#food-drink-order #ordered .fodr-item.active')
    let total = 0;
    allOrderedRealItems.forEach((item) => {
        total += parseInt(item.querySelector('.fodr-cost span').innerText.replaceAll('.',''))
    })

    totalMoney.innerText = (new Intl.NumberFormat().format(total))

}


// handle add and remove food
foodOrderingItems.forEach((item, index) => {

    let input = item.querySelector("input")
    input.onchange = (e) => {
        
        const valueItem = parseInt(item.querySelector('.fodr-cost span').innerText.replaceAll('.',''))
        if(e.target.checked === true){
            foodOrderedItems[index].classList.add('active')
            resetTotalMoney()
        }
        else{
            foodOrderedItems[index].classList.remove('active')
            resetTotalMoney()
        }
    }
})

// handle add and remove drink
drinkOrderingItems.forEach((item, index) => {
    
    let input = item.querySelector("input")
    input.onchange = (e) => {
        const valueItem = parseInt(item.querySelector('.fodr-cost span').innerText.replaceAll('.',''))
        if(e.target.checked === true){
            drinkOrderedItems[index].classList.add('active')
            resetTotalMoney()
        }
        else{
            drinkOrderedItems[index].classList.remove('active')
            resetTotalMoney()
        }
    }
})

// toàn bộ các sản phẩm bên đã chọn, kể cả sản phẩm ko hiện lên (display :none) 
const allOrderedItems = $$('#food-drink-order #ordered .fodr-item')

// toàn bộ các sản phẩm bên đã chọn thực (được hiện lên)
let allOrderedRealItems = $$('#food-drink-order #ordered .fodr-item.active')


const resetValue = function(baseValue, number){
    a = baseValue*number
    return(new Intl.NumberFormat().format(a))
}

// render picked item
allOrderedItems.forEach((item, index) => {
    const decreBtn = item.querySelector('#decre-btn')
    const increBtn = item.querySelector('#incre-btn')
    const input = item.querySelector('input')
    const costSpan = item.querySelector('.fodr-cost span')
    const baseValue = parseInt(costSpan.innerText.replaceAll('.',''))
    let oldValue = 0;

    decreBtn.onclick = function (e) { 
        e.preventDefault()
        let a = parseInt(input.value)
        
        if(a > 1){
            input.value = a - 1;
            costSpan.innerText = resetValue(baseValue, a-1)

            resetTotalMoney()
        } 
    }

    increBtn.onclick = function (e) {
        e.preventDefault()
        let a = parseInt(input.value)
        input.value = a + 1;
        costSpan.innerText  = resetValue(baseValue, a+1)

        resetTotalMoney()

    }

    input.onfocus = (e) => {
        oldValue = e.target.value
    }

    input.onchange = (e) => {

        let a = parseInt(e.target.value)

        e.target.value = a
        
        if(Number.isInteger(a) && a > 0){
            costSpan.innerText = resetValue(baseValue, a)
        }
        else{
            input.value = 1
            costSpan.innerText = resetValue(baseValue, 1)
        }
        resetTotalMoney()
    }

})


 



