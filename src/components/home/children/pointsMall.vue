<template>
    <div class="points-main">
        <teach-title :imgSrc="imgSrc" :title="title"></teach-title>
        <img v-lazy="bannerSrc">
        <ul class="content-wrap clearfix">
            <li class="fl" v-for="(item,index) in content.imgsrc.length" :key="item.id">
                <img v-lazy="content.imgsrc[index]">
                <p class="subject">{{content.subject[index]}}</p>
            </li>
        </ul>
    </div>
</template>
<script>
    import teachTitle from './children/teachTitle.vue'
    export default {
        name : 'pointsMall',
        components:{
            teachTitle
        },
        data(){
           return {
                title:'积分商场',
                imgSrc:require('@/assets/mall.jpg'),
                bannerSrc:require('@/assets/con13.jpg'),
                content:{
                    imgsrc:[require('@/assets/con14.jpg'),require('@/assets/con15.jpg'),require('@/assets/con15.jpg')],
                    subject:['学习终端','培训课程','股票书籍']
                }
           }
        }
    }
</script>
<style lang="less" scoped>
    .points-main{
        background:#f2f2f2;
        padding-bottom:.2rem;
        img{
            width:100%;
            height:3rem;
        }
        .content-wrap{
            width:100%;
            height:2.3rem;
            background:#fff;
            li{
                width:2.5rem;
                height:2.1rem;
                text-align:center;
                padding-top:.2rem;
                img{
                    width:2.08rem;
                    height:1.3rem;
                }
                .subject{
                    padding-top:.2rem;
                    font-size:.28rem;
                    color:#333;
                }
            }
        }
    }
</style>