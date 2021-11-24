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

function convert(timeString) {
    const start = new Date(timeString).getTime() / 1000;
    var no_year = (end - start) / (60 * 60 * 24 * 365)
    console.log(start, " ", end, " ", no_year)
    var no_month = (end - start) / (60 * 60 * 24 * 30)
    var no_day = (end - start) / (60 * 60 * 24)
    var no_hour = (end - start) / (60 * 60)
    var no_minute = (end - start) / 60
    var no_second = (end - start)

    return getTimeFormat(Math.abs(Math.round(no_year)), Math.abs(Math.round(no_month)), Math.abs(Math.round(no_day)), Math.abs(Math.round(no_hour)), Math.abs(Math.round(no_minute)), Math.abs(Math.round(no_second)))

}

for (var txt of date_txt_list) {
    txt.innerHTML = convert(txt.innerHTML)
}