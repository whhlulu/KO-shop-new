<template>
    <div class="KOhome">
        <div v-title data-title="主页">主页</div>
        <home-header :userName="getData"></home-header>
        <mt-swipe :auto="3000">
            <mt-swipe-item v-for="item in this.$store.state.KOhome_data.banner" :key="item.id">
                <img class="home-banner-img" :src="IMG_URL + item.pic_url"  @click="goAd(item.ad_link, item.title)" />
                <!--<div class="swipe-title">dadsad</div>-->
            </mt-swipe-item>
        </mt-swipe>
        <news-card :nav="$store.state.categoryLists"></news-card>
        <!--<news-flash :nav="$store.state.categoryLists"></news-flash>-->
        <!--<new-list-scroll></new-list-scroll>-->
        <to-Top></to-Top>
    </div>
</template>
<script>
    import { MessageBox, Toast, Popup } from 'mint-ui';
    import HomeHeader from './children/Header';
    import NewsFlash from './children/newsFlash';
    import NewsCard from './children/newsCard.vue';
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
            if(!this.$store.state.KOhome_data){
                this.gethome()
            }
            if(this.$store.state.categoryLists.length===0){
                this.getCategoryLists()
            }
        },
        methods:{
            gethome(){
                //轮播数据来源-移动端网页banner
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
            },
            getCategoryLists(){
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
            goAd(address,name){
                window.location.href = address
//                window.mui.openWindow({
//                    url: '/#/KOinfo/358',
//                    id: 'whh-second-wv',
//                    styles: {                             // 窗口参数 参考5+规范中的WebviewStyle,也就是说WebviewStyle下的参数都可以在此设置
//                        titleNView: {                       // 窗口的标题栏控件
//                            titleText:name||"推荐视频",                // 标题栏文字,当不设置此属性时，默认加载当前页面的标题，并自动更新页面的标题
//                            titleColor:"#000000",             // 字体颜色,颜色值格式为"#RRGGBB",默认值为"#000000"
//                            titleSize:"17px",                 // 字体大小,默认17px
//                            backgroundColor:"#F7F7F7",        // 控件背景颜色,颜色值格式为"#RRGGBB",默认值为"#F7F7F7"
//                            progress:{                        // 标题栏控件的进度条样式
//                                color:"#00FF00",                // 进度条颜色,默认值为"#00FF00"
//                                height:"2px",                    // 进度条高度,默认值为"2px"
//                            },
//                            homeButton: true,
//                            autoBackButton: true,
//                            splitLine:{                       // 标题栏控件的底部分割线，类似borderBottom
//                                color:"#CCCCCC",                // 分割线颜色,默认值为"#CCCCCC"
//                                height:"1px"                    // 分割线高度,默认值为"2px"
//                            }
//                        }
//                    }
//                });
            },
        },
        components: {
            HomeHeader,
            NewsFlash,
            NewsCard,
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
        .swipe-title{
            position: absolute;
            left: 0px;
            bottom: 0px;
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