<template>
	<div>
		<div v-title :data-title="title">{{title}}</div>
		<top-header :text="title"></top-header>
		<ul class="ordinary">
			<li>
				<p><span>公司名称：</span><input type="text" v-model="comName" /></p>
			</li>
			<li>
				<p><span>税号：</span><input type="tel" v-model="tax" /></p>
			</li>
			<li>
				<p><span>开户银行名称：</span><input type="text" v-model="bank" /></p>
			</li>
			<li>
				<p><span>开户银行账号：</span><input type="tel" v-model="bankNum" /></p>
			</li>
			<li>
				<span>注册地区：</span>
				<div class="mint-field choose">
					<div class="mint-cell-value" @click="callingArea">
						<input placeholder="请选择地区" type="tel" class="mint-field-core" disabled v-model="data.addressAll">
						<span class="mint-field-state is-default"><i class="mintui mintui-field-default"></i></span>
						<div class="mint-field-other"></div>
					</div>
				</div>
			</li>
			<li>
				<p><span>详情地址：</span><input type="text" v-model="address" /></p>
			</li>
			<li>
				<p><span>注册电话：</span><input type="text" v-model="mobile" oninput="if(value.length > 11)value=value.slice(0, 11)" /></p>
			</li>
		</ul>
		<mt-popup v-model="popupVisible" position="bottom" class="mint-popup-3  pop">
			<div class="picker-toolbar">
				<span class="mint-datetime-action mint-datetime-cancel" @click="cancleaddress">取消</span>
				<span class="mint-datetime-action mint-datetime-confirm" @click="selectaddress">确定</span>
			</div>
			<div class="select">
				<ul class="address-area-tit">
					<li :class="showProvince?'active':''" @click="selectedArea('province')">
						{{ province }}</li>
					<li v-if="choiceCity" :class="showCity?'active':''" @click="selectedArea('city')">
						{{ city }}</li>
					<li v-if="choiceArea" @click="selectedArea('area')" :class="showArea?'active':''">
						{{ area }}</li>
				</ul>
				<ul class="address-city" v-if="showProvince">
					<li v-for="(n, i) in addressPlace" :key="i" @click="getProvince(n.id, n.name, i)" :class="i==provinceIndex?'selected-li':''">
						{{ n.name }}</li>
				</ul>
				<ul class="address-city" v-if="showCity">
					<li v-for="(n, i) in cityArr" :key="i" @click="getCity(n.id, n.name, i)" :class="i==cityIndex?'selected-li':''">
						{{ n.name }}</li>
				</ul>
				<ul class="address-city" v-if="showArea">
					<li v-for="(n, i) in districtArr" :key="i" @click="setCityEnd(n.id, n.name, i)" :class="i==areaIndex?'selected-li':''">{{ n.name }}</li>
				</ul>
			</div>
		</mt-popup>
		<div class="footer">
			<button class=" protect" @click="protact">保存</button>
		</div>
	</div>
</template>
<script>
	import { Field, Popup, Radio, Toast } from 'mint-ui';
	import QS from 'qs';
	import topHeader from '@/components/page/children/header.vue';
	import tabHeader from './child/tabHeader.vue';
	export default {
		data() {
			return {
				title: '新增增值发票',
				comName: '',
				tax: '',
				bank: '',
				bankNum: '',
				address: '',
				mobile: '',
				popupVisible: false,
				popup: false,
				choiceProvince: false, // 省按钮的显示隐藏
				choiceCity: false, // 市按钮的显示隐藏
				choiceArea: false, // 区按钮的显示隐藏
				province: '请选择', // 选中的省
				city: '请选择', // 选中的市
				area: '请选择', // 选中的区
				showProvince: true, // 省选择的显示隐藏
				showCity: false, // 市选择的显示隐藏
				showArea: false, // 区选择的显示隐藏
				provinceId: '', // 选中的省id
				cityId: '', // 选中的市id
				areaId: '', // 选中的区id
				provinceIndex: -1, 
				cityIndex: -1,
				areaIndex: -1,
				streetIndex: -1,
				addressPlace: '',
				cityArr: '',
				districtArr:'',
				data: {
					name: '',
					phone: '',
					address1: '',
					addressAll: '',
					addAll: '',
					Det: '',
					addressa: '',
					value: 0
				},
			}
		},
		mounted() {
			this.proAjax(0, 0)
		},
		methods: {
			protact() {
				if(this.comName == '') {
					Toast({
						message: '公司名称不能为空'
					});
					return;
				}
				if(this.tax == '') {
					Toast({
						message: '税号不能为空'
					});
					return;
				}
				if(this.bank == '') {
					Toast({
						message: '开户银行不能为空'
					});
					return;
				}
				if(this.bankNum == '') {
					Toast({
						message: '开户银行账号不能为空'
					});
					return;
				}
				if(this.data.addressAll == '') {
					Toast({
						message: '请选择注册地址'
					});
					return;
				}
				if(this.address == '') {
					Toast({
						message: '请输入详情地址'
					});
					return;
				}
				if(!(/^1[34578]\d{9}$/.test(this.mobile))) {
					Toast({
						message: '请输入手机号'
					});
					return;
				}
				this.axios.post(this.$httpConfig.capitaAdd, QS.stringify({
					ein: this.tax,
					company_name: this.comName,
					opening_bank: this.bank,
					bank_account: this.bankNum,
					prov_id: this.provinceId,
					city_id: this.cityId,
					dist_id: this.areaId,
					register_address: this.address,
					register_tel: this.mobile
				})).then((res) => {
					Toast({
						message: res.data.message
					})
					this.$router.push('/documents')
				}).catch((err) => {
					console.log(err)
				});
			},
			selectedArea(type) { // 按钮点击
				if(type == "province") {
					this.cityIndex = -1;
					this.areaIndex = -1;
					this.streetIndex = -1

					this.choiceCity = false;
					this.choiceArea = false;
					this.choiceStreet = false,

					this.showProvince = true;
					this.showCity = false;
					this.showArea = false;
					this.showStreet = false;

				} else if(type == "city") {
					this.cityIndex = -1;
					this.areaIndex = -1;
					this.streetIndex = -1
					this.choiceArea = false;
					this.choiceStreet = false;

					this.showProvince = false;
					this.showCity = true;
					this.showArea = false;
					this.showStreet = false;
				}
			},
			getProvince(id, name, index) {
				this.Bcity = '请选择', // 选中的市
				this.area = '请选择', // 选中的区
				this.city = '请选择';
				this.choiceCity = true;
				this.province = name;
				this.provinceId = id;
				this.showProvince = false;
				this.showCity = true;
				this.showArea = false;
				this.showStreet = false;
				this.cityArr = this.proAjax(this.provinceId, 1);
			},
			getCity(id, name, index) { // 获取城市列表
				this.area = '请选择', // 选中的区
				this.choiceArea = true;
				this.city = name;
				this.cityId = id;
				this.showProvince = false;
				this.showCity = false;
				this.showArea = true;
				this.showStreet = false;
				this.districtArr = this.proAjax(this.cityId, 2);
			},
			setCityEnd(id, name, index) { // 区点完以后
				this.area = name;
				this.areaId = id;
			},
			callingArea() {
				this.popupVisible = true;
			},
			cancleaddress() {
				this.popupVisible = false;
			},
			callingadd() {
				this.popup = true;
			},
			selectaddress() {
				this.popupVisible = false;
				if(this.province==""||this.province=="请选择") {
					Toast('请选择地址');
				} else if(this.city==""||this.city=="请选择"){
					Toast('请选择地址');
				}else if(this.area==""||this.area=="请选择" ){
					Toast('请选择地址');
				}else{
					this.data.addressAll = this.province + '-' + this.city + '-' + this.area;
					this.choiceCity=false;// 市按钮的显示隐藏
					this.choiceArea=false; // 区按钮的显示隐藏
					this.choiceStreet=false;
					this.choiceProvince=true; // 省按钮的显示隐藏
					this.showStreet = false;
					this.showProvince=true;
					this.province="请选择"
				}
				
			},
			proAjax(index, selId) {
				this.axios({
						method: 'get',
						url: this.$httpConfig.cityList,
						params: {
							parent_id: index,
							id: ""
						}
					})
					.then((res) => {
						let data = res.data.data;
						if(selId == 0) {
							this.addressPlace = data;
						} else if(selId == 1) {
							this.cityArr = data;
							// this.city = data[0];
						} else if(selId == 2) {
							this.districtArr = data;
							// this.district =  data[0];
						} else if(selId == 3) {
							this.TownshipArr = data;
							// this.Township =  data[0];
						}
					}).catch((err) => {
						console.log(err);
					});
			}
		},
		components: {
			topHeader,
		}
	}
</script>
<style lang="less" scoped>
	.pop {
		width: 100%;
		.picker-toolbar {
			width: 100%;
			height: 1rem;
			line-height: 1rem;
		}
		.select {
			width: 100%;
			height: 1.8rem;
			select {
				width: 24%;
				height: .5rem;
				.option {
					width: 50%;
				}
			}
		}
	}
	
	.ordinary {
		width: 100%;
		/*overflow: auto;*/
		height: 100%;
		li {
			height: 1rem;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: #fff;
			padding: 0 .25rem;
			border-bottom: 1px solid #CCCCCC;
			.choose {
				width: 5.3rem;
				input {
					width: 5rem;
					height: .6rem;
					border: 0;
					background: #fff;
				}
			}
			span {
				color: #727272;
				font-size: .28rem;
			}
			input {
				width: 3.5rem;
				border: 0;
				font-size: .25rem;
			}
			img {
				width: .3rem;
				height: .45rem;
			}
		}
	}
	.mint-popup-bottom {
		width: 100%;
		padding: .2rem;
		height:7rem;
		box-sizing: border-box;
		.select {
			padding: .2rem 0;
			select {
				padding-left: 10/100rem;
				border: 1/100rem solid #d9d9d9;
				width: 24%;
				height: .5rem;
				background: #fff;
				outline: none;
				option {
					color: #333;
					text-align: center;
				}
			}
			.address-area-tit {
				padding: 0;
				box-shadow: none;
				border-bottom: 0;
				height: 41px;
				line-height: 40px;
				li {
					cursor: pointer;
					position: relative;
					left: 0;
					top: 1px;
					height: 40px;
					padding: 0 .2rem;
					width: 24%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					text-align: center;
					font-size: 12px;
					display: inline-block;
					border-bottom: 1px solid #ccc;
				}
				li.active {
					border-bottom: 1px solid #ff8000;
					color: #ff8000;
				}
			}
			.address-city {
				height: 4.5rem;
				overflow:hidden;
				margin-top: 10px;
				overflow-y: scroll;
				li {
					padding: 0 35px;
					line-height: 30px;
					font-size: 12px;
					cursor: pointer;
				}
				li.selected-li {
					color: #ff8000;
				}
			}
		}
	}
	.mint-datetime-action{
		color: #ff8000;
	}
	.footer {
		width: 100%;
		height: 1rem;
		background: #FFFFFF;
		position: absolute;
		bottom: 0;
		left: 0;
		.protect {
			width: 100%;
			height: 1rem;
			font-size: 0.25rem;
			text-align: center;
			line-height: 1rem;
			background: rgb(203,148,49);
			color: #ffffff;
			border: 0;
		}
	}
</style>