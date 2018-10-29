<template>
<div style="background:#fff;position:absolute;top:0;left:0;right:0;bottom:0;">
    <div v-title data-title="修改密码">{{title}}</div>
    <div class="teacher-main">
        <header class="header">
            <span @click="btnGo" class="btnGo"></span>
            {{title}}
        </header>
    </div>
    <div class="logoin-main">
        <div class="from">
            <div class="input-main phone-number">
                <span class="icon"></span>
                <input type="tel" maxlength="11" placeholder="请输入验证手机号码" v-model="mobile">
            </div>
            <div class="input-main message">
                <span class="icon"></span>
                <input type="text" placeholder="请输入短信验证码" v-model="message">
                <button class="btn-ver" :class="{active:isActive}" @click="obtain">{{btnText}}</button>
            </div>
            <div class="input-main passWord">
                <span class="icon"></span>
                <input type="password" placeholder="请输入密码...." v-model="password">
            </div>
            <div class="input-main passWord">
                <span class="icon"></span>
                <input type="password" placeholder="请再次输入密码...." v-model="re_password">
            </div>
            <button class="btn-in" @click="logoIn">确定</button>
        </div>
    </div>
</div>
    
</template>
<script>
    import qs from 'qs';
    import { Toast } from 'mint-ui';
    export default {
        name : 'logoIn',
        data(){
            return {
                title:'修改密码',
                password:'',
                re_password:'',
                isActive:false,
                message:'',
                btnText:'获取验证码',
                scrollWatch:true,
                msgimg:'',
                mobile:''
            }
        },
        methods:{
             btnGo(){
				this.$router.go(-1);	
			},
            obtain(){
                if(!(/^1[345789]\d{9}$/.test(this.mobile))){ 
                    Toast('手机号码有误,请重新输入');
                    return false; 
                };
                if(this.isActive == true)return;
                this.isActive = true;
                var N = 60,
                    _this = this,
                    clear = null;
                this.axios.post(this.$httpConfig.backPwdSendSms,qs.stringify({
                    mobile:this.mobile
                })).then((res) => {
                    if(res.data.status == 1){
                            Toast({
                                message: res.data.message,
                                duration: 1000
                            });
                            _this.isActive = true;
                            _this.btnText = '请'+ N +'秒后重试';
                            _this.isActive = true;
                            clear = setInterval(function(){
                                _this.btnText = '请'+ N-- +'秒后重试';
                                if(N < 0){
                                    clearInterval(clear);
                                    _this.btnText = '再次获取验证码';
                                    _this.isActive = false;
                                }
                            },1000);
                    }else{
                        Toast({
                            message: res.data.message,
                            duration: 1000
                        });
                    }; 
                }).catch((err) => {
                    console.info('FailtrueErr', err);
                });
            },
            logoIn(){
                if(!(/^1[34578]\d{9}$/.test(this.mobile))){ 
                    Toast('手机号码有误,请重新输入');
                    return false; 
                };
                 if(isNaN(this.message.length)){ 
                    Toast("请输入您的验证码");
                    return false; 
                };
                if(this.password.length<6 || this.password.length>16){
                    Toast("请输入6-16位的密码");
                    return false; 
                }
                 if(this.re_password != this.password){
                    Toast("两次输入的密码不同");
                    return false; 
                }
                this.axios.post(this.$httpConfig.backPwd,qs.stringify({
                    mobile:this.mobile,
                    verify:this.message,
                    password:this.password,
                    re_password:this.re_password,
                })).then((res) => {
                    if(res.data.status == 1){
                        Toast({
                            message: '修改密码成功',
                            duration: 1000
                        });
                        sessionStorage.clear();
                        this.$router.push('/LogIn');
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
            toAcclogoIn(){
                this.$router.push({
                    path : '/LogoIn'
                });
                this.show = false;
            },
        },
        mounted() {
            document.body.scrollTop = 0;
        },
        destroyed(){
            this.scrollWatch = false;
        }
    }
</script>
<style lang="less" scoped>
.teacher-main{
    width: 100%;
    .header{
        background: #c79a01;
        text-align: center;
        color: #fff;
        font-size: .36rem;
        font-weight: 700;
        padding: .16rem 0;
        line-height: .62rem;
        width: 100%;
        position: relative;
        .btnGo{
            position:absolute;
            left:.2rem;
            top:50%;
            margin-top:-.23rem;
            width:.46rem;
            height:.46rem;
            background:url(../../assets/btn-return.png) no-repeat;
            background-size:100% 100%;
        }
    }
}
    .logoin-main{
        padding:0 .6rem;
        background:#fff;
        .from{
            .input-main{
                height:1.1rem;
                margin-top:.3rem;
                position:relative;
                .icon{
                    width:1.1rem;
                    height:100%;
                    position:absolute;
                    left:0;
                    top:0;
                }
                input{
                    width:100%;
                    height:100%;
                    border:none;
                    background:#f5f5f5;
                    text-indent:1.1rem;
                    border-radius:5px;
                    font-size:.28rem;
                }
            }
            .passWord{
                .icon{
                    background:url(../../assets/passWord.png) no-repeat center;
                    background-size:.44rem .51rem;
                }
            }
            .phone-number{
                .icon{
                    background:url(../../assets/phone.png) no-repeat center;
                    background-size:.36rem .5rem;
                }
            }
            .message{
                .icon{
                    background:url(../../assets/message.png) no-repeat center;
                    background-size:.41rem .33rem;
                }
                .btn-ver{
                    width:1.88rem;
                    height:1.04rem;
                    position:absolute;
                    right:.04rem;
                    top:50%;
                    margin-top:-.52rem;
                    border:none;
                    background:#fff;
                    font-size:.26rem;
                    color:#333;
                    border-radius:5px;
                    outline:none;
                }
                .btn-ver:active{
                    background:#ccc;
                    color:#333;
                }
                .btn-ver.active{
                    background:#ccc;
                    color:#333;
                }
            }
        }
        .btn-in{
            width:100%;
            height:1.1rem;
            border:none;
            border-radius:20px;
            outline:none;
            margin-top:.3rem;
            background: #c79a01;
            font-size:.36rem;
            color:#fff;
        }
        .fail-link{
            padding-top:.3rem;
            li{
                width:50%;
                text-align:center;
                font-size:.28rem;
            }
            li:nth-child(1){
                border-right:1px solid #dedede;
                box-sizing:border-box;
                -moz-box-sizing:border-box;
                -webkit-box-sizing:border-box;
                color:#797979;
            }
            li:nth-child(2){
                color:#f9781e;
            }
        }
    }
</style>