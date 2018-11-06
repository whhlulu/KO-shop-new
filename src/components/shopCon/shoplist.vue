<template>
      <div ref="shop_class">
        <div v-title data-title="商品列表">商品列表</div>
        <list-header :text="text"></list-header>
         <ul>
             <li class="header">
                <a href="javascript:;">
                    <span>全部宝贝</span>
                    <img :src="imgs" alt="">
                </a>
             </li>
             <li v-for ="(item,index) in dataList" :key = 'index'> 
                <router-link :to="{name: 'comList', params:{status:item.class_three}}" href="javascript:;">
                    <span>{{item.three_name}}</span>
                    <img :src="imgs" alt="">
                </router-link>
             </li>
             <div class="comm-null" v-if="no_data">
				<div class="con-wrap text-center">
					<img src="../../assets/null_com.png">
					<p>暂无更多数据</p>
				</div>
			</div>
             <div class="up-warp" v-show="load_show">
                <p class="rotate"></p>
                <p class="load-title">加载中..</p>
            </div>
             <div class="no-data" v-show="sliding_no_data">暂无更多数据~</div>
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
          dataList:[],
          page:1,
          load_show:true, //滚动动画开关
          roll_switch:true, //触发下拉加载开关
          no_data:false, //无数据时的样式
          sliding_no_data:false, //下拉没数据时的样式
          slide_switch: false //避免多次下拉
      }
  },
  created () {
    this.shopList()  
  },
  mounted(){
      if(this.$refs.shop_class){
        let _this = this;
        window.addEventListener('scroll',function(){ 
            if(document.body.scrollTop + window.innerHeight >= document.body.offsetHeight) { 
              if(_this.roll_switch == false) return false; //禁止下拉
              if(_this.slide_switch == true){ //防止多次请求
                    _this.slide_switch = false;
                    _this.page++;
                    _this.shopList();
                }
            }
        })
      }
  },
  methods: {
        //请求成功后的操作
        returnOperation(data){
            let dataList = data.data.records;
            for (let index = 0; index < dataList.length; index++) {
                this.dataList.push({three_name:dataList[index].three_name,class_three:dataList[index].class_three});
            }
            this.$nextTick(()=>{ //数据渲染结束后获取高度
                let nh = this.$refs.shop_class.offsetHeight;
                let wh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                if(nh<wh && this.page == 1){ //第一次请求成功如果数据没超出屏幕就禁止下拉
                    this.load_show = false; //动画隐藏
					this.roll_switch = false; //禁止下拉加载
                }
                this.slide_switch = true;
            })    
        },
        //请求后返回不同状态时的处理
        stateHandling(status,data){
            if(status == 1){ //成功后的处理
                this.returnOperation(data);
            }else if(status == 0 && this.page == 1) { //第一次请求失败时
                this.no_data = true; //无数据时的样式
                this.load_show = false; //动画隐藏
                this.roll_switch = false; //禁止下拉加载
            }else{ //第二次或更多次无数据时
                this.sliding_no_data = true; //无数据时的样式
                this.load_show = false; //动画隐藏
                this.roll_switch = false; //禁止下拉加载
            }
        },
        shopList(){
            this.axios({
                method:'get',
                url:this.$httpConfig.ShopGoodClass,
                params:{
                    store_id:this.$route.params.id,
                    page:this.page
                }
            })
            .then((res) =>{
                this.stateHandling(res.data.status,res.data);
            }).catch((err)=>{
                console.log(err);
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
    .comm-null {
        padding-top: .5rem;
        p {
            font-size: .28rem;
            color: #666;
            padding-top: .2rem;
        }
    }
    .up-warp{
        height:.5rem;
		padding: .3rem 0;
		text-align: center;
		p{
			display: inline-block;
			vertical-align: middle;
		}
		.rotate{
			width: 16px;
			height: 16px;
			border-radius: 50%;
			border: 1px solid gray;
			margin-right: 6px;
			border-bottom-color: transparent;
		}
		.rotate{
			-webkit-animation:rotate .6s linear infinite;
			animation:rotate .6s linear infinite
		}
		@-webkit-keyframes rotate{
			0%{
				-webkit-transform:rotate(0deg)
				}
			100%{
				-webkit-transform:rotate(360deg)
				}
			}
		@keyframes rotate{
			0%{
				transform:rotate(0deg)
			}
			100%{
				transform:rotate(360deg)
			}
		}
		.load-title{
			font-size: 12px;
    		color: gray;
		}
    }
    .no-data{
        background-color:#fff;
        height: .5rem;
        padding: .3rem 0;
        text-align: center;
        font-size: 12px;
        color: gray;
    }
}


</style>