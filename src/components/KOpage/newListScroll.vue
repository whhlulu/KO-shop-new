<template>
    <div class="new-list-scroll">
        <new-list :newList="$store.state.homeNewList"></new-list>
        <div class="comm-null" v-if="$store.state.homeNewList.length===0">
            <div class="con-wrap text-center">
                <img src="../../assets/null_com.png">
                <p>暂时没有资讯</p>
            </div>
        </div>
        <p class="page-infinite-loading" v-show="$store.state.KOhomequeryLoading">
            <mt-spinner type="fading-circle" color="#666" :size="20" v-show="$store.state.KOhomemoreLoading"></mt-spinner>
            <span style="font-size:.2rem;color:#666;" v-show="$store.state.KOhomeallLoaded">暂无更多数据</span>
            <span style="font-size:.2rem;color:#666;" v-show="$store.state.KOhomeloading">加载中...</span>
        </p>
    </div>
</template>
<script>
    import {MessageBox, Toast} from 'mint-ui';
    import newList from './children/newList.vue'
    import qs from 'qs';
    export default {
        name: 'newListScroll',
        data(){
            return {
                scrollWatch: true,
            }
        },
        components: {
            newList,
        },
        created() {
            //document.body.scrollTop = 0;
            this.$store.state.KOhomepage = 1; //初始页
            this.$store.state.KOhomequeryLoading = false; //整个加载的框
            this.$store.state.KOhomeallLoaded = false;
            this.$store.state.KOhomemoreLoading = false;
            this.$store.state.KOhomeloading = false;
            this.$store.state.KOhomeno_data = false;
            this.$store.state.KOhomeslidingSwitch = true;
            this.getOrderList();
            let this_ = this;
            // 注册scroll事件并监听
            var n = 100;
            window.addEventListener('scroll', () => {
                if (this_.scrollWatch) {
                    // 判断是否滚动到底部
                    if (document.body.scrollTop + window.innerHeight + 50 >= document.body.offsetHeight) {
                        if (this_.$store.state.KOhomeno_data === true) {
                            return false;
                        }
                        // 如果开关打开则加载数据
                        if (this_.$store.state.KOhomeslidingSwitch == true) {
                            this_.$store.state.KOhomeslidingSwitch = false;
                            if (this_.$store.state.KOhomeallLoaded === true) { //暂无更多
                                return false;
                            } else {
                                this_.$store.state.KOhomepage++;
                                this_.$store.state.KOhomequeryLoading = true; // 整个加载的框
                                this_.$store.state.KOhomemoreLoading = true; //转圈动画
                                this_.$store.state.KOhomeloading = true; //加载中
                                this.axios({
                                    url:`${this.$httpConfig.articleLists}/page/${this_.$store.state.KOhomepage}`,
                                    method:'get',
                                    params:{
                                        app_user_id:sessionStorage.getItem('user_ID'),
                                    }
                                }).then((res) => {
                                    this_.$store.state.KOhomeslidingSwitch = true;
                                    this_.$store.state.KOhomequeryLoading = false; // 整个加载的框
                                    var data = res.data.data.records;
                                    data.forEach(function (val, index) {
                                        this_.$store.state.homeNewList.push(val);
                                    });
                                    if (data.length < 15) {
                                        this_.$store.state.KOhomeno_data = true;
                                        this_.$store.state.KOhomequeryLoading = true; //整个加载的框
                                        this_.$store.state.KOhomemoreLoading = false; //转圈动画
                                        this_.$store.state.KOhomeloading = false; //加载中
                                        this_.$store.state.KOhomeallLoaded = true; //暂无更多
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
            getOrderList(){
                var this_ = this;
                this_.$store.state.homeNewList=[];
                this.axios({
                    url:`${this.$httpConfig.articleLists}/page/${this_.$store.state.KOhomepage}`,
                    method:'get',
                    params:{
                        app_user_id:sessionStorage.getItem('user_ID'),
                    }
                }).then((res) => {
                    var data = res.data.data.records;
                    data.forEach(function (val, index) {
                        this_.$store.state.homeNewList.push(val);
                    });
                    if (data.length < 15) {
                        this.$store.state.KOhomeno_data = true;
                        this.$store.state.KOhomequeryLoading = true; //整个加载的框
                        this.$store.state.KOhomemoreLoading = false; //转圈动画
                        this_.$store.state.KOhomeloading = false; //加载中
                        this.$store.state.KOhomeallLoaded = true; //暂无更多
                    }
                }).catch((err) => {
                    Toast('获取资讯异常')
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
    .new-list-scroll {
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
</style>