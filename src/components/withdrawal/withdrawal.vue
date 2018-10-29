<template>
  <div class="wallet-wrap">
    <div v-title :data-title="title">{{title}}</div>
    <wal-header :text="title"></wal-header>
    <div class="balance-wrap">
      <ul class="hd clearfix">
        <li>
          <p class="my_wallet">总返利</p>
          <p class="number text-single-hidden">{{data.money||'0.00'}}</p>
        </li>
        <li>
          <p  class="my_wallet">可提现</p>
          <p class="number text-single-hidden">{{data.balance||'0.00'}}</p>
        </li>
        <li>
          <p class="my_wallet">正在提现</p>
          <p class="number text-single-hidden">{{data.now||'0.00'}}</p>
        </li>
        <li>
          <p class="my_wallet">已提现</p>
          <p class="number text-single-hidden">{{data.have||'0.00'}}</p>
        </li>
        <!-- <li v-if = "member">
          <p class="my_wallet">本级团队返利</p>
          <p class="number text-single-hidden">{{data.memberRebate||'0.00'}}</p>
        </li>
        <li v-if = "member">
          <p  class="my_wallet">自购返利</p>
          <p class="number text-single-hidden">{{data.selfRebate||'0.00'}}</p>
        </li>
        <li v-if = "member">
          <p class="my_wallet">下级团队返利</p>
          <p class="number text-single-hidden">{{data.dealerRebate||'0.00'}}</p>
        </li> -->
        <li>
          <p class="my_wallet">上月返利</p>
          <p class="number text-single-hidden">{{data.lastmonth||'0.00'}}</p>
        </li>
        <li>
          <p  class="my_wallet">当月返利</p>
          <p class="number text-single-hidden">{{data.month||'0.00'}}</p>
        </li>
        <!-- <li>
          <p class="my_wallet">提现激励百分比</p>
          <p class="number text-single-hidden">{{data.bestir_pre||'0.00'}}</p>
        </li> -->
      </ul>
      <ul class="btn-wrap clearfix text-center">
        <li class="fl" @click="toRecharge('/withdrawalList')">我的提现记录</li>
        <li class="fr" @click="toRecharge('/withdrawalapply')">我要提现</li>
      </ul>
      <!-- <p class="abnormal-list">返利异常列表</p> -->
      <!-- <div class="team">
           <table width="100%" border="0" cellspacing="0" cellpadding="0" class="list">
            <tr>
                 <td align="center" bgcolor="#f2f2f2">异动时间</td>
                 <td align="center" bgcolor="#f2f2f2">手机号</td>
                 <td align="center" bgcolor="#f2f2f2">减少金额</td>
                 <td align="center" bgcolor="#f2f2f2">原因</td>
            </tr>
            <tr class="team_list" v-for="(item,index) in info_list" :key="item.drawal_id">
                 <td align="center">{{item.time}}</td>
                 <td align="center">{{item.mobile}}</td>
                 <td align="center">{{item.rebate_money}}</td>
                 <td align="center">{{item.res}}</td>
            </tr>
           </table>
       </div> -->
      <!-- <ul class="btn-wrap clearfix text-center">
       
      </ul> -->
    </div>
  </div>
</template>
<script>
  import walHeader from '@/components/page/children/header.vue';
  import QS from 'qs';
  export default {
    name : 'myWallet',
    data(){
      return {
        title:'我的分销',
        data:'',
        member:0,
        info_list:[]
      }
    },
    methods:{
      toRecharge(link){
        this.$router.push({
          path:link
        });
      }
    },
    created(){
      this.axios.post(API_URL+'Home/Distribution/index',QS.stringify({
              app_user_id:sessionStorage.getItem('user_ID')
          })).then((res) => {
            this.data = res.data.data;
            this.member = res.data.data.member;
            console.log(this.member)
          }).catch((err) => {
              console.log(err);
          })
          // this.axios.post(API_URL+'Home/Pcenter/rebateAbnormal',QS.stringify({app_user_id:sessionStorage.getItem('user_ID')})).then((res) => {
          //       this.info_list = res.data.data;
          //   }).catch((err) => {
          //       console.log(err);
          //   })
    },
    components:{
      walHeader
    }
  }
</script>
<style lang="less" scoped>
  .wallet-wrap{
    background:#f1f1f1;
    .balance-wrap{
      background:#fff;
      .hd{
        padding:.4rem .2rem .8rem;
        li {
          padding-top:.2rem;
          text-align:center;
          width:33.33333%;
          float:left;
          line-height:1.12rem;
          .my_wallet {
            font-size:.3rem;
            color:#999;
          }
          .number{
            padding-top:.5rem;
            font-size:.4rem;
            color:#000;
            line-height: 100%;
            font-family: 'Arial';
          }
        }
      }
      .btn-wrap{
        height: 1.1rem;
        li{
          width: 49%;
          height: 100%;
          line-height:1.1rem;
          font-size:.32rem;
          background:#ed3851;
          color:#fff;
        }
        li:active{
          box-shadow: 5px 0 5px #ccc;
        }
      }
      .abnormal-list{
        height: .6rem;
        line-height: .6rem;
        text-align: center;
        padding: .3rem 0;
        font-size: .3rem;
        color: #333;
      }
      .team {
          margin:0 .1rem;
          .list {
              border:none;
              tr {
                  td {
                      border:none;
                      padding: 15px 0;
                      color:#747474;
                      font-size:.3rem;
                  }
              }
              .team_list {
                  td{
                      font-size:.26rem;
                  }
              }
          }
      }
    }
  }
</style>