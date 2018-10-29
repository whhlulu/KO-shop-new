<template>
    <div>
        <div v-title :data-title="title">{{title}}</div>
        <int-header :text="title"></int-header>
        <div class="order-wrap">
            <div class="order-list" v-for="(item,index) in $store.state.order" :key="item.id">
                <div class="hd clearfix">
                    <span class="title fl">ShopsN商城</span>
                    <span class="status fr" v-if="item.order_status == 0">待付款</span>
                    <span class="status fr" v-if="item.order_status == 1">待发货</span>
                    <span class="status fr" v-if="item.order_status == 3">待收货</span>
                    <span class="status fr" v-if="item.order_status == 4 && item.order_state != '1'">已完成</span>
                    <span class="status fr" v-if="item.order_state == '1'">待评论</span>
                    <span class="status fr" v-if="item.order_status == -1">已取消</span>
                </div>
                <div class="describe clearfix" v-for="text in item.goods" :key="text.id">
                    <img :src="URL + text.selfImg" class="fl" @click="toDetails(item,text,index)">
                    <div class="fl words" @click="toDetails(item,text,index)">
                        <p class="text">{{text.title}}</p>
                        <p class="clearfix company">
                            <span class="fl">{{text.selfAttr[0].name}}&nbsp;:&nbsp;</span>
                            <span class="fl">{{text.selfAttr[0].item}}</span>
                        </p>
                    </div>
                    <button class="btn" @click="toRouter('/evaluate',item,text)" v-if="item.order_state == '1'">马上评论</button>
                </div>
                <div class="commod clearfix">
                    <span class="fl total">共{{item.count}}件商品</span> 
                    <span class="fl actual">积分兑换&nbsp;:&nbsp;<span>-{{item.integral}}</span></span>
                    <span class="icon" @click="del(item,index)" v-if="item.order_status == 4 || item.order_status == -1"></span>
                </div>
                <div class="operation clearfix">
                    <span class="timer fl">下单时间：{{new Date(item.create_time * 1000).getFullYear()+'-'+new Date(item.create_time * 1000).getMonth()+'-'+new Date(item.create_time * 1000).getDay()+' '+new Date(item.create_time * 1000).getHours()+':'+new Date(item.create_time * 1000).getMinutes()+':'+new Date(item.create_time * 1000).getSeconds()}}</span>
                    <button class="btn fr" @click="toRouter('/pay',item,false)" v-if="item.order_status == 0">马上付款</button>
                    <button class="btn fr" @click="toRouter('/order',item,false)" v-if="item.order_status == 1">查看订单</button>
                    <button class="btn fr" @click="toRouter('/logis',item,false)" v-if="item.order_status == 3">查看物流</button>
                    <button class="btn fr" @click="toRouter('/Cart',item,1)" v-if="item.order_status == 4 || item.order_status == -1" v-show="item.order_state != '1'">再次购买</button>
                </div>
            </div>
            <div class="comm-null" v-if="!$store.state.order">
                <div class="con-wrap text-center">
                    <img src="../../assets/null_com.png">
                    <p>暂无商品</p>
                </div>
            </div>
        </div>
        <Shopsn></Shopsn>
    </div>
</template>

<script>
    import intHeader from './children/header';
    import Shopsn from '@/components/page/Shopsn.vue';
    export default {
        name : 'integral_order',
        data(){
            return {
                title:'我的兑换'
            }
        },
        mounted(){
            this.axios({
                url:API_URL + 'Home/Order/myOrder',
                method:'get',
                params:{
                    app_user_id:sessionStorage.getItem('user_ID'),
                    order_type:'integral'
                }
            }).then((res) => {
                this.$store.state.order = res.data.data;
            }).catch((err) => {
                console.log(err);
            });
        },
        methods:{
            toDetails(item,text,index){
                this.$router.push({
                    name:'orderDetails',
                    params:{
                        status:item.order_status,
                        order:item.id,
                        order_type:1 //1为积分订单 2 为商品订单
                    }
                });
            },
            toRouter(to,item,text){
                switch(to){
                    case '/evaluate':
                        this.$store.state.order_ommodity = text;
                        this.$router.push({
                            name:'evaluate',
                            params:{
                                id:item.id
                            }
                        });
                        break;
                    case '/Cart':
                        this.$router.push({
                            name:'orderDetails',
                            params:{
                                status:4,
                                order:item.id,
                                order_type:1 //1为积分订单 2 为商品订单
                            }
                        })
                        break;
                    case '/logis':
                        this.$router.push({
                            name:'logis',
                            params:{
                                status:3,
                                id:item.id,
                                order_type:1 //1为积分订单 2 为商品订单
                            }
                        });
                        break;
                    case '/order':
                        this.$router.push({
                            name:'orderDetails',
                            params:{
                                status:2,
                                order:item.id,
                                 order_type:1 //1为积分订单 2 为商品订单
                            }
                        });
                        break;
                    case '/pay':
                        this.$router.push({
                            name:'orderDetails',
                            params:{
                                status:item.order_status,
                                order:item.id
                            }
                        });
                        break;
                }
            },
            del(item,index){
                MessageBox.confirm('确定执行此操作?').then(action => {
                    this.axios.post(API_URL + 'Home/Order/deleteOrder',qs.stringify({
                        app_user_id:sessionStorage.getItem('user_ID'),
                        order_id:item.id
                    })).then((res) => {
                        this.$store.state.order.splice(index,1);
                        Toast({
                            message: res.data.msg,
                            position: 'bottom'
                        });
                    }).catch((err) => {
                        console.log(err);
                    });
                }).catch((err) => {
                    console.log(err);
                });
            }
        },
        components:{
            intHeader,
            Shopsn
        }
    }
</script>

<style lang="less" scoped>
    .order-wrap{
        padding-top:.1rem;
        .comm-null{
            padding-top:.5rem;
            p{
                font-size:.28rem;
                color:#666;
                padding-top:.2rem;
            }
        }
        .order-list{
            background:#fff;
            line-height:.7rem;
            margin-bottom:.2rem;
            .hd{
                margin:0 .2rem;
                border-bottom:1px solid #dfdfdd;
                height:.7rem;
                .title{
                    font-size:.26rem;
                    color:#333;
                }
                .status{
                    font-size:.3rem;
                    color:#f9781e;
                }
                .status.light{
                    color:#adadad;
                }
                .status.ash{
                    color:#333;
                }
            }
            .describe{
                margin:0 .2rem;
                height:1.46rem;
                padding:.13rem 0;
                border-bottom:1px solid #dfdfdd;
                position:relative;
                .company{
                    padding-top:.2rem;
                    padding-left:.2rem;
                    span{
                        font-size:.22rem;
                        color:#999;
                    }
                }
                .btn{
                    position:absolute;
                    right:0;
                    bottom:.1rem;
                    width: 1.5rem;
                    height: .5rem;
                    border:1px solid #ff881e;
                    background:#fff;
                    border-radius:20px;
                    color:#ff881e;
                }
                img{
                    width:1.46rem;
                    height:1.46rem;
                }
                .words{
                    width:5.24rem;
                    .text{
                        height: .8rem;
                        padding:0 .2rem;
                        font-size:.32rem;
                        color:#333;
                        line-height:.45rem;
                        overflow: hidden;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
                }
            }
            .commod{
                padding:0 .2rem;
                height:.9rem;
                line-height:.9rem;
                border-bottom:1px solid #dfdfdd;
                position:relative;
                span{
                    font-size:.3rem;
                    color:#333;
                }
                .actual{
                    padding-left:.7rem;
                    span{
                        color:#ff881e;
                    }
                }
                .icon{
                    position:absolute;
                    right:.35rem;
                    top:50%;
                    width:.38rem;
                    height:.47rem;
                    background:url(../../assets/trash.png) no-repeat;
                    background-size:100% 100%;
                    margin-top:-.235rem;
                }
            }
            .operation{
                height:.7rem;
                padding:.1rem .2rem;
                line-height:.7rem;
                .timer{
                    font-size:.25rem;
                    color:#757575;
                }
                .btn{
                    width:1.98rem;
                    height:.7rem;
                    background:#fff;
                    border:1px solid #f9781e;
                    font-size:.27rem;
                    color:#f9781e;
                    border-radius:5px;
                    outline:none;
                }
            }
        }
    }
</style>
