<template>
	<div class="product">
		<div v-title data-title="商品详情">商品详情</div>
		<pr-header :text="title"></pr-header>
		<mt-swipe :auto="0">
			<mt-swipe-item v-for="item in images" :key="item.id">
				<img :src="URL + item.pic_url">
			</mt-swipe-item>
		</mt-swipe>
		<!--{{$store.state.commodity_data.images}}-->
		<div class="describe" v-if="$store.state.commodity_data">
			<p class="fn">{{$store.state.commodity_data.title}}</p>
			<p class="timer">
				{{cut_time}}<b class="gray">，以后购买</b>
			</p>
			<div class="price active">
				<p class="orc clearfix">
					<em class="icon fl"></em>
					<em class="fl">{{$store.state.commodity_data.integral}}</em>
				</p>
				<p class="new clearfix">还需支付{{$store.state.commodity_data.money}}元</p>
				<p class="new">市场参考价：<s>{{$store.state.commodity_data.price}}</s>元</p>
			</div>
		</div>
		<!-- 已选 -->
		<div class="selected" @click="theSon">已选
			<span class="number">数量{{$store.state.commodity_val}}</span>
			<span v-if="item" v-for="(item, index) in $store.state.guigeidname" :key="index" class="number">{{$store.state.guigeName[index]}}&nbsp;{{item}}</span>
			<span class="btn-right"></span>
		</div>
		<div class="fenge"></div>
		
		<div class="prompt" @click="toTab">点击查看更多商品信息</div>
		<detail-option v-if='guige' :data="$store.state.commodity_data"></detail-option>
		<Shopsn></Shopsn>
		<foot-btn :state="sonState" :Number="$store.state.commodity_val" :data="$store.state.commodity_data" @reduce="reduce" @plus="plus" :money='this.$route.params.money'></foot-btn>
		<div class="load-wrap" v-show="load_wrap" @touchmove.prevent>
			<mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner>
		</div>
	</div>
</template>
<script>
	import PrHeader from '@/components/page/children/shop_header.vue'; // 头部
	import prList from '@/components/page/children/list.vue'; //猜你喜欢和搭配套餐
	import FootBtn from '@/components/IntegralMall/children/footBtn.vue'; // 底部按钮
	import PageOption from '@/components/page/children/pageOption.vue';
	import shopInfor from '@/components/page/children/shopInfor.vue'; // 店铺信息
	import detailOption from '@/components/page/children/detailOptions.vue'; // 立即购买 || 加入购物车 弹框
	import Shopsn from '@/components/page/Shopsn.vue';
	import qs from 'qs';
	import { Popup } from 'mint-ui';	

	export default {
		name: 'integralDetail',
		data() {
			return {
				//是否显示状态条
				showIndicators: true,
				//初始轮播切换索引
				defaultIndex: 0,
				//轮播是否循环播放
				continuous: true,
				number: 1,
				conItem: {
					title: '猜你喜欢'
				},
				conItemRe: {
					title: '搭配套餐推荐'
				},
				scrollWatch: true,
				topStatus: '',
				loadTop: {},
				sonState: false,
				data: '',
				title: '积分商品详情',
				dataLeave: '',
				load_wrap: true,
				link_id: this.$route.params.id,
				guige: false,
				shopData: '',
				popupVisible: false,
				nowday: 0,
				endday: '',
				end: '',
				brand: '',
				goods_id:'',
				start_time:'',
				finish: false,
				images: [],
				cut_time: "",
			}
		},
		created() {
		},
		methods: {
			countDowns() {
				this.finish = true
			},
			toTab() {
				this.$router.push({
					name: 'integralTab',
					params: {
						id: this.goods_id
					}
				});
			},
			theSon() {
				this.guige = true;
				this.$store.state.const_join = true;
			},
			myLove() {},
			//属性
			spec() {},
			matchGood(id) {},
			shopInfo() {
				this.axios({
					url: this.$httpConfig.shopInfo,
					method: 'get',
					params: {
						id: this.$store.state.commodity_data.store_id
					}
				}).then((res) => {
					this.shopData = res.data.data;
				}).catch((err) => {
					console.log(err);
				});
			},
			//商品详情
			ax() {},
			reduce() {
				if(this.number <= 1) return;
				this.number--;
			},
			plus() {
				if(this.number >= this.data.minStock)
					return;
				this.number++;
			},
			off() {
				this.popupVisible = false
			},
			countDownE_cb() {

			},
			countDownS_cb() {

			},

			//带天数的倒计时
			cutDown(times) {
				var day = 0,
					hour = 0,
					minute = 0,
					second = 0;//时间默认值
				if (times > 0) {
					day = parseInt(times / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
					hour = parseInt(times / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
					minute = parseInt(times / 1000 / 60 % 60, 10);//计算剩余的分钟
					second = parseInt(times / 1000 % 60, 10);//计算剩余的秒数
				} else {
					return  "00天: 00小时： 00分钟：00秒";
				}
				if (day <= 9) day = '0' + day;
				if (hour <= 9) hour = '0' + hour;
				if (minute <= 9) minute = '0' + minute;
				if (second <= 9) second = '0' + second;
				return day + "天:" + hour + "小时：" + minute + "分钟：" + second + "秒";
		},
	},
	mounted() {
		$('html,body').animate({
			scrollTop: '0px'
		}, 500);
		
		this.axios.post(this.$httpConfig.integralGoodInfo, qs.stringify({
			id: this.$route.params.id
		})).then((res) => {
			if(res.data.status == 10001) {
				this.$router.push('/LogIn');
			} else {
				
				let goods = res.data.data.goods;

				this.$store.state.commodity_data = goods;
				this.goods_id = goods.goods_id;
				this.images = res.data.data.images;
				
				this.load_wrap = false;

				this.nowday = new Date().getTime();
				
				let date =  (goods.delayed) * 1000 ;
				
				let createTime = (goods.create_time) * 1000;

				this.start_time = date + createTime - this.nowday;

				this.cut_time = this.cutDown(this.start_time);
				let obj = this;
				
				let id = setInterval(function() {
					obj.start_time -= 1000;
					
					obj.cut_time = obj.cutDown(obj.start_time);
					
				}, 1000);

				if (this.start_time < 0) {
					clearInterval(id);
				}

				if (this.start_time > 0) {
					this.end = '活动尚未开始';
				}

			}
		}).catch((err) => {
			console.log(err);
		});
		
	},
	destroyed() {
		this.scrollWatch = false;
	},
	components: {
		PrHeader,
		Shopsn,
		prList,
		FootBtn,
		shopInfor,
		PageOption,
		detailOption
	}
}
</script>
<style lang="less" scoped>
	.Promotions {
		display: flex;
		padding: 15/100rem 20/100rem;
		h4 {
			color: #A2A2A2;
			font-size: 32/100rem;
			margin-right: 20/100rem;
		}
		.promotionsDiv {
			display: flex;
			padding: 10/100rem;
			align-items: center;
			span {
				padding: 8/100rem;
				color: #E2252B;
				border: 1/100rem solid #E2252B;
				font-size: 24/100rem;
				// width: 100/100rem ;
				height: 25/100rem;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			p {
				margin-left: 20/100rem;
				font-size: 24/100rem;
				color: #656565;
			}
		}
	}
	.gray {
		color: gray;
	}
	.fenge {
		height: 20/100rem;
		background-color: #F1F1F1;
	}
	
	.product {
		background: #fff;
	}
	
	.describe {
		padding: 0 .2rem .35rem .2rem;
		position: relative;
		background-color: #F1F1F1;
		.fn {
			font-size: .36rem;
			color: #333;
			padding-top: .3rem;
			line-height: .5rem;
			// 下面样式为限制显示2行
			display: -webkit-box;
			overflow: hidden;
			white-space: normal!important;
			text-overflow: ellipsis;
			word-wrap: break-word;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}
		.timer {
			font-size: .25rem;
			color: #e02828;
			padding: .3rem 0;
			.newPos {
				color: #F1302B;
			}
		}
		.price.active {
			.orc {
				line-height: .4rem;
				.icon {
					width: .4rem;
					height: .4rem;
					background: url(../../assets/integral.png) no-repeat;
					background-size: 100% 100%;
					margin-right: .2rem;
				}
			}
		}
		.price {
			padding-top: .2rem;
			.orc {
				color: #e02828;
				font-size: .32rem;
				em {
					font-style: normal;
					font-size: .48rem;
				}
			}
			.new {
				color: #757575;
				font-size: .25rem;
				padding-top: .2rem;
				s {
					font-size: .24rem;
				}
			}
		}
		.share {
			position: absolute;
			right: .2rem;
			top: .3rem;
			text-align: center;
			.icon {
				display: block;
				width: .39rem;
				height: .42rem;
				background: url(../../assets/share.png) no-repeat;
				background-size: 100% 100%;
			}
			p {
				font-size: .24rem;
				color: #555;
				line-height: .5rem;
			}
			ul {
				position: absolute;
				top: 45px;
				left: -225%;
				li {
					width: 0.4rem;
					height: 0.4rem;
					float: left;
					margin: 3px;
				}
				img {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	
	.selected {
		padding: 0 .5rem 0 .2rem;
		min-height: .8rem;
		line-height: .6rem;
		font-size: .3rem;
		color: #777;
		position: relative;
		background: #fff;
		border-top: 1px solid #f1f1f1;
		.number {
			font-size: .28rem;
			color: #333;
			padding-left: .55rem;
		}
		.btn-right {
			position: absolute;
			right: .3rem;
			top: 50%;
			margin-top: -.12rem;
			width: .14rem;
			height: .24rem;
			background: url(../../assets/btn-right.png) no-repeat;
			background-size: 100% 100%;
		}
	}
	
	.mint-swipe {
		height: 6.22rem;
		.mint-swipe-items-wrap {
			div {
				width: 100%;
				height: 6.22rem;
				img {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	
	.prompt {
		width: 100%;
		height: .9rem;
		background: #f1f1f1;
		line-height: .9rem;
		text-align: center;
		font-size: .26rem;
		color: #999;
	}
	
	#popup {
		width: 7rem;
		padding: 0.5rem 0.5rem 0.2rem;
		background: rgba(0, 0, 0, 0.5);
		ul {
			overflow: hidden;
			border-bottom: 1px solid #dfe3e4;
			background: #fff;
			border-radius: 0.6rem;
			padding: 0.2rem;
			li {
				float: left;
				margin: 0.1rem;
				width: 0.8rem;
				text-align: center;
			}
			img {
				width: 0.8rem;
				height: 0.8rem;
			}
		}
		button {
			display: block;
			width: 100%;
			text-align: center;
			margin-top: 0.2rem;
			background: #fff;
			line-height: 0.8rem;
			border-radius: 0.6rem;
			border: none;
		}
	}
</style>