<template>
	<div>
		<div v-title :data-title="title">{{title}}</div>
		<com-header :text="title"></com-header>
		<tab-header :sortData="sortData" :tabdata="status" :appraisalNum="appraisalNum" v-on:sortCon="tabIndex"></tab-header>
		<div class="item-wrap" v-show="status == 0">
			<div class="item-list" v-for="item in my_comment" :key="item.id">
				<div class="product clearfix">
					<img class="fl" :src="URL + item.puc_url">
					<p class="fl text1-hidden">{{item.title}}</p>
				</div>
				<p class="text text2-hidden">{{item.content}}</p>
				<div class="clearfix img-wrap">
					<img class="fl" v-for="(items,index) in item.commont_img" :src="URL + items.path" :key="index">
				</div>
				<div class="inf-wrap clearfix">
					<div class="inf fl">
						{{item.create_time | formatDate}}&nbsp;&nbsp;&nbsp;
						<span v-for="items in item.space" :key="items.id">{{items.speName+':'+items.item}}</span>
					</div>
					<div class="status fr" v-if="item.score == 3">差评</div>
					<div class="status fr" v-if="item.score == 2">中评</div>
					<div class="status fr" v-if="item.score == 1">好评</div>
					<!--<el-rate 
					class="r"
					  v-model="item.score"
					  disabled
					  text-color="#ff9900"
					  score-template="{value}">
					</el-rate>-->
				</div>
			</div>
		</div>
		<div class="item-wrap" v-show="status == 1">
			<div class="item-list" v-for="item in chart" :key="item.id">
				<div class="product clearfix">
					<img class="fl" :src="URL + item.puc_url">
					<p class="fl text1-hidden">{{item.title}}</p>
				</div>
				<p class="text text2-hidden">{{item.content}}</p>
				<div class="clearfix img-wrap">
					<img class="fl" v-for="(items,index) in item.commont_img" :src="URL + items.path" :key="index">
				</div>
				<div class="inf-wrap clearfix">
					<div class="inf fl">
						{{new Date(item.create_time * 1000).getFullYear()+'/'+(new Date(item.create_time * 1000).getMilliseconds() + 1)+'/'+new Date(item.create_time * 1000).getDay()}}&nbsp;&nbsp;&nbsp;
						<span v-for="items in item.space" :key="items.id">{{items.speName+':'+items.item}}</span>
					</div>
					<div class="status fr" v-if="item.score == 3">差评</div>
					<div class="status fr" v-if="item.score == 2">中评</div>
					<div class="status fr" v-if="item.score == 1">好评</div>
					<!--<el-rate class="r"
					  v-model="item.score"
					  disabled
					  text-color="#ff9900"
					  show-score
					  score-template="{value}">
					</el-rate>-->
				</div>
			</div>
		</div>
		<!-- <div class="load-wrap" v-show="!$store.state.my_comment" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div> -->
	</div>
</template>
<script>
	import tabHeader from '@/components/page/children/tabHeader';
	import comHeader from '@/components/page/children/header.vue';
	import qs from 'qs';
	export default {
		name: 'myComment',
		data() {
			return {
				title: '我的评论',
				status: 0,
				sortData: ["发布评价", '有图评价'],
				appraisalNum: [Number(sessionStorage.getItem("allNum")), Number(sessionStorage.getItem("chartNum"))],
				status: 0,
				dataAll: [],
				dataPic: [],
				num: [],
				chart: '',
				my_comment: '',
				values:2,
				value:''
			}
			
		},
		methods: {
			tabIndex(index) {
				this.status = index;
				if(this.status == 0) {
					this.axios({
						url: this.$httpConfig.myComment,
						method: 'get',
						params: {
							type: 1,
							page: 1
						}
					}).then(res => {
						if(res.data.status == 10001) {
							this.$router.push('/LogIn');
						} else {
							this.num = res.data.data;
							if(res.data.data.data!=''){
								sessionStorage.setItem("allNum", res.data.data.data.length)
							}
							this.my_comment = res.data.data.data;
						}
					});
				} else if(this.status == 1) {
					this.axios({
						url: this.$httpConfig.myComment,
						method: 'get',
						params: {
							type: 2,
							page: 1
						}
					}).then(res => {
						if(res.data.status == 10001) {
							this.$router.push('/LogIn');
						} else {
							this.num = res.data.data.length
							this.chart = res.data.data.data
							sessionStorage.setItem("chartNum",this.chart.length)
						}
					});
				}
			},
			myComment() {
				this.axios({
					url: this.$httpConfig.myComment,
					method: 'get',
					params: {
						type: 1,
						page: 1
					}
				}).then(res => {
					if(res.data.status == 10001) {
						this.$router.push('/LogIn');
					} else {
						this.num = res.data.data;
						sessionStorage.setItem("allNum", res.data.data.data.length)
						this.my_comment = res.data.data.data;
					}
				});
			},

			addClass(index) {
				this.status = index;
			}
		},
		created() {
			this.myComment();
		},
		components: {
			comHeader,
			tabHeader
		}
	}
</script>
<style lang="less" scoped>
	.r{
		float: right;
	}
	.item-wrap {
		padding-top: .2rem;
		.item-list {
			padding: .34rem .2rem;
			box-sizing: border-box;
			min-height: 3rem;
			background: #fff;
			border-bottom: 1px solid #ccc;
			.img-wrap {
				padding: .2rem 0;
				img {
					width: .88rem;
					height: .88rem;
					margin-right: .2rem;
				}
			}
			.product {
				img {
					width: .9rem;
					height: .9rem;
				}
				p {
					line-height: .9rem;
					width: 5rem;
					padding-left: .33rem;
					font-size: .2rem;
					color: #333;
				}
			}
			.text {
				font-size: .24rem;
				color: #333;
				height: .7rem;
				width: 100%;
				line-height: .4rem;
				padding: .1rem 0;
			}
			.inf-wrap {
				padding-top: .25rem;
				.inf {
					font-size: .2rem;
					color: #999;
				}
				.status {
					font-size: .2rem;
					color: #d0111b;
				}
			}
		}
	}
</style>