<template>
    <div class="edit-wrap">
        <div v-title :data-title="title">{{title}}</div>
        <edit-header :text="title" :btn="btn" :btnDel="btnDel" :id="$route.params.status"></edit-header>
        <div class="form-wrap">
            <mt-field label="收货人：" placeholder="请输入收货人姓名" v-model="data.realname"></mt-field>
            <mt-field label="手机号：" placeholder="请输入手机号" type="number" v-model="data.mobile"></mt-field>
            <div class="mint-cell mint-field">
                <span class="mint-cell-title mint-cell-text">所在地区：</span>
                <div class="mint-cell-value" @click="callingArea">
                    <input placeholder="请选择地区" type="tel" class="mint-field-core" disabled v-model="data.addressAll">
                    <span class="mint-field-state is-default"><i class="mintui mintui-field-default"></i></span>
                    <div class="mint-field-other"></div>
                </div>
            </div>
            <mt-field label="详细地址：" placeholder="请输入详细地址" v-model="data.address"></mt-field>
            <mt-radio
                align="right"
                v-model="value"
                :options="['设为默认地址']">
            </mt-radio>
            <mt-popup v-model="popupVisible" position="bottom" class="mint-popup-4">  
                <div class="picker-toolbar">  
                    <span class="mint-datetime-action mint-datetime-cancel" @click="cancleaddress">取消</span>  
                    <span class="mint-datetime-action mint-datetime-confirm" @click="selectaddress">确定</span>  
                </div>  
                <div class="select">
                    <ul class="address-area-tit">
                        <li 
                            :class="{active:showProvince}" 
                            @click="selectedArea('province')">
                            {{ province }}</li>
                        <li  
                            v-if="choiceCity" 
                            :class="{active:showCity}"
                            @click="selectedArea('city')">
                            {{ city }}</li>
                        <li  
                            v-if="choiceArea" 
                            @click="selectedArea('area')"
                            :class="{active:showArea}">
                        {{ area }}</li>
                    </ul>
                    <ul class="address-city" v-show="showProvince">
                        <li 
                            v-for="(n,i) in addressPlace"
                            :key="n.id"
                            @click="getProvince(n.id,n.name,i)"
                        >{{n.name}}</li>
                    </ul>
                    <ul class="address-city" v-if="showCity">
                        <li 
                            v-for="(n, i) in cityArr" 
                            :key="n.id"
                        	@click="getCity(n.id, n.name, i)" >
                        {{ n.name }}</li>
                    </ul>
                    <ul class="address-city" v-if="showArea">
                        <li 
                            v-for="(n, i) in areaArr" 
                            :key="n.id"
                      		@click="setCityEnd(n.id, n.name, i)" 
                        >{{ n.name }}</li>
                    </ul>
                </div>
            </mt-popup>
        </div>
        <footer-btn :text="footBnt" :id="$route.params.status" :to="'/address'" :data="data" :prov="provinceId" :city="cityId" :district="areaId" :value="value"></footer-btn>
    </div>
</template>
<script>
    import EditHeader from '@/components/page/children/header';
    import FooterBtn from '@/components/Widget/fixedBtn';
    import { Field,Popup,Radio,Toast } from 'mint-ui';
    import qs from 'qs';
    export default {
        name : 'EditDelAddress',
        data(){
            return {
                title : '编辑收货地址',
                btn:' ',
                btnDel:true,
                footBnt:'保存',
                popupVisible:false,
                popup:false,
                province: '请选择',// 选中的省
                city: '请选择', // 选中的市
                area: '请选择', // 选中的区
                provinceArr: [], // 省
                cityArr: [], // 市
                areaArr: [], // 区
                choiceProvince: false, // 省按钮的显示隐藏
                choiceCity: false, // 市按钮的显示隐藏
                choiceArea: false, // 区按钮的显示隐藏
                showProvince: true, // 省选择的显示隐藏
                showCity: false, // 市选择的显示隐藏
                showArea: false, // 区选择的显示隐藏
                provinceId: '', // 选中的省id
                cityId: '', // 选中的市id
                areaId: '', // 选中的区id
                value:'',
                addressPlace:'',
                districtArr:'',
                data:{
                    name:'',
                    phone:'',
                    address1:'',
                    addressAll:'',
                    addAll:'',
                    Det:'',
                    addressa:'',
                    value:''
                }
            }
        },
        methods:{
             // 选择
            selectedArea(type){
                if (type == "province") {
                    this.showProvince = true;
                    this.choiceCity = false;//市按钮消失
                    this.choiceArea = false;//区按钮消失
                    this.showCity = false;//市列表隐藏
                    this.showArea = false;//区列表隐藏
                    this.city = '请选择'; 
                    this.area = '请选择';
                } else if (type == "city"){
                    this.showCity = true;
                    this.showProvince = false;//省列表隐藏
                    this.showArea = false; //区列表隐藏
                    this.choiceArea = false; //区按钮消失
                    this.area = '请选择';
                }
            },
            //选择省
            getProvince(id,name,i){
                this.province = name;
                this.provinceId = id;
                this.showProvince = false; //省列表显示隐藏
                this.choiceCity = true; //市按钮出现
                this.showCity = true; //市按钮的样式//市列表显示隐藏
                for (let key in this.addressPlace) {
                    if(key == i){
                        this.cityArr = this.addressPlace[key].son;
                        break;
                    } 
                }
            },
            //选择市
            getCity(id,name,i){
                this.city = name;
                this.cityId = id;
                this.showArea = true; //区列表出现
                this.choiceArea = true; //区按钮出现
                this.showCity = false; //市按钮的样式//市列表显示隐藏
                for (let key in this.cityArr) {
                    if(key == i){
                        this.areaArr = this.cityArr[key].grandson;
                        break;
                    }
                }
            },
            //选择区
            setCityEnd(id,name,i){
                this.area = name;
                this.areaId = id;
            },
            callingArea(){
                this.popupVisible = true;
            },
            cancleaddress(){
                this.popupVisible = false;
                this.showCity = false; //市按钮的样式//市列表显示隐藏
                this.showArea = false; //区按钮的样式//区列表显示隐藏
                this.showProvince = true; //省列表显示隐藏
                this.choiceCity = false; // 市按钮的显示隐藏
                this.choiceArea = false;// 区按钮的显示隐藏
                this.province = "请选择";
            },
            callingadd(){
                this.popup = true;
            },
            selectaddress(){
                this.popupVisible = false;
                if(this.province==""||this.province=="请选择") {
					Toast('请选择地址');
				}else if(this.city==""||this.city=="请选择"){
					Toast('请选择地址');
				}else if(this.area==""||this.area=="请选择" ){
					Toast('请选择地址');
                }else{
                    this.data.addressAll = this.province +'-'+ this.city +'-'+ this.area;
                    this.showCity = false; //市按钮的样式//市列表显示隐藏
                    this.showArea = false; //区按钮的样式//区列表显示隐藏
                    this.showProvince = true; //省列表显示隐藏
                    this.choiceCity = false; // 市按钮的显示隐藏
                    this.choiceArea = false;// 区按钮的显示隐藏
                    this.province = "请选择";
                }
            },
        },
        watch: {
            value(){
                if(this.value == '设为默认地址'){
                    this.data.value = '1';
                }
            }
        },
        created(){
            
        },
        mounted(){
            this.axios.post(API_URL + 'Home/Pcenter/addinfo',qs.stringify({
                app_user_id:sessionStorage.getItem('user_ID'),
                id:this.$route.params.status
            })).then((res) => {
                this.data = res.data.data;
                this.data.addressAll = res.data.data.prov.name +'-'+ res.data.data.city.name +'-'+ res.data.data.dist.name;
            }).catch((err) => {
                console.log(err);
            });
            this.axios.post(API_URL + 'Home/Pcenter/addressPlace',qs.stringify({
                app_user_id:sessionStorage.getItem('user_ID')
            })).then((res) => {
                this.addressPlace = res.data.data;
            }).catch((err) => {
                console.log(err);
            });
        },
        components:{
            EditHeader,
            FooterBtn
        }
    }
</script>
<style lang="less">
    .edit-wrap{
        .mint-popup-bottom{
            width: 100%;
            padding:.2rem;
            box-sizing: border-box;
            .select{
                padding:.2rem 0;
                .address-area-tit {
                    line-height: 40px;
                    padding: 0;
                    box-shadow: none;
                    border-bottom: 0;
                    height: 41px;
                    li{
                        position: relative;
                        left: 0;
                        padding: 0 .2rem;
                        top: 1px;
                        height:40px;
                        width: 24%;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                        text-align: center;
                        font-size: 12px;
                        display: inline-block;
                        border-bottom: 1px solid #ccc;
                    }
                    li.active {
                        border-bottom: 1px solid #e02828;
                        color: #e02828;
                    }
                }
                .address-city {
                    margin-top: 10px;
                    height:4.5rem;
                    overflow: hidden;
                    overflow-y: scroll;
                    width: calc(100% + 30px);
                    li{
                        padding: 0 35px;
                        line-height: 30px;
                        font-size: 12px;
                    }
                }
            }
        }
        div.mint-field{
            border-top:1px solid #d9d9d9;
            padding:0 .2rem;
        }
        .mint-radiolist-title{
            margin:0;
        }
        .mint-radiolist-label{
            padding:0;
        }
        .mint-radio-label{
            font-size:.29rem;
            color:#999;
        }
        .mint-field{
            height: 1rem;
            line-height:1rem;
            background:#fff;
            .mint-cell-text{
                font-size:.3rem;
                color:#999;
            }
            .mint-cell-value{
                font-size:.32rem;
                color:#333;
                input{
                    background:#fff;
                }
            }
        }
    }
</style>
<style lang="less" scoped>
    
</style>