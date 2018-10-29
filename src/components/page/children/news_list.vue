<template>
    <div class="news">
        <ul class="wrap" v-if="$store.state.news_data.length != 0">
            <li class="clearfix" v-for="item in $store.state.news_data" :key="item.id" @click="tolink(item)">
                <div class="img-wrap fl">
                    <img src="../../../assets/news2.png">
                </div>
                <div class="text-wrap fl">
                    <h5>{{item.theme}}</h5>
                    <p class="text1-hidden">{{item.news_info}}</p>
                </div>
                <div class="time fl">{{item.create_time}}</div>
            </li>
        </ul>
        <div class="default text-center" v-else>
            <img src="../../../assets/news_active.png">
            <p class="text">还没有消息哦，继续逛逛吧！</p>
        </div>
    </div>
</template>
<script>
    export default {
        name:'list',
        data(){
            return {

            }
        },
        methods:{
            tolink(item){
                this.$router.push({
                    name:'newsConent',
                    params:{
                        id:item.id,
                        status:1
                    }
                });
            }
        },
        mounted(){
            
        }
    }
</script>
<style scoped lang="less">
    .news{
        background:#fff;
        .wrap{
            margin:.2rem 0;
            padding:0 .2rem;
            li{
                width: 100%;
                height: 1.5rem;
                border-bottom:1px solid #c1c1c1;
                box-sizing: border-box;
                padding-top:.3rem;
                .img-wrap{
                    width: 1rem;
                    height: 1rem;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                .text-wrap{
                    width: 4.7rem;
                    padding-left:.3rem;
                    box-sizing: border-box;
                    h5{
                        font-size:.3rem;
                        color:#333;
                        padding-bottom:.2rem;
                    }
                    p{
                        font-size:.25rem;
                        color:#999;
                    }
                }
                .time{
                    font-size:.25rem;
                    color:#aaa;
                }
            }
            li:last-child{
                border:none;
            }
        }
        .default{
            padding-top:2.55rem;
            padding-bottom:1rem;
            background:#f1f1f1;
            img{
                width: 3.53rem;
                height: 2.68rem;
            }
            .text{
                padding-top:.4rem;
                font-size:.32rem;
                color:#666;
            }
        }
    }
</style>