<template>
  <div>
       <div v-title data-title="抢购">抢购</div>
        <home-header :userName="title"></home-header>
        <!-- <mt-swipe :auto="4000">
            <mt-swipe-item v-for="item in imgs" :key="item.id">
                <img v-lazy="item">
            </mt-swipe-item>
        </mt-swipe> -->
        <ul class="content">
            <li>
                <img :src="shopImg" alt="">
                <div class="listChild">
                    <p class="title">金一翡翠和田玉玉手镯手串女款油润菠菜绿受贿所得发</p>
                    <div>
                        <div>
                            <h4>抢购中</h4>
                            <h5>￥99</h5>
                            <h6>￥199</h6>
                        </div>
                        <div>
                            <button @click="chase">马上抢购</button>
                            <p><span>21</span> 人已购买</p>
                        </div>
                    </div>
                </div>
            </li>
            <li>
                <img :src="shopImg" alt="">
                <div class="listChild">
                    <p class="title">金一翡翠和田玉玉手镯手串女款油润菠菜绿受贿所得发</p>
                    <div>
                        <div>
                            <h4 class="redTxt">10:10即将开始</h4>
                            <h5>￥99</h5>
                            <h6>￥199</h6>
                        </div>
                        <div>
                            <button class="greenBg"  v-text="notice" @click="notices">提醒我</button>
                            <p><span>21</span> 人已购买</p>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
  </div>
</template>
<script>
import HomeHeader from '@/components/home/children/header.vue'; //头部内容
import qs from 'qs';
export default {
  data () {
      return {
      	notice:"提醒我",
          title:'',
          shopImg:require("@/assets/con23.jpg")
      }
  },
  created(){
      this.getData();
  },
  methods:{
      getData(){
          this.axios.post(this.$httpConfig.getPanicGoods).then((res) => {
                }).catch((err) => {
                    console.log(err);
                });
      },
  	chase(){
  		this.$router.push("/auctionlist")
  	},
  	notices(){
  		this.notice="已提醒"
  	}
  },
  components:{
      HomeHeader
  }
}
</script>
<style lang="less" scoped>
.mint-swipe{
    width:100%;
    height:4.28rem;
    img{
        width:100%;
        height:100%;
    }
    .mint-swipe-indicators{
        .mint-swipe-indicator{
            width:20px;
            height:20px;
        }
    }
}
.content{
    width: 100%;
    li{
        padding:.1rem .3rem;
        height: 2.55rem;
        background-color: #fff;
        display: flex; 
        border-bottom: .01rem solid #B2B2B2;
        align-items: center;
        img{
            width: 2.2rem;
            height: 2.2rem;
        }
       
        .listChild{
            padding-left: .3rem;
            .title{
                font-size: .28rem;
                // height: 1rem;
            }
            div{
                display: flex;
                justify-content: space-between;
                div{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    h4{
                        width: 100%;
                        font-size: .28rem;
                        color: #BF9B00;
                    }
                    h5{
                        width: 100%;
                        font-size: .32rem;
                        color: #F9282B;
                    }
                    h6{
                        width: 100%;
                        font-size: .24rem;
                        color: #969696;
                        text-decoration:line-through;
                    }
                    button{
                        width: 1.7rem;
                        height: .65rem;
                        border: 0;
                        margin-bottom: .1rem;
                        background-color: #C79A01;
                        color: #fff;
                        border-radius: .04rem;
                    }
                    p{
                        width: 100%;
                        text-align: right;
                        font-size: .24rem;
                    }
                    span{
                        color: #EE2329;
                    }
                    .redTxt{
                        color: #F1302B;
                    }
                    .greenBg{
                    	font-size: 0.3rem;
                        background-color: #72BE52;
                    }
                }
            }
        }
    }
}
</style>
