<template>
	<div ref="search_list">
		<div v-title data-title="商品列表">商品列表</div>
		<list-header :sea="search" v-on:child-say="submit"></list-header>
		<!-- <div class="tabbaby">
            <div v-for="(item, index) in tabName" :key="index" @click="activeClick(index)" :class="{active:index == num}"> {{item}}</div>
        </div> -->
		<ul class="sort-wrap clearfix text-center">
			<li class="fl" :class="{active:sortField == 'sales_sum'}" @click="sort('xl')">销量
				<span class="icon">
					<em class="bottom" :class="{active:sort_id == 1}"></em><br>
					<em class="top" :class="{active:sort_id == 2}"></em>
				</span>
			</li>
			<li class="fl" :class="{active:sortField == 'price_member'}" @click="sort('jg')">价格
				<span class="icon">
					<em class="top" :class="{active:sort_id == 3}"></em><br>
					<em class="bottom" :class="{active:sort_id == 4}"></em>
				</span>
			</li>
			<li class="fl" @click="sort('rq')" :class="{active:sortField == 5}">人气</li>
			<li class="fl" @click="sort('dp')" :class="{active:sortField == 6}">店铺</li>
		</ul>
		<ul class="list-wrap" v-if="sortField != 6">
			<li class="clearfix" v-for="(item,index) in search_data" :key="index" @click="tolink(item.id)">
				<img v-lazy="URL + item.pic_url"  class="fl">
				<div class="list-text fl">
					<p class="text">{{item.title}}</p>
					<p class="new-price">￥
					<span>{{item.goods_price || item.price_market|| item.price_member}}</span>
					<p class="status"><span>已有{{item.comment_member}}条评论</span><span>{{item.sales_sum}}笔交易成功</span></p>
				</div>
			</li>
		</ul>
		<shop-list v-if="sortField == 6 && search_type != 'goods'" :shoplist="search_data"></shop-list>
		<div v-show="search_data.length ==0 && sortField != 6" class="comm-null">
			<div class="con-wrap text-center">
				<img src="../../assets/null_com.png">
				<p>暂无商品</p>
			</div>
		</div>
		<div v-show="search_type != 'store' && sortField == 6" class="comm-null">
			<div class="con-wrap text-center">
				<img src="../../assets/null_com.png">
				<p>没有搜索到店铺哦，请搜索商品看看~</p>
			</div>
		</div>
		<Shopsn></Shopsn>
		<to-top></to-top>
		<div class="load" v-show="load" @touchmove.prevent>
			<mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner>
		</div>

		<div class="load-wrap" v-show="load_wrap" @touchmove.prevent>
			<mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner>
		</div>
	</div>
</template>

<script>
	import listHeader from '@/components/page/children/header.vue';
	import shopList from '@/components/shopCon/child/shoplist.vue'; //店铺列表样式
	import qs from 'qs';
	import { Toast } from 'mint-ui';
	import toTop from '@/components/page/toTop.vue';
	import Shopsn from '@/components/page/Shopsn.vue';
	export default {
		name: 'list',
		data() {
			return {
				tabName: ["宝贝", "店铺"],
				logoImg: require('@/assets/btn-return.png'),
				status: [true, false, false],
				search: true,
				sort_id: 1,
				sort_status: null,
				load: false,
				scrollWatch: true,
				load_wrap: true,
				search_data: [],
				msg: '',
				api_url: '',
				num: 0,
				sortField: '',
				search_type:'goods',
				currentPage:1,
				isBottom:false,
				isEnd:false,
			}
		},
		created() {
			if(this.$route.params.status == 'search'){
				this.api_url =  this.$httpConfig.keyWordSearch;
			}else{
				this.api_url = this.$httpConfig.getAllGoods;
			}
			this.sort();
		},
		mounted(){
			var that = this;
			$(window).scroll(function () { 
                if(!that.$refs.search_list)return;
				var bot = document.body.clientHeight;
                if(that.isBottom == false && bot+$(window).scrollTop()>=$(".list-wrap")[0].clientHeight){
                    that.isBottom = true;
                    if (!this.isEnd) {
                        that.currentPage++;
                        that.sort();
                    }
                }
            });
		},
		methods: {
			submit(search_data) {
				this.search_data = search_data;
			},
			activeClick(index) {
				this.num = index
			},
			toback: function() {
				this.$router.go(-1);
			},
			addClass: function(index) {
				for(var i = 0; i < this.status.length; i++) {
					this.$set(this.status, i, false);
				}
				this.$set(this.status, index, true);
			},
			sort(index) {
				switch(index) {
					case 'xl':
						this.currentPage = 1;
						this.search_data = [];
						this.sortField = 'sales_sum';
						if(this.sort_id != 1) {
							this.sort_id = 1;
							this.sort_status = "asc";
						} else {
							this.sort_id = 2;
							this.sort_status = 'desc';
						}
						this.load = true;
						break;
					case 'jg':
						this.currentPage = 1;
						this.search_data = [];
						this.sortField = 'price_member';
						if(this.sort_id != 3) {
							this.sort_id = 3;
							this.sort_status = "asc";
						} else {
							this.sort_id = 4;
							this.sort_status = 'desc';
						}
						this.load = true;
						break;
					case 'rq':
						this.currentPage = 1;
						this.search_data = [];
						if(this.sortField == 5) return;
						this.sortField = 5;
						this.sort_status = '';
						this.load = true;
						break;
					case 'dp':
						this.currentPage = 1;
						this.search_data = [];
						if(this.sortField == 6) return;
						this.sortField = 6;
						break;
				}
				 if(this.$route.params.status == 'search') {
					this.axios.get(this.api_url, {
						params: {
							keyword: this.$route.params.id,
							sort: this.sort_id,
							page:this.currentPage
						}
					}).then((res) => {
						if(res.data.status){
							if(res.data.msg === '没有找到此商品') {
								this.load_wrap = false;
								this.msg = res.data.msg;
							}
							if(res.data.data.flag == 'store'){
								this.search_type = 'store';
								this.sort('dp');
							}else{
								this.search_type = 'goods';
							}
							var list = res.data.data.data;
							for(var i in list){
								this.search_data.push(list[i]);
							}
							this.isBottom = false;
							this.isEnd = false;
						}else{
							this.isEnd = true;
						}
							Toast(res.data.message)
							this.load = false;
							this.load_wrap = false;
					}).catch((err) => {
						console.info('FailtrueErr', err);
					});
				} else {
					//分类进来
					this.axios.get(this.api_url, {
						params: {
							page: this.currentPage,
							class_three: this.$route.params.status,
							sort_type: this.sort_status,
							sort_field: this.sortField
						}
					}).then((res) => {
						if(res.data.status != 1) {
							Toast({
								message: res.data.message,
								position: 'bottom',
								duration: 1000
							});
							this.load_wrap = false;
							this.msg = res.data.message;
						} else {
							var list = res.data.data.records;
							for(var i in list){
								this.search_data.push(list[i]);
							}
							this.load = false;
							this.load_wrap = false;
						}
					}).catch((err) => {
						console.log(err);
					});
				}
			},
			tolink(id) {
				this.$router.push({
					name: 'product',
					params: {
						id: id,
						status: 1
					}
				});
			},
		},
		components: {
			listHeader,
			Shopsn,
			toTop,
			shopList
		}
	}
</script>
<style lang="less" scoped>
	// tab切换
	.tabbaby {
		background: #fff;
		height: .85rem;
		display: flex;
		justify-content: space-between;
		border-bottom: 1/100rem solid #cbcbcb;
		div {
			font-size: 30/100rem;
			width: 275/100rem;
			height: 100%;
			box-sizing: border-box;
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 0 50/100rem;
		}
		.active {
			border-bottom: 3/100rem solid #D19E29;
			color: #D19E29;
		}
	}
	
	.comm-null {
		padding-top: .5rem;
		p {
			font-size: .28rem;
			color: #666;
			padding-top: .2rem;
		}
	}
	
	.sort-wrap {
		height: .9rem;
		background: #fff;
		box-sizing: border-box;
		padding: .2rem 0;
		border-bottom: 1px solid #cbcbcb;
		line-height: .5rem;
		li {
			border-right: 1px solid #cbcbcb;
			box-sizing: border-box;
			width: 25%;
			font-size: .26rem;
			color: #666;
			position: relative;
			.icon {
				position: absolute;
				left: 1.6rem;
				top: 0;
				height: 100%;
				.top {
					position: absolute;
					left: 0;
					top: .17rem;
					width: .12rem;
					height: .06rem;
					background: url(../../assets/sort-top.png);
					background-size: 100% 100%;
				}
				.top.active {
					background: url(../../assets/sort-top-active.png);
					background-size: 100% 100%;
				}
				.bottom {
					position: absolute;
					left: 0;
					bottom: .17rem;
					width: .12rem;
					height: .06rem;
					background: url(../../assets/sort-bottom.png);
					background-size: 100% 100%;
				}
				.bottom.active {
					background: url(../../assets/sort-bottom-active.png);
					background-size: 100% 100%;
				}
			}
		}
		li:nth-child(4) {
			border-right: 0;
		}
		li.active {
			color: #D19E29;
		}
	}
	
	.list-wrap {
		background: #fff;
		li {
			padding: .13rem;
			height: 2.2rem;
			border-bottom: 1px solid #cbcbcb;
			img {
				width: 2.2rem;
				height: 2.2rem;
			}
			.list-text {
				width: 4.3rem;
				padding-left: .25rem;
				.text {
					font-size: .32rem;
					color: #333;
					line-height: .45rem;
					padding-top: .1rem;
					height: .9rem;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
				}
				.new-price {
					font-size: .32rem;
					color: #f23030;
					padding-top: .3rem;
					span {
						font-size: .4rem;
						font-weight: bold;
					}
				}
				.status {
					color: #ddd;
					padding-top: .1rem;
					span {
						font-size: .24rem;
					}
					span:nth-child(2) {
						padding-left: .3rem;
					}
				}
			}
		}
	}
	
	.status {
		background: #fff;
		text-align: center;
		padding-bottom: .2rem;
		font-size: .3rem;
		color: #333;
	}
</style>
<style lang="less">
	.load {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 999999;
	}
	
	.load .mint-spinner-triple-bounce {
		width: 100%;
		text-align: center;
		position: absolute;
		left: 0;
		top: 50%;
	}
</style>