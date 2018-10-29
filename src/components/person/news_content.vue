<template>
	<div ref='box'>
		<div v-title :data-title="title">{{title}}</div>
		<newHeader :text="title" :set="true" :question="question"></newHeader>
		<div class="content" >
			<ul>
				<li v-for="(lists,index) in list" @click="enterDetail(lists,index)" :key="lists.id">{{lists.title}}</li>
			</ul>
		</div>
		<div v-show="no_data" class="no-data">暂无更多数据</div>
	</div>
</template>
<script>
	import newHeader from '@/components/page/children/header.vue';
	import qs from 'qs';
	export default {
		name: 'news_content',
		data() {
			return {
				title: '问题列表',
				load_wrap: true,
				list: '',
				no_data:false,
				question:true
			}
		},
		components: {
			newHeader
		},
		created(){
			this.getProblemList();
		},
		mounted() {
			this.$refs.box.style.backgroundColor = "#fff";
		},
		methods: {
			//问题列表
			getProblemList(){
				this.axios.post(this.$httpConfig.helpList, qs.stringify({
					type_id: this.$route.params.id
				})).then((res) => {
					if(res.data.data.length == 0){
						this.no_data =true;
					}
					if(res.data.status == 1){
						this.list = res.data.data;
					}else{
						Toast({
                            message: res.data.message,
                            duration: 1000
                        }); 
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			enterDetail(lists) {
				this.$router.push({
					name: 'newsDetail',
					params: {
						id: lists.id,
						status: 2 //status = 1 为我的消息详情 status = 2 为客服中心 详情
					}
				});
			}
		},
	}
</script>

<style lang="less" scoped>
	.content {
		width: 710/100rem;
		margin: 20/100rem;
		font-size: .28rem;
		color: #333;
		word-wrap: break-word;
		word-break: break-all;
		p {
			font-size: .28rem;
			text-indent: 12px;
			line-height: 40/100rem;
			padding: 20/100rem 0;
		}
		ul {
			width: 100%;
			li {
				padding: .2rem 0rem;
				font-size: .25rem;
				border-bottom: 1px solid #ccc;
				text-indent: 1em;
			}
		}
	}
	.no-data{
		text-align: center;
		font-size: .3rem;
		padding-top: 1rem;
		color: #555;
		position: absolute;
		top: .94rem;
		left : 0;
		bottom : 0;
		right : 0;
	}
</style>