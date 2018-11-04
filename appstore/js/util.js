function Comget(url, paramdata, successfun, errorfun) {
	$.ajax(url, {
		dataType: 'json',
		data: {
			params: JSON.stringify(paramdata)
		},
		type: 'get',
		timeout: 10000,
		success: function(data) {
			if(data.flag == 0) {
				if(typeof successfun == 'function') {
					successfun(data.data)
				} else {
					alert('调用网路请求语法有误')
				}
				//console.log('参数' + data.params)
			} else {
				if(typeof errorfun == 'function') {
					errorfun(data.desc)
				} else {
					alert(data.desc);
				}
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(type);
			if(type == 'timeout') {
				alert('网络繁忙，稍后再试');
			} else {
				alert('查询失败')
			}
		}
	});
};
function Compost(url,paramdata,successfun,errorfun){
	            $.ajax(url, {
				dataType: 'json',
				data:{params : JSON.stringify(paramdata)},
				type: 'post',
				timeout: 10000,
				success: function(data){
					if(data.flag == 0){
						successfun(data.data)
					}else{
						if(typeof errorfun == 'function'){
							errorfun(data.desc)
						}else{
							alert(data.desc);
						}
					}
				},
				error: function(xhr, type, errorThrown) {
					console.log(type);
					if(type =='timeout'){
						alert('网络繁忙，稍后再试');
					}else{
						alert('查询失败')
					}
				}
			});
       };
function GetRequest() {
	var url = location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
		}
	}
	console.log(theRequest)
	return theRequest;
}
function unique(arr,key) {
	var result = [], hash = {};
	for (var i = 0, elem; (elem = arr[i]) != undefined; i++) {
	    if (!hash[elem[key]]) {
	        result.push(elem);
	        hash[elem[key]] = true;
	    }
	}
	return result;
}
function isJson(str) {
	try{
		var obj = JSON.parse(str);
	}catch(e){
		return false;
	}
	return true;
}
//页面跳转
function locationHref(that) {
    if($(that).attr('dataurl')=='null'){
        alert('下载地址异常！')
    }else if(yonyou.browser.versions.microMessenger){
        $('body').append('<div onclick="$(this).hide();"> <div class="weixin-modal" id="weixinModal"></div><img class="img-weixin-tip" src="./img/live_weixin.png" alt="weixin提示"></div>')
	}else {
		location.href=$(that).attr('dataurl');
	}
}

var yonyou = yonyou || {};
yonyou.browser = {
    versions: function() {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {//移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
			mobile: !!u.match(/AppleWebKit.*Mobile/) || !!u.match(/Windows Phone/) || !!u.match(/Android/) || !!u.match(/MQQBrowser/), //是否为移动终端
			mQQBrowser: !!u.match(/MQQBrowser/), //是否为QQ
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            microMessenger: u.indexOf('MicroMessenger') > -1,	//是否为微信内置浏览器
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}

yonyou.pageHight = (function(){
    return document.body.scrollHeight;
});

yonyou.pageWidth = (function(){
    return document.body.scrollWidth;
});

// mobile orient
yonyou.orient = (function() {
    var flag;
    if (window.orientation == 90 || window.orientation == -90)
        flag = false;
    else if (window.orientation == 0 || window.orientation == 180)
        flag = true;
    return flag;
});


