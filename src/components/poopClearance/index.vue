<template>
    <div class="poop-wrap">
        <div v-title data-title="尾货清仓">尾货清仓</div>
        <poop-header></poop-header>
        <mt-swipe :auto="4000">
            <mt-swipe-item v-for="item in data.top_img" :key="item.id">
                <img v-lazy="URL + item.pic_url">
            </mt-swipe-item>
        </mt-swipe>
        <div class="hd clearfix">
            <div class="title fl"><img src="../../assets/TimeLimit.png"></div>
            <count-down :endTime="endTime" :callback="callback" endText="已经结束了" class="fl" v-if="endTime"></count-down>
        </div>
        <itemList :data="data.activity" :status="sta" :set="set"></itemList>
        <div class="banner" v-for="item in data.poopClear_ad" :key="item.id"><img v-lazy="URL + item.pic_url"></div>
        <con-header :title="conTitle"></con-header>
        <hot-goods :data="data.last_clear"></hot-goods>
        <Shopsn></Shopsn>
        <div class="load-wrap" v-show="load_wrap" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
    </div>
</template>
<script>
    import poopHeader from '@/components/home/children/Header';
    import countDown from '@/components/home/children/children/countDown';
    import itemList from '@/components/Widget/slideItem';
    import conHeader from './children/conHeader';
    import hotGoods from '@/components/home/children/hotGoods';
    import Shopsn from '@/components/page/Shopsn.vue';
    import { Swipe, SwipeItem } from 'mint-ui';
    export default {
        name : 'poopClearance',
        data(){
            return {
                load_wrap:true,
                endTime:'',
                scrollWatch:true,
                data:'',
                sta:'抢购',
                set:'限时',
                conTitle:''
            }
        },
        mounted(){
            document.body.scrollTop = 0;
            this.axios({
                url:API_URL + 'Home/Index/poopClear',
                method:'post'
            }).then(res => {
                this.data = res.data.data;
                this.endTime = res.data.data.activity[0].time;
            }).catch(err => {
                console.log(err)
            });
        },
        methods:{
            callback(){
                console.log('已经结束了！')
            }
        },
        destroyed(){
            this.scrollWatch = false;
        },
        updated(){
            var that = this;
            setTimeout(function(){
                that.load_wrap = false;
            },1000);
        },
        components:{
            poopHeader,
            countDown,
            itemList,
            conHeader,
            hotGoods,
            Shopsn
        }
    }
</script>
<style lang="less">
    .poop-wrap{
        .mint-swipe{
            width: 100%;
            height: 3.34rem;
            img{
                width: 100%;
                height: 100%;
            }
        }
    }
</style>
<style lang="less" scoped>
    .hd{
        height: .9rem;
        padding:0 .2rem;
        box-sizing: border-box;
        background:#fff;
        padding-top:.28rem;
        .title{
            img{
                width: 2.19rem;
                height: .38rem;
            }
        }
    }
    .banner{
        padding-top:.2rem;
        img{
            width: 100%;
        }
    }
</style>