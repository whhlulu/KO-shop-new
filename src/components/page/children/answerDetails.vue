<template>
    <div class="pr-tab-wrap">
        <div v-title data-title="商品咨询">商品咨询</div>
        <pr-header :text="title" :number="number"></pr-header>
        <div class="g_container">
            <div class="g_goods">
                <div class="goods_cover">
                    <img src="http://center.shopsn.cn/Uploads/goods/2018-08-16/5b753c20af7b7.jpg" alt="">
                </div>
                <div class="goods_info">
                    <div class="goods_info_name text2-hidden">七彩莲花灯座酥油灯家用佛供灯油灯佛灯供灯蜡烛台供佛灯长明灯 红色</div>
                </div>
            </div>
            <div class="g_problem">
                <div class="g_problem_heade">用户g***8的提问：<span class="g_problem_time fr">2018-06-11</span></div>
                <div class="g_problem_content">好吃吗好吃吗好吃吗</div>
            </div>
            <div class="g_answers">
                <div class="g_answers_num">共1个回答</div>
                <ul class="g_answers_list">
                    <li>
                        <div class="g_answers_head">
                            <span class="g_answers_list_status">已买</span> 用户g***8说：
                        </div>
                        <div class="g_answers_list_content">
                            哈哈哈哈哈哈哈哈哈哈哈啊哈哈哈哈哈哈哈哈哈哈哈哈哈哈
                        </div>
                        <div class="g_answers_list_time">2018-06-11</div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="load" v-show="load" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
        <div class="load-wrap" v-show="load_wrap" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
    </div>
</template>
<script>
    import { Toast } from 'mint-ui';
    import QS from 'qs';
    import PrHeader from './header.vue';
    export default {
        name : 'tab',
        data(){
            return { 
                title:'商品咨询',
                number:'0',
                load:false,
                load_wrap:false
            }
        }, 
        methods:{
          formatTime(t){
                var time = new Date(Number(t) * 1000);
                var Y = time.getFullYear();
                var m = time.getMonth() + 1;
                var d = time.getDate();
                if (m < 10) {
                    m = '0' + m;
                }
                if (d < 10) {
                    d = '0' + d;
                }
                return (Y + "-" + m + "-" + d);
            }, 
        },
        mounted() {
            this.load_wrap =false;
            
            document.body.scrollTop = 0;
        },
        components:{
            PrHeader
        }
    }
</script>
<style lang="less" scoped>
    .pr-tab-wrap{
        background:#f1f1f1;
        .g_container{
            .g_goods{
                position: relative;
                height: 1rem;
                padding: .2rem .8rem .2rem .2rem;
                background-color: #fff;
                .goods_cover{
                    position: absolute;
                    top: .2rem;
                    left: .2rem;
                    width: 1rem;
                    height: 1rem;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                .goods_info{
                    margin-left: 1.2rem;
                    padding: .14rem 0;
                    .goods_info_name{
                        color: #333;
                        font-size: .24rem;
                        height: .72rem;
                    }
                }
            }
            .g_goods::after {
                position: absolute;
                top: 45%;
                right: .26rem;
                -webkit-transform: translateY(-50%);
                transform: translateY(-50%);
                content: "";
                display: block;
                width: .2rem;
                height: .2rem;
                border-top: 1px solid #666;
                border-left: 1px solid #666;
                -webkit-transform-origin: 50%;
                transform-origin: 50%;
                -webkit-transform: rotate(135deg);
                transform: rotate(135deg);
            }
            .g_problem{
                padding: 0 .4rem .32rem;
                background-color: #fff;
                .g_problem_heade{
                    height: .68rem;
                    line-height: .68rem;
                    color: #666;
                    font-size: .24rem;
                    .g_problem_time{
                        color: #999;
                        font-size: .2rem;
                    }
                }
                .g_problem_content{
                    padding-left: .4rem;
                    color: #333;
                    font-size: .32rem;
                    font-weight: 700;
                }
            }
            .g_answers{
                .g_answers_num{
                    padding: 0 .2rem;
                    height: .64rem;
                    line-height: .64rem;
                    color: #666;
                    font-size: .24rem;
                }
                .g_answers_list{
                    padding: 0 .2rem;
                    background-color: #fff;
                    li{
                        padding-bottom: .2rem;
                        .g_answers_head{
                            padding: .3rem 0;
                            color: #666;
                            font-size: .24rem;
                            .g_answers_list_status{
                                display: inline-block;
                                margin: -.04rem .1rem 0 0;
                                padding: 0 .1rem;
                                height: .3rem;
                                line-height: .3rem;
                                color: #fff;
                                font-size: .2rem;
                                background-color: #D19E29;
                                vertical-align: middle;
                                border-radius: 1px;
                            }
                        }
                        .g_answers_list_content{
                            margin-bottom: .1rem;
                            padding-left: .4rem;
                            color: #333;
                            font-size: .32rem;
                        }
                        .g_answers_list_time{
                            margin-left: .4rem;
                            color: #999;
                            font-size: .2rem;
                        }
                    }
                }
            }
        }
    }
</style>
