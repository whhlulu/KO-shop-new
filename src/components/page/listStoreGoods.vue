<template>
	<div>
		<div v-title data-title="商品列表">商品列表</div>
		<list-header :sea="search" v-on:child-say="submit"></list-header>
		<ul class="sort-wrap clearfix text-center">
			<li class="fl" :class="{active:sortField == 'sales_sum'}" @click="sort('xl')">销量
				<span class="icon">
					<em class="bottom" :class="{active:sort_id == 1}"></em><br>
					<em class="top" :class="{active:sort_id == 2}"></em>
				</span>
			</li>
			<li class="fl" :class="{active:sortField == 'price_member'}" @click="sort('jg')">价格
				<span class="icon">
					<em class="bottom" :class="{active:sort_id == 3}"></em><br>
					<em class="top" :class="{active:sort_id == 4}"></em>
				</span>
			</li>
			<li class="fl" @click="sort('rq')" :class="{active:sortField == 'comment_member'}">人气
				<span class="icon">
					<em class="bottom" :class="{active:sort_id == 5}"></em><br>
					<em class="top" :class="{active:sort_id == 6}"></em>
				</span>
			</li>
		</ul>
		<ul class="list-wrap">
			<li class="clearfix" v-for="item in search_data" :key="item.id" @click="tolink(item.id)">
				<img v-lazy="URL + item.pic_url"  class="fl">
				<div class="list-text fl">
					<p class="text">{{item.title}}</p>
					<p class="new-price">￥
					<span>{{item.goods_price || item.price_market|| item.price_member}}</span>
					<p class="status"><span>已有{{item.comment_member}}条评论</span><span>{{item.sales_sum}}笔交易成功</span></p>
				</div>
			</li>
		</ul>
			<el-pagination 
			class="bttom"
			layout="prev, pager, next" 
			:page-size="page_size" 
			@current-change="handleCurrentChange" 
			:total="page">
			</el-pagination>
		<shop-list v-if="sortField == 6" :shoplist="search_data"></shop-list>
		<div v-if="search_data.length ==0" class="comm-null">
			<div class="con-wrap text-center">
				<img src="../../assets/null_com.png">
				<p>暂无商品</p>
			</div>
		</div>
		<Shopsn></Shopsn>
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
	import Shopsn from '@/components/page/Shopsn.vue';
	export default {
		name: 'list',
		data() {
			return {
				tabName: ["宝贝", "店铺"],
				logoImg: require('@/assets/btn-return.png'),
				status: [true, false, false],
				search: true,
				sort_id: null,
				sort_status: null,
				load: false,
				scrollWatch: true,
				load_wrap: true,
				search_data: [],
				msg: '',
				api_url: '',
				num: 0,
				sortField: 'sales_sum',
				page_size: 0, //每页显示几个
				page: 0, //总页数
				currentPage: 1, //当前页,
			}
		},
		methods: {
			/*页面跳转*/
			handleCurrentChange: function(currentPage) {
				this.currentPage = currentPage;
				this.sort('xl');
			},
			submit(search_data) {
				this.search_data = search_data
			},
			activeClick(index) {
				this.num = index
			},
			toback: function() {
				this.$router.back(-1);
			},

			sort(index) {
				switch(index) {
					case 'xl':
						this.sortField = 'sales_sum';
						this.sort_id = this.sort_id != 1 ? 1 : 2;
						break;
					case 'jg':
						this.sortField = 'price_member';
						this.sort_id = this.sort_id != 3 ? 3 : 4;
						break;
					case 'rq':
						this.sortField = "comment_member";
						this.sort_id = this.sort_id != 5 ? 5 : 6;
						break;
					}
					this.axios.post(this.$httpConfig.storeGoodsAll, qs.stringify({
						title:this.$route.params.data,
						id:this.$route.params.id,
						sort:this.sort_id,
						page:this.currentPage
					})).then((res) => {
						if(res.data.status == 1){
							this.search_data = [];
							var list = res.data.data.data;
							this.page_size = res.data.data.page_size;
							this.page = Number(res.data.data.count);
							for(var i in list){
								this.search_data.push(list[i]);
							}
							this.load_wrap = false;
						}
					}).catch((err) => {
						console.info('FailtrueErr', err);
					});
				
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
		created() {
			this.sort('xl');
		},
		components: {
			listHeader,
			Shopsn,
			shopList
		}
	}
</script>
<style lang="less" scoped>
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
			width: 33.3%;
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
		padding-top: .3rem;
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
					display: flex;
					justify-content: space-between;
					span {
						font-size: .24rem;
					}
				}
			}
		}
	}
	
  .bttom {
    width: 100%;
    display: flex;
    margin: 0.3rem 0 0 0;
	justify-content: center;
	background-color: #f1f1f1!important;
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
	
  .el-pagination .btn-next, .el-pagination .btn-prev ,.el-pager li{
	  background-color: #f1f1f1!important;
  }
  .el-pager li.active{
	  color:#e09629;
  }
	.load .mint-spinner-triple-bounce {
		width: 100%;
		text-align: center;
		position: absolute;
		left: 0;
		top: 50%;
	}
</style>