<template>
    <div>
        <order-header :text="$store.state.order_title" :search="search"></order-header>
        <div class="nav-wrap">
            <ul class="nav">
                <li class="fl" v-for="(name,index) in datas.name" :key="name.id" :class="{active:$store.state.status == index}" @click="addClass(index)"><span>{{name}}</span></li>
            </ul>
        </div>
    </div>
</template>
<script>
    import orderHeader from '@/components/page/children/header.vue';
    import qs from 'qs';
    export default {
        name : 'orderNav',
        data(){
            return {
                datas:{
                    name:['全部','待付款','待发货','待收货','已完成','已取消','待评论']
                },
                search:true
            }
        },
        components:{
            orderHeader
        },
        methods:{
            addClass(index){
                this.$store.state.order_load = true;
                this.title = this.datas.name[index]+'订单';
                this.$store.state.status = index;
                switch(index){
                    case 0:
                        this.$store.state.order_title = '全部订单';
                        this.$store.state.order_status = '';
                        this.axios.post(this.$httpConfig.orderListAll).then((res) => {
                   		this.order=res.data.data
                    }).catch((err) => {
                        console.log(err);
                    });
                        break;
                    case 1:
                        this.$store.state.order_title = '待付款订单';
                        this.$store.state.order_status = 0;
                        this.axios({
                            url:this.$httpConfig.pendingPayment,
                            method:'post',
                            params:{
                            }
                        }).then((res) => {
                            
                            this.$store.state.order = res.data.data;
                            this.$store.state.order_load_wrap = false;
                            this.$store.state.order_load = false;
                        }).catch((err) => {
                            console.log(err);
                        });
                        break;
                    case 2:
                        this.$store.state.order_title = '待发货订单';
                        this.$store.state.order_status = 1;
                        this.axios({
                            url:this.$httpConfig.pendingDelivery,
                            method:'post',
                            params:{
                            }
                        }).then((res) => {
                            this.$store.state.order = res.data.data;
                            this.$store.state.order_load_wrap = false;
                            this.$store.state.order_load = false;
                        }).catch((err) => {
                            console.log(err);
                        });
                        break;
                    case 3:
                        this.$store.state.order_title = '待收货订单';
                        this.$store.state.order_status = 3;
                        this.axios({
                            url:this.$httpConfig.goodsToBeReceived,
                            method:'post',
                            params:{
                            }
                        }).then((res) => {
                            this.$store.state.order = res.data.data;
                            this.$store.state.order_load_wrap = false;
                            this.$store.state.order_load = false;
                        }).catch((err) => {
                            console.log(err);
                        });
                        break;
                    case 4:
                        this.$store.state.order_title = '已完成订单';
                        this.$store.state.order_status = 4;
                        this.axios({
                            url:this.$httpConfig.completed,
                            method:'post',
                            params:{
                            }
                        }).then((res) => {
                            this.$store.state.order = res.data.data;
                            this.$store.state.order_load_wrap = false;
                            this.$store.state.order_load = false;
                        }).catch((err) => {
                            console.log(err);
                        });
                        break;
                    case 5:
                        this.$store.state.order_title = '以取消订单';
                        this.$store.state.order_status = -1;
                        this.axios({
                            url:this.$httpConfig.haveBeenCancelled,
                            method:'post',
                            params:{
                            }
                        }).then((res) => {
                            this.$store.state.order = res.data.data;
                            this.$store.state.order_load_wrap = false;
                            this.$store.state.order_load = false;
                        }).catch((err) => {
                            console.log(err);
                        });
                        break;
                    case 6:
                        this.$store.state.order_title = '待评论订单';
                        this.$store.state.order_status = 6;
                        this.axios({
                            url:this.$httpConfig.toBeEvaluated,
                            method:'post',
                            params:{
                            }
                        }).then((res) => {
                            this.$store.state.order = res.data.data;
                            this.$store.state.order_load_wrap = false;
                            this.$store.state.order_load = false;
                        }).catch((err) => {
                            console.log(err);
                        });
                        break;
                };
            }
        }
    }
</script>
<style lang="less" scoped>
    .nav-wrap{
        width:100%;
        overflow-x:auto;
        background:#fff;
        .nav{
            width:12.39rem;
            height:.94rem;
            border-bottom:1px solid #dfdfdd;
            li{
                width:1.77rem;
                height:100%;
                text-align:center;
                overflow:hidden;
                box-sizing:border-box;
                span{
                    display:block;
                    color:#676767;
                    font-size:.3rem;
                    line-height:.54rem;
                    height:.54rem;
                    margin:.2rem 0;
                    border-right:1px solid #dfdfdd;
                }
            }
            li.active{
                border-bottom:3px solid #fd4f4b;
                span{
                    color:#ff781a;
                }
            }
        }
    }
</style>