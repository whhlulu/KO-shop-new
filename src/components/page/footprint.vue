<template>
    <div class="footp-wrap">
        <div v-title :data-title="title">{{title}}</div>
        <footp-header :text="title" :delData="del" :fooptStatus="fooptS" :checklist="checklist"></footp-header>
        <dl>
            <dd v-for="(item,index) in $store.state.footprint" :key="item.id" @click="tolink(index)">
                <div class="clearfix item-wrap clearfix">
                    <img class="fl" :src="URL + item.img">
                    <div class="fl item">
                        <p class="text text2-hidden">{{item.title}}</p>
                        <p class="Price">￥<span>{{item.price_member}}</span></p>
                    </div>
                </div>
            </dd>
        </dl>
        <div v-if="$store.state.footprint == ''" class="status text-center">您还没有浏览过任何商品，快去逛逛吧！</div>
        <Shopsn></Shopsn>
        <div class="load-wrap" v-show="load" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
    </div>
</template>
<script>
    import footpHeader from './children/header';
    import qs from 'qs';
    import Shopsn from '@/components/page/Shopsn.vue';
    export default {
        name:'footprint',
        data(){
            return {
                title:'我的足迹',
                del:true,
                load:true,
                checklist:false,
                fooptS:''
            }
        },
        mounted(){
            this.axios.post(API_URL + 'Home/Pcenter/myFootprint',qs.stringify({
                app_user_id:sessionStorage.getItem('user_ID')
            })).then((res) => {
                this.$store.state.footprint = res.data.data;
                this.load=false;
            }).catch((err) => {
                console.log(err)
            })
        },
        methods:{
            cancel(){
                this.fooptS = '';
                this.checklist = '';
            },
            tolink(index){
                this.$router.push({
                    name:'product',
                    params:{
                        id:this.data[index].id
                    }
                });
            }
        },
        components:{
            footpHeader,
            Shopsn
        }
    }
</script>
<style lang="less">
    .footp-wrap{
        .mint-cell-wrapper{
            background:none;
        }
    }
</style>
<style lang="less" scoped>
    .footp-wrap{
        dl{
            dt{
                font-size:.26rem;
                color: #666;
                box-sizing: border-box;
                padding:.2rem;
                .mint-checkbox-label{
                    padding-top:.1rem;
                }
            }
            dd{
                width: 100%;
                padding:.2rem;
                box-sizing: border-box;
                background:#fff;
                border-bottom:1px solid #ccc;
                overflow:hidden;
                position:relative;
                .mint-checklist-label{
                    position:absolute;
                    left:-.02rem;
                    top:1rem;
                    .mint-checkbox-core.active {
                        background:#26a2ff;
                    }
                    .mint-checkbox-core.active::after{
                        border-color: #fff;
                        -webkit-transform: rotate(45deg) scale(1);
                        transform: rotate(45deg) scale(1);
                    }
                }
                .item-wrap{
                    width: 100%;
                }
                .item-wrap.active{
                    transform:translate(.5rem);
                }
                img{
                    width: 2.2rem;
                    height: 2.2rem;
                }
                .item{
                    padding-left:.25rem;
                    width: 4.5rem;
                    .text{
                        font-size:.26rem;
                        color:#333;
                        line-height: .4rem;
                        height: .8rem;
                    }
                    .Price{
                        font-size:.28rem;
                        color:#f23030;
                        padding-top:.35rem;
                        span{
                            font-size:.32rem;
                        }
                    }
                }
            }
        }
        .footer-wrap{
            width: 100%;
            height: 1rem;
            .footer{
                width: 100%;
                height: .8rem;
                position:fixed;
                bottom:0;
                left:0;
                background:#fff;
                box-shadow:0 -1px 5px #ccc;
                button{
                    width: 1.5rem;
                    height: 100%;
                    border:none;
                    outline:none;
                }
                button.default{
                    background:#f23030;
                    color:#fff;
                }
            }
        }
    }
    .status{
        color:#666;
        height: 1rem;
        line-height:1rem;
        font-size:.3rem;
    }
</style>