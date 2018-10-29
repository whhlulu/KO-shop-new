<template>
	<div>
		<div v-title data-title="我要开店">我要开店</div>
		<top-header :text="title"></top-header>
		<con-header :text="text[0]"></con-header>
		<ul class="per-center">
			<li>
				<span> 账户开户名:</span><input type="text" placeholder="请输入银行开户名..." v-model="account_name">
			</li>
			<li>
				<span> 公司银行账户:</span><input type="text" placeholder="请输入公司银行账户..." v-model="company_account">
			</li>
			<li>
				<span> 开户支行:</span><input type="text" placeholder="请输入开户支行..." v-model="branch_bank">
			</li>
		</ul>
		<con-header :text="text[1]"></con-header>
		<ul class="per-center">
			<li>
				<span> 账户开户名:</span><input type="text" placeholder="请输入银行开户名..." v-model="settle_name">
			</li>
			<li>
				<span> 公司银行账户:</span><input type="text" placeholder="请输入公司银行账户..." v-model="settle_account">
			</li>
			<li>
				<span> 开户支行:</span><input type="text" placeholder="请输入开户支行..." v-model="settle_number">
			</li>
		</ul>
		<con-header :text="text[2]"></con-header>
		<ul class="per-center">
			<li>
				<span> 税务登记证号:</span><input type="text" placeholder="请输入税务登记证号..." v-model="certificate_number">
			</li>
		</ul>
		<div class="idPhotos">
			<h4>税务登记证号电子版：</h4>
			<div>
				<div>
					<input type="file" @change="iphoneS($event)" v-if="iphone" class="file" />
					<img :src="iphoneImg" v-show="iphoneImg" class="position" @click="double" />
				</div>
			</div>
		</div>
		<button @click="nextinfor">提交以上信息，并填写下一页</button>
	</div>
</template>
<script>
	import QS from 'qs';
	import { Field, Popup, Radio, Toast } from 'mint-ui';
	import topHeader from '@/components/page/children/header.vue';
	import conHeader from '@/com/conHeader'; // 内容头
	export default {
		data() {
			return {
				title: '填写入驻资料',
				text: ['结算（银行卡）账户信息', '结算账户信息', '税务登记证'],
				prompt: "(企业三证合一没有组织机构代码的上传营业执照)",
				prompt2: "(所属企业具有一般纳税人证明时，此项必填)",
				account_name: '',
				company_account: '',
				branch_bank: "",
				settle_name: '',
				settle_account: '',
				settle_number: '',
				certificate_number: '',
				registration_electronic: '',
				iphone: true,
				iphoneImg: '',
			}
		},
		methods: {
			double() {
				this.iphone = true;
				this.iphoneImg = false;
			},
			iphoneS(e) {
				var file = e.target.files[0]
				//图片大小设置
//				var fileSize = 0;
//				if(!e.target.files) {
//					var filePath = e.target.value;
//					var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
//					var file = fileSystem.GetFile(filePath);
//					fileSize = file.Size;
//				} else {
//					fileSize = e.target.files[0].size;
//				}
//				var size = fileSize / 1024;
//				if(size > 2000) {
//					Toast("附件不能大于2M");
//					e.target.value = "";
//					return
//				}
//				var name = e.target.value;
//				var fileName = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
//				if(fileName != "png" && fileName != "jpg") {
//					Toast("请选择png,jpg格式文件上传！");
//					e.target.value = "";
//					return
//				}
				//上传图片接口
				var that = this   
				// this.registration_electronic = file.name
				this.iphone = false
				const reader = new FileReader();
				this.img_type = 'data:' + file.type + ';base64,';
				reader.readAsDataURL(file);
				reader.onload = function() {
					that.iphoneImg = this.result;
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
							that.registration_electronic = res.data.data
						}
						console.log(res.data)
				})

			},
			nextinfor: function() {
				if(this.account_name == "") {
					Toast('请填写开户名');
					return;
				}
				if(this.company_account == "") {
					Toast('请填写公司银行账号');
					return;
				}
				if(this.branch_bank == "") {
					Toast('请填写开户银行支行名称 ');
					return;
				}
				if(this.settle_name == "") {
					Toast('请填写结算账户开户名  ');
					return;
				}
				if(this.settle_account == "") {
					Toast('请填写结算公司银行账号 ');
					return;
				}
				if(this.settle_number == "") {
					Toast('请填写结算支行联行号 ');
					return;
				}
				if(this.certificate_number == "") {
					Toast('请填写税务登记证号  ');
					return;
				}
				if(this.registration_electronic == "") {
					Toast('请填写税务登记证号电子版  ');
					return;
				}
				this.axios.post(this.$httpConfig.storeBank, QS.stringify({
					store_id: sessionStorage.getItem('shop_ID'),
					account_name: this.account_name,
					company_account: this.company_account,
					branch_bank: this.branch_bank,
					settle_name: this.settle_name,
					settle_account: this.settle_account,
					settle_number: this.settle_number,
					certificate_number: this.certificate_number,
					registration_electronic: this.registration_electronic
				})).then((res) => {
					if(res.data.status == 10001) {
						this.$router.push('/LogIn');
					} else {
						Toast(res.data.message);
						if(res.data.status == 1) {
							this.$router.push({
								name: "checkComBusinessInfor"
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
			margin-bottom: 20/100rem;
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
				.position {
					width: 99%;
					height: 99%;
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
				width: 130px;
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