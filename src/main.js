// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import $ from 'jquery'
import store from './control/index'
import './config/rem'
import './config/rotate';
import './style/base.css'
import 'mint-ui/lib/style.css'
//import 'element-ui/lib/theme-default/index.css'
import MintUI from 'mint-ui'
import moment from 'moment' //转换时间戳
import VueLazyload from 'vue-lazyload'
Vue.filter('moment', function(value, formatString) {
    formatString = formatString || 'YYYY-MM-DD';
    return moment(value).format(formatString);
});
Vue.filter('keepTwoNum', function(value) {
    value = Number(value);
    var b = value.toFixed(3);
    return b.substring(0, b.toString().length - 1)
});
Vue.prototype.msg = function(msg) {
    return msg.replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    msg.replace(/&lt;/g, "<")
    msg.replace(/&gt;/g, ">")
    msg.replace(/&quot;/g, "\"")
    msg.replace(/&#39;/g, "\'");
};
import httpConfig from './httpConfig';
import constant from './config/constant';
import HTTP from './config/HTTP';
Vue.prototype.$HTTP = HTTP;
Vue.prototype.$constant = constant;
Vue.prototype.$httpConfig = httpConfig;
    // import { Spinner } from 'mint-ui'
import '../config/globle.js' //常量
const WX_URL = 'http://wx.shopsn.cn',
    load_wrap = true;
Vue.config.productionTip = false;
axios.defaults.withCredentials = true; //让ajax携带cookie
Vue.prototype.axios = axios;
Vue.prototype.URL = window.URL;
Vue.prototype.IMG_URL = window.IMG_URL;
Vue.prototype.WX_URL = WX_URL;
// Vue.prototype.load_wrap = load_wrap;


// Element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: 'http://www.dehong.gov.cn/statics/images/loading.gif',
    loading: 'http://www.dehong.gov.cn/statics/images/loading.gif',
    attempt: 1
})

Vue.use(MintUI);
// import { Indicator } from 'mint-ui';
Vue.directive('title', {
    inserted: function(el, binding) {
        document.title = el.innerText
        el.remove()
    }
});
Vue.directive('img', {
    inserted: function(el, bindimg) {
        let color = Math.floor(Math.random() * 1000000);
        ek.style.backgroundColor = "#" + color;

        let img = new Image();
        img.src = binding.value;
        img.onload = function() {
            el.style.backgroundImage = `url${binding.value}`
        }
    }
});

router.beforeEach((to, from, next) => {
    // Indicator.open('初始化...');
    switch (to.name) {
        case 'KOhome':
            sessionStorage.setItem('router_index', 101);
            break;
        case 'KOlist':
            sessionStorage.setItem('router_index', 102);
            break;
        case 'KOperson':
            sessionStorage.setItem('router_index', 104);
            break;
        case 'home':
            {
                sessionStorage.setItem('router_index', 0);
                document.title = "首页";
            }
            break;
        case 'class':
            sessionStorage.setItem('router_index', 1);
            break;
        case 'Cart':
            sessionStorage.setItem('router_index', 2);
            break;
        case 'person':
            sessionStorage.setItem('router_index', 3);
            break;
    };
    next();
});
//router.beforeEach((to, from, next) => {
//if(to.path == '/author' && store.state.user.id){
//  // 用户使用后退返回到授权页，则默认回到首页
//  next('/index')
//  return false
//}
//if((!holdno.cookie.get('user') || !store.state.user.id) && to.path != '/author'){
//  // 第一次进入项目
//  holdno.cookie.set('beforeLoginUrl', to.fullPath) // 保存用户进入的url
//  next('/author')
//  return false
//}else if(!store.state.user.id && to.path != '/author'){
//  // 之前有获取过授权
//  next('/author')
//  return false
//}
//next()
//})

// router.afterEach(router => {
//     setTimeout(function() {
//         Indicator.close();
//     }, 100)
// });

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})