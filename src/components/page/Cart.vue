<template>
    <div class="goos">
        <div v-title data-title="我的购物车">我的购物车</div>
        <header class="cart-header">我的购物车({{$store.state.cart_data.length}})<router-link to="/myNews"><span></span></router-link></header>
        <dl class="mark-wrap" v-if="$store.state.cart_data">
            <dt>shopSN商城
                <span class="clearfix" @click="deit">
                    <i class="fl">{{total.fn}}</i>
                    <em class="fl"></em>
                </span>
            </dt>
            <dd class="clearfix" v-for="(item,index) in $store.state.cart_data" :key="item.id" :class="{active:!total.deit}">
                <label class="checkBox" :class="{active:status[index]}" @click="addCom(index,item)"><span></span></label>
                <img v-lazy="URL + item.pic_url" class="fl">
                <div class="pull-right fl" v-show="total.deit">
                    <p class="text">{{item.title}}</p>
                    <p class="price-wrap clearfix">
                        <span class="fl price">￥<span>{{item.price_new}}</span></span>
                        <span class="number fr">x{{item.goods_num}}</span>
                    </p>
                </div>
                <div class="delete fr" v-show="!total.deit" @click="remove(index,item)">
                    <div class="icon"></div>
                    <div class="text">删除</div>
                </div>
                <div class="input-wrap fr" v-show="!total.deit">
                    <button @click="reduce(index,item)">-</button>
                    <input type="number" v-model="item.goods_num">
                    <button @click="add(index,item)">+</button>
                </div>
            </dd>
        </dl>
            <div class="interested" v-show="total.deit" v-if="$store.state.cart_data">
                <div class="title">
                    <span></span>
                    <span></span>
                    您可能感兴趣的产品
                </div>
                <hot-goods :data="$store.state.computer"></hot-goods>
            </div>
        <div class="footer-wrap" v-if="$store.state.cart_data">
            <div class="seat"></div>
            <div class="footer clearfix">
                <label class="chicked fl" :class="{active:this.total.seat}" @click="seat">
                    <span></span>{{total.setData}}
                </label>
                <button class="set-btn fr" v-show="total.deit" @click="toOrder">去结算({{total.seleNumber}})</button>
                <div class="total fl" v-show="total.deit">
                    <div class="total-metre clearfix">
                        <span class="title fl">总计&nbsp;:&nbsp;</span>
                        <span class="con fl">￥<span>{{total.price.toFixed(2)}}</span></span>
                    </div>
                    <div class="total-price">
                        总额：￥{{total.price.toFixed(2)}}&nbsp;&nbsp;优惠：￥{{total.dis}}
                    </div>
                </div>
                <div class="immig fr" v-show="!total.deit" @click="collection">移入收藏</div>
                <div class="share fr" v-show="!total.deit">分享</div>
            </div>
        </div>

        <div class="cart-active text-center" v-if="!$store.state.cart_data">
            <img src="../../assets/cart.png">
            <p class="text">您的购物车没有任何商品，快去逛逛吧！</p>
        </div>
         <Shopsn></Shopsn>
        <div class="load" v-show="load" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
        <div class="load-wrap" v-show="$store.state.cart_load" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
    </div>
</template>
<script>
    import { MessageBox,Toast } from 'mint-ui';
    import qs from 'qs';
    import hotGoods from '@/components/home/children/hotGoods';
    import Shopsn from '@/components/page/Shopsn.vue';
    export default {
        name : 'cart',
        data(){
            return {
                load:false,
                load_wrap:true,
                goods_id_list:[],
                total:{
                    seleNumber:0,
                    newPrice:0,
                    price:0,
                    dis:0,
                    seat:'',
                    deit:true,
                    setData:'全选',
                    fn:'编辑'
                },
                scrollWatch:true,
                data:'',
                status:[],
                computer:'',
                goos_id:[],
                goods:[]
            }
        },
        methods:{
            addCom(index,item){//单选
                if(this.status[index] == true){
                    this.$set(this.status,index,false);
                    this.$set(this.goods_id_list,index,'');
                    this.total.seleNumber--;
                    this.total.price -= item.price_new * item.goods_num;
                    this.goos_id.splice(index,1);
                    this.goods.splice(index,1);
                }else{
                    this.$set(this.status,index,true);
                    this.$set(this.goods_id_list,index,item.id);
                    this.total.seleNumber++;
                    this.total.price += item.price_new * item.goods_num;
                    this.$set(this.goos_id,index,item.goods_id);
                    this.$set(this.goods,index,{num:item.goods_num,id:item.goods_id,goods_price:item.price_new});
                }
                if(this.total.seleNumber >= this.$store.state.cart_data.length){
                    this.total.seat = true;
                }else{
                    this.total.seat = false;
                }
            },
            seat(){//全选
            this.total.price = 0;
            this.goods_id_list = [];
                if(this.total.seat == true){
                    this.total.seat = false;
                    for(let i = 0; i < this.$store.state.cart_data.length; i++){
                        this.$set(this.status,i,false);
                        this.goods_id_list.splice(i,1);
                    }
                    this.goos_id = [];
                    this.goods = [];
                    this.total.seleNumber =  0;
                    this.total.price = 0;
                }else{
                    this.total.seat = true;
                    for(let i = 0; i < this.$store.state.cart_data.length; i++){
                        this.$set(this.goods_id_list,i,this.$store.state.cart_data[i].id);
                        this.$set(this.status,i,true);
                        this.total.price += this.$store.state.cart_data[i].price_new * this.$store.state.cart_data[i].goods_num;
                        this.$set(this.goos_id,i,this.$store.state.cart_data[i].goods_id);
                        this.$set(this.goods,i,{num:this.$store.state.cart_data[i].goods_num,id:this.$store.state.cart_data[i].goods_id,goods_price:this.$store.state.cart_data[i].price_new});
                    }
                    this.total.seleNumber = this.$store.state.cart_data.length;
                }
            },
            deit(){//编辑购物车
                if(this.total.deit == true){
                    this.total.fn = '完成';
                    this.total.deit = false;
                }else{
                    this.total.fn = '编辑';
                    this.total.price = 0;
                    this.goods = [];
                    this.goos_id = [];
                    for (var i = 0; i < this.goods_id_list.length; i++) {
                        for (var index = 0; index < this.$store.state.cart_data.length; index++) {
                            if(this.goods_id_list[i] == this.$store.state.cart_data[index].id){
                            this.$set(this.goos_id,index,this.$store.state.cart_data[index].goods_id);
                            this.total.price += this.$store.state.cart_data[index].price_new * this.$store.state.cart_data[index].goods_num;
                             this.$set(this.goods,index,{num:this.$store.state.cart_data[index].goods_num,id:this.$store.state.cart_data[index].goods_id,goods_price:this.$store.state.cart_data[index].price_new});
                            }
                        }
                    }
                    this.total.deit = true;
                }
            },
            reduce(index,item){//商品减少
                if(this.$store.state.cart_data[index].goods_num <= 1)return;
                this.$store.state.cart_data[index].goods_num--;
                this.subtract(2,item.id)
            },
            add(index,item){//商品增加
                this.$store.state.cart_data[index].goods_num++;
                this.subtract(1,item.id)
            },
            subtract(n,_id){
                this.load = true;
                this.axios.post(API_URL+'Home/Cart/addReduce',qs.stringify({
                    app_user_id:sessionStorage.getItem('user_ID'),
                    type:n,
                    id:_id
                })).then((res) => {
                    this.load = false;
                }).catch((err) => {
                    console.log(err);
                })
            },
            remove(index,item){//从购物车中删除商品
                MessageBox.confirm('确定删除此商品?').then(action => {
                    this.axios.post(API_URL+'Home/Cart/delete',qs.stringify({
                        app_user_id:sessionStorage.getItem('user_ID'),
                        id:item.id
                    })).then((res) => {
                        this.$store.state.cart_data.splice(index,1);
                        if(this.$store.state.cart_data.length <= 0){
                            this.$store.state.cart_data = '';
                        }
                        Toast('删除成功！');
                    }).catch((err) => {
                        console.log(err);
                    })
                }).catch((err) => {
                    console.log(err);
                });
            },
            toOrder(){//去结算
                this.load = true;
                for(var i=0,len=this.goods.length;i<len;i++){ //重塑数组
                    if(!this.goods[i] || this.goods[i] == null || this.goods[i] == '' || this.goods[i] == undefined){
                        this.goods.splice(i,1);
                        len--;
                        i--;
                    }
                }
                if(this.goos_id == ''){
                    Toast('请选择您要购买的物品！');
                    this.load = false;
                    return;
                }
                this.$store.state.goods = JSON.stringify(this.goods);
                this.$router.push({
                    name:'order',
                    params:{
                        id:1
                    }
                });
            },
            collection(){//添加到收藏
                for(var i=0,len=this.goos_id.length;i<len;i++){ //重塑数组
                    if(!this.goos_id[i] || this.goos_id[i] == null || this.goos_id[i] == '' || this.goos_id[i] == undefined){
                        this.goos_id.splice(i,1);
                        len--;
                        i--;
                    }
                }
                if(this.goos_id == ''){
                    Toast('请选择您要收藏的物品！');
                    return;
                }
                this.axios.post(API_URL+'Home/Cart/muchCollection',qs.stringify({
                    app_user_id:sessionStorage.getItem('user_ID'),
                    goods_id:JSON.stringify(this.goos_id)
                })).then((res) => {
                    Toast(res.data.msg);
                }).catch((err) => {
                    console.log(err);
                })
            }
        },
        components:{
            hotGoods,
            Shopsn
        },
        mounted() {
            document.body.scrollTop = 0;
            this.axios.post(API_URL+'Home/Cart/cart_recommend',qs.stringify({
                app_user_id:sessionStorage.getItem('user_ID')
            })).then((res) => {
                this.$store.state.computer = res.data.data;
            }).catch((err) => {
                console.log(err);
            });
            if(sessionStorage.getItem('user_ID')){
                this.axios.post(API_URL+'Home/Cart/myCart',qs.stringify({
                    app_user_id:sessionStorage.getItem('user_ID')
                })).then((res) => {
                    this.$store.state.cart_data = res.data.data;
                    this.$store.state.cart_load = false;
                }).catch((err) => {
                    console.log(err);
                });
            }else{
                this.$router.push('/LogoIn');
            }
        },
        destroyed(){
            this.scrollWatch = false;
        }
    }
</script>
<style lang="less" scoped>
    .goos{
        background:#f1f1f1;
        .footer-wrap{
            .seat{
                height:1rem;
            }
            .footer{
                position:fixed;
                left:0;
                bottom:1rem;
                width:7.3rem;
                padding-left:.2rem;
                height:1rem;
                background:#fff;
                .chicked.active{
                    color:#ce0a14;
                    span{
                        border:none;
                        background:url(../../assets/check_bj.png) no-repeat;
                        background-size:100% 100%;
                    }
                }
                .share{
                    width:1.83rem;
                    height:1rem;
                    line-height:1rem;
                    color:#fff;
                    text-align:center;
                    font-size:.36rem;
                    background:#ff7200;
                }
                 .immig{
                    width:2.72rem;
                    height:1rem;
                    line-height:1rem;
                    background:#d0111b;
                    color:#fff;
                    text-align:center;
                    font-size:.36rem;
                 }
                .set-btn{
                    width:2.5rem;
                    color:#fff;
                    height:100%;
                    border:none;
                    text-align:center;
                    line-height:1rem;
                    background:#d0111b;
                    font-size:.36rem;
                }
                .total{
                    padding-left:.1rem;
                    .total-metre{
                        padding-top:.1rem;
                        .title{
                            font-size:.3rem;
                            color:#757575;
                        }
                        .con{
                            font-size:.3rem;
                            color:#ff7200;
                            span{
                                font-size:.36rem;
                                font-weight:bold;
                            }
                        }
                    }
                    .total-price{
                        font-size:.18rem;
                        color:#999;
                    }
                }
                .chicked{
                    position:relative;
                    padding-left:.55rem;
                    line-height:1rem;
                    font-size:.28rem;
                    color:#999;
                    span{
                        position:absolute;
                        top:50%;
                        left:0;
                        width:.4rem;
                        height:.4rem;
                        border:1px solid #8d8d8d;
                        border-radius:100%;
                        margin-top:-.2rem;
                        text-align:center;
                        line-height:.4rem;
                        color:#f9781e;
                    }
                }
            }
        }
        .interested{
            .title{
                text-align:center;
                position:relative;
                font-size:.28rem;
                line-height:.8rem;
                height:.8rem;
                color:#666;
                span{
                    position:absolute;
                    top:50%;
                    width:2.3rem;
                    height:1px;
                    background:#cdcdcd;
                }
                span:nth-child(1){
                    left:0;
                }
                span:nth-child(2){
                    right:0;
                }
            }
            .content-main{
                background:#f1f1f1;
                li{
                    width:3.7rem;
                    height:4.96rem;
                    background:#fff;
                    margin-bottom:.1rem;
                    margin-right:.08rem;
                    img{
                        width:3.7rem;
                        height:3.7rem;
                    }
                    .desi{
                        font-size:.3rem;
                        color:#333;
                        padding:.2rem .2rem;
                        white-space:nowrap;
                        overflow:hidden;
                        text-overflow:ellipsis;
                    }
                    .price{
                        padding-left:.2rem;
                        color:#e02828;
                        font-size:.3rem;
                        span{
                            font-size:.36rem;
                        }
                    }
                }
                li:nth-child(2n){
                    margin-right:0;
                }
            }
        }
        .cart-active{
            padding-top:1rem;
            img{
                width: 3.07rem;
                width: 2.74rem;
            }
            .text{
                font-size:.32rem;
                color:#666;
                padding-top:.4rem;
            }
        }
    }
    .cart-header{
        width: 100%;
        height: .62rem;
        background: #ce0a14;
        padding: .16rem 0;
        overflow: hidden;
        text-align:center;
        position:relative;
        color:#fff;
        font-size:.36rem;
        line-height:.62rem;
        span{
            position:absolute;
            top:50%;
            right:.4rem;
            margin:-.23rem;
            width:.47rem;
            height:.46rem;
            background:url(../../assets/news1.png) no-repeat;
            background-size:100% 100%;
        }
    }
    .mark-wrap{
        margin-top:.2rem;
        padding:0 .2rem .48rem;
        background:#fff;
        dt{
            width:100%;
            height:.9rem;
            line-height:.9rem;
            text-align:center;
            font-size:.32rem;
            color:#f9781e;
            background:#fff;
            border-bottom:1px solid #dfdfdd;
            position:relative;
            span{
                position:absolute;
                right:.2rem;
                top:50%;
                height:.31rem;
                margin-top:-.155rem;
                color:#999;
                line-height:.31rem;
                i{
                    font-style:normal;
                    font-size:.24rem;
                    padding-right:.2rem;
                }
                em{
                    width:.32rem;
                    height:.31rem;
                    background:url(../../assets/edit.jpg) no-repeat;
                    background-size:100% 100%;
                }
            }
        }
        dd.active{
            background:#fafafa;
        }
        dd{
            padding:.25rem 0;
            border-bottom:1px solid #dfdfdd;
            padding-left:.7rem;
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
            .input-wrap{
                margin-right:1.2rem;
                input[type=number]{
                    border:none;
                    width:1.8rem;
                    text-align:center;
                    font-size:.36rem;
                    color:#333;
                    background:#fafafa;
                    outline:none;
                }
                button{
                    border:none;
                    background:none;
                    color:#999;
                    outline:none;
                    width:.8rem;
                    text-align:center;
                    font-size:.5rem;
                }
            }
            .pull-right{
                padding-left:.2rem;
                .text{
                    width:4.6rem;
                    height:.65rem;
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
            .checkBox.active{
                color:#ce0a14;
                span{
                    border:none;
                    background:url(../../assets/check_bj.png) no-repeat;
                    background-size:100% 100%;
                }
            }
            .checkBox{
                position:absolute;
                left:0;
                top:0;
                width:.7rem;
                height:100%;
                span{
                    position:absolute;
                    top:50%;
                    left:0;
                    margin-top:-.2rem;
                    width:.4rem;
                    height:.4rem;
                    border:1px solid #8d8d8d;
                    border-radius:50%;
                    text-align:center;
                    line-height:.4rem;
                    font-size:.3rem;
                    color:#f9781e;
                }
            }
        }
    }
</style>