<template>
    <div>
        <div v-title data-title="优惠券">优惠券</div>
        <coup-header :set="true" :text="'优惠券('+data.length+')'"></coup-header>
        <ul class="clearfix Navigation text-center">
            <li class="fl" :class="{active:status == 3}" @click="nav(3)">未使用</li>
            <li class="fl" :class="{active:status == 1}" @click="nav(1)">已使用</li>
            <li class="fl" :class="{active:status == 2}" @click="nav(2)">已过期</li>
        </ul>

        <ul class="content-wrap">
            <li class="clearfix" v-for="item in data" :key="item.id" :class="{yellow:status == 3,gray:status == 1 || status == 2}">
                <div class="fl item-pull-left">
                    <h2>{{item.name}}</h2>
                    <p class="status">(不包含运费)</p>
                    <p class="term">使用期限</p>
                    <p class="timer">{{new Date(item.use_start_time * 1000).getFullYear()+'.'+(new Date(Number(item.use_start_time * 1000)).getMonth()+1)+'.'+new Date(Number(item.use_start_time * 1000)).getDate()}}  --  {{new Date(item.use_end_time * 1000).getFullYear()+'.'+(new Date(Number(item.use_end_time * 1000)).getMonth()+1)+'.'+new Date(Number(item.use_end_time * 1000)).getDate()}}</p>
                </div>
                <div class="fl item-pull-right text-right">
                    <div class="price">￥<span>{{item.money}}</span></div>
                    <button type="button">立即使用</button>
                </div>
            </li>
        </ul>
        <div class="text-center data-status" v-if="!data">暂无优惠券！</div>
        <Shopsn></Shopsn>
        <div class="load" v-show="load" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
    </div>
</template>
<script>
    import coupHeader from '@/components/page/children/header';
    import qs from 'qs';
    import Shopsn from '@/components/page/Shopsn.vue';
    export default {
        name : 'coupon',
        data(){
            return {
                title:'',
                status:3,
                data:'',
                load:false
            }
        },
        mounted(){
            this.nav(3)
        },
        methods:{
             nav(index){
                this.load = true;
                this.status = index;
                this.axios.post(API_URL + 'Home/Pcenter/myCoupon',qs.stringify({
                    app_user_id:sessionStorage.getItem('user_ID'),
                    status:this.status
                })).then((res) => {
                    this.data = res.data.data;
                    this.load = false;
                }).catch((err) => {
                    console.log(err);
                });
             }
        },
        components:{
            coupHeader,
            Shopsn
        }
    }
</script>
<style lang="less" scoped>
    .data-status{
        line-height: 1rem;
        font-size:.4rem;
        color:#999;
    }
    .Navigation{
        height: .9rem;
        width: 100%;
        box-sizing: border-box;
        padding:.2rem 0;
        border-bottom:1px solid #f5f5f5;
        background:#fff;
        li{
            width: 33.33333%;
            border-right:1px solid #ccc;
            box-sizing: border-box;
            line-height: .5rem;
            font-size:.26rem;
            color:#666;
        }
        li:last-child{
            border:none;
        }
        li.active{
            color:#d0111b;
        }
    }
    .content-wrap{
        padding:.32rem .2rem;
        li{
            width: 100%;
            height: 2rem;
            padding-left:.27rem;
            box-sizing: border-box;
            margin-bottom:.2rem;
            .item-pull-left{
                width: 4rem;
            }
            .item-pull-right{
                width: 2.83rem;
                padding-right:.25rem;
                box-sizing: border-box;
                padding-top:.42rem;
                .price{
                    color:#fff;
                    font-size:.24rem;
                    span{
                        font-size:.5rem;
                        font-family: 'Aparajita';
                    }
                }
            }
            button{
                width: 1.26rem;
                height: .51rem;
                border-radius:5px;
                border:none;
                background:none;
                color:#fff;
                font-size:.24rem;
            }
            h2{
                font-size:.36rem;
                padding-top:.28rem;
            }
            .status{
                font-size:.24rem;
                color:#e02828;
                padding-top:.1rem;
            }
            .term{
                font-size:.22rem;
                color:#a5a5a5;
                padding-top:.1rem;
            }
            .timer{
                padding-top:.1rem;
                font-size: .28rem;
                color:#757575;
            }
        }
        li.yellow{
            background:url(../../assets/yellow.png) no-repeat;
            background-size:100% 100%;
            h2{
                color:#f29a15;
            }
            button{
                background:#e02828;
                box-shadow: .08rem .08rem 0 #da8a12;
            }
        }
        li.gray{
            background:url(../../assets/gray.png) no-repeat;
            background-size:100% 100%;
            h2{
                color:#666;
            }
            button{
                background:#aaa9a9;
                box-shadow: .08rem .08rem 0 #b8b8b8;
            }
        }
    }
</style>