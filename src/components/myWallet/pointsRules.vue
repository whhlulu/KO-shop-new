<template>
  <div class="box">
      <div v-title :data-title="title">{{title}}</div>
      <integ-header :text="title"></integ-header>
      <div>
          <header>
              <h4>积分如何获得</h4>
              <div>
                  <img :src="cartimg" alt="">
                  <h5>购物</h5>
                  <p><span>积分</span> 是会员通过购物所获得的，积累的成长值总额绝对会员级别</p>
                  <h6>(1元 = 1积分)</h6>
              </div>
          </header>
          <nav>会员等级对照表</nav>
          <ul class="content">
              <li v-for="(item,index) in list" :key="index">
                  <img :src="item.img" alt="">
                  <h4>{{item.level_name}}</h4>
                  <h6>{{item.integral_small}}~{{item.integral_big}}积分</h6>
              </li>
          </ul>
      </div>
  </div>
</template>
<script>
import integHeader from '@/components/page/children/header.vue';
import qs from 'qs';
export default {
  data () {
      return {
          title:'积分规则',
          cartimg:require("@/assets/images/cartShop.png"),
          list:[]
      }
  },
  components:{
      integHeader
  },
  created () {
    this.axios.post(this.$httpConfig.rule).then(res => {
        if(res.data.status == 0) {
            return;
        }
    	if(res.data.status==10001){
		    this.$router.push('/LogIn');
	    }else {
            this.list=res.data.data.rule;
		}
    })
  }
}
</script>
<style lang="less" scoped>
.box{
    
    
    header{
        padding:0 .3rem;
        background-color: #fff;
        height: 2.95rem;
        overflow: hidden;
         h4{
            width: 100%;
            height: .95rem;
            font-size: .32rem;
            text-align: center;
            line-height: .95rem;
        }
         img{
            width: 1.05rem;
            height: 1.05rem;
            float: left;
            margin-right: .3rem;
            margin-bottom: .85rem;
        }
        div{
            float: left;
            h5{
                font-weight: 600;
                font-size: .30rem;
            }
            p{
                color: #727272;
                line-height: .4rem;
                font-size: .28rem;
                span{
                    font-size: .28rem;
                    color: #000;
                }
            }
       
            h6{
                color: #F9781C;
                font-size: .28rem;
            }
        }
    }
    nav{
        width: 100%;
        font-size: .32rem;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 1rem;
        border-bottom:.01rem solid #C6C6C6;
        
    }
    .content{
        padding: 0 .3rem;
        li{
            margin-top: .45rem;
            height: .45rem;
            align-items: center;
            display: flex;
            padding:0 .2rem;
            img{
                width: .35rem;
                height: .4rem;
                margin-right: .2rem;
            }
            h4{
                margin-right: .8rem;
                font-size: .32rem;
            }
            h6{
                font-size: .32rem;
            }
        }
    }
}
</style>
