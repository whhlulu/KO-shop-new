<template>
	<div>
		<div class="cashier">
			<div class="teacher-main">
				<header class="header">
					<span @click="goBack" class="btnGo"></span>
					<h1 >支付结果</h1>
				</header>
			</div>
			<div class="pay">			
				<img class="pay-result-image" src="../../assets/pay_success.svg"/>
				<!--<p class="pay-result">支付成功</p>-->
				<el-button type="success" @click.native="goBack" class="pay-btn">查看</el-button>
			</div>
		</div>
	</div>
</template>
<script>
	import { Toast } from 'mint-ui';
	import cashierHeader from '@/components/home/children/header.vue';
	import qs from 'qs';
	export default {
		name: 'recharge_success',
		data() {
			return {
			}
		},
		created() {},
		methods: {
			goBack(){
				this.$router.push({
					name:'description'
				})
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