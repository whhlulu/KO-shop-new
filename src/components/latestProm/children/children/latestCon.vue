<template>
    <div class="clearfix">
        <div class="item-list fl clearfix" v-for="item in data.hot_promotion" :key="item.id" @click="tolink(item)">
            <div class="text fl">
                <h2 class="text-single-hidden">{{item.title}}</h2>
                <p class="text-single-hidden">{{item.description}}</p>
            </div>
            <div class="img-wrap fl"><img v-lazy="URL + item.image"></div>
        </div>
    </div>
</template>
<script>
    export default {
        name : 'latestCon',
        props:{
            data:''
        },
        methods:{
            tolink(item){
                this.$router.push({
                    name:'product',
                    params:{
                        id:item.id,
                        status:1
                    }
                });
            }
        }
    }
</script>
<style lang="less" scoped>
    .item-list{
        width: 50%;
        height: 1.88rem;
        border-bottom:1px solid #f1f1f1;
        background:#fff;
        box-sizing: border-box;
        padding:.2rem;
        .text{
            width: 1.7rem;
            h2{
                font-size:.24rem;
                color:#f06258;
            }
            p{
                font-size:.2rem;
                color:#666;
                padding-top:.12rem;
                box-sizing: border-box;
            }
        }
        .img-wrap{
            width: 1.6rem;
            height: 1.6rem;
            position:relative;
            img{
                width: 100%;
                height: 100%;
            }
        }
    }
    .item-list:nth-child(2n){
        border-left:1px solid #f1f1f1;
    }
</style>