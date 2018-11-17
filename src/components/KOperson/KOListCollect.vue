<template>
    <div class="KOlist">
        <easy-header title="我的收藏"></easy-header>
        <div class="new-list-scroll">
            <new-list :newList="newList"></new-list>
            <div class="comm-null" v-if="newList.length===0">
                <div class="con-wrap text-center">
                    <img src="../../assets/null_com.png">
                    <p>暂时没有商品</p>
                </div>
            </div>
            <p class="page-infinite-loading" v-show="queryLoading">
                <mt-spinner type="fading-circle" color="#666" :size="20" v-show="moreLoading"></mt-spinner>
                <span style="font-size:.2rem;color:#666;" v-show="allLoaded">暂无更多数据</span>
                <span style="font-size:.2rem;color:#666;" v-show="loading">加载中...</span>
            </p>
        </div>
    </div>
</template>
<script>
    import { Toast, InfiniteScroll} from 'mint-ui';
    import newList from '../KOpage/children/newList.vue'
    import easyHeader from '../KOpage/children/easyHeader.vue'
    import qs from 'qs';
    export default {
        name: 'listCollect',
        data(){
            return {
                newList: [],
                KOCollectPage: 1,
                //初始化加载相关参数
                queryLoading: false, //整个加载的框
                moreLoading: false,
                allLoaded: false,
                loading: false,
                scrollWatch: true,
                slidingSwitch: true,
                no_data: false,
            }
        },
        components: {
            newList,
            easyHeader
        },
        mounted() {
            var this_ = this;
            this.getCollectNewList();
            window.addEventListener('scroll', () => {
                if (this_.scrollWatch) {
                    // 判断是否滚动到底部
                    if (document.body.scrollTop + window.innerHeight + 50 >= document.body.offsetHeight) {
                        if (this_.no_data === true) {
                            return false;
                        }
                        // 如果开关打开则加载数据
                        if (this_.slidingSwitch == true) {
                            this_.slidingSwitch = false;
                            if (this_.allLoaded === true) { //暂无更多
                                return false;
                            } else {
                                this_.KOCollectPage++;
                                this_.queryLoading = true; // 整个加载的框
                                this_.moreLoading = true; //转圈动画
                                this_.loading = true; //加载中
                                this.axios({
                                    url:`${this.$httpConfig.myCollectList}/page/${this_.KOCollectPage}`,
                                    method:'get',
                                    params:{
                                        app_user_id:sessionStorage.getItem('user_ID'),
                                    }
                                }).then((res) => {
                                    this_.slidingSwitch = true;
                                    this_.queryLoading = false; // 整个加载的框
                                    var data = res.data.data.data;
                                    data.forEach(function (val, index) {
                                        this_.newList.push(val);
                                    });
                                    if (data.length < 10) {
                                        this_.no_data = true;
                                        this_.queryLoading = true; //整个加载的框
                                        this_.moreLoading = false; //转圈动画
                                        this_.loading = false; //加载中
                                        this_.allLoaded = true; //暂无更多
                                    }
                                }).catch((err) => {
                                    Toast('获取资讯异常')
                                    console.log(err);
                                });
                            }
                        }
                    }
                }

            });
        },
        destroyed(){
            this.scrollWatch = false;
        },
        methods: {
            getCollectNewList(){
                var this_ = this;
                this_.KOCollectPage = 1; //初始页
                this_.queryLoading = false; //整个加载的框
                this_.allLoaded = false;
                this_.moreLoading = false;
                this_.loading = false;
                this_.no_data = false;
                this_.slidingSwitch = true;
                this_.newList=[];
                this.axios({
                    url:`${this_.$httpConfig.myCollectList}/page/${this_.KOCollectPage}`,
                    method:'get',
                    params:{
                        app_user_id:sessionStorage.getItem('user_ID'),
                    }
                }).then((res) => {
                    if(res.data.status == 10001) {
                        this.$router.push('/LogIn');
                    }else{
                        var data = res.data.data.data;
                        data.forEach(function (val, index) {
                            this_.newList.push(val);
                        });
                        if (data.length < 10) {
                            this_.no_data = true;
                            this_.queryLoading = true; //整个加载的框
                            this_.moreLoading = false; //转圈动画
                            this_.loading = false; //加载中
                            this_.allLoaded = true; //暂无更多
                        }
                    }
                }).catch((err) => {
                    Toast('获取我的收藏异常')
                    console.log(err);
                });
            },
        }
    }
</script>
<style lang="less">
    .page-infinite-loading {
        span {
            .mint-spinner-fading-circle {
                display: inline-block;
                vertical-align: middle;
                margin-right: 5px;
            }
        }

    }
</style>

<style lang="less" scoped>
    .KOlist {
        .new-list-scroll {
            margin-top: 1rem;
            .comm-null {
                padding-top: .5rem;
                p {
                    font-size: .28rem;
                    color: #666;
                    padding-top: .2rem;
                }
            }
            .page-infinite-loading {
                text-align: center;
                height: 30px;
                line-height: 30px;
            }
        }
    }

</style>