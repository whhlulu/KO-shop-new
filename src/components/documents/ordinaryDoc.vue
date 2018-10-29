<template>
  <div>
      <div v-title :data-title="title">{{title}}</div>
      <top-header :text="title"></top-header>
      <ul class="ordinary">
          <li>
              <p><span>发票抬头：</span><input type="text"  v-model="name"/></p>
          </li>
      </ul>
			<div class="footer">
				<button class=" el-button--warning protect"  @click="protact">保存</button>
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
            title:'新增普通发票',
            msg:[],
            name:''
        }
    },
    methods: {
    	protact(){
    		if(this.name==''){
    			Toast('抬头不能为空');
    			return;
    		}
    		this.axios.post(this.$httpConfig.invoicesAreRaisedAdd,QS.stringify({
                    name:this.name
                })).then((res) => {
                	Toast({
                		message:res.data.message
                	})
                  	this.$router.push('/documents')
                }).catch((err) => {
                    console.log(err)
                });
    	}
    	
    	
    },

    components:{
        topHeader,
    }
}
</script>
<style lang="less" scoped>
.ordinary{
	width: 100%;
	height: 90%;
	
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
        input{
        	width: 3.5rem;
        	border: 0;
        }
        img{
            width: .3rem;
            height: .45rem;
        }
    }
}
.footer{
	width: 100%;
	height: 1rem;
	background: #FFFFFF;
	position: absolute;
	bottom: 0;
	left: 0;
	.protect{
		width: 100%;
		height: 1rem;
		font-size: 0.25rem;
		text-align: center;
		line-height: 1rem;
		background: rgb(203,148,49);
		color: #ffffff;
		border: 0;
	}
}

</style>
