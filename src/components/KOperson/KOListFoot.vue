<template>
    <div class="KOlist">
        <easy-header :title="我的足迹"></easy-header>
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
    import {Picker, MessageBox, Toast, InfiniteScroll} from 'mint-ui';
    import newList from '../KOpage/children/newList.vue'
    import easyHeader from '../KOpage/children/easyHeader.vue'
    import qs from 'qs';
    export default {
        name: 'listFoot',
        data(){
            return {
                newList: [],
                page: 1,
                //初始化加载相关参数
                queryLoading: false,
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
            easyHeader,
        },
        mounted() {
            document.body.scrollTop = 0;
            this.getOrderList();
            let this_ = this;
            // 注册scroll事件并监听
            var n = 100;
            window.addEventListener('scroll', () => {
                if (this_.scrollWatch) {
                    // 判断是否滚动到底部
                    if (document.body.scrollTop + window.innerHeight >= document.body.offsetHeight) {
                        if (this_.no_data === true) {
                            return false;
                        }
                        // 如果开关打开则加载数据
                        if (this_.slidingSwitch == true) {
                            this_.slidingSwitch = false;
                            if (this_.allLoaded === true) {
                                return false;
                            } else {
                                this_.page++;
                                this_.queryLoading = true;
                                this_.moreLoading = true;
                                this_.loading = true;

                                setTimeout(() => {
                                    this_.slidingSwitch = true;
                                    var data = [
                                        {id: (n + 1), title: 'asd1', pic_url: '', state: ''},
                                        {id: (n + 2), title: 'asda2', pic_url: '', state: ''},
                                        {id: (n + 3), title: 'asd3', pic_url: '', state: ''},
                                        {id: (n + 4), title: 'asdad4', pic_url: '', state: ''},
                                        {id: (n + 5), title: 'asd5', pic_url: '', state: ''},
                                    ]
                                    data.forEach(function (val, index) {
                                        this_.newList.push(val);
                                    });
                                    n = n + 20;
                                }, 2000)

//                                this.axios({
//                                    url:API_URL + 'Home/Order/myOrder',
//                                    method:'get',
//                                    params:{
//                                        app_user_id:sessionStorage.getItem('user_ID'),
//                                        p:this_.$store.state.page
//                                    }
//                                }).then((res) => {
//                                    this_.$store.state.slidingSwitch = true;
//                                    if(res.data.status == 0){
//                                        this_.$store.state.moreLoading = false;
//                                        this_.$store.state.allLoaded = true;
//                                        this_.$store.state.loading = false;
//                                        return false;
//                                    }
//                                    res.data.data.forEach(function(val,index){
//                                        this_.$store.state.order.push(val);
//                                        });
//                                }).catch((err) => {
//                                    console.log(err);
//                                });
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
            handleCommand(command) {
                this.$store.state.KOlistCurType = command;
            },
            getOrderList(){
                var data = [
                    {
                        id: 1,
                        title: '爱仕达1',
                        pic_url: '',
                        state: '',
                        company: '百度新闻是包含海量资讯的新闻服务平台,真实反映每时每刻的新闻热点。您可以搜索新闻事件、'
                    },
                    {id: 2, title: 'sasd2', pic_url: '', state: '', company: 'ssss'},
                    {id: 3, title: 'asd3', pic_url: '', state: '', company: 'ssss'},
                    {id: 4, title: '4', pic_url: '', state: '', like: true},
                    {id: 5, title: '5', pic_url: '', state: '', like: false},
                    {id: 6, title: '5', pic_url: '', state: ''},
                    {id: 7, title: '5', pic_url: '', state: ''},
                    {id: 8, title: 'asd5', pic_url: '', state: ''},
                    {id: 9, title: 'asd5', pic_url: '', state: ''},
                    {id: 10, title: 'asd5', pic_url: '', state: ''},
                ]
                this.newList = data;
                if (data.length < 10) {
                    this.no_data = true;
                }
//                this.axios({
//                        url:API_URL + 'Home/Order/myOrder',
//                        method:'get',
//                        params:{
//                            app_user_id:sessionStorage.getItem('user_ID'),
//                            p:this.$store.state.page
//                        }
//                    }).then((res) => {
//                        this.$store.state.order = res.data.data;
//                        if(res.data.data.length<10){this.$store.state.no_data = true;}
//                        this.$store.state.order_load_wrap = false;
//                    }).catch((err) => {
//                        console.log(err);
//                    });
            },
            toDetails(item, text, index){
                this.$router.push({
                    name: 'orderDetails',
                    params: {
                        order: item.id,
                        order_type: 2 //1为积分订单 2 为商品订单
                    }
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
        .nav-wrap {
            width: 100%;
            background: #fff;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 100;
            .nav-type {
                float: left;
                position: relative;
                height: .96rem;
                line-height: .96rem;
                padding: 0 .2rem;
                .el-dropdown-link{
                    font-size: 16px;
                    color: blue;
                }
                .list_shadow {
                    position: absolute;
                    width: 10px;
                    height: 100%;
                    right: 10px;
                    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAABXCAQAAACjUt0DAAAAAmJLR…AwtDMDRwAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAASUVORK5CYII=) no-repeat center right;
                    background-size: contain;
                    background-color: rgba(244, 245, 246, 0.3);
                }
            }
            .nav-list {
                overflow: hidden;
                overflow-x: scroll;
                -webkit-overflow-scrolling: touch;
                white-space: nowrap;
                .nav {
                    white-space: nowrap;
                    display: inline-block;
                    padding-left: .2rem;
                    padding-right: .2rem;
                    color: #505050;
                    text-decoration: none;
                    font-size: .34rem;
                    line-height: .96rem;
                    height: .96rem;
                    margin-left: .1rem;
                    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.3);
                }
                .nav.active {
                    color: #f85959;
                }
            }
        }
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