<template>
    <div class="KOhome">
        <div v-title data-title="主页">主页</div>
        <home-header :userName="getData"></home-header>
        <mt-swipe :auto="3000">
            <mt-swipe-item v-for="item in this.$store.state.KOhome_data.banner" :key="item.id">
                <img class="home-banner-img" :src="URL + item.pic_url"  @click="goAd(item.ad_link)" />
            </mt-swipe-item>
        </mt-swipe>
        <news-flash :nav="$store.state.categoryLists"></news-flash>
        <new-list-scroll></new-list-scroll>
        <to-Top></to-Top>
    </div>
</template>
<script>
    import { MessageBox, Toast, Popup } from 'mint-ui';
    import HomeHeader from './children/Header';
    import NewsFlash from './children/newsFlash';
    import newListScroll from '../KOpage/newListScroll.vue'
    import toTop from '@/components/page/toTop'; //回到顶部
    export default {
        name: 'KOhome',
        data() {
            return {
                getData:'',
            }
        },
        created() {
            //是否登陆过
            let userid  =  localStorage.getItem('user_ID');
            if(userid){
                sessionStorage.setItem('user_ID', userid);
            }
            var userName = this.$route.params.userName;
            this.getData = userName;
            ////轮播数据来源-移动端网页banner
            this.axios({
                url: this.$httpConfig.home,
                method: 'post'
            }).then((res) => {
                var json_wx = JSON.parse(res.request.response);
                if(json_wx.status == 999) {
                    window.location.href = json_wx.msg;
                    return;
                }
                this.$store.state.KOhome_data = res.data.data;
            }).catch((err) => {
                console.log(err)
            });
            this.$store.state.lunboList = [
                {id:1,pic_url:'http://center.shopsn.cn/Uploads/ad/2018-06-08/5b1a164b06c5b.jpg'},
                {id:2,pic_url:'http://center.shopsn.cn/Uploads/ad/2018-06-08/5b1a18c3e6fa0.jpg'},
            ];
            this.axios({
                url: this.$httpConfig.categoryLists,
                method: 'get',
                params: {
                    app_user_id: sessionStorage.getItem('user_ID'),
                }
            }).then((res) => {
                if(res.data.status){
                    this.$store.state.categoryLists = res.data.data;
                }else{
                    Toast("获取资讯分类异常")
                }
            }).catch((err) => {
                Toast("获取资讯分类异常")
                console.log(err);
            });
        },
        methods:{
            goAd(address){
                window.open(address);
            },
        },
        components: {
            HomeHeader,
            NewsFlash,
            newListScroll,
            toTop
        }
    }
</script>
<style lang="less">
    .KOhome{
        .home-banner-img{
            background-size: 100%;
        }
        .mint-swipe-indicators{
            width: 100%;
            text-align: center;
        }
    }
</style>
<style lang="less" scoped>
.KOhome{
    .mint-swipe{
        width:100%;
        height:3.28rem;
        img{
            width:100%;
            height:100%;
        }
        .mint-swipe-indicators{
            .mint-swipe-indicator{
                width:20px;
                height:20px;
            }
        }
    }
}
</style>