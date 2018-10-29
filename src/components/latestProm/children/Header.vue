<template>
    <div class="header">
       <span @click="btnGo" class="btnGo"></span>
        <div class="header_seek" @click="searchIn">
            <img class="header_seek_img" :src="seekImg" alt="搜素img">
            <input type="text" placeholder="搜索宝贝、店铺...">
        </div>
        <div class="header_news">
            <router-link to="">
                <img class="header_news_RichScan" :src="RichScan" alt="扫一扫img">
                <div class="header_RichScan">扫一扫</div>
            </router-link>
            <router-link to = '/myNews'>
                <img class="header_news_advices" :src="advices" alt="消息img">
                <div class="header_RichScan">消息中心</div>
            </router-link>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'prom-header',
        data() {
            return {
                seekImg:require('@/assets/images/seek.png'),
                RichScan:require('@/assets/images/RichScan.png'),
                advices:require('@/assets/images/advices.png')
            }
        },
        methods: {
            searchIn() {
                this.$router.push({
                    path:'/search'
                })
            },
             btnGo(){
                this.$router.go(-1);
            },
        }
    }
</script>
<style lang="less" scoped>
    .header{
        width: 7.5rem;
        height: 0.9rem;
        background-color: #D19E29;
        position: relative;
        overflow: hidden;
        .btnGo{
            position:absolute;
            left:.2rem;
            top:50%;
            margin-top:-.23rem;
            width:.46rem;
            height:.46rem;
            background:url(../../../assets/btn-return.png) no-repeat;
            background-size:100% 100%;
        }
        .header_seek{
            width: 4.5rem;
            height: 0.6rem;
            /*margin: auto;*/
            margin-left:1rem;
            background-color: #E9C440;
            margin-top: 0.15rem;
            border-radius: 0.25rem;
            position: relative;    
        }
         .header_seek input{
                width: 100%;
                height: 0.6rem;
                border-radius: 0.25rem ;
                border: none;
                outline: none;
                font-size: 0.26rem;
                text-indent: 0.75rem;
                background-color: #E9C440;
                color:#fff;
            }
         .header_seek_img{
             position: absolute;
             top:0.18rem;
             left: 0.25rem;
             display: block;
             width: 0.26rem;
             height: 0.27rem;
         }   
         .header_seek input::-webkit-input-placeholder{
                color: #fff;
         }
         .header_news{
             position: absolute;
             right: 0.1rem;
             top:0.15rem;
             width: 2rem;
             height: 0.62rem; 
           	
         }
         .header_news a{
             display: block;
             width: 1rem;
             height: 0.62rem;
             float: left; 
             text-decoration: none;
             text-align: center;
             color: #fff;
             font-size: 0.16rem
         }
         .header_news_RichScan{
             width: 0.32rem;
             height: 0.32rem;
             display: block;
             margin: auto;
             margin-top: 0.07rem
         }
        .header_RichScan{
            width: 100%;
            line-height: 0.3rem
        }
        .header_news_advices{
             width: 0.38rem;
             height: 0.37rem;
             display: block;
             margin: auto;
             margin-top: 0.02rem
        }
    }
</style>