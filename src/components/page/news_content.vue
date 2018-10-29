<template>
    <div>
        <div v-title :data-title="title">{{title}}</div>
        <newHeader :text="title" :set="true"></newHeader>
        <div class="content-wrap" v-if="$route.params.id == 1">
            <div class="hd">
                <h2>{{$store.state.news_con.theme}}</h2>
                <div class="clearfix">
                    <span class="name-wrap fl">发件人：<em>空气孔雀</em></span>
                    <span class="fr time">{{new Date($store.state.news_con.create_time * 1000).getFullYear()+'/'+(new Date($store.state.news_con.create_time * 1000).getMonth() + 1)+'/'+new Date($store.state.news_con.create_time * 1000).getDay()}}</span>
                </div>
            </div>
        </div>
        <div v-html="level" class="content"></div>
        <div class="load-wrap" v-show="load_wrap" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
    </div>
</template>
<script>
    import newHeader from './children/header';
    import qs from 'qs';
    export default {
        name : 'news_content',
        data(){
            return {
                title:'消息内容',
                load_wrap:true,
                level:''
            }
        },
        components:{
            newHeader
        },
        mounted(){
            if(this.$route.params.status == 2){
                this.axios.post(API_URL + 'Home/Pcenter/articleDetail',qs.stringify({
                    id:this.$route.params.id
                })).then((res) => {
                    // const oDiv = document.createElement('div');
                    // oDiv.className = 'c';
                    // oDiv.innerHTML = res.data.data;
                    // document.body.appendChild(oDiv);
                    this.level = res.data.data;
                    this.load_wrap = false;
                }).catch((err) => {
                    console.log(err);
                });
            }else{
                this.axios.post(API_URL + 'Home/News/content',qs.stringify({
                    news_id:this.$route.params.id
                })).then((res) => {
                    this.$store.state.news_con = res.data.data;
                    this.load_wrap = false;
                }).catch((err) => {
                    console.log(err);
                });
            };
        },
        render(createElement) {
            return createElement(
                this.level,   // tag name 标签名称
            )
        },
    }
</script>
<style scoped lang="less">
    .content-wrap{
        padding:0 .2rem;
        background:#fff;
        .hd{
            height: 1.45rem;
            border-bottom:1px solid #c1c1c1;
            h2{
                font-size:.32rem;
                color:#000;
                padding:.2rem 0;
            }
            .name-wrap{
                font-size:.28rem;
                color:#abacab;
                em{
                    font-style:normal;
                    font-size:.28rem;
                    color:#6ea720;
                }
            }
            .time{
                font-size:.28rem;
                color:#abacab;
            }
        }
    }
    .content{
        background: #fff;
        padding:.2rem;
        font-size:.28rem;
        color:#333;
        p{
            line-height: .48rem;
            padding:.3rem 0;
        }
    }
</style>