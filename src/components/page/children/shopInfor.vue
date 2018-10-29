<template>
  <div class="box" @click="toShop">
    <div class="header" >
        <img v-show="shopData.store_logo" :src="URL+shopData.store_logo" alt="">
        <div>
            <h4>{{shopData.shop_name}}</h4>
            <h6 class="description">{{shopData.description}}</h6>
        </div>
    </div>
    <ul class="cotent">
        <li>
            <h4>{{shopData.goodsNumber}}</h4>
            <p>全部宝贝</p>
        </li>
         <li>
            <h4>{{shopData.store_collect}}</h4>
            <p>关注人数</p>
        </li>
         <li>
            <p>描述相符: <span>4.80</span></p>
            <p>服务态度: <span>4.80</span></p>
            <p>发货速度: <span>4.80</span></p>
        </li>
    </ul>
    <div class="footer">
        <div @click="toShopList">查看分类</div>
        <div>进店逛逛</div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
      return {
      }
  },
  props:{
      shopData:'',
      data:''
  },
  methods: {
      toShopList(){
          event.stopPropagation();
          this.$router.push({path:'/shoplist/1'})
      },
      toShop(){
      	 this.$router.push({
      	 	name:"shopHome",
      	 	params:{
              id:this.data.store_id,
              index:0
          }})
      }
  }
}
</script>
<style lang="less" scoped>
    .box{
        .header{
            display: flex;
            border-top:1/100rem solid #F1F1F1;
            padding:25/100rem 0 20/100rem 0;
            img{
                margin: 0 25/100rem 0 20/100rem;
                width: 95/100rem;
                height: 95/100rem;
                border:1/100rem solid #F1F1F1;
            }
            h4{
                font-size: 36/100rem;
                margin-bottom: 10/100rem;
            }
            h6.description{
                color:#989898;
                display: -webkit-box;
								overflow: hidden;
								white-space: normal!important;
								text-overflow: ellipsis;
								word-wrap: break-word;
								-webkit-line-clamp: 2;
								-webkit-box-orient: vertical;
            }
        }
        .cotent{
            display: flex;
           li{
                width: 254/100rem;
                height: 115/100rem;
                border-right: 1/100rem solid #F1F1F1;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
           }
           h4{
               font-size: 32/100rem;
               margin-bottom:7/100rem;
           }
           p{
           		margin: 3px 0;
               font-size: 18/100rem;
               color:#989898;
               line-height: 30/100rem;
           }
            span{
                color:#D8AC3F;
            }
        }
        .footer{
                padding: 50/100rem 0;
                display: flex;
                justify-content: center;
                align-items: center;
            div{
                margin: 0 30/100rem;
                width: 150/100rem;
                height: 50/100rem;
                border:1/100rem solid #D8AC3F;
                color: #D8AC3F;
                border-radius: 50/100rem;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
</style>
