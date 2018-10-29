<template>
  <div>
      <div v-title :data-title="title">{{title}}</div>
      <coll-header :text="title" :search="search"></coll-header>
      <nav class="text-center">
          <div :style="{width:(data.classname.length + 1) * 1.8 +'rem'}" v-if="data.classname" class="clearfix">
            <span class="fl" @click="refresh(-1)" :class="{active:sta == -1}" >全部宝贝</span>
            <span class="fl" :class="{active:sta == index}" v-for="(item,index) in data.classname" :key="item.id" @click="refresh(index)">{{item.class_name}}</span>
          </div>
      </nav>
      <div class="content-wrap">
            <h2 class="title">最近1个月收藏</h2>
            <div class="con">
                <div class="item-list-wrap">
                    <div v-for="(item,index) in data.goods" :key="item.id" class="clearfix">
                        <transition name="move">
                            <div class="item-list" @touchmove="move($event,index)" @touchstart="moveEv($event)" :class="{active:status == index}">
                                <img v-lazy="URL + item.img" class="fl">
                                <div class="item fl">
                                    <div class="text text2-hidden">{{item.title}}</div>
                                    <div class="price">￥{{item.price_member}}</div>
                                    <!--<div class="status">
                                        <span>已有1000条评论</span>
                                        <span>3000笔交易成功</span>
                                    </div>-->
                                </div>
                                <div class="btn text-center" @click="del(item,index)">取消收藏</div>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
      </div>
        <Shopsn></Shopsn>
      <div class="load" v-show="load" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
      <div class="load-wrap" v-show="load_wrap" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
  </div>
</template>
<script>
    import qs from 'qs';
    import collHeader from '@/components/page/children/header.vue';
    import Shopsn from '@/components/page/Shopsn.vue';
    import { MessageBox,Toast } from 'mint-ui';
    export default {
        name : 'myCollection',
        data(){
            return {
                title:'我的收藏',
                search:false,
                loading:false,
                data:'',
                status:null,
                sta:-1,
                load_wrap:true,
                load:false
            }
        },
        components:{
            collHeader,
            Shopsn
        },
        methods:{
            moveEv(ev){
                this.startX = ev.touches[0].pageX;
                this.startY = ev.touches[0].pageY;  
            },
            move(ev,index){
                 //返回角度
                function GetSlideAngle(dx,dy) {
                    return Math.atan2(dy,dx) * 180 / Math.PI;
                }
                //根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
                function GetSlideDirection(startX,startY, endX, endY) {
                    var dy = startY - endY;
                    var dx = endX - startX;
                    var result = 0;
                    //如果滑动距离太短
                    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
                        return result;
                    }
                    var angle = GetSlideAngle(dx, dy);
                    if (angle >= -45 && angle < 45) {
                        result = 4;
                    }else if (angle >= 45 && angle < 135) {
                        result = 1;
                    }else if (angle >= -135 && angle < -45) {
                        result = 2;
                    }else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
                        result = 3;
                    }
                    return result;
                }
                this.endX = ev.changedTouches[0].pageX;
                this.endY = ev.changedTouches[0].pageY;

                var direction = GetSlideDirection(this.startX, this.startY, this.endX, this.endY);
                if(direction == 3){
                    this.status = index;
                    return;
                }else{
                    this.status = null;
                }
            },
            refresh(index){
                this.load = true;
                this.sta = index;
                if(index == -1){
                    this.post();
                }else{
                    this.axios.get(API_URL + 'Home/Order/classGoods',{
                        params:{
                            class_id:this.data.classname[index].id,
                            app_user_id:sessionStorage.getItem('user_ID')
                        }
                    }).then((res) => {
                        this.data.goods = res.data.data;
                        this.load = false;
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            },
            post(){
                this.axios.post(API_URL + 'Home/Order/myCollection',qs.stringify({
                    app_user_id:sessionStorage.getItem('user_ID')
                })).then((res) => {
                    this.data = res.data.data;
                    this.load = false;
                    this.load_wrap = false;
                }).catch((err) => {
                    console.log(err);
                });
            },
            del(item,index){
                MessageBox.confirm('确定执行此操作?').then(action => {
                    this.axios.post(API_URL + 'Home/Cart/add_collection',qs.stringify({
                        app_user_id:sessionStorage.getItem('user_ID'),
                        goods_id:item.id,
                        type:2
                    })).then((res) => {
                        this.data.goods.splice(index,1);
                        this.status = null;
                        Toast({
                            message: res.data.msg,
                            position: 'bottom'
                        });
                    }).catch((err) => {
                        console.log(err);
                    });
                }).catch((err) => {
                    console.log(err);
                });
            }
        },
        updated(){
            var that = this;
            setTimeout(function(){
                that.load_wrap = false;
            },1000);
        },
        mounted(){
            this.post();
        }
    }
</script>
<style lang="less" scoped>
    
    nav{
        padding:.2rem;
        height: .54rem;
        background:#fff;
        overflow-x: auto;
        span{
            height: 100%;
            background:#eee;
            line-height:.54rem;
            color:#666;
            font-size:.24rem;
            width: 1.6rem;
            margin-right:.2rem;
            border-radius:5px;
        }
        span:active,span.active{
            border:1px solid #ff7200;
            background-color:#fff;
            box-sizing: border-box;
        }
        span:last-child{
            margin:0;
        }
    }
    .content-wrap{
        .title{
            height: .73rem;
            line-height:.73rem;
            text-indent: .2rem;
            font-size:.26rem;
            color:#666;
        }
        .con{
            .item-list-wrap{
                overflow: hidden;
                .item-list.active{
                    transform:translate(-1.38rem);
                }
                .item-list{
                    width: 7.5rem;
                    height: 2.6rem;
                    padding:.2rem;
                    background:#fff;
                    position:relative;
                    box-sizing: border-box;
                    .btn{
                        width: 1.38rem;
                        height: 100%;
                        position:absolute;
                        right:-1.38rem;
                        top:0;
                        background:url(../../assets/bg2.png) no-repeat #d0111b center .71rem;
                        background-size:.58rem .57rem;
                        color:#fff;
                        font-size: .24rem;
                        box-sizing: border-box;
                        padding-top: 1.5rem;
                    }
                    img{
                        width: 2.2rem;
                        height: 2.2rem;
                    }
                    .item{
                        width: 4.7rem;
                        height: 2.2rem;
                        border-bottom:1px solid #cbcbcb;
                        box-sizing: border-box;
                        margin-left:.13rem;
                        .text{
                            font-size:.32rem;
                            height: .85rem;
                            color:#333;
                            line-height:.42rem;
                        }
                        .price{
                            padding-top:.1rem;
                            font-size:.32rem;
                            color:#f23030;
                            span{
                                font-size:.4rem;
                            }
                        }
                        .status{
                            span{
                                font-size:.24rem;
                                color:#bbb;
                                line-height:.7rem;
                            }
                        }
                    }
                }
            }
        }
    }
</style>