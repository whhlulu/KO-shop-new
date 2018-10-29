<template>
    <div class="personData">
        <div v-title :data-title="title">{{title}}</div>
        <personal-header :text="title"></personal-header>
        <div class="person-wrap">
            <div class="hd">
                <div class="status fl">我的头像</div>
                <img :src="URL+$store.state.user_Imag" class="fr" v-show="!hdimg">
                <img :src="hdimg" class="fr" v-show="hdimg">
                <div class="icon-btn"></div>
                <div v-if="show">
                    <input type="file" @change="imgChange($event)" ref="int" >
                </div>
                
            </div>
            <ul class="dd">
                <li class="clearfix">
                    <span class="userStatus fl">用户名<span>*</span></span>
                    <span class="userName fr">{{data.user_name}}</span>
                    <div class="icon-btn"></div>
                </li>
                <li class="clearfix" @click="modify('email')">
                    <span class="userStatus fl">邮箱</span>
                    <span class="userName fr">{{data.email || '请填写'}}</span>
                    <div class="icon-btn"></div>
                </li>
                <li class="clearfix" @click="modify('sex')">
                    <span class="userStatus fl">性别</span>
                    <span class="userName fr">{{data.sex || '请填写'}}</span>
                    <div class="icon-btn"></div>
                </li>
                <li class="clearfix" @click="bir">
                    <span class="userStatus fl">生日</span>
                    <span class="userName fr">{{data.birthday || '请填写'}}</span>
                    <div class="icon-btn"></div>
                </li>
            </ul>
        </div>
        <div class="from-btn" @click="preservation">确认修改</div>
        <div class="prompt"><span>*</span>为必填项</div>
        <mt-datetime-picker
            ref="picker"
            type="date"
            v-model="pickerVisible"
            year-format="{value} 年"
            month-format="{value} 月"
            date-format="{value} 日"
            @confirm="dataChange"
            :start-date="startDate"
            :end-date="endDate"
            >
        </mt-datetime-picker>
        <mt-popup
            v-model="popupVisible"
            position="bottom"
            >
            <ul class="sex-wrap">
                <li v-for="(item,index) in sex" :key="item.id" @click="setSex(index)">{{item}}</li>
                <li @click="setSex('del')">取消</li>
            </ul>
        </mt-popup>

        <div class="load" v-show="load" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
    </div>
</template>
<script>
    import personalHeader from './children/header.vue';
    import qs from 'qs';
    import { Picker,Button,MessageBox,Toast,DatetimePicker,Actionsheet,Popup } from 'mint-ui';
    export default {
        name : 'personalData',
        data(){
            return {
                title:'个人资料',
                data:'',
                pickerVisible:false,
                popupVisible:false,
                user_header:true,
                startDate:new Date('January 01 1960 11:19:47 GMT+0800 (CST)'),
                endDate:new Date(),
                hdimg:'',
                sex:['男','女'],
                load:false,
                img_type:'',
                show:true
            }
        },
        methods:{
            bir(){
                this.$refs.picker.open();
            },
            del(){
                this.popupVisible = false;
            },
            enter(){
                this.data.birthday = this.birthday;
                this.popupVisible = false;
            },
            setSex(index){
                this.popupVisible = false;
                if(index == 'del')return;
                this.data.sex = this.sex[index];
            },
            modify(v){
                switch(v){
                    case 'email':
                        MessageBox.prompt('请输入您要修改的电子邮箱').then(({ value, action }) => {
                            if(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(value)){
                                this.data.email = value;
                                return;
                            }
                            Toast('请填写正确的邮箱');
                        }).catch((err) => {
                            console.log(err)
                        });
                        break;
                    case 'sex':
                        this.popupVisible = true;
                        break;
                }
            },
            dataChange(val){
                this.data.birthday = val.getFullYear() +'-'+this.todo(val.getMonth() + 1)+'-'+this.todo(val.getDate());
            },
            todo(n){
                return n < 10 ?'0' + n: n + '';
            },
            imgChange(ev){
                    const reader = new FileReader(),
                    img1 = ev.target.files[0],
                    that = this;
                    this.img_type = 'data:'+img1.type+';base64,';
                    reader.readAsDataURL(img1);
                    reader.onload = function(){
                        that.hdimg = this.result;
                    }
                    this.$refs.int.value = '';
                          

            },
            preservation(){
                if(!sessionStorage.getItem('user_ID')){
                        this.$router.push({
                        path:'/LogoIn'
                    });
                    return
                }
                this.load = true;
                this.axios.post(API_URL + 'Home/Pcenter/mobilePersoninfo',qs.stringify({
                    app_user_id:sessionStorage.getItem('user_ID'),
                    nick_name:this.data.user_name,
                    email:this.data.email,
                    sex:this.data.sex,
                    birthday:this.data.birthday,
                    user_header:this.hdimg,
                    type:this.img_type
                })).then((res) => {
                    this.load = true;
                    Toast('修改成功');
                    this.$router.push('/person');
                }).catch((err) => {
                    console.log(err);
                });
            }
        },
        mounted(){
            this.axios.post(API_URL + 'Home/Pcenter/userinfo',qs.stringify({
                app_user_id:sessionStorage.getItem('user_ID')
            })).then((res) => {
                this.data = res.data.data;
            }).catch((err) => {
                console.log(err)
            });
            let ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                    this.show=false    
                } else {
                    this.show=true 
                } 
        },
        components:{
            personalHeader
        }
    }
</script>
<style lang="less" scoped>
    .person-wrap{
        background:#fff;
        .hd{
            padding:.2rem .73rem .2rem .2rem;
            height:1.14rem;
            position:relative;
            border-bottom:1px solid #e7e7e7;
            overflow: hidden;
            input{
                width: 300%;
                height: 100%;
                position:absolute;
                left:-200%;
                top:0;
            }
            img{
                width:1.14rem;
                height:1.14rem;
                border-radius:100%;
                box-sizing:border-box;
            }
            
            .status{
                line-height:1.14rem;
                font-size:.32rem;
            }
            .icon-btn{
                position:absolute;
                top:50%;
                right:.2rem;
                margin-top:-.12rem;
                width:.14rem;
                height:.24rem;
                background:url(../../assets/btn-right.png) no-repeat;
                background-size:100% 100%;
            }
        }
        .dd{
            li:nth-child(1){
                .icon-btn{
                    display:none;
                }
            }
            li{
                height:.9rem;
                border-bottom:1px solid #e7e7e7;
                position:relative;
                line-height:.9rem;
                padding:0 .45rem 0 .2rem;
                .userStatus{
                    font-size:.32rem;
                    color:#3d4245;
                    span{
                        font-size:.32rem;
                        color:#d0111b;
                    }
                }
                .userName{
                    font-size:.32rem;
                    color:#999;
                }
                .icon-btn{
                    position:absolute;
                    top:50%;
                    right:.2rem;
                    margin-top:-.12rem;
                    width:.14rem;
                    height:.24rem;
                    background:url(../../assets/btn-right.png) no-repeat;
                    background-size:100% 100%;
                }
            }
        }
    }
    .button-wrap{
        padding:.2rem;
    }
    .from-btn{
        width:7.1rem;
        height:.9rem;
        text-align:center;
        line-height:.9rem;
        background:#d0111b;
        border-radius:20px;
        box-sizing:border-box;
        color:#fff;
        font-size:.32rem;
        margin:.6rem auto .2rem;
    }
    .from-btn:active{
        box-shadow: 0 5px 5px #ccc;
    }
    .prompt{
        text-align:center;
        font-size:.24rem;
        color:#3d4245;
        position:relative;
        span{
            font-size:.32rem;
            color:#d0111b;
            position:absolute;
            top:50%;
            left:3.1rem;
            margin-top:-.15rem;
        }
    }
    .sex-wrap{
        width: 7.1rem;
        text-align:center;
        li{
            height: .8rem;
            line-height: .8rem;
            border-top:1px solid #ccc;
            box-sizing: border-box;
            color:#26a2ff;
            font-size:.3rem;
            background:#fff;
        }
        li:nth-child(3){
            margin-top:.2rem;
        }
    }
</style>
<style lang="less">
    .personData{
        .mint-popup-bottom{
            .picker-item{
                text-align:center;
            }
        }
        .mint-popup{
            background:none;
            padding-bottom:.2rem;
        }
        .picker.mint-datetime-picker{
            background:#fff;
        }
    }
</style>
