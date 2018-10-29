<template>
	<div>
		<div v-title :data-title="text">{{text}}</div>
		<header class="header"><span @click="Return"></span>{{text}}</header>
        <div class="content">
            <h1 class="title">{{text}}</h1>
            <div class="line"></div>
            <div class="text">{{content}}</div>
        </div>
	</div>
</template>

<script>
	import qs from 'qs';
    export default {
        name : 'notice_child',
        data(){
            return {
                text:'协议详情',
                content:''
            }
        },
        methods:{
            Return:function(){
                this.$router.go(-1);
            },
            unescape(html) {
                return String(html)
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, '\'')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>');
            }
        },
        mounted() {
            this.axios.post(this.$httpConfig.StoreHelp,qs.stringify({
                title:this.$store.state.agreenmentName
            })).then((res)=>{
                this.text = res.data.data.title;
                this.content = res.data.data.info;
            })
        },
        created(){
           
        }
    }
</script>
<style lang="less" scoped>
.header{
    width:100%;
    height:.9rem;
    background: #C79A01;
    text-align:center;
    line-height:.9rem;
    color:#fff;
    font-size:.36rem;
    position:relative;
    span{
        width:.46rem;
        height:.46rem;
        border-radius:50%;
        display:block;
        position:absolute;
        left:.2rem;
        top:50%;
        margin-top:-.23rem;
        text-align:center;
        line-height:.46rem;
        font-family:'宋体';
        font-size:.4rem;
        background:url(../../../assets/btn-return.png) no-repeat;
        background-size:100% 100%;
    }
}
.content{
    padding: .3rem;
    .title{
        font-size: .3rem;
        text-align: center;
    }
    .line{
        margin: .2rem 0;
        height: .02rem;
        background: #999;
    }
    .text{
        font-size: .3rem;
    }
}
</style>