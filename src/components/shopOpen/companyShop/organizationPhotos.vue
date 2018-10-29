<template>
	<div>
		<div v-title data-title="我要开店">我要开店</div>
		<top-header :text="title"></top-header>
		<con-header :text="text[0]" :prompt="prompt"></con-header>
		<ul class="per-center">
			<li>
				<span> 组织机构代码:</span><input type="text" placeholder="请输入营业执照号..." v-model="organization_code">
			</li>
		</ul>
		<div class="idPhotos">
			<h4>组织机构代码证电子版：</h4>
			<div>
				<div>
					<input type="file" @change="orange($event)" v-if="ipad" class="file" />
					<img :src="ipadImg" v-show="ipadImg" class="ipadImg" @click="moves" />
				</div>
				<h6>示例</h6>
				<div></div>
			</div>
			<p>
				图片建议使用4：3的jpg、gif、png格式的图片，并且图片大小不得超过2M营业执照、住址机构代码证、税务登记证三证合一jpg、gif、png格式的图片， 并且图片大小不得超过2M
			</p>
		</div>
		<con-header :text="text[1]" :prompt="prompt2"></con-header>
		<div class="idPhotos">
			<h4>{{text[1]}}：</h4>
			<div>
				<div>
					<input type="file" @change="oranges($event)" v-if="ipads" class="file" />
					<img :src="ipadImgs" v-show="ipadImgs" class="ipadImg" @click="removes" />
				</div>
				<h6>示例</h6>
				<div></div>
			</div>
			<p>
				图片建议使用4：3的jpg、gif、png格式的图片，并且图片大小不得超过2M营业执照、住址机构代码证、税务登记证三证合一jpg、gif、png格式的图片， 并且图片大小不得超过2M
			</p>
		</div>
		<button @click="nextinfor">提交以上信息，并填写下一页</button>
	</div>
</template>
<script>
	import { Field, Popup, Radio, Toast } from 'mint-ui';
	import QS from 'qs';
	import topHeader from '@/components/page/children/header.vue';
	import conHeader from '@/com/conHeader'; // 内容头
	export default {
		data() {
			return {
				title: '填写入驻资料',
				text: ['组织机构代码', '一般纳税人证明'],
				prompt: "(企业三证合一没有组织机构代码的上传营业执照)",
				prompt2: "(所属企业具有一般纳税人证明时，此项必填)",
				organization_code: '',
				organization_electronic: '',
				taxpayer_certificate: '',
				ipad: true,
				ipadImg: '',
				ipads: true,
				ipadImgs: '',
			}
		},
		methods: {
			removes() {
				this.ipads = true;
				this.ipadImgs = false;
			},
			moves() {
				this.ipad = true;
				this.ipadImg = false;
			},
			orange(e) {
				var file = e.target.files[0];
				//接口上传文件
				var that = this   
				// this.organization_electronic = file.name
				this.ipad = false
				const reader = new FileReader();
				this.img_type = 'data:' + file.type + ';base64,';
				reader.readAsDataURL(file);
				reader.onload = function() {
					that.ipadImg = this.result;
				}  
				let param = new FormData() // 创建form对象
				    param.append('adv_content', file, file.name) // 通过append向form对象添加数据
				    param.append('chunk', '0') // 添加form表单中其他数据  
					console.log(param.get('file')) // FormData私有类对象，访问不到，可以通过get判断值是否传进去
				let config = {    
					headers: {
						'Content-Type': 'multipart/form-data'
					}   
				}
				this.axios.post(this.$httpConfig.uploadImage, param, config)
					.then((res) => {
						if(res.data.status === 1) {
							this.organization_electronic = res.data.data
						}
					})

			},
			oranges(e) {
				var file = e.target.files[0];
				//接口上传文件
				var that = this   
				// this.taxpayer_certificate = file.name
				this.ipads = false
				const reader = new FileReader();
				this.img_type = 'data:' + file.type + ';base64,';
				reader.readAsDataURL(file);
				reader.onload = function() {
					that.ipadImgs = this.result;
				}  
				let param = new FormData() // 创建form对象
				    param.append('adv_content', file, file.name) // 通过append向form对象添加数据
				    param.append('chunk', '0') // 添加form表单中其他数据
					console.log(param.get('file')) // FormData私有类对象，访问不到，可以通过get判断值是否传进去
				let config = {    
					headers: {
						'Content-Type': 'multipart/form-data'
					}   
				}
				this.axios.post(this.$httpConfig.uploadImage, param, config)
					.then((res) => {
						if(res.data.status === 1) {
							this.taxpayer_certificate = res.data.data
						}
					})

			},

			nextinfor: function() {
				if(this.organization_code == '') {
					Toast('请填写组织机构代码')
					return;
				}
				if(this.organization_electronic == '') {
					Toast('请上传组织机构代码证电子版')
					return;
				}
				if(this.taxpayer_certificate == '') {
					Toast('请上传一般纳税人证明')
					return;
				}
				this.axios.post(this.$httpConfig.uploadOrganization, QS.stringify({
					id: sessionStorage.getItem('shop_ID'),
					organization_code: this.organization_code,
					organization_electronic: this.organization_electronic,
					taxpayer_certificate: this.taxpayer_certificate
				})).then((res) => {
					if(res.data.status == 10001) {
						this.$router.push('/LogIn');
					} else {
						Toast(res.data.message);
						if(res.data.status == 1) {
							this.$router.push({
								name: "checkCompanyBankInfor"
							})
						}
					}
				}).catch((err) => {
					console.log(err)
				});
			}
		},
		components: {
			topHeader,
			conHeader
		}
	}
</script>
<style lang="less" scoped>
	.idPhotos {
		border-bottom: 1/100rem solid #fff;
		padding: 0 27/100rem;
		h4 {
			padding: 30/100rem 0 25/100rem;
			color: #BDBDBD;
			font-size: 32/100rem;
		}
		background-color: #fff;
		div {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			font-size: 32/100rem;
			color: #959595;
			h6 {
				padding: 0 30/100rem;
			}
			div {
				width: 280/100rem;
				height: 210/100rem;
				border: 1/100rem solid #BDBDBD;
				.ipadImg {
					width: 100%;
					height: 100%;
				}
				.file {
					width: 100%;
					height: 100%;
					opacity: 0;
				}
			}
			div:last-child {
				border: 1/100rem dashed #BDBDBD;
			}
		}
		p {
			margin: 30/100rem 0 40/100rem;
			font-size: 24/100rem;
			color: #959595;
			text-align: left;
		}
	}
	
	.per-center {
		li {
			background-color: #fff;
			border-bottom: 1px solid #F1F1F1;
			height: 90/100rem;
			display: flex;
			align-items: center;
			font-size: 28/100rem;
			padding: 0 20/100rem;
			span {
				width: 110px;
				font-size: 32/100rem;
				color: #BDBDBD
			}
			input {
				width: 520/100rem;
				height: 90/100rem;
				border: 0;
				font-size: 28/100rem;
				padding-left: 30/100rem;
				box-sizing: border-box
			}
			div {
				font-size: 32/100rem;
				display: flex;
				align-items: center;
				color: #BDBDBD
			}
		}
		.businessScope {
			margin-bottom: 10/100rem;
			height: 260/100rem;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			span {
				width: 100%;
				height: 90/100rem;
				display: flex;
				align-items: center;
				text-align: left;
			}
			textarea {
				width: 700/100rem;
				height: 160/100rem;
				resize: none;
				border: 0;
				padding: 10/100rem;
			}
		}
		a {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.rightImg {
			margin-left: 20/100rem;
			width: 24/100rem;
			height: 44/100rem;
		}
	}
	
	button {
		margin: 45/100rem 20/100rem 25/100rem;
		height: 90/100rem;
		color: #fff;
		background-color: #D19E29;
		border-radius: 90/100rem;
		border: 0;
		width: 710/100rem;
		outline: none;
		font-size: 32/100rem
	}
	
	p {
		text-align: center;
		line-height: normal;
		.reds {
			color: #FE0100
		}
	}
</style>