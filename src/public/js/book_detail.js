
const sliderItems = document.querySelectorAll('.carousel-item')
const prevSliderIcon = $('.carousel-control-prev')
const nextSliderIcon = $('.carousel-control-next')
const bookItems = document.querySelectorAll('#home-books .carousel-item')
const prevbookIcon = $('#home-books .carousel-control-prev')
const nextbookIcon = $('#home-books .carousel-control-next')


if (bookItems.length > 0)
    bookItems[0].classList.add('active')


function prevIconClick(items) {
    var activeIndex;
    var activeE;
    items.forEach(function (item, index) {
        if (item.classList.contains('active')) {
            activeE = item;
        }
    })
    items.forEach(function (item, index) {
        if (item === activeE) {
            activeIndex = index;
        }
    })
    activeE.classList.remove('active');
    if (activeIndex > 0) {
        items[activeIndex - 1].classList.add('active');
    } else {
        items[items.length - 1].classList.add('active');
    }
}

function nextIconClick(items) {
    var activeIndex;
    var activeE;
    items.forEach(function (item, index) {
        if (item.classList.contains('active')) {
            activeE = item;
        }
    })
    items.forEach(function (item, index) {
        if (item === activeE) {
            activeIndex = index;
        }
    })
    activeE.classList.remove('active');
    if (activeIndex < items.length - 1) {
        items[activeIndex + 1].classList.add('active');
    } else {
        items[0].classList.add('active');
    }
}

prevbookIcon.onclick = function () {
    prevIconClick(bookItems);
}
nextbookIcon.onclick = function () {
    nextIconClick(bookItems);
}
// prevdrinkIcon.onclick = function () {
//     prevIconClick(drinkItems);
// }
// nextdrinkIcon.onclick = function () {
//     nextIconClick(drinkItems);
// }