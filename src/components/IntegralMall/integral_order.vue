<template>
    <div ref="integral_order_list">
        <div v-title :data-title="title">{{title}}</div>
        <int-header :text="title"></int-header>
        <div class="order-wrap" v-for="(items,index) in $store.state.order" :key="index">
            <div class="order-list" v-for="(item,i) in items.cart" :key="i">
                <div class="hd clearfix">
                    <span class="title fl">{{items.store_name}}</span>
                    <span class="status fr">{{order_status[Number(item.order_status)+1]}}</span>
                </div>
                <div class="describe clearfix">
                    <img  v-if ="item.image" v-lazy="URL + item.image" class="fl" @click="toDetails(item,text,index)">
                    <img v-else alt=""  class="fl">
                    <div class="fl words" @click="toDetails(item,text,index)">
                        <p class="text">{{item.title}}</p>
                        <!-- <p class="clearfix company">
                            <span class="fl">111&nbsp;:&nbsp;</span>
                            <span class="fl">111</span>
                        </p> -->
                    </div>
                    <button class="btn" @click="toRouter('/evaluate',item,text)" v-if="item.order_state == '1'">马上评论</button>
                </div>
                <div class="commod clearfix">
                    <span class="fl total">共{{item.goods_num}}件商品</span> 
                    <span class="fl actual">积分兑换&nbsp;:&nbsp;<span>-{{item.integral}}</span></span>
                    <span class="icon" @click="del(item,index)" v-if="item.order_status == 4 || item.order_status == -1"></span>
                </div>
                <div class="operation clearfix">
                    <span class="timer fl">兑换时间：{{item.create_time}}</span>
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
        <to-top></to-top>
        <div class="load-wrap" v-show="load_wrap" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
    </div>
</template>

<script>
	import qs from 'qs'
    import { MessageBox } from 'mint-ui'; 
    import intHeader from '@/components/page/children/header.vue';
    import Shopsn from '@/components/page/Shopsn.vue';
    import toTop from '@/components/page/toTop.vue';
    export default {
        name : 'integral_order',
        data(){
            return {
                title:'我的兑换',
                load_wrap:true,
                text:'',
				order_status:['取消订单','未支付','已支付','发货中','已发货','已收货','退货审核中','审核失败','审核成功','退款中','退款成功'],
                isactive: '',
                slide_switch: false, //避免多次下拉
                load_show: true, //滚动动画
                roll_switch: true, //触发下拉加载开关
                no_data: false, //第一次没数据时的样式
                sliding_no_data: false, //下拉没数据时的样式
                page: 1,
            }
        },
        mounted(){
            this.$store.state.order = [];
            this.getList();

            let _this = this;
            window.addEventListener('scroll', function () {
                if (!_this.$refs.integral_order_list) return;
                if (document.body.scrollTop + window.innerHeight >= document.body.offsetHeight) {
                    //如果第一次请求没数据或数据没达到每页个数就不会再请求数据
                    if (_this.roll_switch == false) {
                        return;
                    }
                    if (_this.slide_switch == true) {
                        _this.slide_switch = false;
                        _this.page++;
                        _this.getList();
                    }
                }
            })
        },
        methods:{
            getList(){
                this.axios({
                    url:this.$httpConfig.myConfirm,
                    method:'get',
                    params:{
                        page:this.page
                    }
                }).then((res) => {
                    this.stateHandling(res.data.status, res.data.data.goods);
                    this.load_wrap = false;
                }).catch((err) => {
                    console.log(err);
                });
            },
            //请求成功后的操作
            returnOperation(data) {
                if (data.length < 10 && this.page == 1) { //第一次请求成功如果数据没达到每页页数就禁止下拉
                    this.load_show = false; //动画隐藏
                    this.roll_switch = false; //禁止下拉加载
                }
                for (let index = 0; index < data.length; index++) {
                    this.$store.state.order.push(data[index]);
                }
                console.log(this.$store.state.order)
                this.slide_switch = true;
            },
            //请求后返回不同状态时的处理
            stateHandling(status, data) {
                this.sw = true;
                if (status == 10001) {
                    this.$router.push('/LogIn');
                } else if (status == 1) { //成功后的处理
                    this.returnOperation(data);
                } else if (status == 0 && this.page == 1) { //第一次请求失败时
                    this.no_data = true; //无数据时的样式
                    this.load_show = false; //动画隐藏
                    this.roll_switch = false; //禁止下拉加载
                } else { //第二次或更多次无数据时
                    this.sliding_no_data = true; //无数据时的样式
                    this.load_show = false; //动画隐藏
                    this.roll_switch = false; //禁止下拉加载
                }
            },
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
                                status:1,
                                order:item.id,
                                order_type:1 //1为积分订单 2 为商品订单
                            }
                        });
                        break;
                    case '/pay':
                        this.$router.push({
                            name:'orderDetails',
                            params:{
								status:0,
								 order:item.id,
                                order_type:1 //1为积分订单 2 为商品订单
                            }
                        });
                        break;
                }
            },
            del(item,index){
                MessageBox.confirm('确定删除订单?').then(action => {
                    this.axios.post(this.$httpConfig.delOrder,qs.stringify({
	                       id:item.id
	                    })).then((res) => {
	                    	this.$store.state.order.splice(index,1);
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
            Shopsn,
            toTop
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
                    color:#CD0C11
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
                    border:1px solid #CCA42B;
                    background:#fff;
                    border-radius:20px;
                    color:#CCA42B
                }
                img{
                    width:1.46rem;
                    height:1.46rem;
                }
                .words{
                    width:5.24rem;
                    .text{
                        height: .8rem;
                        padding:.1rem .2rem;
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
                        color:#CD0C11
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
                    border:1px solid#D19E29;
                    font-size:.27rem;
                    color:#D19E29;
                    border-radius:5px;
                    outline:none;
                }
            }
        }
    }
</style>
