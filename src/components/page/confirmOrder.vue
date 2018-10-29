<template>
    <div class="order-wrap">
        <div v-title data-title="确认订单">确认订单</div>
        <order-header :text="title" :btn="btn"></order-header>
        <div class="inf-header" @click="tolink('address')">
            <div v-if="realname">
                <div class="inf-name clearfix">
                    <div class="name fl"><span></span>{{realname.realname}}</div>
                    <div class="phone fr"><span></span>{{realname.mobile}}</div>
                </div>
                <div class="address">{{realname.prov+realname.city+realname.dist+realname.address}}</div>
            </div>
            <div class="status text-center" v-if="!realname">您还没有填写收货地址，请填写！</div>
            <span class="btn-right"></span>
        </div>
        <div class="bottom-bg"><img src="../../assets/bottom-bj.jpg"></div>
        <ul v-if="data" class="mark-wrap">
            <li class="clearfix" v-for="(item,index) in data.goods" :key="item.id">
                <img :src="URL + item.fatherImg" class="fl">
                <div class="pull-right fl">
                    <p class="text">{{item.title}}</p>
                    <p class="price-wrap clearfix">
                        <span class="fl price" v-if="$route.params.id != 3">￥<span>{{item.price_member}}</span></span>
                        <span class="fl price" v-if="$route.params.id == 3">市场参考价：￥{{item.price_member}}</span>
                        <span class="number fr">x{{item.num}}</span>
                    </p>
                </div>
            </li>
        </ul>
        <div v-if="data" class="dist-wrap">
            <div class="hd active clearfix">
                <div class="title fl">配送方式</div>
                <div class="busi fr">顺丰包邮</div>
            </div>
            <div class="hd clearfix" v-if="$route.params.id != 3">
                <div class="title fl">选择优惠券</div>
                <div class="busi fr">{{coupon}}</div>
            </div>
            <div class="hd clearfix" @click="tolink('/invoice')" v-if="$route.params.id != 3">
                <div class="title fl">开具发票</div>
                <div class="busi fr">{{invoice_type}}</div>
            </div>
            <div class="dd">
                <div class="title">给商家留言：</div>
                <textarea placeholder="选填：备注限字在45个字以内" @blur="limit" v-model="message"></textarea>
                <p class="ind">共<span v-if="data.goods">{{data.goods.length}}</span>件商品</p>
            </div>
        </div>
        <div class="price-set-wrap" v-if="data">
            <div class="total price clearfix" v-if="$route.params.id != 3">
                <span class="fl">税前商品总额</span>
                <span class="fr">￥{{data.total_price}}</span>
            </div>
            <div class="dis price clearfix" v-if="$route.params.id != 3">
                <span class="fl">优惠</span>
                <span class="fr">-&nbsp;&nbsp;<i>￥0</i></span>
            </div>
            <div class="freight price clearfix" v-if="$route.params.id != 3">
                <span class="fl">运费</span>
                <span class="fr">+&nbsp;&nbsp;<i>￥{{data.freight}}</i></span>
            </div>
            <div class="freight price clearfix" v-if="$route.params.id != 3">
                <span class="fl">优惠券</span>
                <span class="fr">-&nbsp;&nbsp;￥0</span>
            </div>
            <div class="tax price clearfix" v-if="$route.params.id != 3">
                <span class="fl">税金</span>
                <span class="fr">￥0</span>
            </div>
            <div class="curInt price clearfix" v-if="$route.params.id != 3">
                <span class="fl">当前积分</span>
                <span class="fr">0</span>
            </div>
            
        </div>
        <div v-if="data" class="footer-wrap">
            <div class="foot-seat"></div>
            <div class="footer clearfix" v-if="$route.params.id != 3">
                <button class="fr btn" @click="toCashier">提交订单</button>
                <div class="fr money">实付款&nbsp;:&nbsp;<span class="price">￥<span>{{Number(data.total_price) + Number(data.freight)}}</span></span></div>
            </div>
            <div class="footer clearfix" v-if="$route.params.id == 3">
                <button class="fr btn" @click="toCashier">立即支付</button>
                <div class="fr money">实付款&nbsp;:&nbsp;<span class="price"><span>{{data.pay_integral}} 积分</span></span></div>
            </div>
        </div>
        <Shopsn></Shopsn>
        <div class="load" v-show="load" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
        <div class="load-wrap" v-show="load_wrap" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
    </div>
</template>
<script>
    import orderHeader from './children/header.vue';
    import { Toast } from 'mint-ui';
    import Shopsn from '@/components/page/Shopsn.vue';
    import qs from 'qs';
    export default {
        name: 'order',
        data() {
            return {
                s: '',
                title: '确认订单',
                btn: '', //头部客服按钮开关
                data: '',
                newdata: '',
                scrollWatch: true,
                coupon: '请选择优惠券',
                invoice_type: '无需发票', //发票选择
                realname: '',
                load: false,
                load_wrap: true,
                message: '',//留言
                invoice_status: 0,
                gcheck:''
            }
        },
        methods: {
            //选取地址
            selectAddress(){
                this.realname = JSON.parse(sessionStorage.getItem('set_address'));
            },
            getOrderData(){
                if (sessionStorage.getItem('user_ID')){
                  this.axios.post(API_URL + 'Home/Order/goBuy', qs.stringify({
                        app_user_id: sessionStorage.getItem('user_ID'),
                        goods: this.$store.state.goods
                    })).then((res) => {
                        this.load_wrap = false;
                        this.data = res.data.data;
                        this.realname = res.data.data.address;
                         if(res.data.data.address){
                            this.realname = res.data.data.address;
                            this.address_id = res.data.data.address.id;
                        }else{
                            this.selectAddress()
                        } 
                        if (res.data.data && sessionStorage.getItem('set_address')) {
                            this.selectAddress()
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                };
            },

            toCashier() {//创建订单
                if (this.$route.params.id == 3) {//积分订单生成
                    this.axios.post(API_URL + 'Home/Integral/integral_order', qs.stringify({
                        app_user_id: sessionStorage.getItem('user_ID'), //用户ID
                        goods: this.$store.state.goods,  //将要兑换的商品 二维数组
                        integral: this.data.pay_integral,//商品所需积分
                        price_sum: 0,//所需金额
                        address_id: this.realname.id,//收货地址ID
                        remarks: this.message, //留言
                        translate: 0, //是否需要发票 1为需要 0为不需要
                        shipping_monery: 0,//运费
                    })).then((res) => {
                        this.$store.state.order_number = res.data.data;
                    }).catch((err) => {
                        console.log(err);
                    });
                    this.$store.state.price = this.data.pay_integral;
                    this.$router.push({
                        name: 'cashier',
                        params: {
                            id: this.$route.params.id //2为商品 1为积分兑换
                        }
                    });
                } else {//商品订单生成
                    this.axios.post(API_URL + 'Home/Pcenter/check', qs.stringify({
                            app_user_id: sessionStorage.getItem('user_ID'),
                            gcheck:this.gcheck
                        })).then((res) => {
                            if(res.data.status == 1){
                                this.toOrder();
                            }else{
                                Toast('请勿重复提交');
                            }
                        }).catch((err) => {
                            console.log(err);
                        });
                    
                };
            },
            toOrder(){
                    this.axios.post(API_URL + 'Home/Order/orderBegin', qs.stringify({
                        app_user_id: sessionStorage.getItem('user_ID'), //用户ID
                        goods: this.$store.state.goods,  //将要购买的商品 二维数组
                        buyType: this.$route.params.id,  //2:为立即购买型 1：为购物车购买
                        price_sum: Number(this.data.total_price) + Number(this.data.freight), //运费及优惠券计算后的总金额
                        invoice: JSON.stringify(this.$store.state.invoice_switch), //发票信息二维数组
                        translate: this.invoice_status, //是否需要发票 1为需要 0为不需要
                        address_id: this.realname.id,//收货地址ID
                        remarks: this.message, //留言
                        shipping_monery: this.data.freight, //运费
                    })).then((res) => {
                        console.log(res)
                        this.$store.state.order_number = res.data.data;
                    }).catch((err) => {
                        console.log(err);
                    });
                    this.$router.push({
                        name: 'cashier',
                        params: {
                            id: this.$route.params.id //2为商品 1为积分兑换
                        }
                    });
                    this.$store.state.price = Number(this.data.total_price) + Number(this.data.freight);
            },
            tolink(to) {
                if(to == 'address'){
                    this.$router.push({
                        name:to,
                        params:{
                            status:1
                        }
                });
                }else{
                   this.$router.push(to);
                }
            },
            limit() {
                if (this.message.length > 45) {
                    Toast('留言不能超过45字！');
                }
            }
        },
        mounted() {
            document.body.scrollTop = 0;
            // if (sessionStorage.getItem('set_address') != '' && sessionStorage.getItem('set_address') != 'undefined' && sessionStorage.getItem('set_address') != null) {
            //     let Local_data = sessionStorage.getItem('set_address');
            //     this.realname = JSON.parse(Local_data)
            // }else{
            //     if (this.$route.params.id == 1) { //积分商品
            //         if (sessionStorage.getItem('user_ID')) {
            //             this.axios.post(API_URL + 'Home/Order/goBuy', qs.stringify({
            //                 app_user_id: sessionStorage.getItem('user_ID'),
            //                 goods: this.$store.state.goods,
            //                 is_integral: 1
            //             })).then((res) => {
            //                 console.log(res,1212121554)
            //                 this.load_wrap = false;
            //                 this.data = res.data.data;
            //                 this.realname = res.data.data.address;
            //                 // this.coupon = res.data.data.coupon[0].name;
            //             }).catch((err) => {
            //                 console.log(err);
            //             });
            //         } else {
            //             this.$router.push('/LogoIn');
            //         };
            //         return;
            //     }
            //     if (sessionStorage.getItem('user_ID')) { //普通商品
            //         this.axios.post(API_URL + 'Home/Order/goBuy', qs.stringify({
            //             app_user_id: sessionStorage.getItem('user_ID'),
            //             goods: this.$store.state.goods
            //         })).then((res) => {
            //             console.log(res,'hayduiahwdiawd')
            //             if(res.data.msg == '请完善收货地址'){
            //                     this.realname = '';
            //             }
            //             this.load_wrap = false;
            //             this.data = res.data.data;
            //             this.realname = res.data.data.address;
            //             // this.coupon = res.data.data.coupon[0].name;
            //         }).catch((err) => {
            //             console.log(err);
            //         });
            //     } else {
            //         this.$router.push('/LogoIn');
            //     };
            //     if (this.$store.state.invoice == false) {
            //         this.invoice_status = 0;
            //     } else {
            //         this.invoice_status = 1;
            //     }
            //     if (this.$store.state.invoice == true) {
            //         this.invoice_type = this.$store.state.invoice_switch[0].invoice_title;
            //     } else {
            //         this.invoice_type = '无需发票';
            //     }
            // }
            // if (this.$route.params.id == 1) { //积分商品
            //         if (sessionStorage.getItem('user_ID')) {
            //             this.axios.post(API_URL + 'Home/Order/goBuy', qs.stringify({
            //                 app_user_id: sessionStorage.getItem('user_ID'),
            //                 goods: this.$store.state.goods,
            //                 is_integral: 1
            //             })).then((res) => {
            //                 // if (res.data.status == 0) {
            //                 //     Toast(res.data.msg);
            //                 //     this.$router.go(-1);
            //                 // }
            //                 if(res.data.msg == '请完善收货地址'){
            //                     this.realname = '';
            //                     // this.$router.push('/address');
            //                     }
            //                 this.load_wrap = false;
            //                 this.data = res.data.data;
            //                 this.realname = res.data.data.address;
            //                 // this.coupon = res.data.data.coupon[0].name;
            //             }).catch((err) => {
            //                 console.log(err);
            //             });
            //         } else {
            //             this.$router.push('/LogoIn');
            //         };
            //         return;
            //     }
            //     if (sessionStorage.getItem('user_ID')) { //普通商品
            //         this.axios.post(API_URL + 'Home/Order/goBuy', qs.stringify({
            //             app_user_id: sessionStorage.getItem('user_ID'),
            //             goods: this.$store.state.goods
            //         })).then((res) => {
            //             if(res.data.msg == '请完善收货地址'){
            //                     this.realname = '';
            //                     // this.$router.push('/address');
            //             }
            //             this.load_wrap = false;
            //             this.data = res.data.data;
            //             // this.coupon = res.data.data.coupon[0].name;
            //         }).catch((err) => {
            //             console.log(err);
            //         });
            //     } else {
            //         this.$router.push('/LogoIn');
            //     };
            //     if (this.$store.state.invoice == false) {
            //         this.invoice_status = 0;
            //     } else {
            //         this.invoice_status = 1;
            //     }
            //     if (this.$store.state.invoice == true) {
            //         this.invoice_type = this.$store.state.invoice_switch[0].invoice_title;
            //     } else {
            //         this.invoice_type = '无需发票';
            //     }
             
        },
        created() {
            this.getOrderData();
                this.axios.post(API_URL + 'Home/Pcenter/getcheck', qs.stringify({
                    app_user_id: sessionStorage.getItem('user_ID'),
                })).then((res) => {
                    if(res.data.status == 1){
                        this.gcheck = res.data.data;
                    }
                }).catch((err) => {
                    console.log(err);
                });
        },
        destroyed() {
            this.scrollWatch = false;
        },
        components: {
            orderHeader,
            Shopsn
        }
    }
</script>
<style lang="less" scoped>
    .order-wrap{
        background:#f1f1f1;
        .inf-header{
            width:7.1rem;
            height:1.64rem;
            padding:0 .2rem;
            background:#fff;
            position:relative;
            .status{
                font-size:.32rem;
                color:#666;
                line-height: 1.64rem;
            }
            .inf-name{
                padding:.3rem 0;
                color:#282828;
                .name{
                    font-size:.36rem;
                    padding-left:.44rem;
                    position:relative;
                    span{
                        position:absolute;
                        top:50%;
                        left:0;
                        width:.28rem;
                        height:.41rem;
                        background:url(../../assets/userIcon.png) no-repeat;
                        background-size:100% 100%;
                        margin-top:-.205rem;
                    }
                }
                .phone{
                    font-size:.36rem;
                    padding-left:.38rem;
                    position:relative;
                    span{
                        position:absolute;
                        left:0;
                        top:50%;
                        margin-top:-.17rem;
                        width:.24rem;
                        height:.34rem;
                        background:url(../../assets/phone.png) no-repeat;
                        background-size:100% 100%;
                    }
                }
            }
            .address{
                width:6.4rem;
                height:.3rem;
                display:block;
                white-space:nowrap; 
                overflow:hidden; 
                text-overflow:ellipsis;
                font-size:.28rem;
                color:#999;
                line-height:.32rem;
                position:relative;
            }
            .btn-right{
                width:.18rem;
                height:.3rem;
                position:absolute;
                top:.9rem;
                right:.2rem;
                background:url(../../assets/btn-right.png) no-repeat;
                background-size:100% 100%;
            }
        }
        .bottom-bg{
            width:100%;
            margin-bottom:.2rem;
            img{
                width:100%;
            }
        }
        .mark-wrap{
            margin:.2rem 0;
            background:#fff;
            li{
                padding:.25rem .2rem;
                border-bottom:1px solid #dfdfdd;
                height:1.55rem;
                position:relative;
                img{
                    width:1.55rem;
                    height:1.55rem;
                }
                .delete{
                    width:1.2rem;
                    height:100%;
                    background:#f9781e;
                    position:absolute;
                    right:0;
                    top:0;
                    color:#fff;
                    text-align:center;
                    .icon{
                        width:.51rem;
                        height:.51rem;
                        background:url(../../assets/delete.png) no-repeat;
                        background-size:100% 100%;
                        margin:.55rem auto .2rem;
                    }
                    .text{
                        font-size:.24rem;
                    }
                }
                .pull-right{
                    padding-left:.2rem;
                    .text{
                        width:4.7rem;
                        font-size:.24rem;
                        color:#333;
                        line-height:.32rem;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                    }
                    .price-wrap{
                        padding-top:.4rem;
                        width:5rem;
                        .price{
                            font-size:.26rem;
                            color:#e02828;
                            span{
                                font-size:.38rem;
                            }
                        }
                        .number{
                            font-size:.32rem;
                            color:#333;
                        }
                    }
                }
            }
        }
        .dist-wrap{
            width:7.1rem;
            padding:0 .2rem;
            background:#fff;
            .hd{
                height:1.1rem;
                line-height:1.1rem;
                border-bottom:1px solid #d1d1d1;
                background:url(../../assets/btn-right.png) no-repeat 6.9rem center;
                background-size:.14rem .24rem;
                padding-right:.3rem;
                box-sizing: border-box;
                .title{
                    font-size:.25rem;
                    color:#777;
                }
                .busi{
                    font-size:.25rem;
                    color:#999;
                }
            }
            .hd.active{
                background:#fff;
            }
            .dd{
                margin-bottom:.2rem;
                .title{
                    padding:.3rem 0;
                    font-size:.25rem;
                    color:#777;
                }
                textarea{
                    border:none;
                    resize:none;
                    width:7.1rem;
                    height:.94rem;
                    background:#f1f1f1;
                    text-indent:.2rem;
                    padding-top:.2rem;
                    outline:none;
                    font-size:.24rem;
                    color:#333;
                }
                .ind{
                    text-align:right;
                    padding:.48rem .2rem .32rem;
                    font-size:.26rem;
                    color:#333;
                    span{
                        font-size:.26rem;
                        color:#f23030;
                    }
                }
            }
        }
        .footer-wrap{
            height:1rem;
            width:100%;
            .footer{
                position:fixed;
                bottom:0;
                left:0;
                width:100%;
                height:1rem;
                background:#fff;
                box-sizing: border-box;
                border-top:1px solid #ccc;
                .btn{
                    width:2.5rem;
                    height:1rem;
                    color:#fff;
                    border:none;
                    background:#d0111b;
                    font-size:.36rem;
                }
                .money{
                    line-height:1rem;
                    font-size:.3rem;
                    color:#757575;
                    padding-right:.3rem;
                    .price{
                        font-size:.3rem;
                        color:#ff7200;
                        span{
                            font-size:.36rem;
                            font-weight:bold;
                        }
                    }
                }
            }
        }
        .price-set-wrap{
            padding:.2rem;
            background:#fff;
            .price{
                height: .6rem;
                line-height: .6rem;
                span.fl{
                    font-size:.25rem;
                    color:#777;
                }
                span.fr{
                    font-size:.28rem;
                    color:#d0111b;
                    overflow: hidden;
                    height: 100%;
                    i{
                        font-style: normal;
                        color:#666;
                    }
                }
            }
            .price.curInt{
                span.fr{
                    color:#ff7200;
                }
            }
        }
    }
</style>