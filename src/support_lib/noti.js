export const getNoNewNotis = function(notis) {
    var cnt = 0
    if (notis) {
        for (var i = 0; i < notis.length; i++) {
            if (notis[i].isRead == 0) cnt++;
        }
    }
    return cnt
}