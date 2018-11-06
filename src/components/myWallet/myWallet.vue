<template>
	<div class="wallet-wrap" ref="wallet_list">
		<div v-title :data-title="title">{{title}}</div>
		<wal-header :text="title"></wal-header>
		<div class="balance-wrap">
			<div class="hd clearfix">
				<!-- <img :src="URL+$store.state.user_Imag" class="hd-port fl">  -->
				<img :src="URL+headerIMG" class="hd-port fl">
				<div class="amount fl">
					<div class="title">账户余额</div>
					<div class="number text-single-hidden">
						<!--{{money.balance}}-->
						{{money}}
					</div>
				</div>
			</div>
			<ul class="btn-wrap clearfix text-center">
				<li class="fl" @click="toRecharge('/withdr')">提现</li>
				<li class="fl" @click="toRecharge('/recharge')">我要充值</li>
			</ul>
		</div>
		<ul class="content">
			<li>
				<header>使用明细</header>
				<ul class="integral-wrap">
					<li @click="routeDet" v-for='(detail,index) in $store.state.my_wallet' :key="index">
						<div class="conFl">
							<img :src="imgs[detail.type]">
							<div>
								<h4>{{detail.description}}</h4>
								<h6>{{detail.time}}</h6>
							</div>
						</div>
						<div>
							<h4>{{detail.balance}}</h4>
							<span>完成</span>
						</div>
					</li>
				</ul>
			</li>
		</ul>
		<to-top></to-top>
	</div>
</template>
<script>
	import qs from 'qs';
	import { Toast } from 'mint-ui';
	import walHeader from '@/components/page/children/header.vue';
	import walObvious from '@/components/Widget/obviousList.vue';
	import toTop from '@/components/page/toTop.vue';
	export default {
		name: 'myWallet',
		data() {
			return {
				title: '我的钱包',
				money: "",
				choose: "",
				headerIMG:'',
				imgs: [ //0消费 1充值 2提现 3退货
					require("@/assets/images/default.png"),
					require("@/assets/images/Recharge.png"),
					require("@/assets/images/withdraw.png"),
					require("@/assets/images/Refund.png")
				],
				isactive: '',
				slide_switch: false, //避免多次下拉
				load_show:true, //滚动动画
				roll_switch:true, //触发下拉加载开关
				no_data:false, //第一次没数据时的样式
				sliding_no_data:false, //下拉没数据时的样式
				page:1,
			}
		},
		created() {
			this.$store.state.my_wallet = [];
			this.getInfo();
		},
		mounted() {
			let _this = this;
			window.addEventListener('scroll',function(){ 
				if(!_this.$refs.wallet_list) return;
				if(document.body.scrollTop + window.innerHeight >= document.body.offsetHeight) { 
					//如果第一次请求没数据或数据没达到每页个数就不会再请求数据
					if(_this.roll_switch == false){
						return;
					}
					if(_this.slide_switch == true){
						_this.slide_switch = false;
						_this.page++;
						_this.getInfo();
					}
				}
			})
		},
		methods: {
			toRecharge(link) {
				this.$router.push({
					path: link
				});
			},
			routeDet() {
				this.$router.push({
					name: 'billingDetails'
				})
			},
			//请求成功后的操作
            returnOperation(data){
				if(data.length < 10 && this.page == 1){ //第一次请求成功如果数据没达到每页页数就禁止下拉
					this.load_show = false; //动画隐藏
					this.roll_switch = false; //禁止下拉加载
				}
				for (let index = 0; index < data.length; index++) {
					for(var i in data[index].list){
					this.$store.state.my_wallet.push(data[index].list[i]);

					}
				}
				this.slide_switch = true;
			},
			//请求后返回不同状态时的处理
			stateHandling(status,data){
				this.sw = true;
				if(status == 10001) {
					this.$router.push('/LogIn');
				}else if(status == 1){ //成功后的处理
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
			getInfo(){
				this.axios.post(this.$httpConfig.my_wallet,qs.stringify({
					page:this.page
				})).then((res) => {
					if(res.data.status == 10001) {
						this.$router.push('/LogIn');
					} else {
						this.money = res.data.data.balance;
						this.headerIMG = res.data.data.header_img;
						this.stateHandling(res.data.status,res.data.data.balance_detail);
						Toast({
							message: res.data.message,
							position: 'bottom',
							duration: 5000
						});
					}
				}).catch((err) => {
					console.log(err);
				});
			}
		},
		components: {
			walHeader,
			walObvious,
			toTop
		}
	}
</script>
<style lang="less" scoped>
	.wallet-wrap {
		background: #f1f1f1;
		.balance-wrap {
			background: linear-gradient(to right, #D19E29, #EFB83A);
			.hd {
				padding: .6rem .2rem .73rem;
				height: 1.12rem;
				.hd-port {
					width: 1.12rem;
					height: 1.12rem;
					border-radius: 100%;
					box-sizing: border-box;
				}
				.amount {
					padding-left: .2rem;
					.title {
						font-size: .24rem;
						color: #fff;
						padding-bottom: .2rem;
					}
					.number {
						font-size: .8rem;
						color: #fff;
						line-height: 100%;
						font-family: 'Arial';
						width: 5.7rem;
						height: .7rem;
					}
				}
			}
			.btn-wrap {
				display: flex;
				justify-content: flex-end;
				padding: 0 .2rem;
				li {
					padding: 0 .6rem;
					height: .8rem;
					display: flex;
					align-items: center;
					font-size: .28rem;
					margin-left: .3rem;
					border-radius: .04rem;
					&:first-child {
						background-color: #fff;
						color: #C38800;
					}
					&:last-child {
						background-color: #C08600;
						color: #fff;
					}
				}
				height: 1.1rem;
			}
		}
		.content {
			header {
				height: .7rem;
				padding: 0 .3rem;
				line-height: .7rem;
				font-size: .28rem;
				font-weight: 500;
				border-top: .01rem solid #E5E5E5;
				border-bottom: .01rem solid #E5E5E5;
			}
			.integral-wrap {
				li {
					height: 1.5rem;
					background-color: #fff;
					border-bottom: .01rem solid #E5E5E5;
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 0 .3rem;
					.conFl {
						display: flex;
						align-items: center;
					}
					img {
						width: .9rem;
						height: .9rem;
						margin-right: .35rem;
					}
					h4 {
						font-size: .32rem;
						font-weight: 500;
					}
					h6 {
						font-size: .24rem;
						color: #CACACA;
					}
					span {
						font-size: .24rem;
						color: #C2AC32;
					}
				}
			}
		}
	}
</style>