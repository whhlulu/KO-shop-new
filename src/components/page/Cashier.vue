<template>
    <div class="cashier">
        <div v-title :data-title="title">{{title}}</div>
        <cashier-header :text="title" :btn="btn"></cashier-header>
        <div class="payment-wrap" v-if="$route.params.id != 3">
            <div class="status">
                <div class="pull-left fl">订单金额</div>
                <div class="pull-right fr">
                    <span>{{$store.state.price}}</span>元</div>
            </div>
        </div>
        <div class="payment-wrap" v-if="$route.params.id == 3">
            <div class="status">
                <div class="pull-left fl">需付积分</div>
                <div class="pull-right fr">
                    <span>{{$store.state.price}}</span>积分</div>
            </div>
        </div>
        <div class="choice" @click="theChecked" v-if="$route.params.id != 3">
            <input type="radio" class="radio-input" value="使用账户余额" :checked="disabled">
            <span class="radio-core"></span>
            <span class="radio-label">使用账户余额
                <span class="span-main">(当前余额：
                    <span>{{my_wallet.balance || 0}}</span>元)</span>
            </span>
        </div>
        <div class="choice" @click="theChecked" v-if="$route.params.id == 3">
            <span class="radio-label">扣除账户积分 -{{$store.state.price}}
                <span class="span-main">（当前积分:
                    <span>{{data.sum || 0}}</span> 积分）</span>
            </span>
        </div>
        <btn :text="text" :bt="this.disabled"></btn>
        <dl class="other" v-if="$route.params.id != 3">
            <dt>其他支付方式</dt>
            <dd   v-if="zfb_notes" class="clearfix" @click="zfb">
                <img src="../../assets/alipay.jpg" class="fl">
                <div class="fl pull-right">
                    <h6 class="title">支付宝支付</h6>
                    <p class="con">支付宝安全支付</p>
                </div>
                <span class="icon"></span>
            </dd>

            <dd  v-if="wx_notes" class="clearfix" @click="wxPay">
                    <img src="../../assets/wx.jpg" class="fl" >
                    <div class="fl pull-right">
                        <h6 class="title">微信支付</h6>
                        <p class="con">微信安全支付</p>
                    </div>
                    <span class="icon"></span>
                </dd>
        </dl>
        <Shopsn></Shopsn>
        <div class="load" v-show="load" @touchmove.prevent>
            <mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner>
        </div>
    </div>
</template>
<script>
import btn from '@/components/Widget/maxBtn.vue';
import cashierHeader from './children/header.vue';
import Shopsn from '@/components/page/Shopsn.vue';
import qs from 'qs';
export default {
    name: 'cashier',
    data() {
        return {
            title: 'shopsn收银台',
            text: '立即支付',
            btn: '订单中心',
            scrollWatch: true,
            disabled: false,
            load: false,
            my_wallet:'',
            data:'',
            zfb_notes:true,
            wx_notes:false
        }
    },
    methods: {
        theChecked() {
            this.disabled = true;
        },
        zfb() {

            this.load = true;
            this.axios({//支付宝支付
                url: API_URL + 'Home/AlipayMobile/PayInfo',
                method: 'get',
                params: {
                    order_id: this.$store.state.order_number
                }
            }).then((res) => {
                const oDiv = document.createElement('div');
                oDiv.innerHTML = res.data;
                document.body.appendChild(oDiv);
                document.forms.alipaysubmit.submit();
                this.load = false;
            }).catch((err) => {
                console.log(err);
            });
        },
        wxPay(){
             if(this.client_type == 2){
                this.wx2();
             }else{
                this.wx();
             }
        },
        wx2(){//微信APP支付
            var that = this;
            console.log(111)
            let  user_id=sessionStorage.getItem('user_ID');
            plus.payment.getChannels(function(channels){
                for(var i = 0;i<channels.length;i++){
                    var channel = channels[i];
                    if(channel.id == 'wxpay'){
                        var xhr=new XMLHttpRequest();
                        xhr.onreadystatechange=function(){
                            switch(xhr.readyState){
                                case 4:
                                if(xhr.status==200){
                                    var order=xhr.responseText;
                                    plus.payment.request(channel,order,function(result){
                                        plus.nativeUI.alert('支付成功',function(){
                                             // window.location.href= "http://www.2tianqc.com/mobile/#/getInfo?data_token="+user_id;
                                             that.$router.push({
                                                    name:'wxapppay',
                                                    params:{
                                                        userId:user_id
                                                }
                                            })
                                        },'2天聚清');
                                    },function(e){
                                        plus.nativeUI.alert('支付失败！', null, '支付失败！');
                                    });
                                }else{
                                    plus.nativeUI.alert('获取订单信息失败！', null, '2天聚清');
                                }
                                break;
                                default:
                                break;
                            }
                        }
                        xhr.open('GET',API_URL + 'Home/Pay/wxpay?order_id='+that.$store.state.order_number);
                        xhr.send();
                        return;
                    }
                }
            })
        },
        wx() {
            let  user_id=sessionStorage.getItem('user_ID');
            let ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                //微信公众号支付 
                this.load = true;
                this.axios.post(API_URL + 'home/WxJsPay/getJsApiData',qs.stringify({
                    user_id:sessionStorage.getItem('user_ID'),
                    order_id: this.$store.state.order_number
                })).then((res) => {
                    if(res.data.status == 1){
                        this.$router.push({
                        name:'payment',
                        params:{
                            data:res.data
                        }
                    });
                    }else{
                        alert("网络错误");
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }else{
                this.load = true;
                this.axios({//h5微信支付
                    url: API_URL +'/home/Wxh5Pay/wxh5pay',
                    method: 'get',
                    params: {
                        order_id: this.$store.state.order_number
                    }
                }).then((res) => {
                    var url = res.data.data;
                    window.location.href=url;
                    this.load = false;   
                }).catch((err) => {
                    console.log(err);
                });
            }
            
        },
    },
    mounted() {      
        document.body.scrollTop = 0;
        if (this.$route.params.id == 3) {
            this.axios.post(API_URL + 'Home/Integral/integral', qs.stringify({
                app_user_id: sessionStorage.getItem('user_ID')
            })).then((res) => {
                this.data = res.data.data;
            }).catch((err) => {
                console.log(err);
            });
            return;
        }
        let ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            this.wx_notes=true
            this.zfb_notes=false
        } else {
            this.wx_notes=false;
            this.zfb_notes=true
        }
        this.axios.post(API_URL + 'Home/Pcenter/my_wallet',qs.stringify({
                app_user_id:sessionStorage.getItem('user_ID'),
            })).then((res) => {
                this.my_wallet = res.data.data;
            }).catch((err) => {
                console.log(err)
            });
    },
    destroyed() {
        this.scrollWatch = false;
    },
    components: {
        cashierHeader,
        btn,
        Shopsn
    }
}
</script>
<style lang="less" scoped>
.cashier {
    background: #fff;
}

.cashier.active {
    background: none;
}

.payment-wrap {
    .status {
        padding: 0 .2rem;
        height: 1rem;
        width: 7.1rem;
        line-height: 1rem;
        border-bottom: 1px solid #dfdfdd;
        .pull-left {
            font-size: .3rem;
            color: #999;
        }
        .pull-right {
            font-size: .32rem;
            color: #f23030;
            span {
                font-size: .36rem;
            }
        }
    }
}

.choice {
    padding: .25rem .2rem;
    width: 7.1rem;
    height: .5rem;
    line-height: 1rem;
    border-bottom: 1px solid #dfdfdd;
    line-height: .5rem;
    .radio-core {
        box-sizing: border-box;
        display: inline-block;
        background-color: #fff;
        border-radius: 100%;
        border: 1px solid #ccc;
        position: relative;
        width: .5rem;
        height: .5rem;
        vertical-align: middle;
    }
    .radio-input {
        display: none;
    }
    .radio-input:checked+.radio-core:after {
        background-color: #fff;
        -webkit-transform: scale(1);
        transform: scale(1);
    }
    .radio-input:checked+.radio-core {
        background-color: #26a2ff;
        border-color: #26a2ff;
    }
    .radio-core:after {
        box-sizing: border-box;
        content: " ";
        border-radius: 100%;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        width: .2rem;
        height: .2rem;
        -webkit-transition: -webkit-transform .2s;
        transition: -webkit-transform .2s;
        transition: transform .2s;
        transition: transform .2s, -webkit-transform .2s;
        -webkit-transform: scale(0);
        transform: scale(0);
    }
    .radio-label {
        display: inline-block;
        vertical-align: middle;
        margin-left: .23rem;
        height: .5rem;
        width: 6.2rem;
        overflow: hidden;
        font-size: .32rem;
        color: #333;
        .span-main {
            font-size: .28rem;
            color: #999;
            span {
                font-size: .28rem;
                color: #f23030;
            }
        }
    }
}

.other {
    padding: 0 .2rem;
    background: #fff;
    dt {
        font-size: .3rem;
        color: #333;
        height: .7rem;
        line-height: .7rem;
        border-bottom: 1px solid #dfdfdf;
    }
    dd {
        padding: .3rem 0;
        height: .83rem;
        border-bottom: 1px solid #dfdfdf;
        position: relative;
        img {
            width: .83rem;
            height: .83rem;
        }
        .icon {
            position: absolute;
            top: 50%;
            right: .2rem;
            width: .2rem;
            height: .35rem;
            background: url(../../assets/btn-right.png) no-repeat;
            background-size: 100% 100%;
            margin-top: -.175rem;
        }
        .pull-right {
            padding-left: .3rem;
            .title {
                font-size: .32rem;
                color: #333;
            }
            .con {
                padding-top: .15rem;
                font-size: .26rem;
                color: #999;
            }
        }
    }
}
</style>