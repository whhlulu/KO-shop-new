<template>
    <div class="KOlist">
        <!--<div class="nav-wrap">-->
            <!--<div class="nav-type">-->
                <!--<el-dropdown trigger="click"  @command="handleCommand">-->
                    <!--<span class="el-dropdown-link">-->
                        <!--{{this.KOlistCurTypeData=='2'?'视频':'图文'}}-->
                        <!--<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
                    <!--</span>-->
                    <!--<el-dropdown-menu slot="dropdown">-->
                        <!--<el-dropdown-item command="1">图文</el-dropdown-item>-->
                        <!--<el-dropdown-item command="2">视频</el-dropdown-item>-->
                    <!--</el-dropdown-menu>-->
                <!--</el-dropdown>-->
                <!--&lt;!&ndash;<span class="list_shadow"></span>&ndash;&gt;-->
            <!--</div>-->
            <!--<div class="nav-list">-->
                <!--<a href="javascript:void(0)"-->
                   <!--class="nav"-->
                   <!--v-for="(item,index) in $store.state.categoryLists"-->
                   <!--:key="item.id"-->
                   <!--:class="{active:$route.params.type == item.id}"-->
                   <!--@click="changeCId(item.id)"-->
                <!--&gt;-->
                    <!--{{item.name}}-->
                <!--</a>-->
            <!--</div>-->
        <!--</div>-->
        <div class="nav-wrap">
            <span class="header_logo" @click="btnGo"></span>
            <span class="title">{{name}}</span>
            <div class="nav-type">
                <el-dropdown trigger="click"  @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{this.KOlistCurTypeData=='1'?'图文':'视频'}}
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="1">图文</el-dropdown-item>
                        <el-dropdown-item command="2">视频</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <!--<span class="list_shadow"></span>-->
            </div>
        </div>
        <div class="new-list-scroll">
            <new-list :newList="$store.state.AllNewList"></new-list>
            <div class="comm-null" v-if="$store.state.AllNewList.length===0 && !$store.state.KOAllqueryLoading">
                <div class="con-wrap text-center">
                    <img src="../../assets/null_com.png">
                    <p>暂时没有资讯</p>
                </div>
            </div>
            <p class="page-infinite-loading" v-show="$store.state.KOAllqueryLoading">
                <mt-spinner type="fading-circle" color="#666" :size="20" v-show="$store.state.KOAllmoreLoading"></mt-spinner>
                <span style="font-size:.28rem;color:#666;" v-show="$store.state.KOAllallLoaded">暂无更多数据</span>
                <span style="font-size:.28rem;color:#666;" v-show="$store.state.KOAllloading">加载中...</span>
            </p>
        </div>
    </div>
</template>
<script>
    import {Picker, MessageBox, Toast, InfiniteScroll} from 'mint-ui';
    import newList from './children/newList.vue'
    import Header from '@/components/page/children/header.vue';
    import qs from 'qs';
    export default {
        name: 'newListScroll',
        data(){
            return {
                name: sessionStorage.getItem('KOlist_name')||'资讯',
                KOlistCurTypeData: sessionStorage.getItem('KOlistCurType'),
                //初始化加载相关参数
                scrollWatch: true,
            }
        },
        components: {
            newList,
        },
        mounted() {
            //document.body.scrollTop = 0;
            var this_ = this;
            //判断是否需要重新请求分类数据
            if(this.$store.state.categoryLists.length===0){
                this.getCategoryLists();
            }
            //第一次请求首页数据, 数据是否是同一个分类由进入时判断
            if(this.$store.state.AllNewList.length===0 || (this.$store.state.AllNewList[0].article_category_id!=this.$route.params.type)){
                console.log('内部')
                this.getAllNewList();
            }

            // 注册scroll事件并监听
            window.addEventListener('scroll', () => {
                if (this_.scrollWatch) {
                    // 判断是否滚动到底部
                    if (document.body.scrollTop + window.innerHeight + 50 >= document.body.offsetHeight) {
                        if (this_.$store.state.KOAllno_data === true) {
                            return false;
                        }
                        // 如果开关打开则加载数据
                        if (this_.$store.state.KOAllslidingSwitch == true) {
                            this_.$store.state.KOAllslidingSwitch = false;
                            if (this_.$store.state.KOAllallLoaded === true) { //暂无更多
                                return false;
                            } else {
                                this_.$store.state.KOAllpage++;
                                this_.$store.state.KOAllqueryLoading = true; // 整个加载的框
                                this_.$store.state.KOAllmoreLoading = true; //转圈动画
                                this_.$store.state.KOAllloading = true; //加载中
                                var KOlistCurType = sessionStorage.getItem('KOlistCurType') || '2'
                                this.axios({
                                    url:`${this.$httpConfig.articleLists}/cid/${this.$route.params.type}/page/${this_.$store.state.KOAllpage}/type/${KOlistCurType}`,
                                    method:'get',
                                    params:{
                                        app_user_id:sessionStorage.getItem('user_ID'),
                                    }
                                }).then((res) => {
                                    this_.$store.state.KOAllslidingSwitch = true;
                                    this_.$store.state.KOAllqueryLoading = false; // 整个加载的框
                                    var data = res.data.data.records;
                                    data.forEach(function (val, index) {
                                        this_.$store.state.AllNewList.push(val);
                                    });
                                    if (data.length < 15) {
                                        this_.$store.state.KOAllno_data = true;
                                        this_.$store.state.KOAllqueryLoading = true; //整个加载的框
                                        this_.$store.state.KOAllmoreLoading = false; //转圈动画
                                        this_.$store.state.KOAllloading = false; //加载中
                                        this_.$store.state.KOAllallLoaded = true; //暂无更多
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
            console.log('kolist destroyed')
            this.scrollWatch = false;
        },
        methods: {
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
            handleCommand(command) {
                this.KOlistCurTypeData=command
                sessionStorage.setItem('KOlistCurType',command)
                this.getAllNewList();
            },
            changeCId(id){
                console.log(id)
                this.$router.push({
                    path:'/KOlist/'+id
                });
                this.getAllNewList();
            },
            getAllNewList(){
                var this_ = this;
                this.$store.state.KOAllpage = 1; //初始页
                this.$store.state.KOAllqueryLoading = true; //整个加载的框
                this.$store.state.KOAllallLoaded = false;
                this.$store.state.KOAllmoreLoading = true;
                this.$store.state.KOAllloading = true;
                this.$store.state.KOAllno_data = false;
                this.$store.state.KOAllslidingSwitch = true;
                this_.$store.state.AllNewList=[];
                var KOlistCurType = sessionStorage.getItem('KOlistCurType') || '2'
                this.axios({
                    url:`${this.$httpConfig.articleLists}/cid/${this.$route.params.type}/page/${this_.$store.state.KOAllpage}/type/${KOlistCurType}`,
                    method:'get',
                    params:{
                        app_user_id:sessionStorage.getItem('user_ID'),
                    }
                }).then((res) => {
                    var data = res.data.data.records;
                    data.forEach(function (val, index) {
                        this_.$store.state.AllNewList.push(val);
                    });
                    if (data.length < 15) {
                        this.$store.state.KOAllno_data = true;
                        this.$store.state.KOAllqueryLoading = true; //整个加载的框
                        this.$store.state.KOAllmoreLoading = false; //转圈动画
                        this_.$store.state.KOAllloading = false; //加载中
                        this.$store.state.KOAllallLoaded = true; //暂无更多
                    }
                }).catch((err) => {
                    Toast('获取资讯异常')
                    console.log(err);
                });
            },
            btnGo() {
                this.$router.go(-1);
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
            .header_logo{
                position: absolute;
                top: .24rem;
                left: .4rem;
                width: .46rem;
                height: .46rem;
                display: block;
                background-image: url("../../assets/images/return_icon_top.png");
                background-size: 100% 100%;
            }
            .title{
                display: inline-block;
                height: .96rem;
                line-height: .96rem;
                width: 100%;
                text-align: center;
                font-size: .36rem;
            }
            .nav-type {
                position: absolute;
                top:0;
                right:0;
                height: .96rem;
                line-height: .96rem;
                padding: 0 .2rem;
                .el-dropdown-link{
                    font-size: 16px;
                    color: #f85959;
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