<template>
	<div class="order-wrap">
		<!-- 从购物车进来确认商品订单 -->
		<div v-title data-title="确认订单">确认订单</div>
		<order-header :text="title" :btn="btn"></order-header>
		<div class="inf-header" @click="tolink('address')">
			<div v-if="rec_address">
				<div class="inf-name clearfix">
					<div class="name fl"><span></span>{{rec_address.realname}}</div>
					<div class="phone fr"><span></span>{{rec_address.mobile}}</div>
				</div>
				<div class="address" v-if="show_addres">
					{{rec_address.prov+"-"+rec_address.city+"-"+rec_address.dist+"-"+rec_address.address}}
				</div>
				<div class="address" v-else>
					{{rec_address.prov_name+"-"+rec_address.city_name+"-"+rec_address.dist_name+"-"+rec_address.address}}
				</div>
			</div>
			<div class="status text-center" v-if="!rec_address">您还没有填写收货地址，请填写！</div>
			<span class="btn-right"></span>
		</div>
		<div class="bottom-bg"><img src="../../assets/bottom-bj.jpg"></div>
		<!-- 购物车多个商品 -->
		<ul class="mark-wrap" v-for="(items,index) in goods_data" :key="index">
			<li class="header"><img :src="URL+items.store_info.store_logo" alt="" /><span>{{items.store_info.shop_name}}</span></li>
			<li class="clearfix" id="store" v-for="(item,index) in items.good_info" :key="index">
				<img :src="URL + item.fatherImg" class="fl">
				<div class="pull-right fl">
					<p class="text">{{item.title}}</p>
					<p class="price-wrap clearfix">
						<span class="fl price">￥<span>{{item.price_member}}</span></span>
						<span class="number fr">X{{item.goods_num}}</span>
					</p>
				</div>
			</li>
			<li>
				<div class="dist-wrap">
					<!-- <div class="hd active clearfix"  >
						<div class="title fl">配送方式</div>
						<div class="busi fr">顺丰包邮</div>
					</div> -->
					<div class="hd clearfix" @click="selectCoupon(items.store_info.id,index)" >
						<div class="title fl">选择优惠券</div>
						<div v-show="$store.state.const_coupon_money[index] == null"  class="busi fr" >请选择优惠券</div>
						<div class="busi fr" 
						v-if="item.store_id == items.store_info.id" 
						:key="item.store_id" 
						v-for="item in $store.state.const_coupon_money">{{item.name}}</div>
					</div>
					<div class="hd clearfix" @click="tolink('/invoice1')"  >
						<div class="title fl">开具发票</div>
						<div class="busi fr">{{invoice_type}}</div>
					</div>
					<div class="dd">
						<div class="title">给商家留言：</div>
						<textarea placeholder="选填：备注限字在45个字以内" oninput="if(value.length>45)value = value.slice(0,45)" v-model="params_goods[index].remarks"></textarea>
						<p class="ind">共<span>{{total_number}}</span>件商品</p>
					</div>
				</div>
			</li>
		</ul>
		<div class="price-set-wrap"  >
			<div class="total price clearfix">
				<span class="fl">税前商品总额</span>
				<span class="fr">￥{{total_price}}</span>
			</div>
			<div class="freight price clearfix">
				<span class="fl">运费</span>
				<span class="fr">+&nbsp;&nbsp;<i>￥{{freight}}</i></span>
			</div>
			<div class="freight price clearfix">
				<span class="fl">优惠券</span>
				<span class="fr">-&nbsp;&nbsp;￥{{$store.state.const_coupon_price}}</span>
			</div>
		</div>
		<div class="footer-wrap">
			<div class="foot-seat"></div>
			<div class="footer clearfix">
				<button class="fr btn" @click="toCashierAll">提交订单</button>
				<div class="fr money">
					实付款&nbsp;:&nbsp;<span class="price">￥
						<span v-if="$store.state.const_coupon_price!=0">{{all_price-parseFloat($store.state.const_coupon_price)|keepTwoNum}}</span>
						<span v-if="$store.state.const_coupon_price==''">{{all_price|keepTwoNum}}</span>
					</span>
				</div>
			</div>
		</div>
		<detail-coupon ></detail-coupon>
		<Shopsn></Shopsn>
		<div class="load-wrap" v-show="load_wrap" @touchmove.prevent>
			<mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner>
		</div>
	</div>
</template>
<script>
	import orderHeader from '@/components/page/children/header.vue';
	import { Toast } from 'mint-ui';
	import Shopsn from '@/components/page/Shopsn.vue';
	import detailCoupon from '@/components/page/children/detailCouponPackage.vue'; // 优惠券 弹框
	import qs from 'qs';
	export default {
		name: 'order',
		data() {
			return {
				show_addres:true, //显示地址
				rec_address:'', //地址
				title: '确认商品订单',
				btn: '', //头部客服按钮开关
				goods_data: [],
				scrollWatch: true,
				coupon: '请选择优惠券',
				coupon_id:'',
				invoice_type: '无需发票', //发票选择
				load_wrap: true,
				message: [], //留言
				invoice_status: 0,
				total_price: '',
                freight: 0, //运费
                total_number:0, //商品总数
				all_price:0,//运费+商品金额（最后价格）
				prompt:'',
				coupons_money:0,
				storeList:[], //所有店铺名和ID
				storeNameNo : '',
				params_goods:[]

			}
		},
		created() {
			this.getData();
			this.$store.state.const_coupon = false;
			this.$store.state.const_coupon_num = 0;
			this.$store.state.select_coupon = [];
			this.$store.state.const_coupon_price = 0.00;
		},
		mounted(){
			$("html,body").animate({scrollTop:'0px'},100);
			this.invoice_type = this.$store.state.invoice == true ? '已开发票' : '无需发票' ;
		},
		methods: {
			selectCoupon(item,index){
				this.$store.state.const_coupon_price_package_index = index;
				this.$store.state.const_coupon = true;
				this.$store.state.const_coupon_num = item;
			},
			//获取运费
			getFreight() {
				if(!this.rec_address){return false;};
				
				let data = {
					prov_id : !this.rec_address.dist_id ? this.rec_address.prov : this.rec_address.prov_id,
					city_id : !this.rec_address.dist_id ? this.rec_address.city : this.rec_address.city_id,
					dist_id : !this.rec_address.dist_id ? this.rec_address.dist : this.rec_address.dist_id
				}
				this.axios.post(this.$httpConfig.getFreight, qs.stringify(data)).then((res) => {
					this.load_wrap = false;
					if(res.data.status == 1){
						this.freight = res.data.data;
					}else{
						var storeID = res.data.data;
						console.log(this.storeList)
						for(var i in this.storeList){
							if(storeID == this.storeList[i].id){
								this.storeNameNo = this.storeList[i].name;
							}
						}
						Toast({
                          message: '抱歉，'+this.storeNameNo+'商铺不能发货您的收货地货！',
                          duration: 1000
						});
						this.prompt = res.data.message;
					}
				this.all_price=parseFloat(this.total_price) + parseFloat(this.freight) ;
				}).catch((err)=>{
					Toast(err);
				})
			},
			//获取默认地址
			getAddress(){
				this.axios.post(this.$httpConfig.getDefault).then((res) => {
					if(res.data.status == 10001){
						this.$router.push('/login');
						return;
					}
                    this.load_wrap = false;						
					if(res.data.data){
						this.rec_address = res.data.data;
					}else{
						this.selectAddress()
					}   
					if (res.data.data && sessionStorage.getItem('set_address')) {
						this.selectAddress()
					}
					this.getFreight();
				}).catch((err) => {
					console.log(err);
				})
			},
            //选取地址
            selectAddress(){
                this.rec_address = JSON.parse(sessionStorage.getItem('set_address'));
				this.show_addres = false;
            },
			//获取数据
			getData(){
				this.storeList = [];
                this.axios.post(this.$httpConfig.userBuyCartGoods, qs.stringify({
					cartId: this.$route.params.cart_id
				})).then((res) => {
					if(res.data.status == 10001) {
                        this.$router.push('/LogIn');
                        return;
                    }
                    // if(!res.data.data){
                    //     this.$router.push('/home')
                    // }
                    if(res.data.status == 1){
                        this.goods_data = res.data.data.shop_goods_info;
                        this.total_price = res.data.data.total_price;
                        //总商品数量
                       for(var i in this.goods_data) {
						   var item = {
							   id : this.goods_data[i].store_info.id,
							   name : this.goods_data[i].store_info.shop_name
						   }

							
							var IDItem = [];
						   this.storeList.push(item);
							for(var j in this.goods_data[i].good_info) {
								IDItem.push(this.goods_data[i].good_info[j].cat_id);
								this.total_number += parseInt(this.goods_data[i].good_info[j].goods_num);
							}
							var paramsItem = {
								id:IDItem.join(','),
								remarks:''
							}
							this.params_goods.push(paramsItem);
						}
						this.getAddress();
					}
				}).catch((err) => {
					console.log(err);
				})
			},

		// 提交订单
			toCashierAll() {
				var price = parseFloat(this.total_price) + parseFloat(this.freight) - parseFloat(this.$store.state.const_coupon_price);
				var b = parseFloat(price).toFixed(3);
				var lastPrice = b.substring(0,b.toString().length - 1);  //这里先将a转换为float类型再保留三位小数，最后截取字符串前b.length - 1位
				
				if(!this.rec_address){Toast("请填写收货地址");return false;}
				if(this.prompt){
					Toast({
                          message: this.prompt,
                          duration: 1000
						});
						return false;
				}
				let needs = 0;
				if(this.$store.state.invoice == true){
					needs = 1;
				}
				this.axios.post(this.$httpConfig.goBuy, qs.stringify({
					goods:this.params_goods,
					total:lastPrice, //订单总价
					address_id:this.rec_address.id, //收货地址ID
					invoice_id:this.$store.state.invoice_id, //发票id
					// remarks:this.message.join(','), //订单备注
					platform:2, //平台 0 代表pc 1代表app 2 代表wap
					translate:needs, //1需要发票，0不需要
					// shipping_monery:this.freight, //运费
					// invoice: [],//发票内容（json格式的二维数组）
					// buyType:this.$route.params.id, //1：为购物车购买 2:为立即购买型
					// coupon_id: this.coupon_id, //优惠券Id，没有优惠券传空
				})).then((res) => {
					if(res.data.data == null){
						Toast({
                            message: '订单已提交',
                            duration: 2000
                        }); 
					this.$router.push({
						name: 'orderList',
						params: {
							id: 0,
						}
					})
					return;
					}
					if(res.data.status == 1){
						sessionStorage.setItem('pay_sourse','goods');
						this.$router.push({
								name: 'cashier',
								params: {
									id: 1 ,//1为商品 3为积分兑换
									number : lastPrice
								},
								
							});
					}else{
						Toast({
                          message: res.data.message,
                          duration: 1500
						});
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			tolink(to) {
				sessionStorage.removeItem('collocation_cart_id');
				sessionStorage.removeItem('collocation_info');
				sessionStorage.removeItem('goods_data');
				sessionStorage.removeItem('integral_data');
				sessionStorage.removeItem('set_meal_id');
				sessionStorage.setItem('cart_id',this.$route.params.cart_id);
				if(to == 'address') {
					this.$router.push({
						name: to,
						params:{
							status:1
						}
					});
				} else if(to = '/invoice1') {
					
					this.$router.push({
						name: 'invoice',
						params:{
							status:2 //1是商品 2是购物车
						}
					});
				}else{
					this.$router.push(to);
				}
			},
			limit() {
				if(this.message.length > 45) {
					Toast('留言不能超过45字！');
				}
			},
		},
		destroyed() {
			this.scrollWatch = false;
		},
		components: {
			orderHeader,
			Shopsn,
			detailCoupon
		}
	}
</script>
<style lang="less" scoped>
	.order-wrap {
		background: #f1f1f1;
		.inf-header {
			width: 7.1rem;
			height: 1.64rem;
			padding: 0 .2rem;
			background: #fff;
			position: relative;
			.status {
				font-size: .32rem;
				color: #666;
				line-height: 1.64rem;
			}
			.inf-name {
				padding: .3rem 0;
				color: #282828;
				.name {
					font-size: .36rem;
					padding-left: .44rem;
					position: relative;
					span {
						position: absolute;
						top: 50%;
						left: 0;
						width: .28rem;
						height: .41rem;
						background: url(../../assets/userIcon.png) no-repeat;
						background-size: 100% 100%;
						margin-top: -.205rem;
					}
				}
				.phone {
					font-size: .36rem;
					padding-left: .38rem;
					position: relative;
					span {
						position: absolute;
						left: 0;
						top: 50%;
						margin-top: -.17rem;
						width: .24rem;
						height: .34rem;
						background: url(../../assets/phone.png) no-repeat;
						background-size: 100% 100%;
					}
				}
			}
			.address {
				width: 6.4rem;
				height: .3rem;
				display: block;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: .28rem;
				color: #999;
				line-height: .32rem;
				position: relative;
			}
			.btn-right {
				width: .18rem;
				height: .3rem;
				position: absolute;
				top: .9rem;
				right: .2rem;
				background: url(../../assets/btn-right.png) no-repeat;
				background-size: 100% 100%;
			}
		}
		.bottom-bg {
			width: 100%;
			margin-bottom: .2rem;
			img {
				width: 100%;
			}
		}
		.mark-wrap {
			margin: .2rem 0;
			background: #fff;
			.header {
				padding: 0.2rem;
				border-bottom: 1px solid #dfdfdd;
				line-height: 0.8rem;
				span {
					font-size: 0.32rem;
					color: #f9781e;
				}
				img {
					width: 0.8rem;
					height: 0.8rem;
					padding-right: 0.3rem;
				}
			}
			li.clearfix {
				padding: .25rem .2rem;
				border-bottom: 1px solid #dfdfdd;
				height: 1.55rem;
				position: relative;
				img {
					width: 1.55rem;
					height: 1.55rem;
				}
				.delete {
					width: 1.2rem;
					height: 100%;
					background: #f9781e;
					position: absolute;
					right: 0;
					top: 0;
					color: #fff;
					text-align: center;
					.icon {
						width: .51rem;
						height: .51rem;
						background: url(../../assets/delete.png) no-repeat;
						background-size: 100% 100%;
						margin: .55rem auto .2rem;
					}
					.text {
						font-size: .24rem;
					}
				}
				.pull-right {
					padding-left: .2rem;
					.text {
						width: 4.7rem;
						font-size: .24rem;
						color: #333;
						line-height: .32rem;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
					.price-wrap {
						padding-top: .4rem;
						width: 5rem;
						.price {
							font-size: .26rem;
							color: #e02828;
							span {
								font-size: .38rem;
							}
						}
						.number {
							font-size: .32rem;
							color: #333;
						}
					}
				}
			}
		}
		.dist-wrap {
			width: 7.1rem;
			padding: 0 .2rem;
			background: #fff;
			.hd {
				height: 1.1rem;
				line-height: 1.1rem;
				border-bottom: 1px solid #d1d1d1;
				background: url(../../assets/btn-right.png) no-repeat 6.9rem center;
				background-size: .14rem .24rem;
				padding-right: .3rem;
				box-sizing: border-box;
				.title {
					font-size: .25rem;
					color: #777;
				}
				.busi {
					font-size: .25rem;
					color: #999;
					width: 50%;
					height: 55px;
					text-align: right;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
				}
			}
			.hd.active {
				background: #fff;
			}
			.dd {
				margin-bottom: .2rem;
				.title {
					padding: .3rem 0;
					font-size: .25rem;
					color: #777;
				}
				textarea {
					border: none;
					resize: none;
					width: 7.1rem;
					height: .94rem;
					background: #f1f1f1;
					text-indent: .2rem;
					padding-top: .2rem;
					outline: none;
					font-size: .24rem;
					color: #333;
				}
				.ind {
					text-align: right;
					padding: .48rem .2rem .32rem;
					font-size: .26rem;
					color: #333;
					span {
						font-size: .26rem;
						color: #f23030;
					}
				}
			}
		}
		.footer-wrap {
			height: 1rem;
			width: 100%;
			.footer {
				position: fixed;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 1rem;
				background: #fff;
				box-sizing: border-box;
				border-top: 1px solid #ccc;
				.btn {
					width: 2.5rem;
					height: 1rem;
					color: #fff;
					border: none;
					background: #D19E29;
					font-size: .36rem;
				}
				.btn-gray {
					background: #ccc;
				}
				.money {
					line-height: 1rem;
					font-size: .3rem;
					color: #757575;
					padding-right: .3rem;
					.price {
						font-size: .3rem;
						span {
							font-size: .36rem;
							font-weight: bold;
						}
					}
				}
			}
		}
		.price-set-wrap {
			padding: .2rem;
			background: #fff;
			.price {
				height: .6rem;
				line-height: .6rem;
				span.fl {
					font-size: .25rem;
					color: #777;
				}
				span.fr {
					font-size: .28rem;
					color: #d0111b;
					overflow: hidden;
					height: 100%;
					i {
						font-style: normal;
						color: #666;
					}
				}
			}
			.price.curInt {
				span.fr {
					color: #ff7200;
				}
			}
		}
	}
</style>