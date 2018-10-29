<template>
    <div>
        <ul class="brand-wrap clearfix">
            <li class="fl" v-for="(item,index) in data" :key="item.id" @click="toLink(index)"><img v-lazy="URL + item.brand_logo"></li>
        </ul>
        <div class="banner" v-for="item in banner" :key="item.id">
            <img v-lazy="URL + item.pic_url">
        </div>
    </div>
</template>
<script>
    export default {
        name : 'brand',
        props:{
            data:null,
            banner:null
        },
        methods:{
            toLink(index){
                this.$router.push({
                    name:'braDetails',
                    params:{
                        ID:this.data[index].id
                    }
                });
            }
        }
    }
</script>
<style lang="less" scoped>
    .brand-wrap{
        width: 7.4rem;
        margin:0 auto;
        li{
            width: 1.85rem;
            height: .84rem;
            line-height: .84rem;
            position:relative;
            background:#fff;
            border:1px solid #f3f3f3;
            box-sizing: border-box;
            img{
                width: 100%;
                position:absolute;
                left:0;
                top:0;
                right:0;
                bottom:0;
                margin:auto;
            }
        }
    }
    .banner{
        padding:.2rem;
        img{
            width: 7.1rem;
            height: 1.66rem;
            border-radius:5px;
        }
    }
</style>