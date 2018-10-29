<template>
  <div>
      <div v-title :data-title="title">{{title}}</div>
      <top-header :text="title"></top-header>
      <ul class="ordinary">
          <li>
              <p>
              	<span>发票抬头：</span>
              	<input type="text"  v-model="data.name"/>
              </p>
              <span class="fonts r el-icon-delete" @click="editDelet"></span>
          </li>
      </ul>
			<div class="footer">
				<button class=" el-button--warning protect"  @click="protact">确认修改</button>
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
            title:'编辑普通发票',
            data:[]
        }
    },
    created(){
    	this.data=JSON.parse(sessionStorage.getItem("ordinary"))
    },
    methods: {
    	protact(){
    		this.axios.post(this.$httpConfig.invoicesAreRaisedSave,QS.stringify({
                    name:this.data.name,
                    id:this.data.id
                })).then((res) => {
                    if(res.data.status == 1){
                        this.$router.push('/documents');
                    }
                	Toast({
                		message:res.data.message
                	})
                }).catch((err) => {
                    console.log(err)
                });
    	},
    	editDelet(){
    		MessageBox.confirm('确定执行此操作?').then(action => {
                    this.axios.post(this.$httpConfig.invoicesAreRaisedDelete,QS.stringify({
                        id:this.data.id
                    })).then((res) => { 
                    	if(res.data.status==10001){
                			this.$router.push('/LogIn');
                		}else{
	                        Toast(res.data.message);
	                        if(res.data.status == 1){
	                           this.$router.push('/documents')
	                        }
	                     }
                    }).catch((err) => {
                        console.log(err);
                    });
                });
    	}
    },

    components:{
        topHeader,
    }
}
</script>
<style lang="less" scoped>
.r{
	float: right;
}
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
        .fonts{
        	float: right;
        	font-size: .5rem;
        	color: #C08600;
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
		background: rgb(203,149,48);
		color: #fff;
		border: 0;
	}
}

</style>
