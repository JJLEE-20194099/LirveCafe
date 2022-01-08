export const cal_avg_rating = function(commentList) {
    var avg_rating = 0;
    var cnt = 0
    for(var comment of commentList) {
        if(comment.rating) {
            avg_rating += comment.rating
            cnt += 1
        }
    }
    if (cnt) return  avg_rating / cnt;
    else return avg_rating
}