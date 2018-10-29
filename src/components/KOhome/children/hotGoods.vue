<template>
    <div class="hotGoods-wrap">
        <ul class="content-main clearfix">
            <li class="fl" v-for="(item,index) in data" :key="item.id" @click="tolink(index)">
                <img v-lazy="item.pic_url">
                <p class="desi">{{item.title}}</p>
                <p class="price">￥<span>{{item.price_market}}</span></p>
            </li>
        </ul>
    </div>    
</template>
<script>
    export default {
        name : 'hotGoods',
        props:{
            data:null
        },
        methods:{
            tolink(index){
                this.$router.push({
                    name:'product',
                    params:{
                        id:this.data[index].id,
                        status:1
                    }
                });
            }
        }
    }
</script>
<style lang="less" scoped>
    .hotGoods-wrap{
        background:#f2f2f2;
        .content-main{
            li{
                width:3.7rem;
                height:4.96rem;
                background:#fff;
                margin-top:.1rem;
                margin-right:.08rem;
                img{
                    width:3.7rem;
                    height:3.7rem;
                }
                .desi{
                    font-size:.3rem;
                    color:#333;
                    padding:.2rem .2rem;
                    white-space:nowrap;
                    overflow:hidden;
                    text-overflow:ellipsis;
                    border-top:1px solid #f2f2f2;
                    box-sizing: border-box;
                }
                .price{
                    padding-left:.2rem;
                    color:#e02828;
                    font-size:.3rem;
                    span{
                        font-size:.36rem;
                    }
                }
            }
            li:nth-child(2n){
                margin-right:0;
            }
        }
    }
</style>