<template>
  <div>
    <dl class="accDetails">
      <dt>{{accDetails.title}}</dt>
      <dd class="clearfix" v-for="item in accDetails.content" :key="item.id">
        <div class="fl text">
          <h2 v-if="item.title">{{item.title}}</h2>
          <h2 v-else>{{item.remarks}}</h2>
          <p class="time">{{item.trading_time}}</p>
        </div>
        <div class="fr status" :class="{Profit:item.type == '1'}">{{item.changes_integral}}</div>
      </dd>
    </dl>
  </div>
</template>
<script>
    export default {
        name : 'obviousList',
        props:{
            accDetails:null
        },
        mounted(){
          
        }
    }
</script>
<style lang="less" scoped>
    .accDetails{
      dt{
        padding:0 .2rem;
        height:.9rem;
        line-height:.9rem;
        font-size:.32rem;
        color:#333;
      }
      dd{
        background:#fff;
        padding:.2rem;
        border-bottom:1px solid #dfdfdf;
        height: .8rem;
        .text{
          h2{
            font-size: .28rem;
            color:#333;
          }
          .time{
            padding-top:.2rem;
            font-size:.28rem;
            color:#999;
          }
        }
          .status{
            font-size:.32rem;
            color:#d0111b;
            line-height:.8rem;
          }
          .status.Profit{
            color:#39ab04;
          }
      }
    }
</style>