<template>
    <div>
        <div class="dd" v-if="data">
            <ul class="clearfix" :style="{ width : data.length * 2.3+'rem'}">
                <li class="fl" v-for="(item,index) in data" :key="item.id" @click="tolink(index)">
                    <img v-lazy="URL + item.pic_url">
                    <p class="desi text2-hidden">{{item.title}}</p>
                    <p class="price">￥<i class="newPrice">{{item.price_market}}</i></p>
                    <p class="price"><span class="bPrice">￥<s>{{item.price_member}}</s></span><i class="icon"></i></p>
                </li>
            </ul>
        </div>
        <div class="banner" v-for="item in banner" :key="item.id">
            <img v-lazy="URL + item.pic_url">
        </div>
    </div>
</template>
<script>
    export default {
        name:'moveCon',
        data(){
            return {
                
            }
        },
        props:{
            data:null,
            url:null,
            banner:null
        },
        methods:{
            tolink(index){
                this.$router.push({
                    name:'product',
                    params:{
                        id:this.data[index].id,
                        status:1
                    }
                })
            }
        },
        mounted(){
            
        }
    }
</script>
<style lang="less" scoped>
        div{
            overflow: hidden;
            height:3.69rem;
        .dd{
            width:100%;
            height:4.69rem;
            overflow-x:auto;
            ul{
                height:100%;
                li{
                    width:2.2rem;
                    height:100%;
                    padding:.1rem;
                    background:#fff;
                    box-sizing:border-box;
                    -moz-box-sizing:border-box;
                    -webkit-box-sizing:border-box;
                    margin-left:.1rem;
                    position:relative;
                    .desi{
                        color:#333;
                        font-size:.24rem;
                        line-height:.32rem;
                        height: .57rem;
                        margin:.2rem 0;
                        overflow:hidden; 
                    }
                    .price{
                        position:relative;
                        font-size:.22rem;
                        color:#e02828;
                        padding-bottom:.05rem;
                        .icon{
                            position:absolute;
                            bottom:0;
                            right:0;
                            width: .44rem;
                            height: .44rem;
                            background:url(../../assets/pro-icon.png) no-repeat;
                            background-size:100% 100%;
                        }
                        .newPrice{
                            font-size:.28rem;
                            color:#e02828;
                            font-style: normal;
                            font-weight:bold;
                        }
                        .bPrice{
                            font-size:.22rem;
                            color:#a8a8a8;
                            s{
                                font-size:.22rem;
                            }
                        }
                    }
                    img{
                        width:2rem;
                        height:2rem;
                    }
                }
            }
        }
        .banner{
            padding:.25rem .2rem;
            img{
                width: 7.1rem;
                height: 1.66rem;
                border-radius:5px;
            }
        }
        }
</style>