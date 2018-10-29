<template>
	<div v-loading = "loading">
		<div class="cashier">
			<div class="teacher-main">
				<header class="header">
					<span @click="goBack" class="btnGo"></span>
					<h1 v-if="status == 1">支付成功</h1>
					<h1 v-else-if="status == 0">支付失败</h1>
					<h1 v-else>支付结果</h1>
				</header>
			</div>
			<div v-if="status == 1" class="pay">			
				<img class="pay-result-image" src="../../assets/pay_success.svg"/>
				<!--<p class="pay-result">支付成功</p>-->
				<el-button type="success" @click.native="goBack" class="pay-btn">查看订单</el-button>
			</div>
			<div v-else-if="status == 0" class="pay">			
				<img class="pay-result-image" src="../../assets/pay_error.svg"/>
				<p class="pay-result">支付失败</p>
				<el-button type="warning" @click.native="goBack" class="pay-btn">完成</el-button>
			</div>
			<div v-else class="pay">
				<p class="pay-result">结果查询中...{{this.$route.query.trade_no}}</p>
			</div>
		</div>
	</div>
</template>
<script>
	import { Toast } from 'mint-ui';
	import cashierHeader from '@/components/home/children/header.vue';
	import qs from 'qs';
	export default {
		name: 'cashier',
		data() {
			return {
				loading:false,
				status:'1'
			}
		},
		created() {},
		methods: {
			goBack(){
				var type = sessionStorage.getItem('pay_sourse');
				if(type == 'goods'){
					this.$router.push({
						name:'orderList',
						params:{id:0}
					})
				}else if(type == 'goodsPackage'){
					this.$router.push({
						name:'packageList',
						params:{id:0}
					})
				}else if(type=='integral'){
					this.$router.push({
						name:'intOrder'
					})
				}else{
					this.$router.push({
						name:'person'
					})
				}
			}
		},

		mounted() {
		},

		destroyed() {},
		components: {
			cashierHeader
		}
	}
</script>
<style lang="less" scoped>
	.cashier {
		background: #fff;
		.teacher-main{
			height: 10%;
			.header{
				    width: 100%;
				    height: .62rem;
				    background: #D19E29;
				    padding: .16rem 0;
				    text-align: center;
				    position: relative;
				    color: #fff;
				    font-size: .36rem;
				    font-weight: bold;
				    line-height: .62rem;
				    position: fixed;
				    top: 0;
				    left: 0;
				    z-index: 1;
				.btnGo{
					    position: absolute;
					    left: .2rem;
					    top: 50%;
					    margin-top: -0.23rem;
					    width: .46rem;
					    height: .46rem;
					    background: url('../../assets/btn-return.png') no-repeat;
					    background-size: 100% 100%;
				}
			}
		}
		.pay{
			width: 50%;
			margin: 0 auto;
			height: 90%;
			min-height: 300px;
			display:flex;
			flex-direction:column;
			align-content:center;
			text-align:center;
			align-items:stretch
			.pay-result-image{
				width: 100px;
				height: 100px;
			}
			.pay-result{
				font-size: 17px;
				color: #3C3C3C;
				font-weight: bold;
			}
			.pay-btn{
				margin-top: 50px;
			}
		}
	}	
	.cashier.active {
		background: none;
	}
</style>