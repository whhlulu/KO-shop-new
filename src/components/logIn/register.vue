<template>
    <div class="register-wrap">
        <div v-title data-title="注册">注册</div>
        <header class="logoIn-header">
           <span @click="remove" class="btn-back">取消</span>{{title}}
        </header>
        <div class="from">
            <div class="input-main userName">
                <span class="icon"></span>
                <input type="text" placeholder="请输入用户名" v-model="username">
            </div>
            <div class="input-main phone-number">
                <span class="icon"></span>
                <input type="number" oninput="if(value.length > 11)value=value.slice(0, 11)"  placeholder="请输入验证手机号码" v-model="mobile">
            </div>
            <div class="input-main message">
                <span class="icon"></span>
                <input type="text"  placeholder="请输入短信验证码" v-model="message">
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
            <div class="input-main message">
                <span class="icon"></span>
                <input type="text" placeholder="请输入邮箱地址" v-model="email">
            </div>
            <div class="input-main rec">
                <span class="icon"></span>
                <input type="text" placeholder="选填推荐码">
            </div>
            <button class="btn-in" @click="register">注&nbsp;&nbsp;册</button>
        </div>
        <div class="return-btn">
            <router-link to="LogIn" class="btn">已有账号 ></router-link>
        </div>
    </div>
</template>
<script>
    import { Toast } from 'mint-ui';
    import Qs from 'qs'
    export default {
        name : 'register',
        data(){
            return {
                title:this.$constant.mainTitle+'注册',
                username : '',
                mobile:'',
                message:'',
                password:'',
                re_password:'',
                email:'',
                btnText:'获取验证码',
                isActive:false,
                scrollWatch:true,
                // sessionId:''
            }
        },
        methods : {
            remove(){
                this.$router.go(-1);
            },
            obtain(){
                if(!this.username){
                    Toast('请输入用户名');
                    return false; 
                }
                if(this.mobile.length != 11){ 
                    Toast('手机号码有误,请重新输入');
                    return false; 
                };
                if(this.isActive == true)return;
                    var N = 60,
                    _this = this,
                    clear = null;
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
                this.axios.post(this.$httpConfig.verCode,Qs.stringify({
                    mobile:_this.mobile,
                    user_name:this.username
                })).then((res) => {
                    Toast(res.data.message);
                    if(res.data.status ==1){
                    }else{
                        clearInterval(clear);
                        _this.btnText = '再次获取验证码';
                        _this.isActive = false;
                    }
                }).catch((err) => {
                    console.info('FailtrueErr', err);
                });
            },
            register(){
                if(this.username.length<2){
                    Toast("请输入至少两位的用户名");
                    return false;
                }
                 if(this.mobile.length != 11){
                    Toast("请输入您的手机号码");
                    return false;
                }
                if(isNaN(this.message)){
                    Toast("请输入短信验证码");
                    return false;
                }
                if(this.password.length<6){
                    Toast("请输入至少6位的密码");
                    return false;
                }
                if(this.re_password.length<6){
                    Toast("请输入至少6位的确认密码");
                    return false;
                }
                if(!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.email)){
                    Toast("请输入邮箱地址");
                    return false;
                }
                  this.axios({
                    method: 'post',
                    url: this.$httpConfig.register,
                    data:Qs.stringify({
                        user_name:this.username,
                        mobile:this.mobile,
                        verify:this.message,
                        email:this.email,
                        password:this.password,
                        re_password:this.re_password
                    })
                }).then((res) => {
                    Toast(res.data.message);
                    if(res.data.status == 1){
                        this.$router.push('/LogIn');
                    }
                }).catch((err) => {
                    console.log(err)
                });
            }
            

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
    .register-wrap{
        padding:0 .6rem;
        background:#fff;
        .logoIn-header{
            width:100%;
            height:.9rem;
            line-height:.9rem;
            text-align:center;
            font-size:.36rem;
            color:#000;
            position:relative;
            .btn-back{
                width:1.3rem;
                height:100%;
                font-size:.28rem;
                color:#999;
                position:absolute;
                left:-.6rem;
                top:0;
            }
        }
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
                    line-height:100%;
                }
            }
            .userName{
                .icon{
                    background:url(../../assets/images/per_icon_active.png) no-repeat center;
                    background-size:.44rem .55rem;
                }
            }
            .phone-number{
                .icon{
                    background:url(../../assets/images/mobild.png) no-repeat center;
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
                    background:#f9781e;
                    color:#fff;
                }
                .btn-ver.active{
                    background:#f9781e;
                    color:#fff;
                }
            }
            .passWord{
                .icon{
                    background:url(../../assets/passWord.png) no-repeat center;
                    background-size:.44rem .51rem;
                }
            }
            .rec{
                .icon{
                     background:url(../../assets/rec.png) no-repeat center;
                     background-size:.5rem .46rem;
                }
            }
            .btn-in{
                width:100%;
                height:1.1rem;
                border:none;
                border-radius:110/100rem;
                outline:none;
                margin-top:.3rem;
                background:#C79A01;
                font-size:.36rem;
                color:#fff;
                margin-bottom:.3rem;
            }
            .btn-in:active{
                box-shadow: 0 5px 5px #ccc;
            }
        }
        .return-btn{
            height:.95rem;
            width:100%;
            text-align:center;
            line-height:.95rem;
            .btn{
                display:inline-block;
                font-size:.28rem;
                color:#797979;
            }
        }
    }
</style>