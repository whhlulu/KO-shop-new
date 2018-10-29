<template>
	<div class="home" ref="home">
		<div v-title data-title="主页">主页</div>
		<home-header :userName="getData"></home-header>
		<mt-swipe :auto="3000">
			<mt-swipe-item v-for="item in this.$store.state.home_data.banner" :key="item.id">
			<img class="home-banner-img" :src="URL + item.pic_url"  @click="goAd(item.ad_link)" />

			</mt-swipe-item>
		</mt-swipe>
		<!-- 快捷链接加快讯 -->
		<news-flash :nav="$store.state.home_data.nav" :data="$store.state.home_data.announcement" @hit='hit'></news-flash>
		<!-- 店铺街 -->
		<!--<limited-hd :text="$store.state.home_data.recommendGoods"></limited-hd>-->
		<ul class="floor">
			<li class="floor-item" v-for="(item,index) in floorList" :key="index">
				<div class="top">
					<div class="title fl">{{item.class.class_name}}</div>
					<span @click="more(item)" class="more fr">更多
    					<em><i></i><b></b></em>    					
    				</span>
				</div>
				<div class="image-ad" @click="goAd(adList[index].ad_link)">
					<img v-if="adList[index]"  :src="URL+adList[index].pic_url" />
				</div>
				<div class="goods-box">
					<div v-show="item.goods" :key="ing" class="floor-goods" v-for="(i,ing) in item.goods" @click="enterDetail(i)">
						<img v-lazy="URL+i.pic_url" />
						<p class="title">{{i.title}}</p>
						<p class="price">￥{{i.price}}</p>
					</div>
				</div>
			</li>
		</ul>
		<span class="isEnd" v-if="isEnd">加载完毕</span>
		<span v-else v-loading="floorLoading" element-loading-text="拼命加载中..." element-loading-spinner="el-icon-loading" class="isEnd" ></span>
		<!--<Shopsn></Shopsn>-->
		<div class="load-wrap" v-show="$store.state.load_wrap" @touchmove.prevent>
			<mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner>
		</div>
		<to-Top></to-Top>
	</div>
</template>
<script>
	import HomeHeader from './children/header.vue'; //头部内容
	import NewsFlash from './children/newsFlash'; //快捷链接加快讯
	import limitedHd from './children/conHeader'; // 内容头
	import hotGoods from './children/hotGoods'; // 内容列表
	import Shopsn from '@/components/page/Shopsn.vue'; //列表底部内容
	import limitedActivity from './children/limitedActivity';
	import limitedDd from '@/components/Widget/moveCon';
	import brandMus from './children/BrandMus';
	import lateMall from './children/lateMall';
	import mallCon from '@/components/Widget/mallCon';
	import toTop from '@/components/page/toTop'; //回到顶部
	import { Indicator,Toast} from 'mint-ui';
	import QS from 'qs';
	export default {
		name: 'home',
		data() {
			return {
				continuous: true,
				defaultIndex: 0,
				showIndicators: true,
				prevent: true,
				stopPropagation: true,
				data: '',
				getData: '',
				newsData: null,
				endtime: '',
				//text:['店铺街','烧造工艺','皇家御饮','滋补养身','御贡膳品','珠宝玉器','红木家具'],
				promotions: '',
				currentPage:1,
				floorList:[],
				isBottom:false,
				adList:[],
				isEnd:false,
				floorLoading:false,
				isRepeat:false
			}
		},
		created() {
			var userName = this.$route.params.userName;
			this.getData = userName;
			this.axios({
				url: this.$httpConfig.home,
				method: 'post'
			}).then((res) => {
				var json_wx = JSON.parse(res.request.response);
				if(json_wx.status == 999) {
					window.location.href = json_wx.msg;
					return;
				}
				this.$store.state.home_data = res.data.data;
			}).catch((err) => {
				console.log(err)
			});
		},
		mounted(){
			$('html,body').animate({scrollTop: '0px'}, 300);
			this.getFloor();
			var that = this;
			setTimeout(that.getFloor,800);//首次进入时请求两次，防止iPhoneX不能铺满屏
			$(window).scroll(function () {
				if(!that.$refs.home)return;
				var bot = 700;
				if ($(".floor").length) {		        	
					if (that.isBottom == false && (bot + $(window).scrollTop()) >= (310+$(".floor")[0].clientHeight)) {  
						that.isBottom = true;
						if (!this.isEnd) {
							that.getFloor();
						}
					}
				}
			});			
		},
		methods: {
			goAd(address){
				location.href = address;
			},
			getFloor(){
				if(this.isRepeat && this.currentPage == 1){
					return false;
				}else{
					if(this.currentPage == 1){
						this.isRepeat = true;
					}
					this.floorLoading = true;
					var params = {page:this.currentPage};
					this.$HTTP(this.$httpConfig.indexFloor,params,'post').then((res)=>{ 

					// })
					// this.axios.post(this.$httpConfig.indexFloor,QS.stringify({
					// 	page:this.currentPage
					// })).then((res)=>{
						if (res.data.status==1) {							
							this.floorList.push(res.data.data);
							this.currentPage++;
							this.isBottom = false;
							this.isEnd = false;
							this.getAd();
						}else{
							this.isEnd = true;
						}
					}).catch((err)=>{
						Toast(err);
					});
				}
				// var names = [];
				// for(var i in this.floorList){
				// 	names.push(this.floorList[i].class.class_name);
				// }
			},
			getAd(){
				this.axios.post(this.$httpConfig.getAd,QS.stringify({
					page:this.currentPage-1
				})).then((res)=>{
					this.adList.push(res.data.data);
					this.floorLoading = true;
				})
			},
			more(goods){
				this.$router.push({
					name:'listHomeMore',
					params:{
						status:goods.class.id
					}
				})
			},
			hit(id) {
				this.$router.push({
					name: 'noticeChild',
					params: {
						id: id
					}
				})
			},
			enterDetail(goods){
				this.$router.push({
					name:'product',
					params:{
						id:goods.id,
						status:1
					}
				})
			}
		},
		destroyed() {
		},
		updated() {
			var that = this;
			setTimeout(function() {
				that.$store.state.load_wrap = false;
			}, 1000);
		},
		components: {
			HomeHeader,
			NewsFlash,
			limitedActivity,
			hotGoods,
			Shopsn,
			limitedDd,
			limitedHd,
			brandMus,
			lateMall,
			mallCon,
			toTop
		}
	}
</script>
<style>
.home-banner-img{
	background-size: 100%;
}
.el-loading-spinner i{
	color: #999!important;
}
.el-loading-spinner .el-loading-text{
	color: #999!important;
}
.el-loading-mask{
	background: none;
	color: #999!important;
}
</style>

<style lang="less" scoped>
	.home {
		.to-top{
			position: fixed;
			width: .75rem;
			height: .75rem;
			bottom: 1.6rem;
			right: .2rem;
		}
		.mint-swipe-indicators {
			width: 100%;
			text-align: center;
		}
		.floor {
			background-color: #F2F1F2;
			box-sizing: border-box;
			.floor-item {
				background-color: #F2F1F2;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				.top {
					background-color: #F2F1F2;
					width: 100%;
					padding: .2rem;
					overflow: hidden;
					.title {
						border-left: 3px solid #E8C441;
						padding-left: .2rem;
						font-size: .32rem;
						color: #111111;
					}
					.more {
						line-height: .4rem;
						color: #999;
						font-size: .28rem;
						position: relative;
						padding-right: .2rem;
						em {
							position: absolute;
							right: 0;
							top: .07rem;
							i {
								border-left: 6px solid #ccc;
								border-top: 6px solid transparent;
								border-bottom: 6px solid transparent;
								position: absolute;
								right: -0.04rem;
								top: 0;
							}
							b {
								border-left: 6px solid #f2f2f2;
								border-top: 6px solid transparent;
								border-bottom: 6px solid transparent;
								position: absolute;
								right: 0;
								top: 0;
							}
						}
					}
				}
				.image-ad{
					width: 7.45rem;
					height: 3.5rem;
					border: 1px solid #eee;					
					img{
						width: 7.45rem;
						height: 3.5rem;
						border: none;
					}
				}
				.goods-box{
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: space-between;
					.floor-goods {
						margin-top: 2%;
						background-color: #fff;
						width: 49%;
						float: left;
						// border: 3px solid #F2F1F2;
						box-sizing: border-box;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						img {
							width: 100%;
							height: 3.5rem;
							align-self: center;
							border-bottom: .5px solid #F2F1F2;
						}
						.title {
							display: -webkit-box;
							overflow: hidden;
							white-space: normal!important;
							text-overflow: ellipsis;
							word-wrap: break-word;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
							color: #343434;
							height: 40px;
							line-height: 20px;
							text-align: left;
							padding: 0 .2rem;
							font-size: 14px
						}
						.price {
							color: #DA3632;
							font-size: 17px;
							font-weight: bold;
							text-align: left;
							padding: 0 .2rem;
							height: 30px;
							line-height: 25px;
						}
					}
				}
			}
		}
		.isEnd{
			display: flex;
			width: 100%;
			justify-content: center;
			height: 50px;
			align-items: center;
			color: #999;
		}
	}
</style>
<style lang="less" scoped>
	.home {
		.mint-swipe {
			width: 100%;
			height: 3.28rem;
			img {
				width: 100%;
				height: 100%;
			}
			.mint-swipe-indicators {
				.mint-swipe-indicator {
					width: 20px;
					height: 20px;
				}
			}
		}
		.entranch-main {
			width: 100%;
			height: 2rem;
		}
		.home-banner {
			padding: .2rem;
			img {
				width: 100%;
			}
		}
		.banner {
			img {
				width: 100%;
			}
		}
		.banner-3 {
			img {
				width: 7.5rem;
				height: 3.75rem;
			}
		}
		.limit-banner {
			padding: .2rem;
			img {
				width: 7.1rem;
				height: 1.66rem;
				border-radius: 5px;
			}
		}
	}
</style>