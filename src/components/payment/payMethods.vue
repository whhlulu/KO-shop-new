<template>
	<div>
		<dl class="other">
			<!-- <dt>其他支付方式</dt> -->
			<dd v-for="item in paymentType" :key="item.id" class="clearfix" @click="paymentMethod(item.id)">
				<img :src="URL+item.logo" class="fl">
				<div class="fl pull-right">
					<h6 class="title">{{item.type_name}}</h6>
					<!-- <p class="con">{{otherdata.content[index]}}</p> -->
				</div>
				<span class="icon"></span>
			</dd>
		</dl>
	</div>
</template>
<script>
import qs from 'qs';
import { Toast } from 'mint-ui';
	export default {
		name: 'payMethods',
		data (){
			return {
				paymentType:'',
				payType:{
					1:'wechatPay',
					2:'aliPay',
					3:'ylPay',
					4:'banlancePay'
				},
				payData:'' //支付时返回的数据
			}
		},
		created(){
			this.getPaymentType();
		},
		methods: {
			//获取充值类型
			getPaymentType() {
				this.axios.post(this.$httpConfig.rechargeType).then((res) => {
					if(res.data.status == 10001) {
						this.$router.push('/LogIn');
					} else {
						this.paymentType = res.data.data
					}
				}).catch((err) => {
					console.log(err);
				});
			},
			wechatPay(){
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
			//充值
			paymentMethod(id) {
				let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
				if(!reg.test(this.$store.state.amount)){
                        Toast({
                          message: '金额错误',
                          duration: 1000
                        });
                        return false;
                    }
				var that = this;
				this.axios.post(this.$httpConfig.balanceRecharge, qs.stringify({
					pay_type_id: id,
					money: this.$store.state.amount
				})).then(function(res) {
						that.payData = res.data.data;
					if(res.data.status == 10001) {
						that.$router.push({name: 'logIn'})
					} else {
						if(res.data.status == 0) {
							Toast(res.data.message + '，即将跳到订单页面!');
							setTimeout(function() {
								that.$router.push({
									name: 'myWallet'
								})
							}, 1000);
						} else{
							eval('that.'+ that.payType[id]+'()');
						}
					}
				}).catch((err) => {
					console.log(err);
				})
			},
		}
	}
</script>
<style lang="less" scoped>
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