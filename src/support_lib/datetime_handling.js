var date_txt_list = document.getElementsByClassName('date');

const end = Date.now() / 1000;

function getTimeFormat(year, month, day, hour, minute, second) {
    if (year > 0)
        return year + " năm trước"
    if (month > 0)
        return month + " tháng trước"

    if (day > 0)
        return day + " ngày trước"

    if (hour > 0)
        return hour + " giờ trước"
    if (minute > 0)
        return minute + " phút trước"
    if (second > 30)
        return second + " giây trước"
    return "Vài giây trước"
}

export const convert =  function(timeString) {
    const start = new Date(timeString).getTime() / 1000;
    var no_year = (end - start) / (60 * 60 * 24 * 365)
    var no_month = (end - start) / (60 * 60 * 24 * 30)
    var no_day = (end - start) / (60 * 60 * 24)
    var no_hour = (end - start) / (60 * 60)
    var no_minute = (end - start) / 60
    var no_second = (end - start)

    return getTimeFormat(Math.abs(Math.round(no_year)), Math.abs(Math.round(no_month)), Math.abs(Math.round(no_day)), Math.abs(Math.round(no_hour)), Math.abs(Math.round(no_minute)), Math.abs(Math.round(no_second)))

}

var localdate_txt_list = document.getElementsByClassName('local-date');


for (var txt of date_txt_list) {
    txt.innerHTML = convert(txt.innerHTML)
}


function getDateByLocalDate(timString) {
    var datum = Date.parse(strDate);
    var date = new Date(datum)
    return date.ustomFormat( "#DD#/#MM#/#YYYY#" )
}


for (var local_txt of localdate_txt_list) {
    local_txt.innerHTML = getDateByLocalDate(local_txt.innerHTML)
}