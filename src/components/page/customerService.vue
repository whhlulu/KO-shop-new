<template>
    <div>
        <div v-title :data-title="title">{{title}}</div>
        <customer-header :text="title" :search="search"></customer-header>
        <div class="notice-wrap clearfix">
            <span class="title fl text-center">公告</span>
            <transition name="fade">
                <p class="text fl text-single-hidden"><span class="icon"><i></i></span>{{con}}</p>
            </transition>
            <router-link to="/Notice" class="fl text-center link">更多</router-link>
        </div>
        <dl class="service clearfix">
            <dt class="fl">在线客服</dt>
            <dd class="fl  text-center">
                <div class="img-wrap"><img src="../../assets/qq.png" ></div>
                <p>QQ咨询</p>
            </dd>
            <dd class="fl  text-center">
                <div class="img-wrap"><img src="../../assets/telephone.png" ></div>
                <p>电话咨询</p>
            </dd>
            <dd class="fl  text-center">
                <div class="img-wrap"><img src="../../assets/mes.png" ></div>
                <p>在线留言</p>
            </dd>
        </dl>  
        <div class="problem">
            <h2 class="title">问题查询</h2>
            <div class="item-wrap">
                <dl class="item-main clearfix" v-for="item in data_con" :key="item.id">
                    <dt class="fl">{{item.name}}</dt>
                    <dd class="fl clearfix text-center">
                        <span class="fl" v-for="items in item.value" :key="items.id" @click="tolink(items)">{{items.name}}</span>
                    </dd>
                </dl>
            </div>
        </div>
        <Shopsn></Shopsn>
        <div class="load-wrap" v-show="!data_con" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
    </div>
</template>
<script>
    import customerHeader from '@/components/page/children/header';
    import { Picker } from 'mint-ui';
    import Shopsn from '@/components/page/Shopsn.vue';
    export default {
        name : 'customerService',
        data(){
            return {
                title : '客户服务',
                search:false,
                data:'',
                data_con:'',
                con:''
            }
        },
        mounted(){
            this.axios.post(API_URL + 'Home/Callcenter/Announcement').then((res) => {
                this.data = res.data.data;
                var N = 0;
                this.change(N);
                setInterval(() => {
                    N++;
                    if(N >= this.data.length){
                        N = 0;
                    }
                    this.change(N);
                },5000);
            }).catch((err) => {
                console.log(err);
            });
            this.axios.post(API_URL + 'Home/Pcenter/article').then((res) => {
                this.data_con = res.data.data;
            }).catch((err) => {
                console.log(err);
            })
        },
        methods:{
            change(N){
                this.con = this.data[N].title;
            },
            tolink(item){
                this.$router.push({
                    name:'newsConent',
                    params:{
                        id:item.id,
                        status:2 //status = 1 为我的消息详情 status = 2 为客服中心 详情
                    }
                });
            }
        },
        components:{
            customerHeader,
            Shopsn
        }
    }
</script>
<style lang="less" scoped>
    .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
    }
    .fade-enter, .fade-leave-to{
    opacity: 0
    }
    .notice-wrap{
        height: .6rem;
        padding:.1rem 0;
        background:#fff;
        line-height:.6rem;
        .title{
            width: 1.5rem;
            height: 100%;
            font-size:.32rem;
            color:#111;
            border-right:1px dotted #ccc;
            box-sizing: border-box;
        }
        .text{
            height: 100%;
            width: 4rem;
            padding-left:.8rem;
            position:relative;
            line-height:.6rem;
            font-size:.28rem;
            color:#333;
            .icon{
                height: 100%;
                width: .8rem;
                position:absolute;
                left:0;
                top:0;
                i{
                    position:absolute;
                    left:0;
                    top:0;
                    bottom:0;
                    right:0;
                    margin: auto;
                    width: .28rem;
                    height: .28rem;
                    background:url(../../assets/icon1.png) no-repeat;
                    background-size:100% 100%;
                }
            }
        }
        .link{
            width: .95rem;
            border-left:1px dotted #ccc;
            box-sizing: border-box;
            font-size:.28rem;
            color:#333;
        }
    }
    .service{
         dt{
            width: 7.1rem;
            height: .9rem;
            line-height: .9rem;
            padding:0 .2rem;
            font-size:.26rem;
            color:#555;
         }
        dd{
            background:#fff;
            height: 2.3rem;
            width: 33.3333333333%;
            box-sizing: border-box;
            border-right:1px solid #dfdfdf;
            border-bottom:1px solid #dfdfdf;
            .img-wrap{
                padding-top:.7rem;
                height: .7rem;
            }
            p{
                font-size:.28rem;
                color:#555;
            }
        }
        dd:last-child{
            border-right:0;
        }
        dd:nth-child(2){
             img{
                width: .56rem;
                height: .6rem;
            }
        }
        dd:nth-child(3){
            img{
                width: .65rem;
                height: .55rem;
            }
        }
        dd:nth-child(4){
            img{
                width: .68rem;
                height: .54rem;
            }
        }
    }
    .problem{
        .title{
            width: 7.1rem;
            height: .9rem;
            line-height: .9rem;
            padding:0 .2rem;
            font-size:.26rem;
            color:#555;
        }
        .item-wrap{
            padding-top:.3rem;
            background:#fff;
        }
        .item-wrap{
            overflow: hidden;
            .item-main{
                width: 7.1rem;
                height: 1.6rem;
                padding:0 .2rem 0;
                margin-bottom:.2rem;
                dt{
                    width: 1.6rem;
                    height: 1.6rem;
                    box-sizing: border-box;
                    padding:.4rem .45rem;
                }
            }
            .item-main{
                margin-bottom:.2rem;
                dt{
                    background:#fde7e8;
                    color:#ba4c52;
                    font-size:.32rem;
                }
                dd{
                    width: 5.4rem;
                    height: 1.6rem;
                    span{
                        width: 50%;
                        height: 50%;
                        line-height:.8rem;
                        background:#fafafa;
                        font-size:.26rem;
                        color:#555;
                    }
                }
            }
            .item-main:nth-child(2n){
                dt{
                    background:#fdf8e7;
                    color:#b38835;
                }
            }
            .item-main:nth-child(3n){
                dt{
                    background:#e8faff;
                    color:#3b7d8f;
                }
            }
        }
    }
</style>
