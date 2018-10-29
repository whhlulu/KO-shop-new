<template>
    <div class="per-center">
        <div v-title data-title="个人中心">个人中心</div>
        <div class="header-wrap">
            <div class="header-hd">个人中心<router-link to="/myNews"><span></span></router-link></div>
            <div class="header-dd-center">
                <!--<div class="setUp"></div>-->
                <div class="icon-wrap" @click="toLink('/seetin')">
                    <img :src="URL+ $store.state.user_Imag">
                </div>
                <div class="admin" @click="toLink('/seetin')"><span></span>账户管理</div>
            </div>
            <div class="status">
                <span class="name">{{data.user_name}}</span>
                <!--<span class="member">黄金会员</span>-->
            </div>
        </div>
        <div class="myOrder clearfix">
            <div class="title fl"><span class="icon"></span>我的订单</div>
            <div class="see fr" @click="toOrder(0)"><span class="icon-right"></span>查看订单</div>
        </div>
        <ul class="nav-link clearfix">
            <li class="fl" v-for="(item,index) in navCon" :key="item.id" @click="toOrder(index+1)">
                <div class="icon-wrap">
                    <img :src="item.imgData" alt="">
                </div>
                <p>{{item.text}}</p>
            </li>
        </ul>
        <div class="myOrder clearfix">
            <div class="title fl"><span class="icon-wallet"></span>我的钱包</div>
            <div class="see fr" @click="toLink('/myWallet')"><span class="icon-right"></span>查看详情</div>
        </div>
        <ul class="account clearfix">
            <li class="fl" @click="toLink('/myWallet')">
                <p class="number"><span class="money">￥</span><span class="min">{{$store.state.my_wallet.balance || 0}}</span></p>
                <p class="balance">账户余额</p>
            </li>
            <li class="fl" @click="toLink('/Integral')">
                <p class="number">{{$store.state.my_wallet.integral || 0}}</p>
                <p class="balance">积分</p>
            </li>
        </ul>
        <ul class="more clearfix">
            <li class="fl" v-for="(item,index) in more.icon" :key="item.id" @click="toLink(index)">
                <div class="icon-main">
                    <img :src="item">
                </div>
                <p>{{more.name[index]}}</p>
            </li>
        </ul>
        <Shopsn></Shopsn>
    </div>
</template>
<script>
    import qs from 'qs';
    import Shopsn from '@/components/page/Shopsn.vue';
    export default {
        name : 'MyAiguxuan',
        data(){
            return {
                more:{
                    icon:[require('@/assets/yhq.png'),require('@/assets/jfsc.png'),require('@/assets/my_ico_01.png'),require('@/assets/my_ico_04.png'),require('@/assets/wdpj.png'),require('@/assets/my_ico_02@3x.png'),require('@/assets/my_ico_03.png'),require('@/assets/my_ico_08.png'),require('@/assets/distribute.png'),require('@/assets/team.png')],
                    name:['优惠券','积分商城','我的收藏','足迹','我的评价','收货地址','客服中心','意见反馈','我的分销金','我的团队']
                },
                Imag:'',
                navCon:[
                    {text:'待付款',imgData:require('@/assets/Orders_01.png')},
                    {text:'待处理',imgData:require('@/assets/Orders_02.png')},
                    {text:'待收货',imgData:require('@/assets/Orders_03.png')},
                    {text:'已完成',imgData:require('@/assets/Orders_04.png')},
                    {text:'返修/退货',imgData:require('@/assets/Orders_05.png')}
                ],
                data:'',
                user_header:true
            }
        },
        components: {
            Shopsn
        },
        methods:{
            toOrder(sta){
                if(sta == 5){
                    this.$router.push('/repair')
                    return;
                }
                this.$store.state.status = sta;
                this.$router.push({
                    name:'orderWrap',
                    params:{
                        status:sta
                    }
                });
            },
            toLink(link){
                 if(!sessionStorage.getItem('user_ID')){
                        this.$router.push({
                        path:'/LogoIn'
                    });
                    return
                }
                function isString(str){ 
                    return (typeof str=='string')&&str.constructor==String; 
                };
                if(isString(link)){
                    this.$router.push({
                        path:link
                    });
                }else{
                    switch(link){
                        case 0:
                            this.$router.push('/coupon');
                            break;
                        case 1:
                            this.$router.push('/Integral')
                            break;
                        case 2:
                            this.$router.push('/Collection');
                            break;
                        case 3:
                            this.$router.push('/footprint')
                            break;
                        case 4:
                            this.$router.push('/myComment')
                            break;
                        case 5:
                            this.$router.push({
                                name:'address',
                                params:{
                                    status:2
                                }
                            });
                            break;
                        case 6:
                            this.$router.push('/customer');
                            break;
                        case 7:
                            this.$router.push('/Feedback');
                            break;
                        case 8:
                            this.$router.push('/withdrawal');
                            break;
                        case 9:
                            this.$router.push('/myTeam');
                            break;
                    }
                }
            }
        },
        mounted(){
            document.body.scrollTop = 0;
            this.axios.post(API_URL + 'Home/Pcenter/userinfo',qs.stringify({
                app_user_id:sessionStorage.getItem('user_ID')
            })).then((res) => {
                this.data = res.data.data;
                let ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                    this.$store.state.user_Imag=res.data.data.weixheader
                } else {
                    this.$store.state.user_Imag=res.data.data.user_header
                    
                }
            }).catch((err) => {
                console.log(err)
            });
            this.axios.post(API_URL + 'Home/Pcenter/my_wallet',qs.stringify({
                app_user_id:sessionStorage.getItem('user_ID'),
            })).then((res) => {
                this.$store.state.my_wallet = res.data.data;
            }).catch((err) => {
                console.log(err)
            });
        },
        wacth:{
            
        }
    }
</script>
<style lang="less" scoped>
    .per-center{
        background:#f1f1f1;
    }
    .header-wrap{
        width:100%;
        background: -webkit-linear-gradient(left, #f97522, #fd4f4b);
        background: -o-linear-gradient(right, #f97522, #fd4f4b);
        background: -moz-linear-gradient(right, #f97522, #fd4f4b);
        background: linear-gradient(to right, #f97522, #fd4f4b);
        .header-hd{
            height:.6rem;
            line-height:.6rem;
            font-size:.32rem;
            padding:.2rem 0;
            color:#fff;
            text-align:center;
            position:relative;
            span{
                width:.47rem;
                height:.46rem;
                position:absolute;
                right:.23rem;
                top:50%;
                margin-top:-.23rem;
                background:url('../../assets/news1.png') no-repeat;
                background-size:100% 100%;
            }
        }
        .header-dd-center{
            width:100%;
            height:1.5rem;
            position:relative;
            .setUp{
                width:.62rem;
                height:.61rem;
                position:absolute;
                left:1.04rem;
                top:50%;
                margin-top:-.305rem;
                background:url(../../assets/setUp.png) no-repeat;
                background-size:100% 100%;
            }
            .icon-wrap{
                width:1.26rem;
                height:1.26rem;
                border:.09rem solid rgba(252,135,93,.5);
                border-radius:100%;
                overflow:hidden;
                position:absolute;
                left:0;
                top:0;
                right:0;
                bottom:0;
                margin:auto;
                img{
                    width:1.26rem;
                    height:1.26rem;
                    border-radius:100%;
                    box-sizing:border-box;
                }
            }
            .admin{
                height:.61rem;
                width:1.68rem;
                line-height:.61rem;
                background:#fff;
                position:absolute;
                right:0;
                top:50%;
                margin-top:-.305rem;
                border-radius:20px 0 0 20px;
                box-sizing:border-box;
                text-indent:.53rem;
                font-size:.24rem;
                color:#797979;
                span{
                    position:absolute;
                    top:50%;
                    left:.15rem;
                    margin-top:-.135rem;
                    width:.27rem;
                    height:.27rem;
                    background:url(../../assets/acIcon.png) no-repeat;
                    background-size:100% 100%;
                }
            }
        }
        .status{
            padding:.2rem 0;
            text-align:center;
            line-height:.31rem;
            span{
                display:inline-block;
                height:.31rem;
            }
            .name{
                font-size:.28rem;
                color:#fff;
            }
            .member{
                padding-left:.37rem;
                padding-right:.1rem;
                width:1.08rem;
                font-size:.24rem;
                color:#fff600;
                background:url(../../assets/mberIcon.png) no-repeat;
                background-size:100% 100%;
            }
        }
    }
    .myOrder{
        width:7.1rem;
        height:.94rem;
        padding:0 .2rem;
        line-height:.94rem;
        background:#fff;
        .title{
            font-size:.28rem;
            color:#333;
            text-indent:.6rem;
            position:relative
        }
        .icon{
            position:absolute;
            left:0;
            top:50%;
            width:.39rem;
            height:.39rem;
            margin-top:-.195rem;
            background:url(../../assets/order-icon.png) no-repeat;
            background-size:100% 100%;
        }
        .icon-wallet{
            position:absolute;
            left:0;
            top:50%;
            width:.39rem;
            height:.39rem;
            margin-top:-.195rem;
            background:url(../../assets/wallet_ico.png) no-repeat;
            background-size:100% 100%;
        }
        .see{
            font-size:.24rem;
            color:#999;
            position:relative;
            padding-right:.4rem;
            .icon-right{
                position:absolute;
                right:0;
                top:50%;
                width:.18rem;
                height:.3rem;
                margin-top:-.15rem;
                background:url('../../assets/btn-right.png') no-repeat;
                background-size:100% 100%;
            }
        }
    }
    .nav-link{
        margin-bottom:.14rem;
        background:#fff;
        li{
            width:20%;
            height:1.26rem;
            text-align:center;
            padding-top:.1rem;
            .icon-wrap{
                width:100%;
                height:.8rem;
                position:relative;
                img{
                    position:absolute;
                    left:0;
                    top:0;
                    bottom:0;
                    right:0;
                    margin:auto;
                }
            }
            p{
                font-size:.24rem;
                color:#797979;
            }
        }
        li:nth-child(1){
            .icon-wrap{
                img{
                    width:.39rem;
                    height:.38rem;
                }
            }
        }
        li:nth-child(2){
            .icon-wrap{
                img{
                    width:.41rem;
                    height:.4rem;
                }
            }
        }
        li:nth-child(3){
            .icon-wrap{
                img{
                    width:.39rem;
                    height:.37rem;
                }
            }
        }
        li:nth-child(4){
            .icon-wrap{
                img{
                    width:.4rem;
                    height:.34rem;
                }
            }
        }
        li:nth-child(5){
            .icon-wrap{
                img{
                    width:.43rem;
                    height:.37rem;
                }
            }
        }
    }
    .account{
        padding:.2rem 0;
        height:.95rem;
        width:100%;
        background:#fff;
        margin-bottom:.14rem;
        li{
            width:50%;
            height:100%;
            border-right:1px solid #e7e7e7;
            box-sizing:border-box;
            text-align:center;
            .number{
                font-size:.42rem;
                color:#333;
                .money{
                    font-size:.32rem;
                    color:#999;
                }
                .min{
                    font-size:.32rem;
                }
            }
            .balance{
                font-size:.24rem;
                color:#999;
                padding-top:.15rem;
            }
        }
        li:last-child{
            border:none;
        }
    }
    .more{
        border-top:1px solid #dfdfdf;
        background:#fff;
        li{
            width:25%;
            height:2rem;
            border-right:1px solid #ebebeb;
            border-bottom:1px solid #ebebeb;
            box-sizing: border-box;
            text-align:center;
            p{
                font-size:.24rem;
                color:#333;
            }
            .icon-main{
                width:100%;
                height: .86rem;
                position:relative;
                padding-top:.57rem;
            }
        }
        li:nth-child(1){
            img{
                width:.7rem;
                height:.51rem;
            }
        }
        li:nth-child(2){
            img{
                width:.49rem;
                height:.51rem;
            }
        }
        li:nth-child(3){
            img{
                width:.46rem;
                height:.5rem;
            }
        }
        li:nth-child(4){
            img{
                width:.45rem;
                height:.55rem;
            }
        }
        li:nth-child(5){
            img{
                width:.53rem;
                height:.53rem;
            }
        }
        li:nth-child(6){
            img{
                width:.55rem;
                height:.54rem;
            }
        }
        li:nth-child(7){
            img{
                width:.61rem;
                height:.57rem;
            }
        }
        li:nth-child(8){
            img{
                width:.52rem;
                height:.50rem;
            }
        }
        li:nth-child(4n){
            border-right:none;
        }
    }
</style>