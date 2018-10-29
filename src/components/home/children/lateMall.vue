<template>
    <div>
        <div class="banner-hd" v-for="item in banner" :key="item.id"><img v-lazy="URL + item.pic_url"></div>
        <ul class="content-wrap clearfix">
            <li v-for="(item,index) in data" :key="item.id" class="fl text-center" @click="tolink(index)">
                <img v-lazy="URL + item.pic_url">
                <p class="text-left text-single-hidden">{{item.title}}</p>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        name:'lateMall',
        props:{
            url:null,
            banner:null,
            data:null,
            status:null
        },
        methods:{
            tolink(index){
                this.$router.push({
                    name:'product',
                    params:{
                        id:this.data[index].id,
                        status:this.status
                    }
                });
            }
        }
    }
</script>
<style lang="less" scoped>
    .banner-hd{
        img{
            width: 7.5rem;
            height: 3rem;
        }
    }
    .content-wrap{
        li{
            width: 33.333333333%;
            height: 2.3rem;
            padding:.25rem;
            box-sizing: border-box;
            background:#fff;
            img{
                width: 1.3rem;
                height: 1.3rem;
            }
            p{
                font-size:.26rem;
                color:#333;
                padding-top:.15rem;
                height: .25rem;
            }
        }
    }
    .banner{
        padding:.2rem;
        img{
            width: 100%;
            border-radius:20px;
        }
    }
</style>