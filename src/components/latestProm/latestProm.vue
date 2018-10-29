<template>
    <div class="latset-wrap">
        <div v-title data-title="最新促销">最新促销</div>
        <latest-header></latest-header>
        <mt-swipe :auto="4000">
            <mt-swipe-item v-for="item in data.top_img" :key="item.id">
            	<img v-lazy="URL + item.pic_url">
            </mt-swipe-item>
        </mt-swipe>
        <latest-pro :banner="hot_promotion_img" :data="data"></latest-pro>
        <latest-item-list :status="sta" :set="set" :data="recommend_hot"></latest-item-list>
        <latest-sale :data="sale_promotion"></latest-sale>
        <div class="load-wrap" v-show="load_wrap" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
    </div>
</template>
<script>
    import latestHeader from './children/Header.vue';
    import latestPro from './children/promotion';
    import latestSale from './children/sale';
    import latestItemList from '@/components/Widget/slideItem';
    import { Swipe, SwipeItem } from 'mint-ui';
    export default {
        name : 'latestProm',
        data(){
            return {
                data:'',
                scrollWatch:true,
                load_wrap:true,
                hot_promotion_img:'',
                recommend_hot:'',
                sale_promotion:'',
                sta:'疯抢',
                set:'热卖',
            }
        },
        components:{
            latestHeader,
            latestPro,
            latestItemList,
            latestSale
        },
        updated(){
            var that = this;
            setTimeout(function(){
                that.load_wrap = false;
            },1000);
        },
        mounted(){
            document.body.scrollTop = 0;
        },
        destroyed(){
            this.scrollWatch = false;
        },
        created(){
            this.axios({
                url:API_URL + 'HomeIndex/promotions',
                method:'post'
            }).then(res => {
                this.data = res.data.data;
                this.hot_promotion_img = res.data.data.hot_promotion_img;
                this.recommend_hot = res.data.data.recommend_hot;
                this.sale_promotion = res.data.data.sale_promotion;
            }).catch(err => {
                console.log(err)
            });
			
        }
    }
</script>
<style lang="less" >
.latset-wrap{
    .mint-swipe{
        height: 3.15rem;
        .mint-swipe-items-wrap{
            img{
                width: 100%;
                height: 3.15rem;
            }
        }
    }
}
</style>