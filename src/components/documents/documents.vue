<template>
  <div>
      <div v-title :data-title="title">{{title}}</div>
      	<top-header :text="title"></top-header>
	      <tab-header :sortData ="sortData" v-on:sortCon ="tabindex" :tabdata ="tabdata"></tab-header>
	      <ul v-if="titleIndex ==0 && datas.length!= 0 " class="ordinary" >
	          <li v-for="(ordins,index) in datas" @click="editOr(ordins)" :key="index">
	              <p><span>发票抬头：</span>{{ordins.name}}</p>
	              <img :src="imgRight" alt="">
	          </li>
	          <!--<button @click="spot">传值</button>-->
	      </ul>
          <!-- <ul v-if="datas"  class="ordinary">
            暂无数据
          </ul> -->
	      <ul v-if="titleIndex ==1 && news.length!= 0 " class="increase" >
	          <li v-for="(items,index) in news" @click="editIn(index,items)" :key="index">
	              <div>
	                  <p><span>发票号码：</span>{{items.ein}}</p>
	                  <p><span>公司名称：</span>{{items.company_name}}</p>
	                  <p><span>开户银行：</span>{{items.opening_bank}}&nbsp;&nbsp;&nbsp;<span>注册地址：</span>{{items.prov_name + items.city_name}}</p>
	                  <p><span>开户银行账号：</span><span>{{items.bank_account}}</span></p>
	              </div>
	              <img :src="imgRight" alt="">
	          </li>
	      </ul>

          <!-- <ul v-if="news"   class="increase">
              暂无数据
          </ul> -->
	      <div class="btm">
	          <button @click="routerLink()"><img :src="add" alt="">{{btn[titleIndex]}}</button>
	      </div>
  </div>
</template>
<script>
import { MessageBox,Toast,Popup } from 'mint-ui';
import QS from "qs"
import topHeader from '@/components/page/children/header.vue';
import tabHeader from './child/tabHeader.vue';
export default {
    data () {
        return {
            title:'我的发票',
            sortData:["普通发票","增资发票"],
            tabdata:0,
            datas:[],
            titleIndex:0,
            imgRight:require("@/assets/images/right-icon.png"),
            btn:['新增发票抬头','新增专票资质'],
            add:require("@/assets/add.png"),
            news:[]
        }
    },
    created(){
		this.axios.post(this.$httpConfig.myInvoice,QS.stringify({
	        type:1
	    })).then((res) => {
	        this.datas=res.data.data
	    }).catch((err) => {
	        console.log(err)
	    });
    },
    methods: {
     tabindex(index){
      	if(this.titleIndex==1){
      		this.titleIndex==1
      	}else{
      		this.axios.post(this.$httpConfig.myInvoice,QS.stringify({
                    type:2
                })).then((res) => {
	                	this.news=res.data.data;
                }).catch((err) => {
                    console.log(err)
                });
      	}
        this.titleIndex = index;
      },
      routerLink(){
            let name = ""
            if(this.titleIndex ==0){
               this.$router.push("/ordinaryDoc")
            }else{
                this.$router.push("/increaseDoc")
            }
            this.$router.push({name:name})
        },
        editOr(item){
        			sessionStorage.setItem("ordinary", JSON.stringify(item))
        			this.$router.push("/editOrdinary")
        },
        editIn(index,items){
        	sessionStorage.setItem("increase", JSON.stringify(items))
        	 this.$router.push("/editIncrease")
        }
    },
    components:{
        topHeader,
        tabHeader,
        
    }
}
</script>
<style lang="less" scoped>
.ordinary{
    height: 10.4rem;
    text-align: center;
	overflow: auto;
    li{
        margin-top: .2rem;
        height: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        padding: 0 .25rem;
        p{
            font-size: .28rem;
        }
        span{
            color: #727272;
            font-size: .28rem;
        }
        img{
            width: .3rem;
            height: .45rem;
        }
    }
}
.increase{
    text-align: center;
	height: 10.4rem;
	overflow: auto;
    li{
        margin-top: .2rem;
        // height: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        padding:.25rem;
        p{
            font-size: .28rem;
            line-height: .5rem;
            // height: .50rem;
        }
        span{
            color: #727272;
            font-size: .28rem;
        }
        img{
            width: .3rem;
            height: .45rem;
            margin-left: .3rem
        }
    }
}
.btm{
    position: fixed;
    bottom: 0;
    width:7.5rem;
    background-color: #fff;
    button{
        width:7.5rem;
        height: .9rem;
        background-color: #D19E29;
        border: 0;
        color:#fff;
        font-size: .28rem;
        img{
            width: .35rem;
            height: .35rem;
            margin-right: .2rem;
        }
    }
}
</style>
