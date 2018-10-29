<template>
<div class="payment">
  <font color="#9ACD32">
    <b>该笔订单支付金额为
      <span style="color:#f00;font-size:50px">{{$route.params.data.order_money}}</span>元</b>
  </font><br/><br/>
  <div align="center">
    <button style="width:210px; height:50px; border-radius: 15px;background-color:#FE6714; border:0px #FE6714 solid; cursor: pointer;  color:white;  font-size:16px;" type="button" @click="callpay">立即支付</button>
  </div>
  <div class="motify"  id="motify">
    <div class="motify-inner" id="motify_content"></div>
  </div>
  </div>
</template>
<script>
import $ from 'jquery'
export default {
  name :'payment',
  data() {
    return {
      order_money:[]
    }
  },
  methods:{
      show_notice: function() {
          $("#motify").show();
          $("#motify_content").html(content);
          setTimeout(function() {
              $('#motify').hide();
          }, 3000);
      },
      //调用微信JS api 支付
      jsApiCall: function() {
          let jsApiParameters = this.$route.params.data.jsApiParameters;
          WeixinJSBridge.invoke('getBrandWCPayRequest', jsApiParameters, function(res) {
              var msg = res.err_msg;
              if (msg == "get_brand_wcpay_request:ok") {
                  this.$router.push({
                            name: 'orderWrap',
                            params: {
                                status: 0
                            }
                        });
              } else {
                  if (msg == "get_brand_wcpay_request:cancel") {
                      var err_msg = "您取消了微信支付";
                  } else if (res.err_code == 3) {
                      var err_msg = "您正在进行跨号支付<br/>正在为您转入扫码支付......";
                  } else if (msg == "get_brand_wcpay_request:fail") {
                      var err_msg = "微信支付失败<br/>错误信息：" + res.err_desc;
                  } else {
                      var err_msg = msg + "<br/>" + res.err_desc;
                  }
                  this.show_notice(err_msg);
              }
          })
      },
  callpay:function() {
      alert(1);
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', this.jsApiCall, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', this.jsApiCall)
                document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall)
            }
        } else {
           this.jsApiCall();
        }
    },
  },
   mounted() {
    this.order_money.push(this.$route.params.data.jsApiParameters);
    sessionStorage.setItem('order_money',this.order_money.join(','))
     if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', '', false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', '');
                document.attachEvent('onWeixinJSBridgeReady', '');
            }
        } else {
        	
        }
   }
  
}
</script>

<style lang="less" scoped>
.motify {
  display: none;
  position: fixed;
  top: 35%;
  left: 50%;
  width: 220px;
  padding: 0;
  margin: 0 0 0 -110px;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  font-size: 14px;
  line-height: 1.5em;
  border-radius: 6px;
  -webkit-box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
}

.motify .motify-inner {
  padding: 10px 10px;
  text-align: center;
  word-wrap: break-word;
}

.motify p {
  margin: 0 0 5px;
}

.motify p:last-of-type {
  margin-bottom: 0;
}
</style>


