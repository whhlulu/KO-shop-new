<template>
    <div class="flash-wrap">
        <ul class="flash-dd clearfix">
            <li class="fl" v-for="(n,index) in nav" :key="n.id" @click="link(n.id)">
                    <img v-lazy="IMG_URL + n.pic_url">
                <p>{{n.name}}</p>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: 'newsflash',
        data() {
            return {
            }
        },
        props:{
            nav:null
        },
        mounted(){
        },
        methods: {
            link(id){
                this.$router.push({
                    path:`/KOlist/${id}`
                });
            }
        }
    }
</script>
<style lang="less" scoped>
    .flash-wrap{
        background:#f2f2f2;
        .flash-dd{
            width:100%;
            padding-top:.27rem;
            background:#fff;
            border-bottom:1px solid #eaf0f4;
            li{
                width:25%;
                text-align:center;
                img{
                    width:1.26rem;
                    height:1.26rem;
                }
                p{
                    font-size:.28rem;
                    color:#333;
                    padding:.2rem 0;
                    line-height:100%;
                    font-weight:400;
                    font-size:.28rem;
                    color:#333;
                }
            }
        }
    }
</style>