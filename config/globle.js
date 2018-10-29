

(function(w) {

    //截取当前访问者的url 参数
    this.split_url = function(name) {
            var url = window.location.href;
            var index = url.indexOf(name);

            if (index === -1) {
                return '';
            }
            var urlParam = url.substring(url.indexOf(name) + 1);

            return urlParam;
        },

        window.getInfo = {
            split_url: this.split_url,
        };



})(window);
//如果下次访问时 时间超出设置时间就清除localStorage
// (function() {
//     var curTime = localStorage.getItem('cur_Time');

//     var time = parseInt(curTime);

//     if (curTime === 'undefined' || curTime === null) {
//         return;
//     }

//     if (new Date().getTime() - time > 172800000) {
//         localStorage.clear();
//     }
// })();

String.prototype.replaceAll = function(str, bystr) {
    var regExp = new RegExp(str, "g");
    return this.replace(regExp, bystr);
}