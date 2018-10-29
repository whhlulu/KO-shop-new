<template>
	<div>
		<div id="header">
			<p class="l left" ><img @click="back" src="../../../assets/btn-return.png"/></p>
			<h1 class="title l">商品详情</h1>
			<span class="l gouwu" ><img @click="car" src="../../../assets/gouwu.png"/></span>
			<span class="l quan"><img src="../../../assets/quan.png"/></span>
		</div>
	</div>
</template>

<script>
export default {
	
  data () {
      return {
         
      }
  },
  methods:{
  	back(){
  		this.$router.push("/auction")
  	},
  	car(){
  		this.$router.push('/Cart')
  	}
  },
  components:{
      
  }
}
</script>

<style lang="less" scoped>
.l{
	float: left;
}
.r{
	float: right;
}
  #header{
  	width: 100%;
  	height: 1rem;
  	background: #c79a01;
  	.left{
  		width: 20%;
  		height: 1rem;
  		line-height: 1rem;
  		img{
  			width: 0.6rem;
  			margin-top: 0.2rem;
  			margin-left: 0.3rem;
  		}
  	}
  	.title{
  		width: 45%;
  		height: 1rem;
  		text-align: center;
  		font-size: 0.4rem;
  		line-height: 1rem;
  		color: #fffeff;
  	}
  	.gouwu{
  		display: inline-block;
  		width: 0.6rem;
  		height: 1rem;
  		img{
  			width: 0.8rem;
  			margin-top: 0.15rem;
  		}
  	}
  	.quan{
  		width: 0.6rem;
  		display: inline-block;
  		margin-top: 0.4rem;
  		margin-left: 0.7rem;
  		img{
  			width: 0.8rem;
  		}
  	}
  }
</style>