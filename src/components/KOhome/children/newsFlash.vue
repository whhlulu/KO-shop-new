<template>
    <div class="flash-wrap">
        <ul class="flash-dd clearfix">
            <li class="fl" v-for="(n,index) in nav" :key="n.id" @click="link(n.id)">
                    <img v-lazy="IMG_URL + n.pic_url">
                <p>{{n.name}}</p>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: 'newsflash',
        data() {
            return {
            }
        },
        props:{
            nav:null
        },
        mounted(){
        },
        methods: {
            link(id){
                if(sessionStorage.getItem('KOlist_index')&&sessionStorage.getItem('KOlist_index')!=id){
                    this.getAllNewList(id)
                }
                this.$router.push({
                    path:`/KOlist/${id}`
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
                this_.$store.state.AllNewList=[];
                var KOlistCurType = sessionStorage.getItem('KOlistCurType') || '2'
                this.axios({
                    url:`${this.$httpConfig.articleLists}/cid/${id}/page/${this_.$store.state.KOAllpage}/type/${KOlistCurType}`,
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
        }
    }
</script>
<style lang="less" scoped>
    .flash-wrap{
        background:#f2f2f2;
        .flash-dd{
            width:100%;
            padding-top:.27rem;
            background:#fff;
            border-bottom:1px solid #eaf0f4;
            li{
                width:25%;
                text-align:center;
                img{
                    width:1.26rem;
                    height:1.26rem;
                }
                p{
                    font-size:.28rem;
                    color:#333;
                    padding:.2rem 0;
                    line-height:100%;
                    font-weight:400;
                    font-size:.28rem;
                    color:#333;
                }
            }
        }
    }
</style>