<template>
    <div>
        <div v-title :data-title="title">{{title}}</div>
        <repair-header :text="title"></repair-header>
        <ol class="tab-hd clearfix text-center">
            <li class="fl" :class="{active:status == 0}" @click="toAjax(0)"><span>售后申请</span></li>
            <li class="fl" :class="{active:status == 1}" @click="toAjax(1)"><span>进度查询</span></li>
        </ol>
        <div class="search-hd clearfix">
            <input type="search" placeholder="商品名称 , 订单编号" class="fl">
            <button class="fl">搜索</button>
        </div>
        <ul class="list-wrap" v-if="status == 0 && sta">
            <li v-for="item in $store.state.repair" :key="item.id">
                <div class="hd">
                    <div class="oddNumbers clearfix">
                        <span class="name fl">服务单号：{{item.order_sn_id}}</span>
                        <!--<span class="status fr">待收货</span>-->
                    </div>
                    <div class="time">申请时间：{{new Date(item.create_time * 1000).getFullYear()+'-'+(new Date(item.create_time * 1000).getMonth() + 1)+'-'+new Date(item.create_time * 1000).getDay()}}&nbsp;&nbsp;{{new Date(item.create_time * 1000).getHours()+':'+new Date(item.create_time * 1000).getMinutes()+':'+new Date(item.create_time * 1000).getSeconds()}}</div>
                </div>
                <div class="dd clearfix" v-for="(items,index) in item.order_goods" :key="items.id">
                    <img :src="URL + items.pic_url" class="fl">
                    <div class="text-wrap fl">
                        <p class="text text2-hidden">{{items.title}}</p>
                        <div class="btn-wrap clearfix">
                            <span class="fl">数量：{{items.goods_num}}</span>
                            <button class="fr active" @click="toService('rGoods',index,item)">申请售后</button>
                        </div>
                    </div>
                </div>
            </li>
        </ul>

        <ul class="list-wrap" v-if="status == 1 && sta">
            <li v-for="item in $store.state.repair" :key="item.id">
                <div class="hd">
                    <div class="oddNumbers clearfix">
                        <span class="name fl">服务单号：{{item.order_sn_id}}</span>
                        <!--<span class="status fr">待收货</span>-->
                    </div>
                    <div class="time">申请时间：{{new Date(item.create_time * 1000).getFullYear()+'-'+(new Date(item.create_time * 1000).getMonth() + 1)+'-'+new Date(item.create_time * 1000).getDay()}}&nbsp;&nbsp;{{new Date(item.create_time * 1000).getHours()+':'+new Date(item.create_time * 1000).getMinutes()+':'+new Date(item.create_time * 1000).getSeconds()}}</div>
                </div>
                <div class="dd clearfix" @click="tolink(item)">
                    <img :src="URL + item.pic_url" class="fl">
                    <div class="text-wrap fl">
                        <p class="text text2-hidden">{{item.title}}</p>
                        <div class="btn-wrap clearfix">
                            <span class="fl">数量：{{item.number}}</span>
                            <button class="fr" v-if="item.status == 0">审核中</button>
                            <button class="fr" v-if="item.status == 1">审核失败</button>
                            <button class="fr" v-if="item.status == 2">审核通过</button>
                            <button class="fr" v-if="item.status == 3">退货中</button>
                            <button class="fr" v-if="item.status == 4">退款中</button>
                            <button class="fr" v-if="item.status == 5">完成</button>
                            <button class="fr" v-if="item.status == 6">已撤销</button>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <Shopsn></Shopsn>
        <div class="load" v-show="load" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
        <div class="load-wrap" v-show="load_wrap" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
    </div>
</template>
<script>
    import repairHeader from './children/header';
    import qs from 'qs';
    import Shopsn from '@/components/page/Shopsn.vue';
    export default {
        name : 'returnRepair',
        data(){
            return {
                title:'退货返修',
                status:0,
                load:false,
                load_wrap:true,
                sta:true
            }
        },
        mounted(){
            this.axios.post(API_URL + 'Home/Pcenter/afetrsale_list',qs.stringify({
                app_user_id:sessionStorage.getItem('user_ID')
            })).then((res) => {
                this.$store.state.repair = res.data.data;
                this.load_wrap = false;
            }).catch((res) => {
                console.log(res);
            });
        },
        methods:{
            toAjax(index){
                var api_url = '';
                this.status = index;
                this.load = true;
                this.sta = false;
                if(index == 0){
                    api_url = API_URL + 'Home/Pcenter/afetrsale_list';
                }else{
                    api_url = API_URL + 'Home/Pcenter/speed_check';
                }
                this.axios.post(api_url,qs.stringify({
                    app_user_id:sessionStorage.getItem('user_ID')
                })).then((res) => {
                    this.$store.state.repair = res.data.data;
                    this.load = false;
                    this.sta = true;
                }).catch((res) => {
                    console.log(res);
                });
            },
            toService(str,index,item){
                this.$store.state.order_details = item;
                this.$router.push({
                    name:'serviceBack',
                    params:{
                        status:str,
                        index:index
                    }
                });
            },
            tolink(item){
                this.$router.push({
                    name:'progress',
                    params:{
                        id:item.id
                    }
                });
            }
        },
        components:{
            repairHeader,
            Shopsn
        }
    }
</script>
<style lang="less" scoped>
    .tab-hd{
        height: .9rem;
        line-height: .9rem;
        background:#fff;
        li{
            width: 50%;
            span{
                display:inline-block;
                width: 2.5rem;
                height: 100%;
                font-size:.28rem;
                color:#666;
            }
        }
        li.active{
            span{
                color:#d0111b;
                border-bottom:2px solid #d0111b;
                box-sizing: border-box;
            }
        }
    }
    .search-hd{
        padding:.2rem;
        input{
            width: 6.2rem;
            height: .8rem;
            border:1px solid #ccc;
            border-radius:5px;
            box-sizing: border-box;
            font-size:.24rem;
            color:#333;
            padding-left:.6rem;
            background:url(../../assets/search1.png) no-repeat #fff .2rem center;
            background-size:.29rem .29rem;
            outline: none;
        }
        button{
            width: .9rem;
            line-height: .8rem;
            border:none;
            outline: none;
            background:none;
            font-size:.3rem;
            color:#333;
        }
    }
    .list-wrap{
        li{
            padding: 0 .2rem .2rem .2rem;
            width: 100%;
            background:#fff;
            box-sizing: border-box;
            border-bottom:1px solid #dfdfdd;
            border-top:1px solid #dfdfdd;
            margin-bottom:.15rem;
            .hd{
                height: 1.4rem;
                border-bottom:1px solid #dfdfdd;
                box-sizing: border-box;
                .oddNumbers{
                    padding-top:.44rem;
                    .name{
                        font-size:.25rem;
                        color:#333;
                    }
                    .status{
                        font-size:.3rem;
                        color:#f9781e;
                    }
                }
                .time{
                    font-size:.25rem;
                    color:#757575;
                }
            }
            .dd{
                padding-top:.35rem;
                img{
                    width: 1.46rem;
                    height: 1.46rem;
                }
                .text-wrap{
                    padding-left:.2rem;
                    width: 5.15rem;
                    .text{
                        font-size:.25rem;
                        color:#333;
                        line-height: .38rem;
                    }
                    .btn-wrap{
                        padding-top:.28rem;
                        span{
                            font-size:.25rem;
                            color:#999;
                        }
                        button{
                            width: 1.43rem;
                            height: .53rem;
                            background:#fff;
                            border-radius:5px;
                            border:none;
                            font-size:.24rem;
                            color:#333;
                            outline: none;
                            border:1px solid #757575;
                            box-sizing: border-box;
                        }
                        button.active{
                            background:#d0111b;
                            border:none;
                            color:#fff;
                        }
                        button:active{
                            box-shadow: 0 5px 5px #ccc;
                        }
                    }
                }
            }
        }
    }
</style>