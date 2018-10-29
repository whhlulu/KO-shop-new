<template>
	<div>
		<div v-title data-title="我要开店">我要开店</div>
		<top-header :text="title"></top-header>
		<con-header :text="text[0]"></con-header>
		<ul class="per-center">
			<li>
				<span> 银行开户行</span><input type="text" placeholder="请输入银行开户行..." v-model="bank_name">
			</li>
			<li>
				<span> 银行卡账户:</span><input type="text" placeholder="请输入银行卡账户..." v-model="bank_account">
			</li>
			<!--<li>
        <span> 开户支行:</span><input type="text" placeholder="请输入开户支行...">
       </li>-->
		</ul>
		<button @click="nextinfor">下一步</button>
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
				text: ['结算（银行卡）账户信息'],
				bank_name: '',
				bank_account: '',
			}
		},
		components: {
			topHeader,
			conHeader
		},
		methods: {

			nextinfor: function() {
				if(this.bank_name == "") {
					Toast('请输入开户行')
					return;
				}
				if(!/^\d{16}|\d{19}$/.test(this.bank_account)) {
					Toast('请填写正确的银行卡号');
					return;
				}

				this.axios.post(this.$httpConfig.enterBankInfo, QS.stringify({
					id: sessionStorage.getItem('shopPer_ID'),
					bank_name: this.bank_name,
					bank_account: this.bank_account
				})).then((res) => {
					if(res.data.status == 10001) {
						this.$router.push('/LogIn');
					} else {
						Toast(res.data.message);
						if(res.data.status == 1) {
							this.$router.push({
								name: "checkProBusinessInfor"
							})
						}
					}
				}).catch((err) => {
					console.log(err)
				});
			}
		}
	}
</script>
<style lang="less" scoped>
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
				width: 100px;
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
		}
		a {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.rightImg {
			width: 24/100rem;
			height: 44/100rem;
		}
	}
	
	button {
		margin: 75/100rem 20/100rem 0;
		height: 90/100rem;
		color: #fff;
		background-color: #D19E29;
		border-radius: 90/100rem;
		border: 0;
		width: 710/100rem;
		outline: none;
		font-size: 32/100rem
	}
</style>