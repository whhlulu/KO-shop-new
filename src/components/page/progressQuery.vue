<template>
    <div>
        <prog-header :text="title"></prog-header>
        <div class="com-content" v-for="item in data" :key="item.id">
            <div class="hd clearfix">
                <div class="hd-text fl">
                    <p class="number">订单编号：{{item.order_id}}</p>
                    <p class="money">退款金额：<span>{{item.price}}</span>元</p>
                </div>
                <div class="status fr" v-if="item.status == 0">审核中</div>
                <div class="status fr" v-if="item.status == 1">审核失败</div>
                <div class="status fr" v-if="item.status == 2">审核通过</div>
                <div class="status fr" v-if="item.status == 3">退货中</div>
                <div class="status fr" v-if="item.status == 4">退款中</div>
                <div class="status fr" v-if="item.status == 4">完成</div>
                <div class="status fr" v-if="item.status == 6">已撤销</div>
            </div>
            <div class="content clearfix">
                <img :src="URL + item.pic_url" class="fl">
                <div class="fl text">
                    <p class="p text2-hidden">{{item.title}}</p>
                    <p class="number">数量：{{item.number}}</p>
                </div>
            </div>
        </div>
        <dl class="describe" v-for="item in data" :key="item.id">
            <dt>问题描述</dt>
            <dd>{{item.tuihuo_case}}</dd>
        </dl>
        <dl class="describe" v-for="item in data" :key="item.id">
            <dt>审核留言</dt>
            <dd>{{item.message}}</dd>
        </dl>
        <!--<div class="progress">
            <h5>审核进度</h5>
            <ul class="examine">
                <li>
                    <span class="icon"></span>
                    <em class="triangle"></em>
                    <p class="time">015-08-13&nbsp;&nbsp;12:12:12</p>
                    <p class="text">您的服务单正在审核中。</p>
                    <p class="name">经办：商家客服-陈晓</p>
                </li>
                <li>
                    <span class="icon"></span>
                    <em class="triangle"></em>
                    <p class="time">015-08-13&nbsp;&nbsp;12:12:12</p>
                    <p class="text">您的服务单正在审核中。</p>
                    <p class="name">经办：商家客服-陈晓</p>
                </li>
            </ul>
            <button>拨打售后服务</button>
        </div>-->
    </div>
</template>

<script>
    import progHeader from './children/header';
    import qs from 'qs';
    export default {
        name:'progressQuery',
        data(){
            return {
                title : '进度查询',
                data(){
                    return {
                        data:''
                    }
                }
            }
        },
        mounted(){
            this.axios.post(API_URL + 'Home/Pcenter/speed_check_list',qs.stringify({
                id:this.$route.params.id
            })).then((res) => {
                this.data = res.data.data;
                console.log(this.data)
            }).catch((err) => {
                console.log(res);
            });
        },
        components:{
            progHeader
        }
    }
</script>

<style lang="less" scoped>
    .com-content{
        padding:.2rem;
        background:#fff;
        border-bottom:1px solid #dfdfdd;
        .hd{
            .hd-text{
                width: 5.5rem;
                height: 1.1rem;
                .number{
                    font-size:.25rem;
                    color:#333;
                    padding-top:.2rem;
                }
                .money{
                    font-size:.28rem;
                    color:#757575;
                    padding-top:.2rem;
                    span{
                        font-size:.28rem;
                        color:#d0111b;
                        font-weight: bold;
                    }
                }
            }
            .status{
                font-size:.3rem;
                color:#e02828;
                line-height: 1.1rem;
            }
        }
        .content{
            border-top:1px solid #dfdfdd;
            padding-top:.38rem;
            padding-bottom:.2rem;
            img{
                width: 1.46rem;
                height: 1.46rem;
                border:1px solid #dfdfdd;
                box-sizing: border-box;
            }
            .text{
                width: 5rem;
                padding-left:.2rem;
                .p{
                    font-size:.25rem;
                    color:#333;
                    line-height: .38rem;
                    font-weight: bold;
                    height: .76rem;
                }
                .number{
                    font-size:.25rem;
                    color:#999;
                    padding-top:.2rem;
                }
            }
        }
    }
    .describe{
        padding:0 .2rem;
        background:#fff;
        margin:.2rem 0;
        border-bottom:1px solid #dfdfdd;
        border-top:1px solid #dfdfdd;
        dt{
            font-size:.3rem;
            color:#333;
            padding-top:.48rem;
        }
        dd{
            font-size:.25rem;
            color:#757575;
            padding-top:.2rem;
            padding-bottom:.49rem;
        }
    }
    .progress{
        border-top:1px solid #dfdfdd;
        background:#fff;
        padding:0 .2rem;
        h5{
            padding-top:.4rem;
            padding-bottom:.1rem;
            font-size:.3rem;
            color:#333;
        }
        .examine{
            border-left:1px solid #bbb;
            padding:.2rem 0;
            margin-left:.2rem;
            width: 7rem;
            li{
                position: relative;
                margin-left:.38rem;
                border:1px solid #d5d5d5;
                border-radius:5px;
                padding:.2rem;
                box-sizing: border-box;
                margin-top:.2rem;
                span{
                    position:absolute;
                    left:-.56rem;
                    top:0;
                    width: .33rem;
                    height: .33rem;
                    border:.05rem solid #e02828;
                    box-sizing: border-box;
                    border-radius:50%;
                    background:#fff;
                }
                p{
                    font-size:.25rem;
                    color:#e02828;
                    padding-bottom:.2rem;
                }
                p.name{
                    padding:0;
                }
            }
        }
        button{
            width: 100%;
            height: .9rem;
            line-height: .9rem;
            background:#e02828;
            border:none;
            margin-top:.5rem;
            font-size:.32rem;
            color:#fff;
            margin-bottom:.2rem;
        }
    }
</style>
