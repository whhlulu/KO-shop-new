<template>
    <div class="footp-wrap" ref="footprint_list">
        <div v-title :data-title="title">{{title}}</div>
        <footp-header :text="title" :delData="del" :fooptStatus="fooptS" :checklist="checklist" :footprint="footprint"></footp-header>
        <dl>
            <dd v-for="item in footprint" :key="item.id">
            	<p class="time">{{item.create_time}}</p>
                <div class="clearfix item-wrap clearfix" v-for="(items,index) in item.goods" @click="tolink(index,items)" :key="index">
                    <img class="fl" :src="URL + items.puc_url">
                    <div class="fl item">
                        <p class="text text2-hidden">{{items.title}}</p>
                        <p class="Price">￥<span>{{items.price_member}}</span></p>
                        <!--<p class="time">{{items.create_time}}</p>-->
                    </div>
                </div>
            </dd>
        </dl>
        <div v-if="footprint =='' " class="status text-center">您还没有浏览过任何商品，快去逛逛吧！</div>
        <Shopsn></Shopsn>
        <to-top></to-top>
        <div class="load-wrap" v-show="load" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
    </div>
</template>
<script>
    import footpHeader from '@/components/page/children/header.vue';
    import qs from 'qs';
    import Shopsn from '@/components/page/Shopsn.vue';
    import toTop from '@/components/page/toTop.vue';
    export default {
        name:'footprint',
        data(){
            return {
                title:'我的足迹',
                del:true,
                load:true,
                checklist:false,
                fooptS:'',
                footprint:[],
                isactive: '',
                slide_switch: false, //避免多次下拉
                load_show: true, //滚动动画
                roll_switch: true, //触发下拉加载开关
                no_data: false, //第一次没数据时的样式
                sliding_no_data: false, //下拉没数据时的样式
                page: 1,
            }
        },
        created(){
            this.load=false;
        },
        mounted(){
            this.getList();

            let _this = this;
            window.addEventListener('scroll', function () {
                if (!_this.$refs.integral_order_list) return;
                if (document.body.scrollTop + window.innerHeight >= document.body.offsetHeight) {
                    //如果第一次请求没数据或数据没达到每页个数就不会再请求数据
                    if (_this.roll_switch == false) {
                        return;
                    }
                    if (_this.slide_switch == true) {
                        _this.slide_switch = false;
                        _this.page++;
                        _this.getList();
                    }
                }
            })

        },
        methods:{
            getList(){
                this.axios.post(this.$httpConfig.myFootprint,qs.stringify({
                    page:this.page
                })).then((res) => {
                    if(res.data.status==10001){
                            this.$router.push('/LogIn');
                    }else{
                    	this.stateHandling(res.data.status, res.data.data.goods);
                        this.load=false;
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            //请求成功后的操作
            returnOperation(data) {
                if (data.length < 10 && this.page == 1) { //第一次请求成功如果数据没达到每页页数就禁止下拉
                    this.load_show = false; //动画隐藏
                    this.roll_switch = false; //禁止下拉加载
				}
					for (let index = 0; index < data.length; index++) {
						this.footprint.push(data[index]);
					}
                this.slide_switch = true;
            },
            //请求后返回不同状态时的处理
            stateHandling(status, data) {
                this.sw = true;
                if (status == 10001) {
                    this.$router.push('/LogIn');
                } else if (status == 1) { //成功后的处理
                    this.returnOperation(data);
                } else if (status == 0 && this.page == 1) { //第一次请求失败时
                    this.no_data = true; //无数据时的样式
                    this.load_show = false; //动画隐藏
                    this.roll_switch = false; //禁止下拉加载
                } else { //第二次或更多次无数据时
                    this.sliding_no_data = true; //无数据时的样式
                    this.load_show = false; //动画隐藏
                    this.roll_switch = false; //禁止下拉加载
                }
            },
            tolink(index,items){
                this.$router.push({
                    name:'product',
                    params:{
                        id:items.goods_id,
                        status:1
                    }
                });
            }
        },
        components:{
            footpHeader,
            Shopsn,
            toTop
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
                box-sizing: border-box;
                background:#fff;
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
                .time{
                	text-indent: .2rem;
                	height: .6rem;
                	line-height: .6rem;
                	font-size: .25rem;
                	background: rgb(241,241,241);
                }
                .item-wrap{
                	border-bottom:1px solid #ccc;
                	padding:.2rem;
                    width: 100%;
                }
                .item-wrap.active{
                    transform:translate(.5rem);
                }
                img{
                    width: 1.5rem;
                    height: 1.5rem;
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
                    .time{
                    	font-size:.2rem;
                        color:#ccc;
                        line-height: .4rem;
                        height: .8rem;
                        float: right;
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