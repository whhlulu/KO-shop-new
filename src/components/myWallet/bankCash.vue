<template>
  <div>
      <div v-title :data-title="title">{{title}}</div>
      <with-header :text="title"></with-header>
      <div class="from-wrap">
          <div class="input-main clearfix">
              <span class="fl account_num">持卡人</span>
              <input type="text" name="account" maxlength="10" v-model="cardholder_name" class="name" placeholder="请输入持卡人姓名">
          </div>
          <div class="input-main clearfix">
              <span class="fl account_num">卡号</span>
              <input type="tel" name="account" class="card" v-model="card_number" placeholder="请输入正确的卡号">
          </div>
          <div class="input-main clearfix">
              <span class="fl account_num">银行名称</span>
              <input type="text" name="account" v-model="card_name" maxlength="15"  placeholder="请输入银行名称">
          </div>
          <div class="input-main clearfix">
              <span class="fl account_num">联系手机号</span>
              <input type="tel" name="account" maxlength="11" v-model="mobile"  placeholder="请输入联系手机号码">
          </div>
      </div>
      <div class="from-glup">
        <div class="input-wrap clearfix">
            <span class="fl icon">￥</span>
            <input type="tel" v-model="money" class="fl" @change="change" :placeholder="'可提现金额'+balance+'元'">
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
    import qs from 'qs';
    import { Toast } from 'mint-ui';
    export default {
        name : 'Withdrawals',
        data(){
            return {
                title:'提现申请',
                text:'提交',
                balance:'0.00',
                mobile:'',
                money:'',
                show:false,
                cardholder_name:'',
                card_number:'',
                card_name:''

            }
        },
        created(){
             this.axios.post(API_URL + 'Home/Pcenter/my_wallet').then((res) => {
                this.balance = res.data.data.balance;
            }).catch((err) => {
                console.log(err)
            });
        },
        methods: {
            //提交
            bypay(){
                    if(!/^[\u4e00-\u9fa5]{2,10}$/.test(this.cardholder_name)){
                        Toast({
                          message: '请输入正确的持卡人姓名',
                          duration: 1000
                        });
                        return false;
                    }else if(!/^[1-9](\d{15})|\d{18}$/.test(this.card_number)){
                        Toast({
                          message: '请输入正确的卡号',
                          duration: 1000
                        });
                        return false;
                    }else if(!/^[\u4e00-\u9fa5]{2,10}$/.test(this.card_name)){
                        Toast({
                          message: '请输入正确的银行名称',
                          duration: 1000
                        });
                        return false;
                    }else if(!/^1[34578]\d{9}$/.test(this.mobile)){
                        Toast({
                          message: '请输入正确的手机号码',
                          duration: 1000
                        });
                        return false;
                    }else if(!/^[1-9]\d*\.\d*|0\.\d*[1-9]\d*|[1-9]\d*$/.test(this.money )){
                        Toast({
                          message: '金额错误',
                          duration: 1000
                        });
                        return false;
                    }
                    this.axios.post(API_URL+'Home/Pcenter/balance_deposit',qs.stringify({
                          user_name: this.cardholder_name,
                          card: this.card_number,
                          bank_type: this.card_name,
                          mobile: this.mobile,
                          price:this.money
                      })).then((res) => {
                        if(!res.data.status == 1){
                            Toast({
                              message: res.data.msg,
                              duration: 1000
                            });
                        }else{
                            Toast({
                              message: res.data.msg,
                              duration: 1000
                            });
                            this.$router.push("/myWallet");
                        }
                      }).catch((err) => {
                          console.log(err);
                      }) 
            },
            //全部转出
            total(){
                this.money = this.balance;
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
                 if(money > balance){
                    this.show = true;
                    return;
                }else{
                    this.show = false;
                }
            }
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
        padding-top: .1rem;
        .input-main {
            width: 100%;
            height: 1rem;
            line-height: 1rem;
            border-bottom: 1px solid #dfdfdf;
            .account_num {
                font-size:.32rem;
                width:1.6rem;
            }
            .bestir_pre {
                font-size:.32rem;
            }
            .bestir {
                width: 5rem;
                height: 100%;
                text-align:center;
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