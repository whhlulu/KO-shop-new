<template>
  <div>
    <dl class="other">
        <dt>其他支付方式</dt>
        <dd v-for="(item,index) in otherdata.img" :key="item.id" class="clearfix">
            <img :src="item" class="fl">
            <div class="fl pull-right">
                <h6 class="title">{{otherdata.title[index]}}</h6>
                <p class="con">{{otherdata.content[index]}}</p>
            </div>
            <span class="icon"></span>
        </dd>
    </dl>
  </div>
</template>
<script>
    export default {
        name : 'payMethods',
        props:{
            otherdata:null
        }
    }
</script>
<style lang="less" scoped>
    .other{
        padding:0 .2rem;
        background:#fff;
        dt{
            font-size:.3rem;
            color:#333;
            height:.7rem;
            line-height:.7rem;
            border-bottom:1px solid #dfdfdf;
        }
        dd{
            padding:.3rem 0;
            height:.83rem;
            border-bottom:1px solid #dfdfdf;
            position:relative;
            img{
                width:.83rem;
                height:.83rem;
            }
            .icon{
                position:absolute;
                top:50%;
                right:.2rem;
                width:.2rem;
                height:.35rem;
                background:url(../../assets/btn-right.png) no-repeat;
                background-size:100% 100%;
                margin-top:-.175rem;
            }
            .pull-right{
                padding-left:.3rem;
                .title{
                    font-size:.32rem;
                    color:#333;
                }
                .con{
                    padding-top:.15rem;
                    font-size:.26rem;
                    color:#999;
                }
            }
        }
    }
</style>
