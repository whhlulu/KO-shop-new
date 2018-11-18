<template>
    <div class="card-wrap">
        <div class="card-wrap-item" v-for="(item,index) in nav" :key="item.id">
            <div class="header" @click="link(item.id,item.name)">
                {{item.name}}
                <span class="goList"></span>
            </div>
            <div class="con">
                <el-row :gutter="20">
                    <el-col :span="12" v-for="(newItem,index) in item.data">
                        <div class="new-item">
                            <img class="v-img" v-lazy="IMG_URL + newItem.pic_url">
                            <div class="title">{{newItem.name}}</div>
                        </div>
                    </el-col>
                </el-row>
                <div v-if="item.data.length===0">暂无</div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'newsCard',
        data() {
            return {}
        },
        props: {
            nav: null
        },
        mounted(){
        },
        methods: {
            link(id, name){
                // 判断数据是否需要更新
                if (sessionStorage.getItem('KOlist_index') && sessionStorage.getItem('KOlist_index') != id) {
                    this.getAllNewList(id)
                }
                sessionStorage.setItem('KOlist_name', name)
                this.$router.push({
                    path: `/KOlist/${id}`
                });
            },
            getAllNewList(id){
                var this_ = this;
                this.$store.state.KOAllpage = 1; //初始页
                this.$store.state.KOAllqueryLoading = false; //整个加载的框
                this.$store.state.KOAllallLoaded = false;
                this.$store.state.KOAllmoreLoading = false;
                this.$store.state.KOAllloading = false;
                this.$store.state.KOAllno_data = false;
                this.$store.state.KOAllslidingSwitch = true;
                this_.$store.state.AllNewList = [];
                var KOlistCurType = sessionStorage.getItem('KOlistCurType') || '1'
                this.axios({
                    url: `${this.$httpConfig.articleLists}/cid/${id}/page/${this_.$store.state.KOAllpage}/type/${KOlistCurType}`,
                    method: 'get',
                    params: {
                        app_user_id: sessionStorage.getItem('user_ID'),
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
        }
    }
</script>
<style lang="less" scoped>
    .card-wrap {
        margin-bottom: .3rem;
        .card-wrap-item {
            background: #fff;
            margin-top: .24rem;
            padding: .24rem;
            .header {
                position: relative;
                height: .48rem;
                line-height: .48rem;
                text-align: center;
                font-size: .32rem;
                .goList {
                    position: absolute;
                    right: 0;
                    top: .04rem;
                    width: .18rem;
                    height: .36rem;
                    display: block;
                    background-image: url("../../../assets/btn-right.png");
                    background-size: 100% 100%;
                }
            }
            .con {
                .new-item {
                    padding-top: .1rem;
                    padding-bottom: .1rem;
                    .v-img {
                        width: 100%;
                        height: 2rem;
                        border-radius: .08rem;
                    }
                    .title{
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        height: .5rem;
                        line-height: .5rem;
                        color:#333;
                    }
                }
            }
        }
    }
</style>