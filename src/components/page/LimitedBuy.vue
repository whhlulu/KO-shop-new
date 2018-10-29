<template>
    <div>
        <div v-title :data-title="title">{{title}}</div>
        <buy-header :text="title"></buy-header>
        <div class="content-wrap">
            <img v-lazy="bannerImg" class="banner">
            <div class="hot-wrap">
                <title-header :title="hotTitle"></title-header>
                <div class="item-lest-wrap">
                    <div class="item-list clearfix" v-for="index in con.dataImg.length" :key="index.id">
                        <div class="pull-left fl">
                            <span>{{index}}</span>
                            <img v-lazy="con.dataImg[index-1]">
                        </div>
                        <div class="pull-right fl">
                            <p class="details">{{con.dataItem[index-1]}}</p>
                            <p class="Price">￥<s>{{con.price[index-1]}}.00</s></p>
                            <p class="new-price">
                                <span class="new-pr"><i>￥</i>{{con.newPrice[index-1]}}.00</span>
                                <input type="button" value="立即购买" @click="toDeta">
                                <em></em>
                            </p>
                            <p class="timer">距结束：<span>22:50:50:60</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="hotGoods-wrap">
                <title-header :title="LimitTitle"></title-header>
                <ul class="content-main clearfix">
                    <li class="fl" v-for="(item,index) in content.imhSrc.length" :key="item.id"  @click="toDeta">
                        <img v-lazy="content.imhSrc[index]">
                        <p class="desi">{{content.desI[index]}}</p>
                        <p class="price">￥<span>{{content.price[index]}}</span>.00</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import BuyHeader from './children/header.vue';
    import titleHeader from './children/group-title.vue';
    export default {
        name : 'limitedbuy',
        data(){
            return {
                title:'限时团购',
                hotTitle:'人气团购',
                LimitTitle:'限时团购',
                scrollWatch:true,
                bannerImg:require('@/assets/con21.jpg'),
                con:{
                    dataImg:[require('@/assets/con22.jpg'),require('@/assets/con22.jpg'),require('@/assets/con22.jpg'),require('@/assets/con22.jpg')],
                    dataItem:['爱股轩学习终端 每日解盘直播（学习终端+PC端MINI）','爱股轩学习终端 每日解盘直播（学习终端+PC端MINI）','爱股轩学习终端 每日解盘直播（学习终端+PC端MINI）','爱股轩学习终端 每日解盘直播（学习终端+PC端MINI）'],
                    price:['2980','2981','2981','2981'],
                    newPrice:['2888','2882','2882','2882']
                },
                // content:{
                //     imhSrc:[require('@/assets/con16.jpg'),require('@/assets/con17.jpg'),require('@/assets/con18.jpg'),require('@/assets/con18.jpg')],
                //     desI:['学习终端+PC端MINI','炒股入门必读股票投资炒股入门必读股票投资','董钟祥的股票教室开课','爱股轩100点券在线充值'],
                //     price:[2980,16,2980,10]
                // }
            }
        },
        components:{
            BuyHeader,
            titleHeader
        },
        mounted() {
            document.body.scrollTop = 0;
        },
        destroyed(){
            this.scrollWatch = false;
        },
        methods:{
            toDeta:function(){
                this.$router.push({
                    name : 'product'
                });
            }
        }
    }
</script>
<style lang="less" scoped>
    .content-wrap{
        .banner{
            width:7.5rem;
            height:4.15rem;
        }
        .hot-wrap{
            .item-lest-wrap{
                background:#f1f1f1;
                .item-list:nth-child(1){
                    .pull-left{
                        span{
                            background:url(../../assets/item-hot1.png) no-repeat;
                            background-size:100% 100%;
                        }
                    }
                }
                .item-list:nth-child(2){
                    .pull-left{
                        span{
                            background:url(../../assets/item-hot2.png) no-repeat;
                            background-size:100% 100%;
                        }
                    }
                }
                .item-list:nth-child(3){
                    .pull-left{
                        span{
                            background:url(../../assets/item-hot3.png) no-repeat;
                            background-size:100% 100%;
                        }
                    }
                }
                .item-list{
                    width:7.1rem;
                    padding:.43rem .2rem;
                    height:3.31rem;
                    background:#fff;
                    margin-bottom:.2rem;
                    .pull-left{
                        width:2.93rem;
                        height:2.93rem;
                        position:relative;
                        img{
                            width:100%;
                            height:100%;
                        }
                        span{
                            position:absolute;
                            left:0;
                            top:-.2rem;
                            text-align:center;
                            width:.4rem;
                            height:.4rem;
                            background:url(../../assets/item-hot4.png) no-repeat;
                            background-size:100% 100%;
                            font-size:.28rem;
                            color:#fff;
                            text-align:center;
                            line-height:.5rem;
                            overflow:hidden;
                        }
                    }
                    .pull-right{
                        width:3.5rem;
                        padding-left:.65rem;
                        .details{
                            width:3.18rem;
                            font-size:.28rem;
                            line-height:.4rem;
                            color:#333;
                        }
                        .Price{
                            width:3.33rem;
                            font-size:.22rem;
                            color:#999;
                            text-align:right;
                            line-height:.6rem;
                            s{
                                font-size:.26rem;
                            }
                        }
                        .timer{
                            font-size:.28rem;
                            color:#555;
                            padding-top:.25rem;
                            span{
                                color:#f9781e;
                                font-size:.28rem;
                            }
                        }
                        .new-price{
                            position:relative;
                            width:3.33rem;
                            height:.77rem;
                            line-height:.77rem;
                            color:#fff;
                            background: -webkit-linear-gradient(left, #f97522, #fd5148);
                            background: -o-linear-gradient(right, #f97522, #fd5148);
                            background: -moz-linear-gradient(right, #f97522, #fd5148);
                            background: linear-gradient(to right, #f97522, #fd5148);
                            .new-pr{
                                padding-left:.2rem;
                                font-size:.32rem;
                                i{
                                    font-size:.24rem;
                                    font-style:normal;
                                }
                            }
                            em{
                                position:absolute;
                                top:0;
                                right:0;
                                border-top: .38rem solid transparent;
                                border-bottom: .38rem solid transparent;
                                border-right: .18rem solid #fff;
                            }
                            input{
                                position:absolute;
                                top:50%;
                                right:.3rem;
                                margin-top:-.25rem;
                                width:1.33rem;
                                height:.5rem;
                                border:none;
                                background:#fff111;
                                border-radius:5px;
                                font-size:.24rem;
                                color:#bb0548;
                            }
                        }
                    }
                }
            }
        }
        .hotGoods-wrap{
            background:#f2f2f2;
            .content-main{
                li{
                    width:3.7rem;
                    height:4.96rem;
                    background:#fff;
                    margin-top:.1rem;
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
    }
</style>