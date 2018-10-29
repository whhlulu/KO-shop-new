<template>
  <div>
      <div v-title :data-title="title">{{title}}</div>
      <top-header :text="title"></top-header>
      <header>
            <div><img :src="titleImg" alt="">和平苑店</div>
            <h4>-102.00</h4>
            <h6>交易成功</h6>
      </header>
      <ul>
        <li>
            <span>商品说明</span>
            <p>七彩云南&nbsp;翡翠佛公&nbsp;吊坠玉挂件&nbsp;冰儒种&nbsp;SC0023243925</p>
        </li>
        <li>
            <span>付款方式</span>
            <p>余额支付</p>
        </li>
         <li>
            <span>收货地址</span>
            <p>湖南省赵阳市双清区石桥乡社会上电动工具厂，花之物语花店</p>
        </li>
         <li>
            <span>物流信息</span>
            <p>已发货</p>
        </li>
         <li>
            <span>积分奖励</span>
            <p>1积分</p>
        </li>
        <li>
            <span>创建时间</span>
            <p>2017-07-28&nbsp; 10:07</p>
        </li>
        <li>
            <span>积分奖励</span>
            <p>20178655925896586525</p>
        </li>
         <li>
            <span>积分奖励</span>
            <p>YERTESDFGSGR45454DFG</p>
        </li>
      </ul>
  </div>
</template>
<script>
import topHeader from '@/components/page/children/header.vue';
export default {
  data () {
      return {
          title:"账单详情",
          titleImg:require("@/assets/images/e_default.png"),
      }
  },
  components:{
      topHeader
  }
}
</script>
<style lang="less" scoped>
ul{
    background-color: #fff;
    padding:.1rem .3rem;
    li{
        
        display: flex;
        align-items: center;
        margin: .5rem 0;
        justify-content: space-between;
        span{
            color: #D4D4D4;
            font-size: .32rem;
            width: 3rem;
        }
        p{
            font-size: .32rem;
            text-align: right;
            line-height: .5rem;
        }
    }
}
header{
    height: 2.75rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border-bottom: .01rem solid #E8E8E8;
    div{
        display: flex;
        align-items: center;
        font-size: .32rem;
        img{
            width: .55rem;
            height: .55rem;
            margin-right: .2rem;
        }
    }
   
    h4{
        margin-top: .25rem;
        font-size: .50rem;
    }
     h6{
        margin-top: .25rem;
        font-size: .24rem;
        color: #9E9E9E;
    }
}
</style>
