<template>
    <div class="KOinfo">
        <div v-title data-title="图文详情">图文详情</div>
        <easy-header :title="title"></easy-header>
        <div class="info" v-html="info">
            {{info}}
        </div>
    </div>
</template>
<script>
    import {Picker, MessageBox, Toast, InfiniteScroll} from 'mint-ui';
    import easyHeader from './children/easyHeader.vue';
    import qs from 'qs';
    export default {
        name: 'newListScroll',
        data(){
            return {
                title: '图文详情',
                info: ''
            }
        },
        components: {
            easyHeader,
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
                    this.info = res.data.data.content
                }).catch((err) => {
                    Toast('获取图文详情异常')
                    console.log(err);
                });
            }
        }
    }
</script>
<style lang="less">
    .info {
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
    }

</style>
<style lang="less" scoped>
    .KOinfo {
        .info {
            height: 100vh;
            background: #fff;
            overflow-y: auto;
            padding: 1rem .4rem;
        }
    }
</style>