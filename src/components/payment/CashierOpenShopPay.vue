<template>
	<div class="cashier">
		<div v-title :data-title="title">{{title}}</div>
		<cashier-header :text="title" :btn="btn"></cashier-header>
		<div class="payment-wrap" v-if="$route.params.id != 3">
			<div class="status">
				<div class="pull-left fl">订单金额</div>
				<div class="pull-right fr">
					<span>{{$route.params.number}}</span>元</div>
			</div>
		</div>
		<div class="choice" v-if="$route.params.id != 3">
			<span class="span-main">当前余额：<span> {{balance}} </span>元</span>
		</div>
	
		<div class="default-pay">
			<el-button class="pay-btn" v-for="item in paymentType" v-if="item.is_default == 1" :key="item.id" type="success" @click="paymentMethod(item.id)">
				{{item.type_name}}
			</el-button>
			<span v-else></span>
		</div>
		<dl class="other" v-if="$route.params.id != 3">
			<dt>其他支付方式</dt>
			<dd v-if="item.is_default!= 1" v-for="item in paymentType" :key="item.id" class="clearfix" @click="payment(item.id)">
				<img :src="URL+item.logo" class="fl">
				<div class="fl pull-right">
					<h6 class="title">{{item.type_name}}</h6>
					<!--<p class="con">支付宝安全支付</p>-->
				</div>
				<span class="icon"></span>
			</dd>
		</dl>
		<div class="load" v-show="load" @touchmove.prevent>
			<mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner>
		</div>
	</div>
</template>
<script>
	import { Toast } from 'mint-ui';
	import btn from '@/components/Widget/maxBtn.vue';
	import cashierHeader from '@/components/home/children/header.vue';
	import Shopsn from '@/components/page/Shopsn.vue';
	import qs from 'qs';
	export default {
		name: 'cashier',
		data() {
			return {
				title: this.$constant.mainTitle+'收银台--入驻',
				img1: require('@/assets/yuan.png'),
				img2: require('@/assets/duihao.png'),
				text: '立即支付',
				btn: '订单中心',
				scrollWatch: true,
				disabled: false,
				load: false,
				my_wallet: '',
				data: '',
				orderId: '',
				flag: false,
				Integral: '',
				paymentType: '',
				balance: '',
				integralMoney:'',
				payType:{
					1:'wechatPay',
					2:'aliPay',
					3:'ylPay',
					4:'banlancePay'
				},
				payData:'', //支付时返回的数据
				ley_user:'',//支付时要传的值
			}
		},
		created() {
			this.getPaymentType();
			this.integralMoney=JSON.parse(sessionStorage.getItem('scoreIn'));
			this.orderId=sessionStorage.getItem('integral_orderID');
		},
		methods: {
			theChecked() {
				this.flag = !this.flag
			},
			getPaymentType() {
				this.axios.post(this.$httpConfig.paymentType).then((res) => {
					if(res.data.status == 10001) {
						this.$router.push('/LogIn');
					} else {
						this.paymentType = res.data.data
					}
				}).catch((err) => {
					console.log(err);
				});
			},wechatPay(){
				console.log('微信支付');
				window.location.href = this.payData;
			},
			aliPay(){
				console.log('支付宝支付');
				const oDiv = document.createElement('div');
				oDiv.innerHTML = this.payData;
				document.body.appendChild(oDiv);
				document.forms.Alipaysubmit.submit();
			},
			ylPay(){
				//银联
			},
			banlancePay(){
				//余额支付
				var url_ = this.payData;
				console.log(url_);
				var that = this;
				that.axios.post(url_,qs.stringify({
					ley_user:that.ley_user
				})).then((res)=>{
					if(res.data == 'SUCCESS'){
						Toast('支付成功!');
						that.$router.push({
							name: 'description'
						})
					}else{
						Toast('支付失败，请选择其他支付方式!');
						return;
					}
				})
			},
			payment(id) {
				this.paymentMethod(id);
			},
			paymentMethod(id) {
				var that = this;
				this.axios.post(this.$httpConfig.openShop, qs.stringify({
					pay_type_id: id,
					platform: 1
				})).then(function(res) {
					that.payData = res.data.data;
					if(res.data.status == 30000 || res.data.status == 0) {
						that.$message.info(res.data.message);
						that.$router.push({
							name: 'description'
						})
					} else {
						console.log(res.data)
						that.ley_user = res.data.ley_user;
						eval('that.'+ that.payType[id]+'()');
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			getBanlance() {
				//获取余额
				//var that = this;
				this.axios.post(this.$httpConfig.getBalance).then((res) => {
					if(res.data.status == 1) {
						this.balance = res.data.data;
					}
				}).catch((err) => {
					console.log(err);
				});
			}
		},

		mounted() {
			this.getBanlance();
		},
		destroyed() {
			this.scrollWatch = false;
		},
		components: {
			cashierHeader,
			btn,
			Shopsn
		}
	}
</script>
<style lang="less" scoped>
	.cashier {
		background: #fff;
	}
	
	.cashier.active {
		background: none;
	}
	
	.payment-wrap {
		.status {
			padding: 0 .2rem;
			height: 1rem;
			width: 7.1rem;
			line-height: 1rem;
			border-bottom: 1px solid #dfdfdd;
			.pull-left {
				font-size: .3rem;
				color: #999;
			}
			.pull-right {
				font-size: .32rem;
				color: #f23030;
				span {
					font-size: .36rem;
					margin-right: .2rem;
				}
			}
		}
	}
	
	.choice {
		padding: .25rem .2rem;
		width: 7.1rem;
		min-height: .5rem;
		line-height: 1rem;
		border-bottom: 1px solid #dfdfdd;
		line-height: .5rem;
		.img {
			width: 0.56rem;
			height: 0.56rem;
			float: left;
			img {
				width: 100%;
				height: 100%;
			}
		}
		.radio-core {
			box-sizing: border-box;
			display: inline-block;
			background-color: #fff;
			border-radius: 100%;
			border: 1px solid #ccc;
			position: relative;
			width: .5rem;
			//  min-height: .5rem;
			vertical-align: middle;
		}
		.radio-input {
			display: none;
		}
		.radio-input:checked+.radio-core:after {
			background-color: #fff;
			-webkit-transform: scale(1);
			transform: scale(1);
		}
		.radio-input:checked+.radio-core {
			background-color: #26a2ff;
			border-color: #26a2ff;
		}
		.radio-core:after {
			box-sizing: border-box;
			content: " ";
			border-radius: 100%;
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			right: 0;
			margin: auto;
			width: 0.5rem;
			height: 0.5rem;
			-webkit-transition: -webkit-transform .2s;
			transition: -webkit-transform .2s;
			transition: transform .2s;
			transition: transform .2s, -webkit-transform .2s;
			-webkit-transform: scale(0);
			transform: scale(0);
		}
		.radio-label {
			display: inline-block;
			vertical-align: middle;
			margin-left: .23rem;
			// height: .5rem;
			width: 6.1rem;
			// overflow: hidden;
			font-size: .32rem;
			color: #333;
		}
		.span-main {
			width: 100%;
			font-size: .28rem;
			color: #999;
			span {
				width: 7.1rem;
				font-size: .28rem;
				color: #f23030;
			}
		}
	}
	
	.default-pay {
		padding: 10px;
		text-align: center;
		.pay-btn {
			width: 100%;
		}
	}
	
	.other {
		padding: 0 .2rem;
		background: #fff;
		dt {
			font-size: .3rem;
			color: #333;
			height: .7rem;
			line-height: .7rem;
			border-bottom: 1px solid #dfdfdf;
		}
		dd {
			padding: .3rem 0;
			height: .83rem;
			border-bottom: 1px solid #dfdfdf;
			position: relative;
			img {
				width: .83rem;
				height: .83rem;
			}
			.icon {
				position: absolute;
				top: 50%;
				right: .2rem;
				width: .2rem;
				height: .35rem;
				background: url(../../assets/btn-right.png) no-repeat;
				background-size: 100% 100%;
				margin-top: -.175rem;
			}
			.pull-right {
				padding-left: .3rem;
				.title {
					line-height: .83rem;
					font-size: .32rem;
					color: #333;
				}
				.con {
					padding-top: .15rem;
					font-size: .26rem;
					color: #999;
				}
			}
		}
	}
</style>