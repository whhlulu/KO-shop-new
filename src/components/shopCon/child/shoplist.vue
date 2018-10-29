<template>
   <ul class="list-shop" id="list-shop">
            <li v-for="item in shoplist" :key="item.id">
                <div class="header">
                    <div class="title">
                        <img :src="URL+item.store_logo" alt="">
                        <div>
                            <h4>{{item.shop_name}}</h4>
                            <p>销量{{item.store_sales}} &nbsp;&nbsp;共{{item.good_number}}件</p>
                        </div>
                    </div>
                    <router-link :to="{name:shopHome,params:{id:item.id,index:0}}" class="initShop" > 进店</router-link>
                </div>
                <div class="con">
                    <div  v-for=" val in item.store_goods" :key="val.id">
                        <img v-if="val.pic_url" v-lazy="URL+val.pic_url" >
                        <img v-else :src="imgs" alt="">
                        <div>￥{{val.goods_price}}</div>
                    </div>
                </div>
            </li>
        </ul>
</template>
<script>
export default {
	  data () {
	      return {
	          imgs:require('@/assets/cp.png'),
	          shopHome:'shopHome'
	      }
	  },
	 
		props: ["shoplist"],
	}
</script>
<style lang="less" scoped>
/*// 店铺分类*/
.list-shop{
    li{
        background-color: #fff;
        margin-top:20/100rem;
        padding:0 25/100rem 35/100rem;
        .header{
            display: flex;
            justify-content: space-between;
            align-items: center;
            img{
                width: 80/100rem;
                height: 70/100rem;
                margin-right:30/100rem;
            }
            .title{
                height: 130/100rem;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                h4{
                    font-size: 30/100rem;
                }
                h6{
                    font-size: 26/100rem;
                }
            }
            .initShop{
                width: 100/100rem;
                height: 48/100rem;
                border-radius: 48/100rem;
                border:2/100rem solid #D19E29;
                color: #D19E29;
                 display: flex;
                justify-content: center;
                align-items: center;
            }
        }
        .con{
            display: flex;
                justify-content: flex-start;
                align-items: center;
            div{
                margin:0 .05rem;
                margin-top:10/100rem;
                position: relative;
                width: 225/100rem;
                 img{
                     width: 100%;
                    
                }
                div{
                    display: flex;
                    justify-content:flex-end;
                    align-items: center;
                    margin:0;
                    position: absolute;
                    width: 100%;
                    height: .4rem;
                    bottom: 0;
                    padding:0 .15rem;
                    box-sizing: border-box;
                    background-color: rgba(0, 0, 0, .7);
                    font-size: 24/100rem;
                    color: #fff;
                }
            }
           
        }
    }
}
</style>

