<template>
	<div class="goos" ref="cart">
		<div v-title data-title="我的购物车">我的购物车</div>
		<header class="cart-header">我的购物车
			<!-- ({{nav[0].number+nav[1].number}}) -->
			<router-link to="/myNews"><span></span></router-link>
		</header> 
		<ul class="nav">
			<li @click="selectNav(index)" :class="{active:item.isSelected}" :key="index" v-for="(item,index) in nav">{{item.name}}</li>
		</ul>
		<div class="cart-active text-center" v-show="$store.state.no_data">
			<img src="../../assets/cart.png">
			<p class="text">您的购物车还没有宝贝哦，
				<a @click="enterList">快选购看看</a>
			</p>
		</div>
		<div v-show="nav[1].isSelected">
			<cartPackage :cart="cart_click"></cartPackage>
		</div>
		<div style="margin-bottom:1.5rem" v-show="nav[0].isSelected">
			<dl class="mark-wrap" v-if="$store.state.cart_data" v-for="(items,index1) in $store.state.cart_data" v-bind:key="index1">
				<dt>
					<label class="checkBox" :class="{active:items.checked}" @click="addShop(index1,items)"><span></span></label>
					<a @click="enterShop(items)">{{items.shop_name}}</a>
					<span class="clearfix" @click="deit(index1,$event)">
						<i class="fl">{{total.fn}}</i>
						<em class="fl"></em>
					</span>
					<span class="all" :class="{allColor:items.checked}">全选</span>
				</dt>
				<dd class="clearfix" v-for="(item,index) in items.goods" :key="item.id" :class="{active:!total.deit}">
					<label class="checkBox" :class="{active:item.checked}" @click="addCom(index1,index,item)" checked><span></span></label>
					<label v-show="isEdit" class="checkBox" :class="{active:item.checked}" @click="addCom(index1,index,item)" checked><span></span></label>
					<img v-lazy="URL + item.puc_url" class="fl" @click="enterDetail(index,item)">
					<div class="pull-right fl" v-show="total.deit" @click="enterDetail(index,item)">
						<p class="text">{{item.title}}</p>
						<p class="price-wrap clearfix">
							<span class="fl price">￥<span>{{item.price_new}}</span></span>
							<span class="number fr">x{{item.goods_num}}</span>
						</p>
					</div>
					<div class="delete fr" v-show="!total.deit" @click="remove(index,index1,item)">
						<div class="icon"></div>
						<div class="text">删除</div>
					</div>
					<div class="input-wrap fr" v-show="!total.deit">
						<button @click="reduce(index,item)">-</button>
						<input type="number" v-model="item.goods_num" v-on:input="cartNumModify(item)">
						<button @click="add(index,item)">+</button>
					</div>
				</dd>
			</dl>
			<div class="interested">
				<div class="title">
					<span></span>
					<span></span> 您可能感兴趣的产品
				</div>
				<hot-goods :data="$store.state.computer"></hot-goods>
			</div>
			<div class="footer-wrap" v-if="$store.state.cart_data">
				<div class="seat"></div>
				<div class="footer clearfix">
					<label class="chicked fl" :class="{active:flag}" @click="seat()">
						<span></span>{{total.setData}}
					</label>
					<button class="set-btn fr" v-show="total.deit" @click="toOrder">去结算({{total.seleNumber}})</button>
					<div class="total fl" v-show="total.deit">
						<div class="total-metre clearfix">
							<span class="title fl">总计:</span>
							<span class="con fl">￥<span>{{price.toFixed(2)}}</span></span>
						</div>
					</div>
					<div class="immig fr" v-show="!total.deit" @click="collection">移入收藏</div>
				</div>
			</div>
		</div>
		<Shopsn></Shopsn>
		<div class="load" v-show="load" @touchmove.prevent>
			<mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner>
		</div>
		<div class="load-wrap" v-show="$store.state.cart_load" @touchmove.prevent>
			<mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner>
		</div>
        <to-top></to-top>
	</div>
</template>
<script>
	import { MessageBox, Toast } from 'mint-ui';
	import qs from 'qs';
	import hotGoods from '@/components/home/children/hotGoods';
	import Shopsn from '@/components/page/Shopsn.vue';
	import cartPackage from '@/components/cart/cartPackage.vue';
    import toTop from '@/components/page/toTop.vue';
	export default {
		name: 'cart',
		data() {
			return {
				load: false,
				load_wrap: true,
				cart_click:0,
				sw:false,
				total: {
					seleNumber: 0,
					newPrice: 0,
					price: 0,
					dis: 0,
					seat: '',
					deit: true,
					setData: '全选',
					fn: '编辑'
				},
				scrollWatch: true,
				data: '',
				status: [],
				computer: '',
				goos_id: [],
				goods: [],
				id: [],
				flag: false,
				price: 0,
				length: [],
				delRemove: [],
				isEdit: true,
				cartId: [],
				news:[],
				nav:[
					{name:'商品',isSelected:true,number:0},
					{name:'推荐套餐',isSelected:false,number:0}
				],
                isactive: '',
                slide_switch: false, //避免多次下拉
                load_show: true, //滚动动画
                roll_switch: true, //触发下拉加载开关
                no_data: false, //第一次没数据时的样式
                sliding_no_data: false, //下拉没数据时的样式
                page: 1,
			}
		},
		created() {
			// this.getCartData();
		},
		mounted() {
			this.$store.state.cart_data = [];
			this.$store.state.package_cart_data = '';
			if(this.$route.params.status == 2){
				this.nav[1].isSelected = true;
				this.nav[0].isSelected = false;
				this.getPackageCart();
			}else{
				this.nav[0].isSelected = true;
				this.nav[1].isSelected = false;
				this.getCartData();
			}
			this.$store.state.cart_load = false;
			document.body.scrollTop = 0;

            let _this = this;
            window.addEventListener('scroll', function () {
				if (!_this.$refs.cart) return;
				console.log(document.body.scrollTop + window.innerHeight >= document.body.offsetHeight,_this.roll_switch == false,_this.slide_switch == true)
                if (document.body.scrollTop + window.innerHeight >= document.body.offsetHeight) {
                    //如果第一次请求没数据或数据没达到每页个数就不会再请求数据
                    
                    if (_this.slide_switch == true) {
                        _this.slide_switch = false;
                        _this.page++;
                        _this.getCartData();
                    }
                }
            })
		},
		methods: {
			selectNav(index){
				console.log(index)
				if(this.sw == true) return;
				this.$store.state.cart_data = [];
				this.$store.state.package_cart_data = '';
				this.cart_click++;
				this.sw = true;
				switch (index) {
					case 0:
						this.nav[0].isSelected = true;
						this.nav[1].isSelected = false;
						this.getCartData();
						break;
					case 1:
						this.nav[1].isSelected = true;
						this.nav[0].isSelected = false;
						this.getPackageCart();
						break;
					default:
						break;
				}		
			},
			getPackageCart() {
				this.length = [];
				// 获取购物车套餐商品
				this.axios.post(this.$httpConfig.cartPackageList)
				.then(res => {
					Toast(res.data.message)
					this.sw = false;
					this.$store.state.no_data = res.data.data == ''?true:false;
					if (res.data.status == 10001) {
						this.$router.push("/LogIn");
					} else {
						if (res.data.status) {
								this.length = res.data.data;
								this.$store.state.package_cart_data = res.data.data;
							} else {
								this.$store.state.package_cart_data = '';
							}
						}
					})
				.catch(err => {
					Toast(err);
				});
			},
			getCartData(){
				this.length = [];
				this.axios.post(this.$httpConfig.cartGoodsList,qs.stringify({
					page:this.page
				})).then((res) => {
					this.sw = false;
					this.$store.state.no_data = res.data.data == null?true:false;
					if(res.data.status == 10001) {
						this.$router.push('/LogIn');
					} else {
                    	this.stateHandling(res.data.status, res.data.data.goods);
						this.$store.state.cart_load = false;
						// for(var i in this.$store.state.cart_data) {
						// 	for(var j in this.$store.state.cart_data[i].goods) {
						// 		this.length.push(this.$store.state.cart_data[i].goods[j])
						// 	}
						// }
						// this.nav[0].number = this.length.length;
					}
				}).catch((err) => {
					console.log(err);
				});
			},
            //请求成功后的操作
            returnOperation(data) {
                if (data.length < 10 && this.page == 1) { //第一次请求成功如果数据没达到每页页数就禁止下拉
                    this.load_show = false; //动画隐藏
                    this.roll_switch = false; //禁止下拉加载
				}
					for (let index = 0; index < data.length; index++) {
						this.$store.state.cart_data.push(data[index]);
					}
                this.slide_switch = true;
            },
            //请求后返回不同状态时的处理
            stateHandling(status, data) {
                if (status == 10001) {
                    this.$router.push('/LogIn');
                } else if (status == 1) { //成功后的处理
                    this.returnOperation(data);
                } else if (status == 0 && this.page == 1) { //第一次请求失败时
                    this.no_data = true; //无数据时的样式
                    this.load_show = false; //动画隐藏
                    this.roll_switch = false; //禁止下拉加载
                } else { //第二次或更多次无数据时
                    this.sliding_no_data = true; //无数据时的样式
                    this.load_show = false; //动画隐藏
                    this.roll_switch = false; //禁止下拉加载
                }
            },
			enterShop(items){
				this.$router.push({
					name: "shopHome",
					params: {
						id: items.store_id,
              			index:0
					}
				})
			},
			enterList() {
				this.$router.push({
					path: '/list/1/search'
				})
			},
			enterDetail(index, item) {
				this.$router.push({
					name: "product",
					params: {
						id: item.goods_id,
						status: 1
					}
				})
			},
			addgoods(goods) {
				if(this.goods.length > 0) {
					for(var j = 0; j < this.goods.length; j++) {
						if(this.goods[j].id == goods.id) {
							return;
						} else {
							this.goods.push(goods)
							this.total.seleNumber = this.goods.length
							return;
						}
					}
				} else {
					this.goods.push(goods);
					this.total.seleNumber = this.goods.length
				}
			},
			deletegoods(goods) {
				if(this.goods.length == 0) {
					return;
				} else {
					for(var j = 0; j < this.goods.length; j++) {
						if(this.goods[j].id == goods.id) {
							this.goods.splice(j, 1);
							return;
						}
					}
				}
			},
			deit(index1, e) { //编辑购物车
				var list = this.$store.state.cart_data[index1].goods,
					len = list.length;
				if(this.total.deit) {
					for(var i = 0; i < len; i++) {
						this.total.deit = false;
						this.total.fn = '完成';
						this.isEdit = false;
					}
				} else {
					this.getAllprice();
					for(var i = 0; i < len; i++) {
						this.total.deit = true;
						this.total.fn = '编辑';
						this.isEdit = true;

					}

				}
			},
			addShop(index, items) {
				var list = this.$store.state.cart_data[index]['goods'],
					len = list.length;
				if(this.$store.state.cart_data[index]['checked']) {
					for(var i = 0; i < len; i++) {
						list[i]['checked'] = false;
						this.deletegoods(list[i]);
					}
				} else {
					for(var i = 0; i < len; i++) {
						list[i]['checked'] = true;
						this.addgoods(list[i]);
					}
				}
				this.$store.state.cart_data[index]['checked'] = !this.$store.state.cart_data[index]['checked'];
				this.getAllprice();
				this.hasAllchecked();
			},
			addCom(index1, index, item) { //单选
				var list = this.$store.state.cart_data[index1]['goods'];
				var	len = list.length;
				if(list[index]['checked']) {
					this.$store.state.cart_data[index1]['checked'] = false;
					this.flag = false;
					list[index]['checked'] = !list[index]['checked'];
					for(var i = 0; i < this.goods.length; i++) {
						if(this.goods[i].id == item.id) {
							this.goods.splice(i, 1);
							break;
						}
					}

				} else {
					list[index]['checked'] = !list[index]['checked'];
					// 判断是否选择当前店铺的全选			    
					var off = true;
					for(var j = 0; j < len; j++) {
						if(typeof list[j]['checked'] == 'undefined' || list[j]['checked'] == false) {
							off = false;
						}
					}
					off == true ? this.$store.state.cart_data[index1]['checked'] = true : this.$store.state.cart_data[index1]['checked'] = false;
					this.goods.push(list[index]);
					this.total.seleNumber = this.goods.length
				}
				this.getAllprice();
				this.hasAllchecked();
			},
			seat() { //全选
				var offon = true;
				if(this.flag) {
					offon = false;
				}
				for(var i = 0, len = this.$store.state.cart_data.length; i < len; i++) {
					this.$store.state.cart_data[i]['checked'] = offon;
					var list = this.$store.state.cart_data[i]['goods'];
					for(var k = 0, len1 = list.length; k < len1; k++) {
						list[k]['checked'] = offon;
						if(this.flag == false) {
							this.addgoods(list[k]);
							this.total.seleNumber = this.goods.length
						} else if(this.flag == true) {
							this.deletegoods(list[k])
							this.total.seleNumber = this.goods.length
						}
					}
				}
				this.flag = !this.flag;
				this.getAllprice();
			},
			getAllprice() {
				if(!this.$store.state.cart_data){
					this.$store.state.no_data = true;
				} 
				let allprice = 0;
				let num = 0
				this.$store.state.cart_data.forEach((value, index) => {
					value.goods.forEach((value, index) => {
						if(value.checked) {
							allprice += value.goods_num * value.price_new
						}
					})
				})
    			this.total.seleNumber = this.goods.length>99?'99+': this.goods.length;
				this.price = allprice
			},
			hasAllchecked() {
				var flag1 = true;
				for(var i = 0, len = this.$store.state.cart_data.length; i < len; i++) {
					if(typeof this.$store.state.cart_data[i]['checked'] === 'undefined' || this.$store.state.cart_data[i]['checked'] == false) {
						flag1 = false;
						break;
					}
				}
				flag1 == true ? this.flag = true : this.flag = false;
			},
			cartNumModify(item) {
				if(item.goods_num == 0) {
					return;
				} else {
					this.axios.post(this.$httpConfig.cartNumModify, qs.stringify({
						cart_id: item.id,
						num: item.goods_num
					})).then((res) => {
						if(res.data.status == 10001) {
							this.$router.push('/LogIn');
						} else {
							this.load = false;
							if(res.data.status == 1) {
								if(item.goods_num == 0) {
									item.goods_num = 1;
									Toast({
										message: '不能为0哦!'
									});
								}
							} else {
								Toast(res.data.message);
								item.goods_num = 1;
								return false;
							}
						}
					}).catch((err) => {
						console.log(err);
					});
					this.getAllprice();
				}
			},
			reduce(index, item) { //商品减少
				if(item.goods_num <= 1) {
					item.goods_num = 1;
					Toast('不能再减少了哟!!');
					return false;
				} else if(item.goods_num > 1) {
					this.axios.post(this.$httpConfig.cartNumReduce, qs.stringify({
						cart_id: item.id
					})).then((res) => {
						if(res.data.status == 10001) {
							this.$router.push('/LogIn');
						} else {
							item.goods_num--
							this.load = false;
						}
					}).catch((err) => {
						console.log(err);
					})
					this.getAllprice();
				}
			},
			add(index, item) { //商品增加
				this.axios.post(this.$httpConfig.cartNumPlus, qs.stringify({
					cart_id: item.id
				})).then((res) => {
					if(res.data.status == 10001) {
						this.$router.push('/LogIn');
					} else {
						if(res.data.status == 1) {
							item.goods_num++;
							this.load = false;
						} else {
							Toast(res.data.message)
						}
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			remove(index, key, item) { //从购物车中删除商品
				MessageBox.confirm('确定删除此商品?').then(action => {
						this.axios.post(this.$httpConfig.delGoodsCart, qs.stringify({
							id: item.id
						})).then((res) => {
							if(res.data.status == 10001) {
								this.$router.push('/LogIn');
							} else {
								if(res.data.status == 1) {
									this.$store.state.cart_data[key].goods.splice(index,1);
								}
								if(this.$store.state.cart_data[key].goods.length == 0){
									this.$store.state.cart_data.splice(key,1);
								}
								if(this.$store.state.cart_data.length == 0){
									this.$store.state.cart_data = [];
								}
								Toast('删除成功！');
								this.getAllprice();
							}
						}).catch((err) => {
							console.log(err);
						})
					}).catch((err) => {
						console.log(err);
					});
			},
			toOrder() { //去结算
				this.$store.state.invoice = false;
				this.$store.state.rise = null;
				this.$store.state.type = null;
				this.$store.state.content = null;
				this.$store.state.invoice_id = '';
				if(this.goods == '') {
					Toast('请选择您要购买的物品！');
					this.load = false;
					return;
				}
				for(var i = 0; i < this.goods.length; i++) {
					this.cartId.push(this.goods[i].id);
				}
				this.$router.push({
					name: 'cartOrder',
					params: {
						cart_id: this.cartId.join(',')
					}
				});
			},
			collection() { //添加到收藏
				this.delRemove = [];
				for(var i = 0; i < this.goods.length; i++) {
					this.delRemove.push(this.goods[i].id);
				}
				if(this.goods == '') {
					Toast('请选择您要收藏的物品!');
					return;
				}
				
				this.axios.post(this.$httpConfig.cartAddCollection, qs.stringify({
					goods: this.delRemove.join(','),
				})).then((res) => {
					if(res.data.status == 10001) {
						this.$router.push('/LogIn');
					} else {
						Toast({
							message: res.data.message
						});
						if(res.data.status == 1) {
							var allGoods = this.$store.state.cart_data;
							for(var i in this.goods){
								for(var j in allGoods){
									if(this.goods[i].store_id == allGoods[j].store_id){
										for(var k in allGoods[j].goods){
											if(allGoods[j].goods[k].id == this.goods[i].id){
												this.$store.state.cart_data[j].goods.splice(k,1);
												if(this.$store.state.cart_data[j].goods.length == 0){
													this.$store.state.cart_data.splice(k,1);
												}
												if(this.$store.state.cart_data.length == 0){
													this.$store.state.cart_data = [];
												}
											}

										}
									}
								}
							}
						}
					}
				}).catch((err) => {
					console.log(err);
				})
			}
		},
		components: {
			hotGoods,
			Shopsn,
			cartPackage,
            toTop
		},
		watch: {
			cart_click(){
				this.flag = false;
				this.total.seleNumber = 0;
				this.price = 0;
				this.goods = [];
				}
		},

		destroyed() {
			this.scrollWatch = false;
		}

	}
</script>
<style scoped>
.package{
	background-color: #F1F1F1;
}
.clearfix1{
	background: #f1f1f1!important;
}
.title1{
	color: #444;
	font-size: .2rem;
	padding: .2rem 1rem;
	height: .3rem;
	line-height: .3rem;
	position: relative;
}
.checkBox1{
	top: none!important;
	height: .7rem!important;
}

</style>

<style lang="less" scoped>
	.goos {
		background: #f1f1f1;
		.nav{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			height: .9rem;
			li{
				width: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 14px;
			}
			li.active{
				color: #D19E29;
				border-bottom: .03rem solid #D19E29;
			}
		}
		.footer-wrap {
			position: absolute;
			z-index: 9999;
			.seat {
				height: 1rem;
			}
			.footer {
				position: fixed;
				left: 0;
				bottom: 1rem;
				width: 7.4rem;
				padding-left: .1rem;
				height: 1rem;
				background: #fff;
				.chicked.active {
					color: #D19E29;
					span {
						border: none;
						width: .44rem;
						height: .44rem;
						background: url(../../assets/check_bj.png) no-repeat;
						background-size: 100% 100%;
					}
				}
				.share {
					width: 1.83rem;
					height: 1rem;
					line-height: 1rem;
					color: #fff;
					text-align: center;
					font-size: .36rem;
					background: #ff7200;
				}
				.immig {
					width: 2.72rem;
					height: 1rem;
					line-height: 1rem;
					background: #D19E29;
					color: #fff;
					text-align: center;
					font-size: .36rem;
				}
				.set-btn {
					width: 2rem;
					color: #fff;
					height: 100%;
					border: none;
					text-align: center;
					line-height: 1rem;
					background: #D19E29;
					font-size: .36rem;
				}
				.total {
					padding: .2rem .1rem;
					float: right;
					.total-metre {
						padding-top: .1rem;
						.title {
							font-size: .3rem;
							color: #757575;
							padding: 0!important;
						}
						.con {
							font-size: .3rem;
							color: #ff7200;
							span {
								font-size: .36rem;
								font-weight: bold;
							}
						}
					}
					.total-price {
						font-size: .18rem;
						color: #999;
						float: right;
					}
				}
				.chicked {
					position: relative;
					padding-left: .55rem;
					line-height: 1rem;
					font-size: .28rem;
					color: #999;
					span {
						position: absolute;
						top: 50%;
						left: 0;
						width: .4rem;
						height: .4rem;
						border: 1px solid #8d8d8d;
						border-radius: 100%;
						margin-top: -.2rem;
						text-align: center;
						line-height: .4rem;
						color: #f9781e;
					}
				}
			}
		}
		.interested {
			.title {
				margin-top: .5rem;
				text-align: center;
				position: relative;
				font-size: .28rem;
				line-height: .8rem;
				height: .8rem;
				color: #666;
				span {
					position: absolute;
					top: 50%;
					width: 2.3rem;
					height: 1px;
					background: #cdcdcd;
				}
				span:nth-child(1) {
					left: 0;
				}
				span:nth-child(2) {
					right: 0;
				}
			}
			.content-main {
				background: #f1f1f1;
				li {
					width: 3.7rem;
					height: 4.96rem;
					background: #fff;
					margin-bottom: .1rem;
					margin-right: .08rem;
					img {
						width: 3.7rem;
						height: 3.7rem;
					}
					.desi {
						font-size: .3rem;
						color: #333;
						padding: .2rem .2rem;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.price {
						padding-left: .2rem;
						color: #e02828;
						font-size: .3rem;
						span {
							font-size: .36rem;
						}
					}
				}
				li:nth-child(2n) {
					margin-right: 0;
				}
			}
		}
		.cart-active {
			padding-top: 1rem;
			img {
				width: 3.07rem;
				width: 2.74rem;
			}
			.text {
				font-size: .32rem;
				color: #666;
				padding-top: .4rem;
				a {
					font-size: .32rem;
					color: #C32E27;
					border-bottom: 1px solid #C32E27;
					;
					padding-bottom: .02rem;
				}
			}
		}
	}
	
	.cart-header {
		width: 100%;
		height: .62rem;
		background: #D19E29;
		padding: .16rem 0;
		overflow: hidden;
		text-align: center;
		position: relative;
		color: #fff;
		font-size: .36rem;
		line-height: .62rem;
		span {
			position: absolute;
			top: 50%;
			right: .4rem;
			margin: -.23rem;
			width: .47rem;
			height: .46rem;
			background: url(../../assets/news1.png) no-repeat;
			background-size: 100% 100%;
		}
	}
	
	.mark-wrap {
		margin-bottom: .2rem;
		dt {
			box-sizing: border-box;
			width: 100%;
			height: .9rem;
			line-height: .9rem;
			text-align: center;
			font-size: .32rem;
			color: #D19E29;
			background: #fff;
			border-bottom: 1px solid #dfdfdd;
			position: relative;
			.all {
				position: absolute;
				top: 50%;
				right: 82.5%;
				display: inline-block;
				font-size: .32rem;
				z-index: 0;
			}
			a{
				font-size: .32rem;
				color: #D19E29;
			}
			.allColor {
				color: #D19E29;
			}
			span {
				position: absolute;
				right: .2rem;
				top: 50%;
				height: .31rem;
				margin-top: -.155rem;
				color: #999;
				line-height: .31rem;
				z-index: 2;
				i {
					font-style: normal;
					font-size: .24rem;
					padding-right: .2rem;
				}
				em {
					width: .32rem;
					height: .31rem;
					background: url(../../assets/edit.jpg) no-repeat;
					background-size: 100% 100%;
				}
			}
		}
		dd.active {
			background: #fafafa;
		}
		dd {
			background: #fff;
			padding: .25rem 0;
			border-bottom: 1px solid #dfdfdd;
			padding-left: .7rem;
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
			.input-wrap {
				margin-right: 1.2rem;
				input[type=number] {
					border: none;
					width: 1.8rem;
					text-align: center;
					font-size: .36rem;
					color: #333;
					background: #fafafa;
					outline: none;
				}
				button {
					border: none;
					background: none;
					color: #999;
					outline: none;
					width: .8rem;
					text-align: center;
					font-size: .5rem;
				}
			}
			.pull-right {
				padding-left: .2rem;
				.text {
					width: 4.6rem;
					height: .65rem;
					font-size: .24rem;
					color: #454545;
					line-height: .32rem;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
				.price-wrap {
					padding-top: .4rem;
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
		.checkBox.active {
			span {
				border: none;
				width: .44rem;
				height: .44rem;
				background: url(../../assets/check_bj.png) no-repeat;
				background-size: 100% 100%;
			}
		}
		.checkBox {
			position: absolute;
			left: .1rem;
			top: 0;
			width: .7rem;
			height: 100%;
			z-index: 1;
			span {
				position: absolute;
				top: 50%;
				left: 0;
				margin-top: -.2rem;
				width: .4rem;
				height: .4rem;
				border: 1px solid #8d8d8d;
				border-radius: 50%;
				text-align: center;
				line-height: .4rem;
				font-size: .3rem;
				color: #f9781e;
			}
		}
	}
	
	.mint-popup {
		width: 5rem;
		height: 3rem;
		border-radius: 3px;
		p {
			font-size: 0.3rem;
			text-align: center;
			color: #333;
			line-height: 1.8rem;
			padding-bottom: 0.2rem;
		}
		span {
			font-size: 0.28rem;
			padding-left: 20%;
			color: #333;
			float: left;
		}
		span:nth-of-type(2) {
			float: right;
			padding-right: 20%;
			color: #1CACEB;
			padding-left: 0.4rem;
		}
	}
</style>