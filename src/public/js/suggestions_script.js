// getting all required elements
const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom-box");
let linkTag = searchWrapper.querySelector("a");
let webLink;

// inputBox.onfocus = ()=>{
//     if (inputBox.value.length==0){
//         icon.onclick = ()=>{
//             webLink = `https://www.google.com/search?q=${userData}`;
//             linkTag.setAttribute("href", webLink);
//             linkTag.click();
//         }
//         emptyArray = default_suggestions
//         emptyArray = emptyArray.map((data)=>{
//             // passing return data inside li tag
//             return data = `<li>${data}</li>`;
//         });
//         searchWrapper.classList.add("active"); //show autocomplete box
//         showSuggestions(emptyArray);
//         let allList = suggBox.querySelectorAll("li");
//         for (let i = 0; i < allList.length; i++) {
//             //adding onclick attribute in all li tag
//             allList[i].setAttribute("onclick", "select(this)");
//         }
//     }
// }

// inputBox.onblur = () => {
//     console.log(document.activeElement.tagName)
//     if (!("LI"==document.activeElement.tagName)){
//         searchWrapper.classList.remove("active")
//     }
// }

//if user press any key and release

function removeAccents(str) {
    var AccentsMap = [
        "aàảãáạăằẳẵắặâầẩẫấậ",
        "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
        "dđ", "DĐ",
        "eèẻẽéẹêềểễếệ",
        "EÈẺẼÉẸÊỀỂỄẾỆ",
        "iìỉĩíị",
        "IÌỈĨÍỊ",
        "oòỏõóọôồổỗốộơờởỡớợ",
        "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
        "uùủũúụưừửữứự",
        "UÙỦŨÚỤƯỪỬỮỨỰ",
        "yỳỷỹýỵ",
        "YỲỶỸÝỴ"
    ];
    for (var i = 0; i < AccentsMap.length; i++) {
        var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
        var char = AccentsMap[i][0];
        str = str.replace(re, char);
    }
    return str;
}


inputBox.onkeyup = (e) => {
    var userData = e.target.value; //user enetered data
    var emptyArray = [];
    var food_filter = [];
    var coffee_filter = [];
    var books_filter = [];
    var no_food = 0;
    var no_coffee = 0;
    var no_books = 0;


    if (userData) {

        food_filter = suggestions.food.filter((data) => {
            return removeAccents(data.name.toLocaleLowerCase() + " " + data.description.toLocaleLowerCase()).includes(removeAccents(userData.toLocaleLowerCase()));
        })
        no_food = food_filter.length

        coffee_filter = suggestions.coffee.filter((data) => {
            return removeAccents(data.name.toLocaleLowerCase() + " " + data.description.toLocaleLowerCase()).includes(removeAccents(userData.toLocaleLowerCase()));
        })
        no_coffee = coffee_filter.length

        books_filter = suggestions.books.filter((data) => {
            return removeAccents(data.title.toLocaleLowerCase() + " " + data.author.toLocaleLowerCase() + " " + data.description.toLocaleLowerCase()).includes(removeAccents(userData.toLocaleLowerCase()));
        })
        no_books = books_filter.length

        emptyArray = emptyArray.concat(food_filter, coffee_filter, books_filter)

        let res = []

        for (var j = 0; j < emptyArray.length; j++) {
            if (j < no_food) {
                res.push(`<li style="display: flex; align-items: center; justify-content: flex-start"><img style="border-radius: 50%; margin-right: 8px; width: 50px; height: 50px;" src="${emptyArray[j].image}"></img><a href="/food/${emptyArray[j].slug}">${emptyArray[j].name}</a></li>`)
                continue
            }
            if (j < no_coffee + no_food) {
                res.push(`<li style="display: flex; align-items: center; justify-content: flex-start"><img style="border-radius: 50%; margin-right: 8px; width: 50px; height: 50px;" src="${emptyArray[j].image}"></img><a href="/coffee/${emptyArray[j].slug}">${emptyArray[j].name}</a></li>`)
                continue
            }
            if (j < no_coffee + no_food + no_books) {
                res.push(`<li style="display: flex; align-items: center; justify-content: flex-start"><img style="border-radius: 50%; margin-right: 8px; width: 50px; height: 50px;" src="${emptyArray[j].image}"></img><a href="/books/${emptyArray[j].slug}">${emptyArray[j].title  }</a></li>`)
                continue
            }
        }
        emptyArray = res
        searchWrapper.classList.add("active"); //show autocomplete box
        showSuggestions(emptyArray);
        let allList = suggBox.querySelectorAll("li");
        for (let i = 0; i < allList.length; i++) {
            //adding onclick attribute in all li tag
            allList[i].setAttribute("onclick", "select(this)");
        }
    } else {

        let default_suggestions = [
            "Nước uống hấp dẫn",
            "Đồ ăn ngon",
            "Sách hay"
        ]

        if (inputBox.value.length == 0) {
            suggBox.innerHTML = '';
            emptyArray = default_suggestions
            var drink_ele = `<li><a href="/coffee/list">${emptyArray[0]}</a></li>`
            var food_ele = `<li><a href="/food/list">${emptyArray[1]}</a></li>`
            var book_ele = `<li><a href="/books/list">${emptyArray[2]}</a></li>`
            emptyArray[0] = drink_ele
            emptyArray[1] = food_ele
            emptyArray[2] = book_ele
            console.log("hahaha", default_suggestions, emptyArray);

            searchWrapper.classList.add("active");
            showSuggestions(emptyArray);
            let allList = suggBox.querySelectorAll("li");
            for (let i = 0; i < allList.length; i++) {
                //adding onclick attribute in all li tag
                allList[i].setAttribute("onclick", "select(this)");
            }
        }
        // searchWrapper.classList.remove("active"); //hide autocomplete box  
    }
}

function select(element) {
    let selectData = element.textContent;
    inputBox.value = selectData;
    searchWrapper.classList.remove("active");
}

function showSuggestions(list) {
    let listData;
    if (!list.length) {
        userValue = inputBox.value;
        listData = `<li>${userValue}</li>`;
    } else {
        listData = list.join('');
    }
    suggBox.innerHTML = listData;
    console.log(suggBox.innerHTML)
}