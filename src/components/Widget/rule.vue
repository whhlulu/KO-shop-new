<template>
  <div>
      <transition name="fade">
        <div class="rule-wrap" v-show="rule">
            <div class="rule-bg" @click="addShow"></div>
            <div class="content-wrap">
                <div class="title text-center">积分规则</div>
                <div class="rule-main">
                    <div class="item-list">
                        <h5>如何获取积分</h5>
                        <dl>
                            <dt>1.新客户注册得积分</dt>
                            <dd>首次在史泰博官网(STB.com)注册的新客户，即可免费获得积分。</dd>
                        </dl>
                        <dl>
                            <dt>2.网站购物得积分</dt>
                            <dd>10元=1积分(现金卡券类商品不可获得积分)</dd>
                            <dd>注: 积分数量计算结果采用去尾数结算，不支持四舍五入结算。</dd>
                        </dl>
                        <dl>
                            <dt>3.首单额外奖励积分</dt>
                            <dd>新客户首单额外赠送积分。</dd>
                        </dl>
                    </div>
                    <div class="item-list">
                        <h5>如何使用积分?</h5>
                        <dl>
                            <dt>1.兑换礼品</dt>
                        </dl>
                        <dl>
                            <dt>2.抵扣运费</dt>
                            <dd>当您订购商品时,订单金额未达到免运条件需要支付运费,可使用积分抵扣运费。</dd>
                        </dl>
                    </div>
                </div>
                <div class="btn-wrap text-center">
                    <button type="button" @click="addShow">我知道</button>
                </div>
            </div> 
        </div>
      </transition>
  </div>
</template>
<script>
    export default {
        name : 'rule',
        data(){
            return {

            }
        },
        methods:{
            addShow(){
                this.ruleCon = false;
                this.$emit('addShow')
            }
        },
        props:{
            rule:null
        }
    }
</script>
<style lang="less" scoped>
    .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0
    }
    .rule-wrap{
        position:fixed;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
        .rule-bg{
            position:absolute;
            left:0%;
            top:0;
            width: 100%;
            height: 100%;
            background:rgba(0,0,0,.5);
        }
        .content-wrap{
            width: 7rem;
            height: 9rem;
            background:#fff;
            border-radius:10px;
            position:absolute;
            left:0;
            top:0;
            right:0;
            bottom:0;
            margin:auto;
            z-index:1;
            padding:0 .45rem;
            box-sizing: border-box;
            .title{
                height: 1rem;
                line-height:1rem;
                font-size:.42rem;
                color:#d0111b;
            }
            .rule-main{
                height: 6.5rem;
                overflow-y:auto; 
                h5{
                    font-size:.3rem;
                    color:#000;
                    padding:.2rem 0;
                }
                dl{
                    dt{
                        font-size:.3rem;
                        color:#666;
                        line-height:.42rem;
                    }
                    dd{
                        font-size:.26rem;
                        color:#666;
                        line-height:.42rem;
                        padding-left: 1em;
                    }
                }
            }
            .btn-wrap{
                padding-top:.2rem;
                button{
                    width: 6rem;
                    height: 1rem;
                    border:1px solid #535353;
                    background:#fff;
                    box-sizing: border-box;
                    border-radius:10px;
                    outline: none;
                    font-size:.3rem;
                    color:#999;
                }
            }
        }
    }
</style>