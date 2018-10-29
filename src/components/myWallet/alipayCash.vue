<template>
  <div>
      <div v-title :data-title="title">{{title}}</div>
      <with-header :text="title"></with-header>
      <div class="from-wrap">
          <div class="input-main clearfix">
              <span class="fl account_num">账号</span>
              <input type="text" name="account" v-model="account" @blur="zfb_account" placeholder="请输入支付宝账户">
          </div>
      </div>
      <div class="from-glup">
        <div class="input-wrap clearfix">
            <span class="fl icon">￥</span>
            <input type="tel" v-model="money" @blur="change" class="fl" :placeholder="'可提现金额'+balance+'元'">
        </div>
        <div class="status clearfix">
            <span class="danger fl" v-show="show">转出金额超限</span>
            <span class="turnOut fr" @click="total">全部转出</span>
        </div>
      </div>
      <button class="form-btn" @click="bypay">{{text}}</button>
  </div>
</template>
<script>
    import withHeader from '@/components/page/children/header.vue';
    import QS from 'qs';
    import { Toast } from 'mint-ui';
    export default {
        name : 'alipayCash',
        data(){
            return {
                title:'提现申请',
                text:'提交',
                balance:'0.00',
                account:'',
                money:'',
                show:false

            }
        },
        methods: {
            //提交
            bypay(){
                    if(this.account ==''){
                        Toast({
                          message: '请输入正确的支付宝账号',
                          duration: 1000
                        });
                        return false;
                    }else if(this.money == ''){
                        Toast({
                          message: '金额错误',
                          duration: 1000
                        });
                        return false;
                    } 
            },
            //全部转出
            total(){
                this.money = this.balance;
            },
            //zfb账号验证
            zfb_account(){
                let tel = /^[1][3,4,5,7,8,9][0-9]{9}$/;
                let reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
                if(!reg.test(this.account)){
                    if(!tel.test(this.account)){
                        Toast({
                          message: '请输入正确的支付宝账号',
                          duration: 1000
                        });
                        return;
                    }
                }
            },
            //金额验证
            change(){
                let regTow = /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*|[1-9]\d*$/;
                let money = parseFloat(this.money);
                let balance = parseFloat(this.balance)

                if(!(regTow.test(money))){
                    Toast({
                      message: '金额错误',
                      duration: 1000
                    });
                    return;
                }
            }
        },
        created(){
          this.axios.post(API_URL+'Home/Pcenter/myRebate').then((res) => {
                this.balance = res.data.data.balance;
              }).catch((err) => {
                  console.log(err);
              })

        },
        mounted(){
        },
        components:{
            withHeader
        }
    }
</script>
<style lang="less" scoped>
    .from-wrap {
        background: #fff;
        padding: 0 .2rem;
        .input-main {
            width: 100%;
            height: 1rem;
            line-height: 1rem;
            border-bottom: 1px solid #dfdfdf;
            .account_num {
                font-size:.32rem;
                width:1.6rem;
            }
            input {
                width: 5.5rem;
                height: 100%;
                outline: none;
                border:none;
                font-size: .32rem;
                width: 5.5rem;
                text-indent:.5rem;
            }
        }
    }
    .from-glup{
        padding:.2rem;
        width: 7.1rem;
        background:#fff;
        border-bottom:1px solid #dfdfdd;
        .input-wrap{
            height: .6rem;
            line-height:.6rem;
            padding:.3rem 0;
            .icon{
                font-size:.6rem;
                color:#333;
            }
            input{
                width: 6.4rem;
                height: 100%;
                border:none;
                text-indent: .2rem;
                font-size:.42rem;
                outline: none;
            }
        }
    }
    .status{
        .danger{
            font-size:.28rem;
            color:#d0111b;
        }
        .turnOut{
            font-size:.32rem;
            color:#1caceb;
        }
    }
    .form-btn{
        width:7.1rem;
        height:.9rem;
        background: #D19E29;
        border:none;
        border-radius:20px;
        color:#fff;
        display:block;
        margin:.62rem auto;
        box-sizing: border-box;
        font-size:.4rem;
        outline: none;
    }
    .form-btn:active{
        box-shadow: 0 5px 5px #ccc;
    }
</style>