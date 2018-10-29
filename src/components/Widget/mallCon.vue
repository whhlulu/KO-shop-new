<template>
    <div class="clearfix mallCon">
        <div class="item-con fl text-center" v-for="item in data" :key="item.id">
            <img v-lazy="url + item.pic_url">
            <p class="text-single-hidden">{{item.title}}</p>
        </div>
    </div>
</template>
<script>
    export default {
        name : 'mallCon',
        props:{
            data:null,
            url:null
        }
    }
</script>
<style lang="less" scoped>
    .mallCon{
        padding:.2rem;
        background:#fff;
        .item-con{
            width: 33.3333333%;
            height: 2.3rem;
            padding:.25rem;
            box-sizing: border-box;
            img{
                width:1.3rem;
                height:1.3rem;
            }
            p{
                font-size:.28rem;
                color:#333;
                line-height: 100%;
                padding-top:.16rem;
            }
        }
    }
</style>