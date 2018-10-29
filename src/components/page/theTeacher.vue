<template>
    <div class="teacher-main">
        <div v-title :data-title="text">{{text}}</div>
        <the-header :text="text"></the-header>
        <ul class="item-lest-wrap clearfix">
            <li class="fl" v-for="index in content.name.length" :key="index.id" @click="todetails">
                <!-- <img  v-lazy="content.dataImg[index-1]"> -->
                <p>{{content.name[index-1]}}</p>
            </li>
        </ul>
    </div>
</template>
<script>
    import TheHeader from './children/header.vue';
    export default {
        name: 'theTeacher',
        data() {
            return {
                text:'名师专栏',
                content:{
                    name:['廖英强','廖英强','廖英强','廖英强','廖英强'],
                    // dataImg:[require('@/assets/con5.jpg'),require('@/assets/con4.jpg'),require('@/assets/con3.jpg'),require('@/assets/con2.jpg'),require('@/assets/con1.jpg')]
                },
                scrollWatch:true
            }
        },
        components:{
            TheHeader
        },
        mounted() {
            document.body.scrollTop = 0;
        },
        destroyed(){
            this.scrollWatch = false;
        },
        methods:{
            todetails:function(){
                this.$router.push({
                    path:'/pickWeek'
                });
            }
        }
    }
</script>
<style lang="less" scoped>
    .teacher-main{
        .item-lest-wrap{
            background:#f1f1f1;
            padding:.3rem .2rem;
            li{
                width:2.2rem;
                height:2.4rem;
                background:#fff;
                border-radius:10px;
                margin-right:.25rem;
                text-align:center;
                padding-top:.3rem;
                margin-bottom:.25rem;
                img{
                    width:1.6rem;
                    height:1.6rem;
                    border-radius:50%;
                }
                p{
                    font-size:.32rem;
                    color:#000;
                    padding-top:.2rem;
                }
            }
            li:nth-child(3n){
                margin-right:0;
            }
        }
    }
</style>