<template>
	<div class="box">
		<div v-title data-title="店铺">店铺</div>
		<list-header :set="true" :text="text"></list-header>
		<div class="head">
			<ul :style="{width:titleData.length * 2+'rem'}" class="headers fl" ref="headers">
				<li :class="{avtive:titleIndex == index}" class="fl" @click="proTab(index,item.id)" v-for="(item, index) in titleData" :key="index">
					{{item.sc_name}}
				</li>
			</ul>
		</div>
		<!-- 排序切换 -->
		<!--<title-header :sortData = "sortData" v-on:sortCon = "titleTab"  :tabdata ="tabIndex"></title-header>-->
		<ul class="content">
			<li :class="{active: sortHead == index}" v-for="(item, index) in sortData" :key="index" @click="proSort(index)">{{item}}</li>
		</ul>
		<!-- 列表展示 -->
		<shop-list :shoplist="shoplist"></shop-list>
		<div class="up-warp" v-show="load_show">
			<p class="rotate"></p>
			<p class="load-title">加载中..</p>
		</div>
		<div class="no-data" v-show="no_data">暂无相关数据~</div>
		<div class="load" v-show="load" @touchmove.prevent>
			<mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner>
		</div>
		<div class="load-wrap" v-show="$store.state.class_load" @touchmove.prevent>
			<mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner>
		</div>
	</div>
</template>
<script>
	import qs from 'qs'
	//import titleHeader from './child/tabHeader.vue'; //tab切换
	import shopList from './child/shoplist.vue'; //店铺列表
	import listHeader from '@/components/page/children/header.vue'; //头部
	export default {
		data() {
			return {
				headerWidth: '',
				titleIndex: -1,
				sortHead: 0,
				text: "店铺",
				titleData: [],
				sortData: ['综合排序', '销量优先', '按信誉'],
				sortType: ['store_sort', 'store_sales', 'grade_id '],
				page: 1,
				shoplist: [],
				sort_types:'store_sort',
				class_id:'',
				load: false,
				tabIndex: -1,
				sw:true,
				state:true,
				flag:false,
				no_data:false,
				load_show:true
			}
		},
		created() {
			this.$store.state.class_load = false;
			this.getStoreListAjax();
			this.storeClasses();

		},
		mounted(){
			document.body.scrollTop = 0;
			let _this = this;
			// 注册scroll事件并监听  
            window.addEventListener('scroll',function(){ 
				if($("#list-shop").length){
					if(document.body.scrollTop + window.innerHeight >= document.body.offsetHeight) { 
						//没有数据时不在再请求
						if(_this.state == false){
							return;
						}else{
							_this.load_show = true;
						};
						//限制重复滑动
						if(_this.sw == true){
							_this.sw = false;
							_this.page++;
							_this.getStoreListAjax();
						}
					}
				}
			})
		},
		methods: {
			//  首页店铺列表请求 默认综合排序
			getStoreListAjax() {
				//避免重复请求
				if(this.flag === true){return};
				this.flag = true;
				this.axios.post(this.$httpConfig.getStoreList, qs.stringify({
					page:this.page,
					sort_types:this.sort_types,
					class_id:this.class_id
				})).then((res) => {
					this.sw = true;
					this.flag = false;
					this.load_show = false;
					//第一次获取数据如果数据没铺满屏幕 不再触发滚动
					if(res.data.data.records.length <10 && this.page == 1){
						this.load_show = false;
						this.state = false;
					}else if(res.data.data.records.length == 0){
						this.no_data = true;
						this.state = false;
						return;
					}
					for(let key in res.data.data.records) {
						this.shoplist.push(res.data.data.records[key])
					}
				}).catch((err) => {
					console.log(err)
				});
			},
			//筛选切换
			proSort(index){
				//打开加载动画
				this.load_show = true;
				//避免重复请求
				if(this.flag === true) return;
				//初始化无数据时的条件
				this.state = true;
				//隐藏无数据时的样式
				this.no_data = false;
				//初始化page
				this.page = 1;
				//清空数据列表
				this.shoplist = [];
					this.sortHead = index;
				if(this.sortHead==0){
					this.sort_types = 'store_sort';
					this.getStoreListAjax();
					
				}else if(this.sortHead==1){
					this.sort_types = 'store_sales';
					this.getStoreListAjax();
					
				}else if(this.sortHead==2){
					this.sort_types = 'grade_id';
					this.getStoreListAjax();

				}
			},
			//店铺首页导航
			storeClasses() {
				this.axios.post(this.$httpConfig.storeClasses)
					.then((res) => {
						this.titleData = res.data.data;
					}).catch((err) => {
						console.log(err)
					});
			},
			titleTab(index) {
				this.sortObj.sort_types = this.sortType[index];

			},
			proTab(index,id) {
				//打开加载动画
				this.load_show = true;
				//避免重复请求
				if(this.flag === true) return;
				//初始化无数据时的条件
				this.state = true;
				//隐藏无数据时的样式
				this.no_data = false;
				//初始化page
				this.page = 1;
				//清空数据列表
				this.shoplist = [];
				this.titleIndex = index;
				this.class_id = id;
				this.getStoreListAjax();

			},
		},
		components: {
			listHeader,
			shopList,
			//titleHeader
		}
	}
</script>
<style lang="less" scoped>
	
	.head {
		background: #fff;
		width: 100%;
		overflow-x: auto;
		height: 90/100rem;
		border-bottom: .01rem solid #CBCBCB;
	}
	
	.headers {
		// background-color: #fff;
		height: 100%;
		li {
			font-size: .26rem;
			width: 1.5rem;
			height: .9rem;
			text-align: center;
			line-height: .9rem;
			box-sizing: border-box;
			padding:0 .2rem;
		}
		.avtive {
			color: #D4B660;
			border-bottom: 4/100rem solid #C19D07;
		}
	}
	
	.content {
		background-color: #fff;
		display: flex;
		border-bottom: 1/100rem solid #CBCBCB;
		li {
			display: flex;
			height: 50/100rem;
			margin: 20/100rem 0;
			justify-content: center;
			align-items: center;
			flex: 1;
			border-right: 1/100rem solid #CBCBCB;
			&:last-child {
				border: 0
			}
		}
		.active {
			color: #D4B660;
		}
	}
	.up-warp{
		height: .5rem;
		padding: .3rem 0;
		text-align: center;
		p{
			display: inline-block;
			vertical-align: middle;
		}
		.rotate{
			width: 16px;
			height: 16px;
			border-radius: 50%;
			border: 1px solid gray;
			margin-right: 6px;
			border-bottom-color: transparent;
		}
		.rotate{
			-webkit-animation:rotate .6s linear infinite;
			animation:rotate .6s linear infinite
		}
		@-webkit-keyframes rotate{
			0%{
				-webkit-transform:rotate(0deg)
				}
			100%{
				-webkit-transform:rotate(360deg)
				}
			}
		@keyframes rotate{
			0%{
				transform:rotate(0deg)
			}
			100%{
				transform:rotate(360deg)
			}
		}
		.load-title{
			font-size: 12px;
    		color: gray;
		}
	}
	.no-data{
		height: .5rem;
		padding: .3rem 0;
		text-align: center;
		font-size: 12px;
    	color: gray;
	}
</style>