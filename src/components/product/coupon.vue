<template>
    <div ref="coupon">
        <div v-title data-title="优惠券">优惠券</div>
        <coup-header :set="true" :text="'优惠券('+countTotal.count+')'"></coup-header>
        <ul class="clearfix Navigation text-center">
            <li class="fl" :class="{active:status == 3}" @click="nav(3)">未使用({{countTotal.not_used}})</li>
            <li class="fl" :class="{active:status == 1}" @click="nav(1)">已使用({{countTotal.used}})</li>
            <li class="fl" :class="{active:status == 2}" @click="nav(2)">已过期({{countTotal.expired}})</li>
        </ul>

        <ul class="content-wrap" id="content">
            <li class="clearfix" v-for="item in data[status-1]" :class="{green:status == 3 &&item.money >= 150 ,yellow:status == 3 &&item.money <= 50,origin:status == 3 &&item.money > 50 &&item.money <150,gray:status == 1 || status == 2}">
                <div class="fl item-pull-left">
                    <h2>{{item.name}}</h2>
                    <p class="status">(不包含运费)</p>
                    <p class="term">使用期限</p>
                    <p class="timer">{{item.use_start_time}} -- {{item.use_end_time}}</p>
                </div>
                <div class="fl item-pull-right text-right">
                    <div class="price">￥<span>{{item.money}}</span></div>
                    <button v-if="status == 3" type="button" @click="useFun">立即使用</button>
                    <button v-else type="button">无法使用</button>
                </div>
            </li>
        </ul>
        <div class="text-center data-status" v-if="!data">暂无优惠券！</div>
		<span class="isEnd" v-if="isEnd">加载完毕</span>
        <!-- <Shopsn></Shopsn> -->
        <div class="load" v-show="load" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
    </div>
</template>
<script>
    import coupHeader from '@/components/page/children/header.vue';
    import qs from 'qs';
    import Shopsn from '@/components/page/Shopsn.vue';
    export default {
        name : 'coupon',
        data(){
            return {
                title:'',
                status:2,
                data:[[],[],[]],
                load:false,
                page:1,
                countTotal:'',
				isBottom:false,
				isEnd:false,
            }
        },
        mounted(){
            var that = this;
            that.nav(3);
            $(window).scroll(function () { 
                if(!that.$refs.coupon)return;
                var bot = document.body.clientHeight;
                if(that.isBottom == false && bot+$(window).scrollTop()>=$(".content-wrap")[0].clientHeight && that.status == 3){
                    that.isBottom = true;
                    if (!this.isEnd) {
                        that.page++;
                        that.loadMore(3)
                    }
                }
            });
        },
        methods:{
            useFun(){
                this.$router.push({
					path: '/list/ /search'
				})
            },
             nav(index){
                 this.page = 1;
                 this.data[index-1] = [];
                 this.loadMore(index);
            },
            loadMore(index){
                this.load = true;
                this.status = index
                this.axios({
                    url:this.$httpConfig.myCouponLists,
                    method:"get",
                    params:{
                        status:this.status,
                        page:this.page
                    }
                })
                .then((res) => {
                    if(res.data.status==10001){
                    this.$router.push('/LogIn');
                }else{
                    if(res.data.status ==1){
                        this.isBottom = false;
                        this.isEnd = false;
                        var list = res.data.data.records;
                        console.log(this.data,index)
                        for(var i in list){
                            this.data[index-1].push(list[i]);
                        }
                            this.countTotal = res.data.data.countTotal
                    }else{
                        this.isEnd = true;
                    }
                    this.load = false;
                    }
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
            color:#C69B3C;
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
                height: .55rem;
                border-radius:5px;
                border:none;
                background:none;
                color:#fff;
                font-size:.24rem;
            }
               .status{
                font-size:.24rem;
                color:#E02828;
                padding-bottom:.1rem;
            }
            h2{
                font-size:.36rem;
                padding-top:.28rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
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
        li.origin{
            background:url(../../assets/images/coupon2.png) no-repeat;
            background-size:100% 100%;
            h2{
                color:#E18752;
            }
            button{
                background:#e02828;
                box-shadow: .08rem .08rem 0 #da8a12;
            }
        }
         li.green{
            background:url(../../assets/images/coupon3.png) no-repeat;
            background-size:100% 100%;
            h2{
                color:#86B766;
            }
          
            button{
                background:#438524;
                box-shadow: .08rem .08rem 0 #68A24B;
            }
        }
        li.yellow{
            background:url(../../assets/images/coupon1.png) no-repeat;
            background-size:100% 100%;
            h2{
                color:#D3B881;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .status{
                font-size:.24rem;
                color:#E02828;
                padding-bottom:.1rem;
            }
            button{
                background:#E02828;
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