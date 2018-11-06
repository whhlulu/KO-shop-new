<template>
	<div  ref="collect_list">
		<div v-title :data-title="title">{{title}}</div>
		<coll-header :text="title" :search="search" @activeCli='activeCli'></coll-header>
			<!--<nav class="text-center">
			<div :style="{width:(data.classname.length + 1) * 1.8 +'rem'}" v-if="data.classname" class="clearfix">
				<span class="fl" @click="refresh(-1)" :class="{active:sta == -1}" >全部宝贝</span>
				<span class="fl" :class="{active:sta == index}" v-for="(item,index) in data.classname" :key="item.id" @click="refresh(index)">{{item.class_name}}</span>
			</div>
		</nav>-->
		<div class="content-wrap">
			<h2 class="title">最近1个月收藏</h2>
			<div class="con" v-show="goods">
				<div class="item-list-wrap">
					<div class="clearfix" v-if="data.data == ''">暂时没有收藏</div>
					<div v-else v-for="(item,index) in data" :key="index" class="clearfix" @click="enterDetail(item.goods_id)">
						<transition name="move">
							<div class="item-list" @touchmove="move($event,index)" @touchstart="moveEv($event)" :class="{active:status == index}">
								<img :src="URL + item.puc_url" class="fl" >
								<div class="item fl">
									<div class="text text2-hidden">{{item.title}}</div>
									<div class="price">￥{{item.price_member}}</div>
								</div>
								<div class="btn text-center" @click="cancel(item,index)">取消收藏</div>
							</div>
						</transition>
					</div>
				</div>
			</div>
			<div class="con" v-show="shop">
				<div class="item-list-wrap item-list-shop">
					<div v-for="(item,index) in shopData" :key="index" class="clearfix">
						<transition name="move">
							<div class="item-list" @touchmove="move($event,index)" @touchstart="moveEv($event)" :class="{active:status == index}">
								<img :src="URL + item.store_logo" class="fl" @click="collectEnterProduct(index,item)">
								<!--<img :src="URL + item.store_logo"/>-->
								<div class="item fl" @click="collectEnterProduct(index,item)">
									<div class="text text2-hidden">{{item.shop_name}}</div>
								</div>
								<div class="btn text-center" @click="del(item,index)">取消关注</div>
							</div>
						</transition>
					</div>
				</div>
			</div>
		</div>
		<Shopsn></Shopsn>
		<div class="load" v-show="load" @touchmove.prevent>
			<mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner>
		</div>
		<div class="load-wrap" v-show="load_wrap" @touchmove.prevent>
			<mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner>
		</div>
        <to-top></to-top>
	</div>
</template>
<script>
	import qs from 'qs';
	import collHeader from '@/components/page/children/headertab.vue';
	import Shopsn from '@/components/page/Shopsn.vue';
	import { MessageBox, Toast } from 'mint-ui';
    import toTop from '@/components/page/toTop.vue';
	export default {
		name: 'myCollection',
		data() {
			return {
				title: '我的收藏',
				search: false,
				loading: false,
				data: [],
				shopData: [],
				status: null,
				sta: -1,
				load_wrap: true,
				load: false,
				goods: true,
				shop: false,
				isactive: '',
				slide_switch: false, //避免多次下拉
				load_show: true, //滚动动画
				roll_switch: true, //触发下拉加载开关
				no_data: false, //第一次没数据时的样式
				sliding_no_data: false, //下拉没数据时的样式
				page: 1,
			}
		},
		components: {
			collHeader,
			Shopsn,
            toTop
		},
		mounted() {
			this.load_wrap = false;
            this.getList();

            let _this = this;
            window.addEventListener('scroll', function () {
                if (!_this.$refs.integral_order_list) return;
                if (document.body.scrollTop + window.innerHeight >= document.body.offsetHeight) {
                    //如果第一次请求没数据或数据没达到每页个数就不会再请求数据
                    if (_this.roll_switch == false) {
                        return;
                    }
                    if (_this.slide_switch == true) {
                        _this.slide_switch = false;
                        _this.page++;
                        _this.getList();
                        _this.shoplist();
                    }
                }
            })
		},
		methods: {
			enterDetail(id) {
				this.$router.push({
					name: "product",
					params: {
						id: id,
						status: 1
					}
				})
			},
			collectEnterProduct(index, item) {
				this.$router.push({
					name: "shopHome",
					params: {
						id: item.store_id,
						index:0
					}
				})
			},
			moveEv(ev) {
				this.startX = ev.touches[0].pageX;
				this.startY = ev.touches[0].pageY;
			},
			move(ev, index) {
				//返回角度
				function GetSlideAngle(dx, dy) {
					return Math.atan2(dy, dx) * 180 / Math.PI;
				}
				//根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
				function GetSlideDirection(startX, startY, endX, endY) {
					var dy = startY - endY;
					var dx = endX - startX;
					var result = 0;
					//如果滑动距离太短
					if(Math.abs(dx) < 2 && Math.abs(dy) < 2) {
						return result;
					}
					var angle = GetSlideAngle(dx, dy);

					if(angle >= -45 && angle < 45) {
						result = 4;
					} else if(angle >= 45 && angle < 135) {
						result = 1;
					} else if(angle >= -135 && angle < -45) {
						result = 2;
					} else if((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
						result = 3;
					}
					return result;
				}
				this.endX = ev.changedTouches[0].pageX;
				this.endY = ev.changedTouches[0].pageY;

				var direction = GetSlideDirection(this.startX, this.startY, this.endX, this.endY);
				if(direction == 3) {
					this.status = index;
					return;
				} else {
					this.status = null;
				}
			},
			// 收藏商品列表
			getList() {
				this.axios({
					url: this.$httpConfig.myCollection,
					method: 'get',
					params: {
						page:this.page
					}
				}).then((res) => {
					if(res.data.status == 10001) {
						this.$router.push('/LogIn');
					} else {
                    	this.stateHandling(res.data.status, res.data.data.goods,1);
						this.load = false;
						this.load_wrap = false;
					}
				}).catch((err) => {
					console.log(err);
				});

			},
            //请求成功后的操作
            returnOperation(data,type) {
                if (data.length < 10 && this.page == 1) { //第一次请求成功如果数据没达到每页页数就禁止下拉
                    this.load_show = false; //动画隐藏
                    this.roll_switch = false; //禁止下拉加载
				}
				if(type == 1){
					for (let index = 0; index < data.length; index++) {
						this.data.push(data[index]);
					}
				}else{
					for (let index = 0; index < data.length; index++) {
						this.shopData.push(data[index]);
					}
				}
                this.slide_switch = true;
            },
            //请求后返回不同状态时的处理
            stateHandling(status, data,type) {
                this.sw = true;
                if (status == 10001) {
                    this.$router.push('/LogIn');
                } else if (status == 1) { //成功后的处理
                    this.returnOperation(data,type);
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
			// 关注店铺列表
			shoplist() {
				this.axios.post(this.$httpConfig.collectShops).then((res) => {
                    this.stateHandling(res.data.status, res.data.data.goods,2);
					this.load = false;
					this.load_wrap = false;
					//                  window.history.go(0)
				}).catch((err) => {
					console.log(err);
				});
			},
			// 取消关注
			del(item, index) {
				MessageBox.confirm('确定执行此操作?').then(action => {
					this.axios.post(this.$httpConfig.cancelAttenStore, qs.stringify({
						store_id: item.store_id,
					})).then((res) => {
						this.shopData.splice(index, 1);
						this.status = null;
						Toast({
							message: res.data.msg,
							position: 'bottom'
						});
					}).catch((err) => {
						console.log(err);
					});
				}).catch((err) => {
					console.log(err);
				});
			},
			cancel(item, index) {
				var that = this;
				event.stopPropagation();
				MessageBox.confirm('确定执行此操作?').then(action => {
					this.axios.post(this.$httpConfig.cancelCollectionGood, qs.stringify({
						id: item.id,
					})).then((res) => {
						that.data.splice(index, 1)
						that.status = null;
						Toast({
							message: res.data.msg,
							position: 'bottom'
						});
					}).catch((err) => {
						console.log(err);
					});
				}).catch((err) => {
					console.log(err);
				});
			},
			activeCli(index) {
				if(index == 0) {
					this.data = [];
					this.getList();
					this.goods = true;
					this.shop = false
				} else {
					this.shopData = [];
					this.shoplist();
					this.shop = true;
					this.goods = false;
				}
			}
		},
		updated() {
			var that = this;
			setTimeout(function() {
				that.load_wrap = false;
			}, 1000);
		},
	}
</script>
<style lang="less" scoped>
	nav {
		padding: .2rem;
		height: .54rem;
		background: #fff;
		overflow-x: auto;
		span {
			height: 100%;
			background: #eee;
			line-height: .54rem;
			color: #666;
			font-size: .24rem;
			width: 1.6rem;
			margin-right: .2rem;
			border-radius: 5px;
		}
		span:active,
		span.active {
			border: 1px solid #D19E29;
			background-color: #fff;
			box-sizing: border-box;
		}
		span:last-child {
			margin: 0;
		}
	}
	
	.content-wrap {
		.title {
			height: .73rem;
			line-height: .73rem;
			text-indent: .2rem;
			font-size: .26rem;
			color: #666;
		}
		.con {
			.item-list-shop{
				.item-list{
					height: 1.5rem!important;
					line-height: 1.5rem!important;
					.btn{
						background: url(../../assets/bg2.png) no-repeat #D19E29 center .3rem!important;
						background-size: .58rem .57rem!important;
						padding-top: .4rem!important;
					}
					img{
						width: 1rem!important;
						height: 1rem!important;
					}
					.item{
						height: 1rem!important;
						.text{
							height: 1rem!important;
							line-height: 1rem!important;
						}
					}
				}
			}
			.item-list-wrap {
				overflow: hidden;
				.item-list.active {
					transform: translate(-1.38rem);
				}
				.item-list {
					width: 7.5rem;
					height: 2rem;
					padding: .2rem;
					background: #fff;
					position: relative;
					box-sizing: border-box;
					border-bottom: 1px solid #cbcbcb;
					.btn {
						width: 1.38rem;
						height: 100%;
						position: absolute;
						right: -1.38rem;
						top: 0;
						background: url(../../assets/bg2.png) no-repeat #D19E29 center .5rem;
						background-size: .58rem .57rem;
						color: #fff;
						font-size: .24rem;
						box-sizing: border-box;
						padding-top: 1.3rem;
					}
					img {
						width: 1.5rem;
						height: 1.5rem;
					}
					.item {
						width: 4.7rem;
						height: 2rem;
						box-sizing: border-box;
						margin-left: .13rem;
						.text {
							font-size: .32rem;
							height: .8rem;
							color: #333;
							line-height: .42rem;
						}
						.price {
							padding-top: .1rem;
							font-size: .32rem;
							color: #D19E29;
							span {
								font-size: .4rem;
							}
						}
						.status {
							span {
								font-size: .24rem;
								color: #bbb;
								line-height: .7rem;
							}
						}
					}
				}
			}
		}
	}
</style>