<template>
	<div>
		<div v-title :data-title="title">{{title}}</div>
		<repair-header :text="title"></repair-header>
		<ol class="tab-hd clearfix text-center">
			<li class="fl" :class="{active:status == 0}" @click="toAjax(0)"><span>退货</span></li>
			<li class="fl" :class="{active:status == 1}" @click="toAjax(1)"><span>退款</span></li>
		</ol>
		<div class="search-hd clearfix" v-show="status == 0">
			<input type="search" placeholder="商品名称 , 订单编号" class="fl" v-model="keyword">
			<button class="fl" @click="search(0)">搜索</button>
		</div>
		<div class="search-hd clearfix" v-show="status == 1">
			<input type="search" placeholder="商品名称 , 订单编号" class="fl" v-model="keyword1">
			<button class="fl" @click="search(sta1tus)">搜索</button>
		</div>
		<ul class="list-wrap">
			<li v-for="item in $store.state.repair" :key="item.id">
				<div class="hd">
					<div class="oddNumbers clearfix">
						<span class="name fl">服务单号：{{item.id}}</span>
						<!--<span class="status fr">待收货</span>-->
					</div>
					<div class="time">申请时间：{{new Date(item.create_time * 1000).getFullYear()+'-'+(new Date(item.create_time * 1000).getMonth() + 1)+'-'+new Date(item.create_time * 1000).getDay()}}&nbsp;&nbsp;{{new Date(item.create_time * 1000).getHours()+':'+new Date(item.create_time * 1000).getMinutes()+':'+new Date(item.create_time * 1000).getSeconds()}}</div>
				</div>
				<div class="dd clearfix" @click="tolink(item)">
					<img :src="URL + item.puc_url" class="fl">
					<div class="text-wrap fl">
						<p class="text text2-hidden">{{item.title}}</p>
						<div class="btn-wrap clearfix">
							<span class="fl">数量：{{item.number}}</span>
							<button class="fr" >{{statusArr[item.status]}}</button>
						</div>
					</div>
				</div>
			</li>
		</ul>
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
	import { MessageBox, Toast, Popup } from 'mint-ui';
	import repairHeader from '@/components/page/children/header.vue';
	import qs from 'qs';
	import Shopsn from '@/components/page/Shopsn.vue';
	export default {
		name: 'returnRepair',
		data() {
			return {
				title: '退货返修',
				status: 0,
				load: false,
				load_wrap: true,
				sta: true,
				statusArr:['审核中','审核失败','审核通过','退货中','换货中','换货完成','退货完成','已撤销'],
				keyword:'',
				keyword1:''
			}
		},
		mounted() {
			this.toAjax(0)
		},
		methods: {
			toAjax(index) {
				this.status = index;
				if(index == 0) {
					this.axios.post(this.$httpConfig.progressQueryList).then((res) => {
						if(res.data.status == 10001) {
							this.$router.push('/LogIn');
						} else {
							this.$store.state.repair = res.data.data;
							this.load_wrap = false;
							Toast(res.data.message);
						}
					}).catch((err) => {
						console.log(err);
					});
				}else{
					this.axios.post(this.$httpConfig.progressQueryList2).then((res) => {
						if(res.data.status == 10001) {
							this.$router.push('/LogIn');
						} else {
							this.$store.state.repair = res.data.data;
							this.load_wrap = false;
							Toast(res.data.message);
						}
					}).catch((err) => {
						console.log(err);
					});

				}
			},
			search(index){
				if(index == 0){
					this.axios.post(this.$httpConfig.OrderReturnGoodsBack,
					qs.stringify({
						keyWord:this.keyword
					})).then((res)=>{
						if(res.data.status == 10001) {
							this.$router.push('/LogIn');
						} else {
							this.$store.state.repair = res.data.data;
							this.load_wrap = false;
							Toast(res.data.message);
						}
					}).catch((err) => {
						console.log(err);
					});
				}else{
					this.axios.post(this.$httpConfig.OrderExchangeGoodsBack,
					qs.stringify({
						keyWord:this.keyword1
					})).then((res)=>{
						if(res.data.status == 10001) {
							this.$router.push('/LogIn');
						} else {
							this.$store.state.repair = res.data.data;
							this.load_wrap = false;
							Toast(res.data.message);
						}
					}).catch((err) => {
						console.log(err);
					});
				}
			},
			tolink(item) {
				this.$router.push({
					name: 'progress',
					params: {
						id: item.id
					}
				});
			}
		},
		components: {
			repairHeader,
			Shopsn
		}
	}
</script>
<style lang="less" scoped>
	.tab-hd {
		height: .9rem;
		line-height: .9rem;
		background: #fff;
		li {
			width: 50%;
			span {
				display: inline-block;
				width: 2.5rem;
				height: 100%;
				font-size: .28rem;
				color: #666;
			}
		}
		li.active {
			span {
				color: #D19E29;
				border-bottom: 2px solid #D19E29;
				box-sizing: border-box;
			}
		}
	}
	
	.search-hd {
		padding: .2rem;
		input {
			width: 6.2rem;
			height: .8rem;
			border: 1px solid #ccc;
			border-radius: 5px;
			box-sizing: border-box;
			font-size: .24rem;
			color: #333;
			padding-left: .6rem;
			background: url(../../assets/search1.png) no-repeat #fff .2rem center;
			background-size: .29rem .29rem;
			outline: none;
		}
		button {
			width: .9rem;
			line-height: .8rem;
			border: none;
			outline: none;
			background: none;
			font-size: .3rem;
			color: #333;
		}
	}
	
	.list-wrap {
		li {
			padding: 0 .2rem .2rem .2rem;
			width: 100%;
			background: #fff;
			box-sizing: border-box;
			border-bottom: 1px solid #dfdfdd;
			border-top: 1px solid #dfdfdd;
			margin-bottom: .15rem;
			.hd {
				height: 1.4rem;
				border-bottom: 1px solid #dfdfdd;
				box-sizing: border-box;
				.oddNumbers {
					padding-top: .44rem;
					.name {
						font-size: .25rem;
						color: #333;
					}
					.status {
						font-size: .3rem;
						color: #f9781e;
					}
				}
				.time {
					font-size: .25rem;
					color: #757575;
				}
			}
			.dd {
				padding-top: .35rem;
				img {
					width: 1.46rem;
					height: 1.46rem;
				}
				.text-wrap {
					padding-left: .2rem;
					width: 5.15rem;
					.text {
						font-size: .25rem;
						color: #333;
						line-height: .38rem;
					}
					.btn-wrap {
						padding-top: .28rem;
						span {
							font-size: .25rem;
							color: #999;
						}
						button {
							width: 1.43rem;
							height: .53rem;
							background: #fff;
							border-radius: 5px;
							border: none;
							font-size: .24rem;
							color: #333;
							outline: none;
							border: 1px solid #757575;
							box-sizing: border-box;
						}
						button.active {
							background: #D19E29;
							border: none;
							color: #fff;
						}
						button:active {
							box-shadow: 0 5px 5px #ccc;
						}
					}
				}
			}
		}
	}
</style>