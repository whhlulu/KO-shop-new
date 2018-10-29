<template>
	<div class="boxs">
		<div v-title data-title="我要开店">我要开店</div>
		<top-header :text="title"></top-header>
		<!-- 入店须知 -->
		<tab-header v-show="btmIndex ==0" @sortCon='sortCon' :sortData="sortData" :tabdata="tabIndex"></tab-header>
		<div v-show="btmIndex ==0">
			<div id="Process" v-show="tabIndex ==0">
				<div v-html="html"></div>
			</div>
			<div v-show="tabIndex ==1" class="standard">
				<div v-html="enterHtml"></div>
			</div>
			<div v-show="tabIndex ==2" class="detail">
				<div v-html="copHtml"></div>
			</div>
		</div>
		<ul class="content" v-show="btmIndex ==1">
          <li :class="{active: progressHead == index}" v-for="(item, index) in progressNav" :key="index" @click="cut(index)">{{item}}</li>
      </ul>
		<!-- 个人进度查看 -->
		<div  v-show="btmIndex ==1">
			<ul class="per-center"  v-if="personalData" v-show="show">
				<li>
					<span class="span"> 店铺名称:</span><span>{{personalData.store_name}}</span>
				</li>
				<li>
					<span class="span"> 姓名:</span><span>{{personalData.person_name}}</span>
				</li>
				<li>
					<span class="span"> 联系人手机:</span><span>{{personalData.mobile}}</span>
				</li>
				<li>
					<span class="span"> 申请时间:</span><span>{{new Date(personalData.create_time * 1000).getFullYear()+'-'+new Date(personalData.create_time * 1000).getMonth()+'-'+new Date(personalData.create_time * 1000).getDay()+' '+new Date(personalData.create_time * 1000).getHours()+':'+new Date(personalData.create_time * 1000).getMinutes()+':'+new Date(personalData.create_time * 1000).getSeconds()}}</span>
				</li>
				<li>
					<span class="span"> 更新时间:</span><span>{{new Date(personalData.update_time * 1000).getFullYear()+'-'+new Date(personalData.update_time * 1000).getMonth()+'-'+new Date(personalData.update_time * 1000).getDay()+' '+new Date(personalData.update_time * 1000).getHours()+':'+new Date(personalData.update_time * 1000).getMinutes()+':'+new Date(personalData.update_time * 1000).getSeconds()}}</span>
				</li>
				<li>
					<span class="span"> 身份证号码:</span><span>{{personalData.id_card}}</span>
				</li>
				<li class="id-img">
					<span class="span"> 身份证正面:</span><img :src="URL + personalData.idcard_positive" alt="">
				</li>
				<li class="id-img">
					<span class="span"> 身份证反面:</span><img :src="URL + personalData.other_side" alt="">
				</li>
				<li>
					<span class="span"> 申请状态:</span>
					<span>{{applyList[personalData.status]}}</span>
					<div class="fr" v-if="personalData.status == 2"> <button class="payment-btn fr" @click="payment(1)">支付</button></div>
				</li>
			</ul>
		</div>
		<!-- 企业进度查看 -->
		<div  v-show="btmIndex ==1" v-if="enterpriseData">
			<ul class="per-center"  v-show="!show">
				<li>
					<span class="span"> 店铺名称:</span><span>{{enterpriseData.store_name}}</span>
				</li>
				<li>
					<span class="span"> 公司名称:</span><span>{{enterpriseData.company_name}}</span>
				</li>
				<li>
					<span class="span"> 公司电话:</span><span>{{enterpriseData.company_mobile}}</span>
				</li>
				<li>
					<span class="span"> 联系人手机:</span><span>{{enterpriseData.mobile}}</span>
				</li>
				<li>
					<span class="span"> 注册资金:</span><span>{{enterpriseData.registered_capital}}</span>
				</li>
				<li>
					<span class="span"> 营业执照号:</span><span>{{enterpriseData.license_number}}</span>
				</li>
				<li>
					<span class="span manner"> 营业执照有效期开始时间:</span><span>{{enterpriseData.validity_start}}</span>
				</li>
				<li>
					<span class="span manner"> 营业执照有效期结束时间:</span><span>{{enterpriseData.validity_end}}</span>
				</li>
				<li>
					<span class="span manner"> 法定经营范围:</span><span>{{enterpriseData.scope_of_operation}}</span>
				</li>
				<li>
					<span class="span manner"> 组织机构代码:</span><span>{{enterpriseData.organization_code}}</span>
				</li>
				<li>
					<span class="span"> 申请时间:</span><span>{{new Date(enterpriseData.create_time * 1000).getFullYear()+'-'+new Date(enterpriseData.create_time * 1000).getMonth()+'-'+new Date(enterpriseData.create_time * 1000).getDay()+' '+new Date(enterpriseData.create_time * 1000).getHours()+':'+new Date(enterpriseData.create_time * 1000).getMinutes()+':'+new Date(enterpriseData.create_time * 1000).getSeconds()}}</span>
				</li>
				<li>
					<span class="span"> 更新时间:</span><span>{{new Date(enterpriseData.update_time * 1000).getFullYear()+'-'+new Date(enterpriseData.update_time * 1000).getMonth()+'-'+new Date(enterpriseData.update_time * 1000).getDay()+' '+new Date(enterpriseData.update_time * 1000).getHours()+':'+new Date(enterpriseData.update_time * 1000).getMinutes()+':'+new Date(enterpriseData.update_time * 1000).getSeconds()}}</span>
				</li>
				<li class="id-img">
					<span class="span"> 组织机构代码证明电子版:</span><img :src="URL + enterpriseData.organization_electronic" alt="">
				</li>
				<li class="id-img">
					<span class="span"> 一般纳税人证明:</span><img :src="URL + enterpriseData.taxpayer_certificate" alt="">
				</li>
				<li>
					<span class="span"> 申请状态:</span>
					<span>{{applyList[enterpriseData.status]}}</span>
					<div class="fr" v-if="enterpriseData.status == 2"> <button class="payment-btn fr" @click="payment(2)">支付</button></div>
				</li>
			</ul>
		</div>
		
		<!-- <ul v-show="btmIndex ==1" class="schedule" ref="schedule">
			<li v-for="(val, index) in scheduledata" :key="index">
				<div class="radios"></div>
				<div class="hiddens" v-if="scheduledata.length ==index+1" ref="scheduleDom"></div>
				<div class="box">
					<div class="big"></div>
					<div class="small"></div>
					<h4>{{val.time}}</h4>
					<h5>{{val.title}}</h5>
					<h6>{{val.status}}</h6>
				</div>
			</li>
		</ul> -->
		<!--<div v-html="html"></div>-->
		<div class="btm">
			<div>
				<div @click="btmIndex =0">
					<img :src="notesImg" alt="">
					<span>入驻须知</span>
				</div>
				<div @click="btmIndex =1">
					<img :src="ViewImg" alt="">
					<span>进度查看</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import topHeader from '@/components/page/children/header.vue';
	import tabHeader from '@/components/shopOpen/child/tabHeader.vue';
	import { Button ,Toast} from 'mint-ui';
	import QS from 'qs';
	export default {
		data() {
			return {
				personalData:'',
				enterpriseData:'',
				title: '入驻须知',
				html: "",
				enterHtml: '',
				applyList:['已提交申请','缴费完成','审核成功','审核失败','缴费审核失败','审核通过开店'],
				copHtml: "",
				sortData: ['入驻流程', '入驻标准', '合作细则'],
				progressNav:['个人入驻进度','企业入驻进度'],
				progressHead:0,
				show:true,
				tabIndex: 0,
				titles: ['提交入驻资料', '商家等待审核', '完善店铺信息'],
				list: [
					['查询入驻条件', '资质上传', '品牌上传', '店铺命名', '提交审核'],
					['商业判断', '资质审核'],
					['账号激活', '签署协议', '提交保证金', '不全商家信息']
				],
				time: ['约2个小时', '约5个工作日', '约1天'],
				Notes: [require("@/assets/images/Notes_off.png"), require("@/assets/images/Notes_on.png")],
				View: [require("@/assets/images/View_off.png"), require("@/assets/images/View_on.png")],
				notesImg: require("@/assets/images/Notes_on.png"),
				ViewImg: require("@/assets/images/View_off.png"),
				btmIndex: 0,
				scheduledata: [{
						time: "2018-08-13 12:12:12",
						title: '入驻信息已提交',
						status: '审核中'
					},
					{
						time: "2018-08-13 12:12:12",
						title: '入驻信息已提交',
						status: '审核中'
					},
					{
						time: "2018-08-13 12:12:12",
						title: '入驻信息已提交',
						status: '审核中'
					},
					{
						time: "2018-08-13 12:12:12",
						title: '驻信息已提交驻已提交驻信交驻信已提交驻信交驻信已提交驻信交驻信提交驻信交驻信已提交驻信交驻信提交驻信交驻信信交驻信息已提交',
						status: '审核中1111111'
					},
				]
			}
		},
		created() {
			this.standAjax();
		},

		methods: {
			payment(status){
				let id = '';
				if(status === 1){
					id = this.personalData.id;
				}else{
					id = this.enterpriseData.id;
				}
				this.axios.post(this.$httpConfig.getPayInfo, QS.stringify({
					id: id
				})).then((res) => {
					if(res.data.status == 1){
						this.$router.push({
							name: 'CashierOpenShopPay',
							params: {
								id: 1 ,
								number : res.data.data
							}
						});
					}else{
						Toast({
                          message: res.data.message,
                          duration: 1000
						});
					}
				}).catch((err) => {
					console.log(err);
				});
			},
			cut(index){
				this.progressHead = index;
				if(index === 0){
					this.show = true;
					this.getPersonalProgress();
				}else{
					this.show = false;
					this.getEnterpriseProgress();
				}
				if(index == this.progressHead) return;
			},
			//企业进度
			getEnterpriseProgress(){
				this.axios.post(this.$httpConfig.CompanyStoreAduitProgress, QS.stringify({
				})).then((res) => {
					if(res.data.status == 1){
						this.enterpriseData = res.data.data;
					}
				}).catch((err) => {
					console.log(err);
				});
			},
			//个人进度
			getPersonalProgress(){
				this.axios.post(this.$httpConfig.PersonStoreAduitProgress, QS.stringify({
				})).then((res) => {
					if(res.data.status == 1){
						this.personalData = res.data.data;
					}
				}).catch((err) => {
					console.log(err);
				});
			},
			standAjax() {
				this.axios.post(this.$httpConfig.enterFlow)
					.then((res) => {
						this.html = res.data.data.info
					}).catch((err) => {
						console.log(err)
					});
			},
			enterAjax() {
				this.axios.post(this.$httpConfig.standardOfInvestment)
					.then((res) => {
						this.enterHtml = res.data.data.info;
					}).catch((err) => {
						console.log(err)
					});
			},
			copAjax() {
				this.axios.post(this.$httpConfig.rulesOfCooperation)
					.then((res) => {
						this.copHtml = res.data.data.info
					}).catch((err) => {
						console.log(err)
					});
			},
			sortCon(index) {
				this.tabIndex = index
				if(index == 0) {
					this.standAjax()
				} else if(index == 1) {
					this.enterAjax()
				} else if(index == 2) {
					this.copAjax()
				}
			}

		},
		watch: {
			btmIndex() {
				if(this.btmIndex == 0) {
					this.notesImg = this.Notes[1];
					this.ViewImg = this.View[0]
				} else {
					this.getPersonalProgress();
					this.notesImg = this.Notes[0];
					this.ViewImg = this.View[1];
					
				}
			}
		},
		mounted() {

		},
		components: {
			topHeader,
			tabHeader
		}
	}
</script>
<style lang="less">
	.right {
		background: #fff;
		padding-bottom: .3rem;
		.right-top {
			padding: .3rem .2rem;
			li {
				height: .6rem;
				p {
					height: .6rem;
					line-height: .6rem;
					font-size: .27rem;
					margin-left: .3rem;
				}
				.first {
					font-weight: 700;
					font-size: .3rem;
					padding-left: .1rem;
					margin-left: 0rem;
					border-left: 3px solid #FF883F;
				}
			}
		}
		.t-1 {
			margin: .4rem .2rem;
			.title {
				font-weight: 700;
				font-size: .3rem;
				padding-left: .1rem;
				margin-left: 0rem;
				border-left: 3px solid #FF883F;
			}
			p {
				height: .6rem;
				line-height: .6rem;
				margin-left: .2rem;
				font-size: .25rem;
			}
		}
		.t-2 {
			margin: .2rem .2rem;
			.title {
				font-weight: 700;
				font-size: .3rem;
				padding-left: .1rem;
				margin-left: 0rem;
				border-left: 3px solid #FF883F;
			}
			p {
				height: .6rem;
				line-height: .6rem;
				margin-left: .2rem;
				font-size: .25rem;
			}
		}
		.t-3 {
			margin: .4rem .2rem;
			.title {
				height: .6rem;
				line-height: .6rem;
				font-weight: 700;
				font-size: .3rem;
				padding-left: .1rem;
				margin-left: 0rem;
				border-left: 3px solid #FF883F;
			}
			p {
				height: .6rem;
				line-height: 200%;
				margin-left: .2rem;
				font-size: .25rem;
			}
		}
		.t-4 {
			margin: .4rem .2rem;
			.title {
				height: .6rem;
				line-height: .6rem;
				font-weight: 700;
				font-size: .3rem;
				padding-left: .1rem;
				margin-left: 0rem;
				border-left: 3px solid #FF883F;
			}
			p {
				height: .6rem;
				line-height: .6rem;
				margin-left: .2rem;
				font-size: .25rem;
			}
		}
		.t-5 {
			margin: .4rem .2rem;
			.title {
				height: .6rem;
				line-height: .6rem;
				font-weight: 700;
				font-size: .3rem;
				padding-left: .1rem;
				margin-left: 0rem;
				border-left: 3px solid #FF883F;
			}
			p {
				height: .6rem;
				line-height: .6rem;
				margin-left: .2rem;
				font-size: .25rem;
			}
		}
		.t-6 {
			margin: .4rem .2rem;
			.title {
				height: .6rem;
				line-height: .6rem;
				font-weight: 700;
				font-size: .3rem;
				padding-left: .1rem;
				margin-left: 0rem;
				border-left: 3px solid #FF883F;
			}
			p {
				height: .6rem;
				line-height: .6rem;
				margin-left: .2rem;
				font-size: .25rem;
			}
		}
	}
	
	.text {
		font-size: .25rem;
		width: 100%;
		p {
			line-height: 150%;
			font-size: .25rem;
		}
		span {
			padding-right: .1rem;
			font-size: .25rem;
		}
	}
	
	.c-request {
		.title {
			padding: .25rem 0rem;
			font-size: .3rem;
			span {
				display: inline-block;
				width: 5px;
				height: .4rem;
				background: #FF883F;
				margin-right: .1rem;
			}
		}
		.col1 {
			width: 30%;
			height: 1.5rem;
		}
		td {
			padding-left: .2rem;
			font-size: .25rem;
			p {
				line-height: 170%;
				font-size: .25rem;
			}
			a {
				color: #F02B2B;
			}
		}
	}
	
	.b-request {
		.title {
			padding: .25rem 0rem;
			font-size: .3rem;
			span {
				display: inline-block;
				width: 5px;
				height: .4rem;
				background: #FF883F;
				margin-right: .1rem;
			}
		}
		.col1 {
			width: 30%;
			padding: .3rem 0.2rem;
		}
		td {
			padding: .3rem 0.2rem;
			font-size: .25rem;
			p {
				line-height: 170%;
				font-size: .25rem;
			}
		}
	}
	
	.fee {
		.title {
			padding: .3rem 0rem;
			font-size: .3rem;
			font-weight: 700;
			color: #000000;
			span {
				width: 3px;
				display: inline-block;
				height: .3rem;
				background: #FF883F;
				vertical-align: middle;
				margin-right: .1rem;
			}
		}
		p {
			line-height: 150%;
			font-size: .25rem;
		}
	}
	
	.fee-rule {
		.title {
			padding: .3rem 0rem;
			font-size: .3rem;
			font-weight: 700;
			color: #000000;
			span {
				width: 3px;
				display: inline-block;
				height: .3rem;
				background: #FF883F;
				vertical-align: middle;
				margin-right: .1rem;
			}
		}
		p {
			line-height: 150%;
			font-size: .25rem;
		}
	}
</style>
<style lang="less" scoped>
	.boxs {
		padding-bottom: 1.05rem;
	}
	.content{
		background-color: #fff;
		display: flex;
		border-bottom: 1/100rem solid #CBCBCB;
		li{
			display: flex;
			height: 50/100rem;
			margin: 20/100rem 0;
			justify-content: center;
			align-items: center;
			flex:1;
			border-right: 1/100rem solid #CBCBCB;
			&:last-child{
				border:0
			}
			
		}
		.active{
			color: #D4B660;
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
			span{
				color: #555;
				font-size:.25rem;
			}
			.span {
				width: 1.8rem;
				font-size: 32/100rem;
			}
			.manner{
				width:2.2rem;
			}
			div{
				padding-left:2rem;
				.payment-btn{
					height: 0.6rem;
    				padding: 0 .3rem;
					border: 0;
					color: #fff;
					border-radius: 4px;
    				background-color: #26a2ff
				}
			}
		}
		.id-img{
			height: 1.7rem;
			img{
				width: 2.8rem;
    			height: 1.6rem;
			}
		}
	}
	.Process {
		background-color: #fff;
		padding-left: .6rem;
		padding-top: .3rem;
	}
	.btm {
		background-color: #fff;
		position: fixed;
		width: 100%;
		height: 1.05rem;
		border-top: .01rem solid #ccc;
		bottom: 0;
		div {
			display: flex;
			height: 100%;
			div {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				span {
					margin-top: .01rem;
					font-size: .22rem;
				}
				img {
					width: .45rem;
					height: .45rem;
				}
			}
		}
	}
	
	// 标准
	.standard {
		background-color: #fff;
		padding: .3rem .25rem;
		h2 {
			font-size: .28rem;
			border-left: .1rem solid #D29D29;
			padding-left: .1rem;
			margin-bottom: .2rem;
		}
		td {
			border-color: #939393;
			font-size: .24rem;
			padding: .2rem;
			min-height: .65rem;
			&:first-child {
				width: 2.4rem;
			}
		}
		th {
			height: .65rem;
			border-color: #939393;
			font-size: .28rem;
			font-weight: normal;
			color: #939393
		}
		p {
			font-size: .24rem;
			padding: .3rem 0;
			line-height: 150%;
			span {
				font-size: .24rem;
				color: #0990D2;
			}
		}
	}
	
	// 细节
	.detail {
		background-color: #fff;
		padding: 0 .25rem .3rem;
		overflow: hidden;
		h2 {
			border-left: .1rem solid #D29D29;
			padding-left: .1rem;
			margin: .3rem 0;
			font-size: .28rem;
		}
		p {
			font-size: .28rem;
			line-height: 120%;
			color: rgb(82, 82, 82);
		}
	}
	
	.schedule {
		margin-left: .4rem;
		border-left: .01rem solid #BBB;
		padding-right: .2rem;
		margin-bottom: 1.05rem;
		li {
			overflow: hidden;
			// display: flex;
			padding-top: .5rem;
			margin-left: -.27rem;
			position: relative;
		}
		.radios {
			position: absolute;
			width: .35rem;
			height: .35rem;
			margin: .3rem .25rem 0 0;
			border: .1rem solid #D3A023;
			border-radius: .35rem;
			background-color: #fff;
			// z-index: 2;
		}
		.hiddens {
			// position: absolute;
			float: left;
			width: .55rem;
			// bottom:0;
			background-color: #f1f1f1;
			margin-top: .5rem;
			height: 3rem;
		}
		.box {
			margin-left: .67rem;
			background-color: #fff;
			width: 6rem;
			min-height: 1.45rem;
			border-radius: .2rem;
			border: .01rem solid #ccc;
			padding: .2rem;
			position: relative;
			.big {
				position: absolute;
			}
			.small {
				position: absolute;
			}
		}
		h4 {
			color: #9A9A9A;
			font-size: .30rem;
			line-height: .45rem;
		}
		h5 {
			line-height: .45rem;
			font-size: .30rem;
		}
		h6 {
			line-height: .45rem;
			font-size: .30rem;
			color: #E62A21;
		}
	}
</style>