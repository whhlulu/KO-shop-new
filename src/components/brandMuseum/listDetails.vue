<template>
    <div ref="brand_list">
        <list-header  v-if="brand" :set="true" :text="brand.brand_name"></list-header>
        <div class="banner">
            <img v-lazy="URL + brand.brand_banner">
        </div>
        <div class="list-header" v-if="brand">
            <div class="content">
                <div class="logo"><img v-lazy="URL + brand_logo"></div>
                <h6>{{brand.brand_name}}</h6>
                <p class="text2-hidden">{{brand_description}}</p>
            </div>
        </div>
        <ul class="sort-wrap clearfix text-center">
            <li class="fl" :class="{active:sort_status == 1}" @click="sort('xl')">销量
                <span class="icon">
                    <em class="top" :class="{active:sort_id == 1}"></em><br>
                    <em class="bottom" :class="{active:sort_id == 2}"></em>
                </span>
            </li>
            <li class="fl" :class="{active:sort_status == 2}" @click="sort('jg')">价格
                <span class="icon">
                    <em class="bottom" :class="{active:sort_id == 3}"></em><br>
                    <em class="top" :class="{active:sort_id == 4}"></em>
                </span>
            </li>
            <li class="fl" @click="sort('rq')" :class="{active:sort_status == 3}">人气</li>
        </ul>
        <list-lop :data="goods"></list-lop>
        <Shopsn></Shopsn>
        <to-top></to-top>
        <div class="load" v-show="load" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
        <div class="load-wrap" v-show="load_wrap" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
    </div>
</template>
<script>
    import QS from 'qs';
    import listHeader from '@/components/page/children/header.vue';
    import listLop from './searchList';
    import Shopsn from '@/components/page/Shopsn.vue';
    import toTop from '@/components/page/toTop.vue';
    export default {
        name : 'listDetails',
        data(){
            return {
                goods:[],
                brand:'',
                brand_logo:'',
                brand_description:'',
                sort_id:null,
                sort_status:null,
                load:false,
                scrollWatch:true,
                load_wrap:true,
                isactive: '',
                slide_switch: false, //避免多次下拉
                load_show: true, //滚动动画
                roll_switch: true, //触发下拉加载开关
                no_data: false, //第一次没数据时的样式
                sliding_no_data: false, //下拉没数据时的样式
                page: 1,
            }
        },
        methods:{
            sort(index){
                switch(index){
                    case 'xl':
                        if(this.sort_id != 1){
                            this.sort_id = 1;
                            this.sort_status = 1;
                        }else{
                            this.sort_id = 2;
                            this.sort_status = 1;
                        }
                        this.load = true;
                        break;
                    case 'jg':
                        if(this.sort_id != 3){
                            this.sort_id = 3;
                            this.sort_status = 2;
                        }else{
                            this.sort_id = 4;
                            this.sort_status = 2;
                        }
                        this.load = true;
                        break;
                    case 'rq':
                        if(this.sort_id == 5)return;
                        this.sort_id = 5;
                        this.sort_status = 3;
                        this.load = true;
                        break;
                }
                this.axios.post(this.$httpConfig.brandDetail,QS.stringify({
                    id:this.$route.params.ID,
                    sort:this.sort_id,
                    page:this.page
                })).then(res => {
                    this.goods = [];
                    this.stateHandling(res.data.status, res.data.data.goods);
                    this.brand = res.data.data.brand;
                    this.brand_logo = res.data.data.brand.brand_logo;
                    this.brand_description = res.data.data.brand.brand_description;
                    this.$store.state.braDetails = res.data.data;
                    this.load = false;
                }).catch(err => {
                    console.log(err)
                });
            },
            //请求成功后的操作
            returnOperation(data) {
                if (data.length < 10 && this.page == 1) { //第一次请求成功如果数据没达到每页页数就禁止下拉
                    this.load_show = false; //动画隐藏
                    this.roll_switch = false; //禁止下拉加载
                }
                for (let index = 0; index < data.length; index++) {
                    this.goods.push(data[index]);
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
        },
        created(){
            this.sort();
        },
        mounted(){
            document.body.scrollTop = 0;
            let _this = this;
            window.addEventListener('scroll', function () {
                if (!_this.$refs.brand_list) return;
                if (document.body.scrollTop + window.innerHeight >= document.body.offsetHeight) {
                    //如果第一次请求没数据或数据没达到每页个数就不会再请求数据
                    if (_this.roll_switch == false) {
                        return;
                    }
                    if (_this.slide_switch == true) {
                        _this.slide_switch = false;
                        _this.page++;
                        _this.sort();
                    }
                }
            })
        },
        destroyed(){
            this.scrollWatch = false;
        },
        updated(){
            var that = this;
            setTimeout(function(){
                that.load_wrap = false;
            },1000);
        },
        components:{
            listHeader,
            listLop,
            Shopsn,
            toTop
        }
    }
</script>
<style lang="less">
    .load {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999999;
    }

    .load .mint-spinner-triple-bounce {
        width: 100%;
        text-align: center;
        position: absolute;
        left: 0;
        top: 50%;
    }
</style>
<style lang="less" scoped>
    .banner{
        img{
            width: 100%;
        }
    }
    .list-header{
        height: 1.1rem;
        padding:0 .2rem;
        background:#f9f9f9;
        .content{
            padding-left:1.7rem;
            height: 100%;
            padding-top:.1rem;
            box-sizing:border-box;
            position:relative;
            h6{
                font-size:.28rem;
                color:#333;
            }
            p{
                font-size:.2rem;
                line-height:.28rem;
                color:#999;
                height: .56rem;
            }
            .logo{
                position:absolute;
                left:0;
                bottom:0;
                width: 1.42rem;
                height: 1.42rem;
                box-sizing:border-box;
                border-radius:100%;
                border:2px solid #fff;
                background:#000;
                img{
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    position:absolute;
                    left:0;
                    top:0;
                    right:0;
                    bottom:0;
                    margin:auto;
                }
            }
        }
    }
    .sort-wrap {
        height: .9rem;
        background:#fff;
        box-sizing:border-box;
        padding:.2rem 0;
        border-bottom:1px solid #cbcbcb;
        line-height:.5rem;
        li{
            width: 33.3333333%;
            font-size:.26rem;
            color:#666;
            position:relative;
            .icon{
                position:absolute;
                left:1.6rem;
                top:0;
                height: 100%;
                .top{
                    position:absolute;
                    left:0;
                    top:.17rem;
                    width: .12rem;
                    height: .06rem;
                    background:url(../../assets/sort-top.png);
                    background-size:100% 100%;
                }
                .top.active{
                    background:url(../../assets/sort-top-active.png);
                    background-size:100% 100%;
                }
                .bottom{
                    position:absolute;
                    left:0;
                    bottom:.17rem;
                    width: .12rem;
                    height: .06rem;
                    background:url(../../assets/sort-bottom.png);
                    background-size:100% 100%;
                }
                .bottom.active{
                    background:url(../../assets/sort-bottom-active.png);
                    background-size:100% 100%;
                }
            }
        }
        li:nth-child(2){
            border-left:1px solid #cbcbcb;
            border-right:1px solid #cbcbcb;
            box-sizing:border-box;
        }
        li.active{
            color:#d0111b;
        }
    }
</style>
