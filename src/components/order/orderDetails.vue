<template>
	<div>
		<div v-title :data-title="title">{{title}}</div>
		<order-header :text="title"></order-header>
		<div class="order-number">
			<span class="fl title" >订单编号：<em>{{order.order_sn_id}}</em></span>
			<!-- <span class="fr status">{{$store.state.order_title}}</span> -->
			<span class="status fr" >{{order_status[Number(order.order_status)+1]}}</span>
		</div>
		<div class="address-wrap" v-if="address">
			<div class="bg-top"></div>
			<div class="con-center">
				<div class="personalInf clearfix">
					<span class="name fl"><em></em>{{address.realname}}{{address.user_name}}</span>
					<span class="number fl">{{address.mobile}}{{address.user_mobile}}</span>
				</div>
				<div class="address" v-if="$route.params.order_type == 2">{{address.prov_name + address.city_name + address.dist_name + address.realname}}</div>
				<div class="address" v-if="$route.params.order_type == 1">{{address.user_address}}</div>
				<div class="icon"></div>
			</div>
			<div class="bg-bottom"></div>
		</div>
		<div class="market-wrap">
			<div v-if="$route.params.order_type == 0 ||$route.params.order_type == 1">
				<h2 class="title">{{order.store_name}}</h2>
				<ul class="content-main">
					<li class="clearfix" @click="enterIntoInteragl">
						<img :src="URL + order.image" class="fl">
						<div class="explain-wrap fr">
							<p class="details">{{order.title}}</p>
							<p class="clearfix product">
								<span class="fl name">积分{{order.interagl_total}}</span>
								<span class="fr number">x{{order.goods_num}}</span>
							</p>
							<p class="clearfix price-main" v-if="$route.params.order_type == 2">
								<span class="fl price">￥{{item.goods_price}}</span>
								<button class="fr btn" v-if="$route.params.status == 1" @click="toService('refund',index)">退款</button>
								<button class="fr btn" v-if="$route.params.status == 4" @click="toService('rGoods',index)">申请售后</button>
							</p>
						</div>
					</li>
				</ul>
			</div>
			<ul class="content-main">
				<li class="title">{{order.shop_name}}</li>
				<li class="clearfix" v-for="(item,index) in order.goods" :key="index">
					<img :src="URL + item.pic_url" class="fl" @click="enterShop(index,item)">
					<div class="explain-wrap fr">
						<p class="details" @click="enterShop(index,item)">{{item.title}}</p>
						<p class="goods-status">{{order_status[Number(item.status)+1]}}</p>
						<p class="clearfix product" @click="enterShop(index,item)">
							<span class="fl price">￥{{item.goods_price}}</span>
							<span class="fr number">x{{item.goods_num}}</span>
						</p>
						<p class="clearfix price-main" v-show="$route.params.order_type == 2 ">
							<button class="fr btn" v-show="order.order_status == 1 && item.status == 1"  @click="toService(item,order.id,1)">退款</button>
							<button class="fr btn" v-show="order.order_status == 4 && item.status ==4"  @click="toService(item,order.id,0)">申请售后</button>
						</p>
					</div>
				</li>
			</ul>
			<!--<div class="status"><span>还有1件</span><em></em></div>-->
		</div>
		<div class="sundry-wrap">
			<p class="mode clearfix" v-if="order.order_status !=0">
				<span class="title fl">支付方式：</span>
				<span class="answer fr">{{order.pay_type}}</span>
			</p>
			<p class="mode clearfix" v-if="$route.params.order_type == 0 ||$route.params.order_type == 1">
				<span class="title fl">所兑换积分</span>
				<span class="answer fr">{{order.price_sum}}</span>
			</p>
			<p class="mode clearfix" v-show="order.order_status >= 3">
				<span class="title fl">配送方式：</span>
				<span class="answer fr">{{order.exp_name}}</span>
			</p>
			<p class="mode clearfix" v-if="$route.params.order_type == 2">
				<span class="title fl">开具发票：</span>
				<span class="answer fr">{{order.translate}}</span>
			</p>
			<div class="clearfix msg-wrap" v-if="$route.params.order_type == 2">
				<span class="title">买家留言：</span><br>
				<textarea class="answer" placeholder="买家没有留下备注哦！" readonly="readonly" v-model="order.remarks"></textarea>
			</div>
			<div class="money-wrap" v-if="$route.params.order_type == 2">
				<p class="clearfix">
					<span class="fl name">商品总额</span>
					<span class="fr price">￥{{parseFloat(order.price_sum)}}</span>
				</p>
				<p class="clearfix">
					<span class="fl name">运费</span>
					<span class="fr price">+ <em>￥{{order.shipping_monery}}</em></span>
				</p>
				<p class="clearfix">
					<span class="fl name">优惠券</span>
					<span class="fr price">- ￥{{order.coupon_deductible}}</span>
				</p>
				<p class="clearfix">
					<span class="fl name">实付款</span>
					<span class="fr price">￥{{parseFloat(order.price_sum) + parseFloat(order.shipping_monery) - parseFloat(order.coupon_deductible) | keepTwoNum}}</span>
				</p>
			</div>
			<div v-if="$route.params.order_type == 2">
				<p class="timer-main">创建时间：{{new Date(order.create_time * 1000).getFullYear()+'-'+(new Date(order.create_time * 1000).getMonth()+1)+'-'+new Date(order.create_time * 1000).getDate()+' '+new Date(order.create_time * 1000).getHours()+':'+new Date(order.create_time * 1000).getMinutes()+':'+new Date(order.create_time * 1000).getSeconds() }}</p>
				<!-- <p class="timer-main">付款时间：{{new Date($store.state.order_details.pay_time * 1000).getFullYear()+'/'+(new Date($store.state.order_details.pay_time * 1000).getMonth()+1)+'/'+new Date($store.state.order_details.pay_time * 1000).getDate()+' '+new Date($store.state.order_details.pay_time * 1000).getHours()+':'+new Date($store.state.order_details.pay_time * 1000).getMinutes()+':'+new Date($store.state.order_details.pay_time * 1000).getSeconds()}}</p> -->
				<p v-if="order.delivery_time" class="timer-main">发货时间：{{new Date(order.delivery_time * 1000).getFullYear()+'-'+(new Date(order.delivery_time * 1000).getMonth()+1)+'-'+new Date(order.delivery_time * 1000).getDate()+' '+new Date(order.delivery_time * 1000).getHours()+':'+new Date(order.delivery_time * 1000).getMinutes()+':'+new Date(order.delivery_time * 1000).getSeconds() }}</p>
				<p v-else class="timer-main"  v-show="order.order_status >= 3">发货时间：-- </p>
			</div>
			<div v-if="$route.params.order_type == 1">
				<p class="timer-main">创建时间：{{order.create_time}}</p>
				<!-- <p class="timer-main">付款时间：{{new Date($store.state.order_details.pay_time * 1000).getFullYear()+'/'+(new Date($store.state.order_details.pay_time * 1000).getMonth()+1)+'/'+new Date($store.state.order_details.pay_time * 1000).getDate()+' '+new Date($store.state.order_details.pay_time * 1000).getHours()+':'+new Date($store.state.order_details.pay_time * 1000).getMinutes()+':'+new Date($store.state.order_details.pay_time * 1000).getSeconds()}}</p> -->
				<p class="timer-main"  v-show="order.order_status >= 3">发货时间：{{order.delivery_time}}</p>
			</div>
		</div>
		<footer>
			<div class="btn-wrap">
				<button class="fr" v-if="$route.params.status == 3" @click="conReceipt">确认收货</button>
				<button class="fr" v-if="$route.params.status == 3 || $route.params.status == 2" @click="toLogis">查看物流</button>
				<button class="fr" v-if="$route.params.status == 4 || $route.params.status == 1" @click="goBuy">再次购买</button>
				<button class="fr" v-if="$route.params.status == 0"  @click="pay(order)">马上付款</button>
				<button class="fr" v-if="$route.params.status == 0" @click="cancelOrder">取消订单</button>
			</div>
		</footer>
		<Shopsn></Shopsn>
		<div class="load-wrap" v-show="load_wrap" @touchmove.prevent>
			<mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner>
		</div>
	</div>
</template>
<script>
	import orderHeader from '@/components/page/children/header.vue';
	import qs from 'qs';
	import { Toast, MessageBox } from 'mint-ui';
	import Shopsn from '@/components/page/Shopsn.vue';
	export default {
		name: 'orderPending',
		data() {
			return {
				title: '订单详情',
				scrollWatch: true,
				status: '',
				load_wrap: true,
				order: {},
				address: '',
				create_time: '',
				delivery_time: '',
				order_Id: '',
				id: [],
				totalPrice: 0,
				order_status:['取消订单','未支付','已支付','发货中','已发货','已收货','退货审核中','审核失败','审核成功','退款中','退款成功']
			}
		},
		components: {
			orderHeader,
			Shopsn
		},
		created(){
			this.totalPrice=parseFloat(this.order.price_sum) + parseFloat(this.order.shipping_monery)
		},
		methods: {
			enterShop(index, item) {
				this.$router.push({
					name: 'product',
					params: {
						id: item.goods_id,
						status: 1
					}
				})

			},
			enterIntoInteragl(){
				this.$router.push({
					name: 'integralDetail',
					params: {
						id: this.order.integral_id,
						status:2
					}
				})
			},
			getInvoiceByOrder() {
				this.axios.post(this.$httpConfig.getInvoiceByOrder, qs.stringify({
					order_id: this.$route.params.order
					//		                this.$route.params.order
				})).then((res) => {

				}).catch((err) => {
					console.log(err);
				});
			},
			toService(item, id,type) {
				event.stopPropagation();
				this.$store.commit('setvuce', this.$store.state.order_details);
				this.$router.push({
					name: 'serviceBack',
					params: {
						type:type,//0:退货 1:退款 2:维修 3:换货
						id: id,
						goods_id: item.goods_id,
						feight:this.order.shipping_monery
					}
				});
			},
			toLogis() {
				this.$router.push({
					name: 'logis',
					params: {
						status: 3,
						id: this.order.id
					}
				});
			},
			cancelOrder() {
				if(this.$route.params.order_type == 1){
					MessageBox.confirm('确定取消订单吗?').then(action => {
						this.axios.post(this.$httpConfig.cancelIntegral, qs.stringify({
							id: this.order.id
						})).then((res) => {
							Toast('取消订单成功！');
							this.$router.push({
								name: 'intOrder'
							})
						}).catch((err) => {
							console.log(err);
						});
					}).catch((err) => {
						console.log(err);
					});
//					console.log(this.order.id,'积分id')
				}else if(this.$route.params.order_type == 2){
					MessageBox.confirm('确定取消订单吗?').then(action => {
						this.axios.post(this.$httpConfig.cancelOrder, qs.stringify({
							id: this.order.id
						})).then((res) => {
							Toast('取消订单成功！');
							this.$router.push({
								path: '/orderList/0'
							})
						}).catch((err) => {
							console.log(err);
						});
					}).catch((err) => {
						console.log(err);
					});
				}
				
			},
			goBuy() {
				if(this.$route.params.order_type == 2){
					/**
					 * 再次购买 （请求接口后直接跳转到购物车）
					 */
					this.axios.post(this.$httpConfig.buyAgain,qs.stringify({
						id:this.order.id
					})).then((res)=>{
						if(res.data.status){
							Toast('添加成功!');
							this.$router.push({name:'Cart'})
						}else{
							Toast(res.data.message);
						}
					}).catch((err)=>{
						Toast(err);
					})
				}else if(this.$route.params.order_type == 1){
					this.integralPay();
				}
			},
			conReceipt() {
				this.axios.post(this.$httpConfig.confirmGet,qs.stringify({
					id:this.order.id
				})).then((res)=>{
					Toast(res.data.message);
				}).catch((err)=>{
					console.log(err)
				})
			},
			integralPay(){
				if(this.address == '') {
					Toast({
						message: '请先填写地址'
					})
					return;
				}
				sessionStorage.setItem("scoreIn",JSON.stringify(this.order.interagl_total));
				sessionStorage.setItem('integral_orderID', this.order.id);
				//余额支付接口
				this.axios.post(this.$httpConfig.confirmExchange, qs.stringify({
					remarks:this.order.remarks,
					address_id:this.order.address_id,
					id:this.order.integral_id
				})).then((res) => {
					Toast(res.data.message);
					sessionStorage.setItem('pay_sourse','integral')
					this.$router.push({
						name: 'CashierIntegral',
						params: {
							id: 1, 
							number:res.data.data
						},
						query:{
							goods:this.$route.query.goods,
							orderId:res.data.data.orderId
						}
					});
					this.$store.state.order_number = res.data.data.orderId;
				}).catch((err) => {
					console.log(err);
				});
			},
			pay(item) { //马上付款
				let total = Number(item.price_sum) + Number(item.shipping_monery);
				if(this.$route.params.order_type == 1) {
					this.integralPay();
				} else {
					if(this.address == '') {
						Toast({
							message: '请先填写地址'
						})
						return;
					}
					this.$store.state.order_number = this.$store.state.order_details.id;
					this.$store.state.price = this.$store.state.order_details.price_sum;

					sessionStorage.setItem('pay_sourse','goods');
					this.$router.push({
						name: 'cashier',
						params: {
							id: 1,
							number: total
						},
						query: {
		 					order_sn_id: this.order.order_sn_id
		 				}
					});
				}
			},
			//获取地址
			getSingleAddress(id) {
				this.axios({
					method: 'get',
					url: this.$httpConfig.addressInfo,
					params: {
						id: id
					}
				}).then((res) => {
					if(res.data.status == 1) {
						this.address = res.data.data;
					}
				}).catch((err) => {
					console.log(err);
				});
			}
		},
		mounted() {
			//      	this.getDefaultAddress();
			this.getInvoiceByOrder();
			this.load_wrap = false;
			document.body.scrollTop = 0;
			if(this.$route.params.order_type == 1) {
				this.axios.post(this.$httpConfig.integralGoodsInfo, qs.stringify({
					id: this.$route.params.order
				})).then((res) => {
					if(res.data.status == 10001) {
						this.$router.push('/LogIn');
					} else {
						Toast(res.data.message)
						this.order = res.data.data
						this.load_wrap = false
						this.address=res.data.data
					}

				}).catch((err) => {
					console.log(err);
				});
			} else if(this.$route.params.order_type == 2) {
				this.axios.post(this.$httpConfig.orderDetail, qs.stringify({
					id: this.$route.params.order
				})).then((res) => { 
					if(res.data.status == 10001) {
						this.$router.push('/LogIn');
					} else {
						this.order = res.data.data;
						this.getSingleAddress(res.data.data.address_id);
						this.load_wrap = false;
					}
				}).catch((err) => {
					console.log(err);
				});
			}
		},
		destroyed() {
			this.scrollWatch = false;
		}
	}
</script>
<style lang="less" scoped>
	.order-number {
		width: 7.1rem;
		height: .9rem;
		background: #fff;
		padding: 0 .2rem;
		line-height: .9rem;
		.title {
			font-size: .28rem;
			color: #666;
			em {
				font-style: normal;
				font-size: .28rem;
				color: #282828;
			}
		}
		.status {
			font-size: .32rem;
			color: #d0111b;
			width: 1.5rem;
			overflow: hidden;
			height: 100%;
		}
	}
	
	.address-wrap {
		.bg-top,
		.bg-bottom {
			width: 100%;
			height: .06rem;
			background: url(../../assets/bottom-bj.jpg) no-repeat;
			background-size: 100% 100%;
		}
		.con-center {
			width: 7.1rem;
			height: 1.5rem;
			padding: 0 .2rem;
			position: relative;
			background: #fff;
			.personalInf {
				padding-top: .3rem;
				.number {
					font-size: .32rem;
					color: #555;
					float: right;
				}
				.name {
					padding: 0 .45rem;
					font-size: .32rem;
					color: #555;
					position: relative;
					em {
						width: .28rem;
						height: .41rem;
						position: absolute;
						left: 0;
						top: 0;
						background: url(../../assets/userIcon.png) no-repeat;
						background-size: 100% 100%;
					}
				}
			}
			.address {
				width: 6.4rem;
				padding-top: .2rem;
				font-size: .28rem;
				color: #999;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.icon {
				position: absolute;
				right: .2rem;
				bottom: .22rem;
				width: .18rem;
				height: .3rem;
				background: url(../../assets/icon-right.jpg) no-repeat;
				background-size: 100% 100%;
			}
		}
	}
	
	.market-wrap {
		padding: .2rem 0;
		background: #f1f1f1;
		.title {
			background: #fff;
			padding: 0 .2rem;
			height: .9rem;
			line-height: .9rem;
			font-size: .32rem;
			color: #D19E29;
			border-bottom: 1px solid #dfdfdd;
		}
		.content-main {
			padding: 0 .2rem;
			background: #fff;
			.title {
				background: #fff;
				padding: 0 .2rem;
				height: .7rem;
				line-height: .7rem;
				font-size: .32rem;
				color: #D19E29;
				border-bottom: 1px solid #dfdfdd;
			}
			li {
				padding: .25rem 0;
				border-bottom: 1px solid #dfdfdd;
				img {
					width: 1.55rem;
					height: 1.55rem;
				}
				.explain-wrap {
					width: 5.25rem;
					.details {
						font-size: .24rem;
						line-height: .4rem;
						height: .8rem;
						// color:#333;
						display: -webkit-box;
						overflow: hidden;
						white-space: normal!important;
						text-overflow: ellipsis;
						word-wrap: break-word;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}
					.goods-status{
						display: flex;
						justify-content: flex-end;
						color: #d0111b;
					}
					.product {
						padding-top: .1rem;
						padding-bottom: .1rem;
						.name {
							font-size: .22rem;
							// color:#999;.
						}
						.number {
							font-size: .22rem;
							color: #fd5149;
						}
					}
					.price-main {
						.price {
							font-size: .28rem;
							color: #333;
							line-height: .62rem;
						}
						.btn {
							width: 1.67rem;
							height: .62rem;
							border: 1px solid #979797;
							background: #fff;
							border-radius: 20px;
							outline: none;
							font-size: .28rem;
							color: #333;
							box-sizing: border-box;
						}
						.btn:active {
							background-color: #fd5149;
							color: #fff;
							box-shadow: 0 0 10px #fd5149;
							border-color: #fd5149;
						}
					}
				}
			}
		}
		.status {
			height: .8rem;
			text-align: center;
			line-height: .8rem;
			background: #fff;
			span,
			em {
				display: inline-block;
				font-size: .28rem;
				color: #555;
			}
			em {
				width: .34rem;
				height: .2rem;
				background: url(../../assets/icon-bottom.jpg) no-repeat;
				background-size: 100% 100%;
				margin-left: .28rem;
			}
		}
	}
	
	.sundry-wrap {
		padding: 0 .2rem .2rem;
		background: #fff;
		.mode {
			height: 1.1rem;
			line-height: 1.1rem;
			border-bottom: 1px solid #d1d1d1;
			.title {
				font-size: .25rem;
				color: #777;
			}
			.answer {
				font-size: .28rem;
				color: #333;
				padding-right: .3rem;
				height: 100%;
			}
		}
		.money-wrap {
			padding-top: .4rem;
			border-bottom: 1px solid #ccc;
			.name {
				font-size: .25rem;
				color: #777;
				height: .5rem;
				line-height: .5rem;
			}
			.price {
				font-size: .28rem;
				color: #d0111b;
				em {
					font-size: .28rem;
					color: #666;
					font-style: normal;
				}
			}
		}
		.msg-wrap {
			.title {
				padding-top: .5rem;
				display: block;
			}
			textarea {
				background: #f1f1f1;
				border: none;
				width: 100%;
				height: 1rem;
				resize: none;
				padding: .2rem;
				outline: none;
				box-sizing: border-box;
			}
		}
		.timer-main {
			padding-top: .3rem;
			font-size: .22rem;
			color: #797979;
		}
	}
	
	footer {
		width: 100%;
		height: .8rem;
		.btn-wrap {
			height: .5rem;
			width: 7.1rem;
			padding: .13rem .2rem;
			position: fixed;
			left: 0;
			bottom: 0;
			background: rgba(0, 0, 0, .4);
			button {
				width: 1.71rem;
				height: .54rem;
				border-radius: 5px;
				box-sizing: border-box;
				border: none;
				outline: none;
				color: #fff;
				background: #f97620;
				font-size: .28rem;
			}
			button:nth-child(2) {
				margin-right: .15rem;
				background: #666;
			}
		}
	}
</style>