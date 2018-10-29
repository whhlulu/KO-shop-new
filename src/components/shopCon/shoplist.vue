<template>
      <div>
        <div v-title data-title="商品列表">商品列表</div>
        <list-header :text="text"></list-header>
         <ul>
             <li class="header">
                <a href="javascript:;">
                    <span>全部宝贝</span>
                    <img :src="imgs" alt="">
                </a>
             </li>
             <li v-for = "(item,index) in data" :key = 'index'> 
                <router-link :to="{name: 'comList', params:{status:item.id}}" href="javascript:;">
                    <span>{{item.class_name}}</span>
                    <img :src="imgs" alt="">
                </router-link>
             </li>
         </ul>
      </div>
</template>
<script>
import listHeader from '@/components/page/children/header.vue';
export default {
  data () {
      return {
          text:'店铺分类',
          imgs:require('@/assets/btn-right.png'),
          data:''
      }
  },
  created () {
    this.shopList()  
  },
  methods: {
      shopList(){
          this.axios({
              method:'get',
              url:this.$httpConfig.ShopGoodClass,
              params:{
                  store_id:this.$route.params.id
              }
          })
          .then(res =>{
              this.data = res.data.data;
          })
      }
  },
  components: {
      listHeader
  }
}
</script>

<style lang="less">
ul{
    overflow: hidden;
    .header{
        margin:20/100rem 0;
    }
    li{
       
        a{
            border:1/100rem solid #EEEEEE;
            padding: 0 25/100rem;
            height: 90/100rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #fff;
        }
        
        span{
            font-size: .28rem
        }
        img{
            width: 15/100rem;
            height: 25/100rem;
        }
    }
}


</style>