<template>
    <div class="limited-wrap">
        <div class="hd clearfix">
            <div class="title fl"><i></i>尾货清仓</div>
            <count-down :endTime="endTime" :callback="callback" endText="已经结束了" class="fl" v-if="endTime"></count-down>
            <router-link class="more fr" to="/poopClearance">更多<em><i></i><b></b></em></router-link>
        </div>
        <item-list :data="data" :status="sta" :set="set"></item-list>
    </div>
</template>
<script>
    import countDown from './children/countDown.vue';
    import itemList from '@/components/Widget/slideItem'
    export default {
        name:'limitedActivity',
        data(){
           return {
                sta:'抢购',
                set:'限时'
           }
        },
        props:{
            data:null,
            url:null,
            endTime:null
        },
        components:{
            countDown,
            itemList
        },
        methods:{
            // callback:function(){
            //     console.log('已经结束了！')
            // }
            
        },
        created(){
            
        },
        method(){
        },
        directives:{
    　　　　dirName:{
                
    　　　　}
    　　}
    }
</script>
<style lang="less" scoped>
    .limited-wrap{
        padding-top:.1rem;
        background:#f2f2f2;
        .hd{
            padding:.2rem;
            background:#fff;
            .title{
                height:.5rem;
                position:relative;
                padding-left:.4rem;
                font-size:.32rem;
                color:#f02b2b;
                line-height: .5rem;
                i{
                    width:.27rem;
                    height:.28rem;
                    position:absolute;
                    left:0;
                    top:50%;
                    margin-top:-.14rem;
                    background:url(../../../assets/la-title.png) no-repeat no-repeat;
                    background-size:100% 100%;
                }
            }
            .timers{
                height:.5rem;
                text-align:center;
                padding:0 .5rem;
                line-height:.5rem;
                color:#666;
                margin-top:-.03rem;
                i{
                    font-style:normal;
                    font-size:.28rem;
                    padding:0 .02rem;
                    display:inline-block;
                    height:100%;
                }
                span{
                    display:inline-block;
                    box-sizing:border-box;
                    -moz-box-sizing:border-box;
                    -webkit-box-sizing:border-box;
                    text-align:center;
                    width:.41rem;
                    height:.49rem;
                    border:1px solid #d9d9d9;
                    background:#fff;
                    font-size:.28rem;
                    border-radius:5px;
                }
            }
            .more{
                line-height:.5rem;
                color:#999;
                font-size:.28rem;
                position:relative;
                padding-right:.2rem;
                em{
                    position:absolute;
                    right:0;
                    top:.07rem;
                    i{
                        border-left:6px solid #ccc;
                        border-top:6px solid transparent;
                        border-bottom:6px solid transparent;
                        position:absolute;
                        right:-.04rem;
                        top:0;
                    }
                    b{
                        border-left:6px solid #f2f2f2;
                        border-top:6px solid transparent;
                        border-bottom:6px solid transparent;
                        position:absolute;
                        right:0;
                        top:0;
                    }
                }
            }
        }
    }
</style>