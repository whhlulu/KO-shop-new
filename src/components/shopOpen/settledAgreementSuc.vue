<template>
  <div class="box">
       <div v-title data-title="开店申请提交成功">开店申请提交成功</div>
      <top-header :text = "title"></top-header>
      <img class="agreementSuc" :src="img" alt="">
      <h4>您的开店申请已成功提交</h4>
      <p>
      	
      	
        我们将在3个工作日内（不包括国家法定假期）,完成审核并短信或邮件的方式通知您 <br/> 
        您也可以登录<span class="shopIn">商家入驻中心</span> 及时查看审核状态；<br/>
        店铺使用费及保证金需线下缴费，     请您联系400-168-1698进行确认打垮事宜。 <br/>
        如有疑问请联系网站客服。
      </p>
      <button class="btnOk btn1" @click="reback">撤销申请</button>
      <button class="btnNo btn2" @click="toProgress">查看进度</button>
  </div>
</template>
<script>
import topHeader from '@/components/page/children/header.vue';
export default {
  data () {
      return {
          title:'开店申请提交成功',
          img:require('@/assets/images/agreementSuc.jpg')
      }
  },
  methods:{
    toProgress(){
        this.$router.push("/description")
    },
  	reback(){
  		this.$router.push("/shopOpen")
  	}
  },
    components:{
      topHeader
  }
}
</script>
<style lang="less" scoped>
.box{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .agreementSuc{
    width:142/100rem;
    height:142/100rem;
    margin-top: 50/100rem;
  }
  h4{
      color:#333333;
      font-size: 36/100rem;
      margin: 25/100rem 0 40/100rem;
      font-weight: 600;
  }
  p{
      color:#989898;
      font-size:28/100rem;
      padding:0 30/100rem;
      line-height: 36/100rem;
  }
  .btn1{
      margin-top: 245/100rem;
  }
  .btn2{
      margin-top: 20/100rem;
  }
}
.shopIn{
    color:#0479C6;
    font-size: 28/100rem;
    padding:10/100rem;
}
</style>
