<template>
  <div>
    <!-- <keep-alive> -->
            <!-- <router-view v-if="$route.meta.keepAlive"></router-view> -->
        <!-- 这里是会被缓存的视图组件 -->
        <!-- </keep-alive> -->
        <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {

    }
  },
    mounted(){
      if(mui){
          mui.init({
              KeyEventBind: {
                  backbutton: true
              }
          })
          var first = null;
          mui.back = function () {
//              var weixin = plus.webview.getWebviewById('whh-weixin')
//              if(weixin){
//                  alert(1)
//                  plus.webview.close(weixin);
//              }
              var wv = plus.webview.getWebviewById('whh-second-wv')
              if(wv){
                  plus.webview.close(wv);
              }else{
                  if (!first) {
                      first = new Date().getTime();  //记录第一次按下返回键的时间
                      mui.toast('再按一次退出应用');
                      history.go(-1);  // 返回上一页
                      setTimeout(function () {
                          first = null;   //一秒后清除按下的时间
                      }, 1000);
                  } else {
                      if (new Date().getTime() - first < 1000) {
                          plus.runtime.quit();  //如果两次按下的时间小于1秒是  退出应用
                      }
                  }
              }
          }
      }
    }
}
</script>
