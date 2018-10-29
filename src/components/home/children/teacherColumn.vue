<template>
    <div class="teach-wrap">
        <!-- <teach-title :imgSrc="imgSrc" :title="title"></teach-title> -->
        <ul class="content-main clearfix">
            <!-- <li class="fl" v-for="item in itemsImg" :key="item.id" @click="tolest">
                <img v-lazy="item.images">
                <p>{{item.name}}</p>
            </li> -->
        </ul>
        <p class="more-link-main clearfix"  @click="toThe">查看更多名师<em></em></p>
    </div>
</template>
<script>
    import teachTitle from './children/teachTitle.vue'
    export default {
        name:'teacherColumn',
        data(){
            return{
                // imgSrc:require('@/assets/user-o.jpg'),
                title:'名师专栏',
                // itemsImg:[
                //     {name:'廖英强',images:require('@/assets/con1.jpg')},
                //     {name:'蔡宗园',images:require('@/assets/con2.jpg')},
                //     {name:'钟黎融',images:require('@/assets/con3.jpg')},
                //     {name:'薛武辉',images:require('@/assets/con4.jpg')},
                //     {name:'黄洛婷',images:require('@/assets/con5.jpg')}
                // ]
            }
        },
        components:{
            teachTitle
        },
        methods:{
            toThe:function(){
                this.$router.push({
                    path:'/theTeacher'
                });
            },
            tolest:function(){
                this.$router.push({
                    path:'/pickWeek'
                });
            }
        }
    }
</script>
<style lang="less" scoped>
    .teach-wrap{
        background:#f2f2f2;
        padding-bottom:.2rem;
        
        .content-main{
            background:#fff;
            li{
                width:20%;
                text-align:center;
                padding-top:.24rem;
                img{
                    width:1.14rem;
                    height:1.14rem;
                    border-radius:100%;
                }
                p{
                    color:#333;
                    font-size:.24rem;
                    padding:.2rem 0;
                }
            }
        }
        .more-link-main{
            padding:.3rem 0;
            background:#fff;
            text-align:center;
            line-height:.22rem;
            height:.22rem;
            font-size:.2rem;
            color:#999;
            em{
                position:relative;
                top:.06rem;
                left:.05rem;
                display:inline-block;
                width:.22rem;
                height:.22rem;
                background:url(../../../assets/btn-return1.png) no-repeat;
                background-size:100% 100%;
            }
        }
    }
</style>