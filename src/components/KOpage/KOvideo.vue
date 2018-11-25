<template>
    <div class="KOinfo">
        <div v-title data-title="图文详情">图文详情</div>
        <div class="info">
            <div class="header">{{title}}</div>
            <div class="info-detail" v-html="info">{{info}}</div>
        </div>
        <div class="info-footer">
            <span @click="btnGo" class="btnGo">
                <img src="../../assets/images/return_icon_top.png" alt="返回">
                返回
            </span>
            <span class="collect" :class="{active:is_collect}" @click="collect"></span>
        </div>
    </div>
</template>
<script>
    import {Picker, MessageBox, Toast, InfiniteScroll} from 'mint-ui';
    import qs from 'qs';
    export default {
        name: 'newListScroll',
        data(){
            return {
                title: '图文详情',
                info: '',
                is_collect: false,
            }
        },
        components: {
        },
        created(){
            document.body.scrollTop = 0;
            this.getInfo()
        },
        methods: {
            getInfo(){
                this.axios({
                    url: `${this.$httpConfig.articleInfo}/id/${this.$route.params.id}`,
                    method: 'get',
                    params: {
                        app_user_id: sessionStorage.getItem('user_ID'),
                    }
                }).then((res) => {
                    console.log(res)
                    this.title = res.data.data.name;
                    this.info = res.data.data.content;
                    this.is_collect = res.data.data.is_collect;
                }).catch((err) => {
                    Toast('获取图文详情异常')
                    console.log(err);
                });
            },
            btnGo() {
                this.$router.go(-1);
            },
            collect() {
                this.axios({
                    url: `${this.$httpConfig.collectArticle}/${this.$route.params.id}`,
                    method: 'get',
                    params: {
                        app_user_id: sessionStorage.getItem('user_ID'),
                    }
                }).then((res) => {
                    if(res.data.status == 10001) {
                        this.$router.push('/LogIn');
                    }else if(res.data.status == 1){
                        this.is_collect = !this.is_collect;
                        Toast(res.data.data.msg || '操作成功')
                    }else{
                        Toast('点击收藏异常')
                    }
                }).catch((err) => {
                    Toast('点击收藏异常')
                    console.log(err);
                });
            }
        }
    }
</script>
<style lang="less">
    .info-detail {
        * {
            font-size: 17px;
            word-wrap: break-word;
            text-align: justify;
            color: #505050;
            line-height: 1.647;
            padding: 0;
            margin-bottom: 8px;
            font-family: helvetica!important;
        }
        img{
           width: 300px!important;
        }
        .video-js {
            width: 320px;
            height: auto;
        }
    }

</style>
<style lang="less" scoped>
    .KOinfo {
        width: 100%;
        height: 100%;
        background: #fff;
        position: relative;
        .info {
            height: 100%;
            box-sizing: border-box;
            padding: 0rem .4rem 50px .4rem;
            overflow-y: auto;
            .header{
                font-size: 20px;
                margin: .2rem 0;
            }
        }
        .info-footer{
            position: absolute;
            left: 0px;
            bottom: 0px;
            height: 50px;
            width: 100%;
            background: #fff;
            .btnGo {
                height: 50px;
                line-height: 50px;
                img{
                    width: 26px;
                    height: 26px;
                    margin: 12px 0 12px 16px;
                }
            }
            .collect {
                position: absolute;
                top: .24rem;
                right: .3rem;
                width: .52rem;
                height: .48rem;
                background: url(../../assets/images/xinxin.png) no-repeat;
                background-size: 100% 100%;
            }
            .collect.active {
                background: url(../../assets/images/xu_xinxin.png) no-repeat;
                background-size: 100% 100%;
            }
        }
    }
</style>