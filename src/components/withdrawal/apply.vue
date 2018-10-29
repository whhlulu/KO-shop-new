<template>
  <div>
      <div v-title :data-title="title">{{title}}</div>
      <with-header :text="title"></with-header>
      <div class="from-wrap">
          <div class="input-main clearfix" v-if="$route.params.status == 'zfb'">
              <span class="fl account_num">账号</span>
              <input type="text" name="account" v-model="account" @blur="zfb_account" placeholder="请输入支付宝账户">
          </div>
      </div>
      <div class="from-wrap" v-if="$route.params.status == 'yhk'">
          <div class="input-main clearfix">
              <span class="fl account_num">持卡人</span>
              <input type="text" name="account" @blur="cardholder" v-model="cardholder_name" class="name" placeholder="请输入持卡人姓名">
          </div>
          <div class="input-main clearfix">
              <span class="fl account_num">卡号</span>
              <input type="tel" name="account" class="card" @blur="card" v-model="card_number" placeholder="请输入正确的卡号">
          </div>
          <div class="input-main clearfix">
              <span class="fl account_num">银行名称</span>
              <input type="text" name="account" @blur="yhkName" v-model="card_name"  placeholder="请输入银行名称">
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
        name : 'Withdrawals',
        data(){
            return {
                title:'提现申请',
                text:'提交',
                balance:'0.00',
                account:'',
                money:'',
                show:false,
                cardholder_name:'',
                card_number:'',
                card_name:'',
                gcheck : 0

            }
        },
        methods: {
            //提交
            bypay(){
                if(this.$route.params.status == 'zfb'){
                    //支付宝提交
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

                    this.axios.post(API_URL+'Home/Common/check',QS.stringify({
                          app_user_id:sessionStorage.getItem('user_ID'),
                          gcheck:this.gcheck
                      })).then((res) => {
                          if(res.data.status == 1){
                              this.axios.post(API_URL+'Home/Distribution/addWithdrawal',QS.stringify({
                                  uid:sessionStorage.getItem('user_ID'),
                                  ali_account:this.account,
                                  money:this.money,
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
                                    this.$router.push("/withdrawal");
                                }
                              }).catch((err) => {
                                  console.log(err);
                              })
                          }else{
                            Toast('申请已提交，请勿多次提交');
                          }
                      }).catch((err) => {
                          console.log(err);
                      })

                    


                }else{
                    //银行卡提交
                    if(this.cardholder_name ==''){
                        Toast({
                          message: '请输入持卡人姓名',
                          duration: 1000
                        });
                        return false;
                    }else if(this.card_number == ''){
                        Toast({
                          message: '请输入正确的卡号',
                          duration: 1000
                        });
                        return false;
                    }else if(this.card_name == ''){
                        Toast({
                          message: '请输入银行名',
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
                    this.axios.post(API_URL+'Home/Common/check',QS.stringify({
                          app_user_id:sessionStorage.getItem('user_ID'),
                          gcheck:this.gcheck
                      })).then((res) => {
                          if(res.data.status == 1){
                            this.axios.post(API_URL+'Home/Distribution/addWithdrawal',QS.stringify({
                                  uid:sessionStorage.getItem('user_ID'),
                                  bank_num:this.card_number,
                                  bank_name:this.card_name,
                                  bank_user:this.cardholder_name,
                                  money:this.money,
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
                                    this.$router.push("/withdrawal");
                                }
                              }).catch((err) => {
                                  console.log(err);
                              })
                          }else{
                            Toast('申请已提交，请勿多次提交');
                          }
                      }).catch((err) => {
                          console.log(err);
                      })
                    

                }
                
            },
            //全部转出
            total(){
                this.money = this.balance;
            },
            //yhk名字验证
            cardholder(){
                if(this.cardholder_name == ''){
                    Toast({
                      message: '请输入持卡人姓名',
                      duration: 1000
                    });
                    return;
                }
            },
            // yhk卡号验证
            card(){
                if(!/^[1-9](\d{15})|\d{18}$/.test(this.card_number)){
                        Toast({
                          message: '请输入正确的卡号',
                          duration: 1000
                        });
                        return;
                }
            },
            yhkName(){
                if(this.card_name == ''){
                    Toast({
                      message: '请输入银行名',
                      duration: 1000
                    });
                    return;
                }
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
                   console.log(22);
                    Toast({
                      message: '金额错误',
                      duration: 1000
                    });
                    return;
                }
                 if(money > balance){
                    this.show = true;
                    return;
                }else {
                    this.show = false;
                    return;
                }
            }
        },
        created(){
          this.axios.post(API_URL+'Home/Distribution/index',QS.stringify({
                  app_user_id:sessionStorage.getItem('user_ID')
              })).then((res) => {
                this.balance = res.data.data.balance;
              }).catch((err) => {
                  console.log(err);
              })
          this.axios.post(API_URL+'Home/Common/getCheck',QS.stringify({
              app_user_id:sessionStorage.getItem('user_ID')
          })).then((res) => {
            this.gcheck = res.data.data;
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
        background: #ed3851;
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