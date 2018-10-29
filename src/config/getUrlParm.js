function getRequest() {
    var url = window.location.href; //获取url中"?"符后的字串
    
    var theRequest = new Object();
    var index = url.indexOf("?")
    if ( index !== -1) {
        var str = url.substr(index+1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {

            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);

        }
    }
    return theRequest;
}
window.getRequest = getRequest;