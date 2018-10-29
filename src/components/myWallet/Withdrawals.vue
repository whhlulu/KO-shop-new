<template>
  <div>
      <div v-title :data-title="title">{{title}}</div>
      <with-header :text="title"></with-header>
      <div class="from-glup">
        <ul class="other">
            <li @click="tolink('/alipayCash')">
                <img src="../../assets/zfb15.png" class="fl">
                <p class="fl">提现到支付宝</p>
                <span  class="icon"></span>
            </li>
            <li @click="tolink('/bankCash')">
                <img src="../../assets/yhk13.png" class="fl yhk">
                <p class="fl">提现到银行卡</p>
                <span  class="icon"></span>
            </li>
        </ul>
      </div>
  </div>
</template>
<script>
    import withHeader from '@/components/page/children/header.vue';
    export default {
        name : 'Withdrawals',
        data(){
            return {
                title:'提现',
                text:'确认提现'
            }
        },
        methods: {
            tolink(link){
                this.$router.push(link);
            }
        },
        components:{
            withHeader
        }
    }
</script>
<style lang="less" scoped>
    .from-glup{
        padding:0 .2rem;
        width: 7.1rem;
        background:#fff;
        border-bottom:1px solid #dfdfdd;
        .other {
            background: #fff;
            li {
                height: 1rem;
                border-bottom: 1px solid #dfdfdf;
                position: relative;
                img {
                    width: .6rem;
                    height: .6rem;
                    padding: .2rem 0;
                }
                .yhk {
                    width:.55rem;
                    height:.4rem;
                    padding: .3rem 0;
                }
                p{
                    font-size:.35rem;
                    padding-left:.2rem;
                    line-height:1rem;
                }
                .icon {
                    position: absolute;
                    top: 50%;
                    right: .2rem;
                    width: .2rem;
                    height: .35rem;
                    background: url(../../assets/btn-right.png) no-repeat;
                    background-size: 100% 100%;
                    margin-top: -.175rem;
                }
            }
            li:nth-child(2){
                border:none;
            }
        }
    }
</style>