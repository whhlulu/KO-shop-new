<template>
    <div class="product">
        <div v-title data-title="商品详情">商品详情</div>
        <pr-header :text="title"></pr-header>
        <mt-swipe :auto="0">
            <mt-swipe-item v-for="item in $store.state.commodity_data.goods_img || $store.state.commodity_data.pic_url" :key="item.id">
                <img v-lazy="URL + item">
            </mt-swipe-item>
        </mt-swipe>
        <div class="describe" v-if="$store.state.commodity_data">
            <p class="fn">{{$store.state.commodity_data.title || $store.state.commodity_data.goods.title}}</p>
            <!--<p class="timer">促销剩余时间:365天12小时50分钟23秒</p>-->
            <p class="price" v-if="$route.params.status == 1">
                <span class="orc">￥<em>{{$store.state.commodity_data.price_member}}</em></span>
                <span class="new">原价 ：￥<s>{{$store.state.commodity_data.price_market}}</s></span>
            </p>
            <div class="price active" v-if="$store.state.commodity_data.goods">
                <p class="orc clearfix"><em class="icon fl"></em><em class="fl">{{$store.state.commodity_data.goods.integral}}</em></p>
                <p class="new">市场参考价：<s>{{$store.state.commodity_data.goods.price_market}}</s>元</p>
            </div>
            <div class="share"> 
                <i class="icon"></i>
                <p>分享</p>
            </div>
        </div>
        <div class="selected" @click="theSon">已选<span class="number">数量&nbsp;{{$store.state.commodity_val}}</span><span class="btn-right"></span></div>
        <pr-list :conItem="conItem" :data="$store.state.dataLeave" v-if="$route.params.status == 1&&lv_switch"></pr-list>
        <pr-list :conItem="conItemRe" :data="$store.state.commodity_data.recommend" v-if="$route.params.status == 1"></pr-list>
        <div class="prompt" @click="toTab">点击查看更多商品信息</div>
        <detail-option></detail-option>
        <Shopsn></Shopsn>
        <foot-btn :state="sonState" :data="$store.state.commodity_data" @reduce="reduce" @plus="plus"></foot-btn>
        <div class="load-wrap" v-show="load_wrap" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
    </div>
</template>
<script>
    import PrHeader from './children/shop_header.vue';
    import prList from './children/list.vue';
    import FootBtn from './children/footBtn.vue';
    import PageOption from './children/pageOption.vue';
    import detailOption from './children/detailOptions.vue';
    import Shopsn from '@/components/page/Shopsn.vue';
    import qs from 'qs';
    
    export default {
        name : 'product',
        data(){
            return {
                // swiperImg:[require('@/assets/con16.jpg'),require('@/assets/con17.jpg'),require('@/assets/con18.jpg')],
                //是否显示状态条
                showIndicators:true,
                //初始轮播切换索引
                defaultIndex:0,
                //轮播是否循环播放
                continuous:true,
                number:1,
                conItem:{
                    title:'猜你喜欢'
                },
                conItemRe:{
                    title:'搭配套餐推荐'
                },
                scrollWatch:true,
                topStatus: '',
                loadTop:{},
                lv_switch:false,
                sonState:false,
                data:'',
                title:'商品详情',
                dataLeave:'',
                load_wrap:true,
                link_id:this.$route.params.id
            }
        },
        methods:{
            toTab(){
                this.$router.push({
                    name:'tab',
                    params:{
                        id:this.link_id
                    }
                });
            },
            theSon(){
                this.$store.state.const_join = true;
            },
            myLove(){
                this.axios({//猜你喜欢
                    url:API_URL + 'Home/Goods/my_love',
                    method:'get',
                    params:{
                        app_user_id:sessionStorage.getItem('user_ID')
                    }
                }).then((res) => {
                    this.$store.state.dataLeave = res.data.data;
                }).catch((err) => {
                    console.log(err);
                });
            },
            ax(){
                this.axios({
                    url:API_URL + 'Home/Goods/goods',
                    method:'get',
                    params:{
                        goods_id:this.link_id,
                        app_user_id:sessionStorage.getItem('user_ID')
                    }
                }).then((res) => {
                    this.$store.state.commodity_data = res.data.data;
                    this.$store.state.catr_number= parseInt(res.data.data.goods_num);
                    // if(this.$store.state.catr_number <= 0){
                    //     this.$store.state.catr_number = '0';
                    // }
                    this.load_wrap = false; 
                }).catch((err) => {
                    console.log(err);
                });
            },
            reduce(){
                if(this.number <= 1)return;
                this.number--;
            },
            plus(){
                if(this.number >= this.data.minStock) 
                return;
                this.number++;
            }
        },
        updated(){

        },
        mounted() {
            document.body.scrollTop = 0;
            this.$store.state.commodity_data = '';
            this.$store.commit('value',this.$store.state.commodity_val);
            this.$store.commit('shops_switch',this.$store.state.const_join);
            if(sessionStorage.getItem('user_ID')){this.lv_switch = true}
            if(this.$route.params.status == 2){
                this.axios.post(API_URL + 'Home/Integral/integral_goodsdetail',qs.stringify({
                    goods_id:this.link_id
                })).then((res) => {
                    this.$store.state.commodity_data = res.data.data;
                    this.load_wrap = false;
                }).catch((err) => {
                    console.log(err);
                });
            }else{
                this.ax();
                this.myLove();               
            }
        },
        destroyed(){
            this.scrollWatch = false;
        },
        components:{
            PrHeader,
            Shopsn,
            prList,
            FootBtn,
            PageOption,
            detailOption
        }
    }
</script>
<style>
    .mint-swipe-indicator.is-active{
        background:#a1410b;
    }
</style>
<style lang="less" scoped>
    .product{
        background:#fff;
    }
    .describe{
        width:6.3rem;
        padding:0 1rem .35rem .2rem;
        position:relative;
        .fn{
            font-size:.36rem;
            color:#333;
            padding-top:.3rem;
            line-height:.5rem;
        }
        .timer{
            font-size:.25rem;
            color:#e02828;
            padding:.3rem 0;
        }
        .price.active{
            .orc{
                line-height: .4rem;
                padding-bottom: .2rem;
                .icon{
                    width: .4rem;
                    height: .4rem;
                    background:url(../../assets/integral.png) no-repeat;
                    background-size:100% 100%;
                    margin-right:.2rem;
                }
            }
            .new{
                padding:0;
            }
        }
        .price{
            padding-top:.2rem;
            .orc{
                color:#e02828;
                font-size:.32rem;
                em{
                    font-style:normal;
                    font-size:.48rem;
                }
            }
            .new{
                color:#757575;
                font-size:.25rem;
                padding-left:.2rem;
                s{
                    font-size:.24rem;
                }
            }
        }
        .share{
            position:absolute;
            right:.2rem;
            top:.3rem;
            text-align:center;
            .icon{
                display:block;
                width:.39rem;
                height:.42rem;
                background:url(../../assets/share.png) no-repeat;
                background-size:100% 100%;
            }
            p{
                font-size:.24rem;
                color:#555;
                line-height:.5rem;
            }
        }
    }
    .selected{
        padding:0 .2rem;
        height:1.1rem;
        line-height:1.1rem;
        font-size:.25rem;
        color:#777;
        position:relative;
        background:#fff;
        border-top:1px solid #f1f1f1;
        .number{
            font-size:.3rem;
            color:#333;
            padding-left:.55rem;
        }
        .btn-right{
            position:absolute;
            right:.3rem;
            top:50%;
            margin-top:-.12rem;
            width:.14rem;
            height:.24rem;
            background:url(../../assets/btn-right.png) no-repeat;
            background-size:100% 100%;
        }
    }
    
    .mint-swipe{
            height:6.22rem;
        .mint-swipe-items-wrap{
            div{
                width:100%;
                height:7.22rem;
                img{
                    width:100%;
                    height:100%;
                }
            }
        }
    }
    .prompt{
        width:100%;
        height:.9rem;
        background:#f1f1f1;
        line-height:.9rem;
        text-align:center;
        font-size:.26rem;
        color:#999;
    }
</style>