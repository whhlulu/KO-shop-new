<template>
    <div class="logoin-main" ref="content">
        <div v-title data-title="登录">登录</div>
        <div>
            <header class="logoIn-header">
                <span @click="remove" class="btn-back">取消</span>{{title}}
            </header>
            <div class="from">
                <div class="input-main userName">
                    <span class="icon"></span>
                    <input type="text" oninput="if(value.length > 11)value=value.slice(0, 11)" placeholder="邮箱/用户名/已验证手机" v-model="userName" >
                </div>
                <div class="input-main passWord">
                    <span class="icon"></span>
                    <input type="text" oninput="if(value.length > 11)value=value.slice(0, 11)" placeholder="请输入密码...." v-model="passWord" v-if="checked">
                    <input type="password" oninput="if(value.length > 11)value=value.slice(0, 11)" placeholder="请输入密码...." v-model="passWord" v-else>
                    <!--@focus="focu" @blur="blu"-->
                    <!--<span class='open'></span>-->
                    <img class='open'  @click="open" v-show="!eye" src="../../assets/openeye.png"/>
                    <img class='close' @click="close" v-show="eye" src="../../assets/closeeye.png"/>
                </div>
                <button class="btn-in" @click="logoIn">登&nbsp;&nbsp;录</button>
            </div>
            <ul class="fail-link clearfix">
                <li class="fl" @click="other">无法登录?</li>
                <li class="fl" @click="goNow">现在注册 ></li>
            </ul>
        </div>
        <dl class="tplogin" v-show="show">
            <dt>
                社交账号一键登录
                <span></span><span></span>
            </dt>
            <dd  @click="qqLogin"></dd>
            <!-- <dd></dd> -->
        </dl>
        <div class="actionsheet" v-show="isActive">
            <div class="box" @click="increment"></div>
            <div class="acti-box" :class="{active:isActive}">
                <ul>
                    <li @click="toback">忘记密码</li>
                    <li @click="toSms">短信验证登录</li>
                </ul>
                <div class="btn" @click="increment">{{cancelText}}</div>
            </div>
        </div>

        <div class="load" v-show="load" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
    </div>
</template>
<script>
    import { Toast } from 'mint-ui';
    import QS from 'qs';
    export default {
        name : 'logIn',
        data(){
            return {
                title:this.$constant.mainTitle+'登录',
                show:true,
                userName:'',
                passWord:'',
                cancelText:'取消',
                isActive:false,
                popupVisible:false,
                scrollWatch:true,
                load:false,
                eye:false,
                checked:false,                
            	screenWidth: document.body.clientWidth
            }
        },
        components:{
			
        },
        watch:{
        	'$route':'fetchdata'
        },
        watch: {
            screenWidth (val) {
                if (!this.timer) {
                    this.screenWidth = val
                    this.timer = true
                    let that = this
                    setTimeout(function () {
                        that.init()
                        that.timer = false
                    }, 400)
                }
            }
        },
        mounted() {
        	const that = this
	        window.onresize = () => {
	            return (() => {
	                window.screenWidth = document.body.clientWidth
	                that.screenWidth = window.screenWidth
	            })()
	        }
            let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            this.$refs.content.style.height = h + 'px';
            document.body.scrollTop = 0;
            //记录一下路径
        },
        destroyed(){
            this.scrollWatch = false;
        },
        methods:{
        	init(){
        		this.show = document.body.clientHeight<500?false:true
        	},
        	open(){
        		this.eye=!this.eye;
        		this.checked=true;
        	},
        	close(){
        		this.checked=false;
        		this.eye=!this.eye
            },
        	qqLogin() {
                
                this.axios.post(this.$httpConfig.qqThirdParty,QS.stringify({
                    type:1,
                })).then((res) => {
                    location.href = res.data.data;
                }).catch((err) => {
                    console.log(err)
                });
        	},
            remove(){//路由回退一步
                this.$router.go(-2);
            },
            //设置登录时的时间
            setTime(){
                let curTime = new Date().getTime();
                localStorage.setItem('cur_Time',curTime);
            },
            logoIn(){//帐户名密码是否正确如果正确跳转主页
                if(this.userName == ''){
                    Toast({
                        message: '账号不能为空',
                        position: 'bottom',
                        duration: 1000
                    });
                    return;
                }
                if(this.passWord.length<6 || this.passWord.length > 16){
                    Toast('请输入6-16位的手机密码');
                    return;
                }
                this.load = true;
                this.axios.post(this.$httpConfig.login,QS.stringify({
                    account:this.userName,
                    password:this.passWord
                })).then((res) => {
                    Toast(res.data.message);
                    this.load = false;
                    if(res.data.status == 1){
                        // this.setTime(); //不要删除
                        this.$router.push('/home')
                        this.show = false;
                    }
                }).catch((err) => {
                    console.log(err)
                });
            },
            goNow(){//跳转注册页
                this.$router.push({
                    path : '/Register'
                });
                this.show = false;
            },
            other(){//无法登录
                this.isActive = true;
            },
            increment(){
                this.isActive = false;
            },
            toSms(){
                this.$router.push({
                    path:'/sms'
                });
                this.show = false;
            },
            toback(){
                this.$router.push({
                    path : '/bachWord'
                });
                this.show = false;
            },
            bindNumber(){
                this.$router.push({
                    path:'/logInBind'
                });
            },
        }
    }
</script>
<style lang="less" scoped>
    .logoin-main{
        padding:0 .6rem;
        background:#fff;
        position: relative;
        .logoIn-header{
            width:100%;
            height:.9rem;
            line-height:.9rem;
            text-align:center;
            font-size:.36rem;
            color:#333;
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
        .logo{
            width:100%;
            height:2.26rem;
            position:relative;
            img{
                width:3.4rem;
                height:.95rem;
                position:absolute;
                left:0;
                bottom:0;
                right:0;
                top:0;
                margin:auto;
            }
        }
        .from{
            padding-top:.8rem;
            .input-main{
                height:1rem;
                margin-bottom:.3rem;
                position:relative;
                .icon{
                    width:1rem;
                    height:90%;
                    position:absolute;
                    left:0;
                    top:0;
                }
                input{
                    width:100%;
                    height:85%;
                    border:none;
                    background:#fff;
                    text-indent:1.1rem;
                    border-radius:5px;
                    font-size:.28rem;
                    border: 1px solid #ccc;
                }
                .open{
                	position: absolute;
                	top: .2rem;
                	width: .5rem;
                	right: .15rem;
                	color: #CCCCCC;
                }
                .close{
                	position: absolute;
                	top: .44rem;
                	width: .35rem;
                	right: .2rem;
                	color: #FF0000;
                }
            }
            .userName{
                .icon{
                    background:url(../../assets/images/per_icon_active.png) no-repeat center;
                    background-size:.44rem .55rem;
                }
            }
            .passWord{
                .icon{
                    background:url(../../assets/passWord.png) no-repeat center;
                    background-size:.44rem .51rem;
                }
            }
        }
        .btn-in{
            width:100%;
            height:.95rem;
            border:none;
            border-radius:25/100rem;
            outline:none;
            margin-top:.3rem;
            background: #C79A01;
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
                color:#C79A01;
            }
        }
        .tplogin{
            width:6.3rem;
            text-align:center;
            position:absolute;
            left:.6rem;
            bottom:0;
            dt{
                width:100%;
                font-size:.24rem;
                color:#9f9f9f;
                text-align:center;
                height:.5rem;
                line-height:.5rem;
                position:relative;
                span{
                    position:absolute;
                    top:50%;
                    width:2rem;
                    height:1px;
                    background:#ccc;
                }
                span:nth-child(1){
                    left:0;
                }
                span:nth-child(2){
                    right:0;
                }
            }
            dd{
                display:inline-block;
                width:1.21rem;
                height:1.21rem;
                background:url(../../assets/qq_icon_login.png) no-repeat;
                background-size:100% 100%;
                margin:.3rem 0;
            }
            dd:nth-child(3){
                margin-left:1.2rem;
                margin-right:1.2rem;
                background:url(../../assets/wx.jpg) no-repeat;
                background-size:100% 100%;
            }
            dd:nth-child(4){
                background:url(../../assets/logoIn-wb.jpg) no-repeat;
                background-size:100% 100%;
            }
        }
        .actionsheet{
            .box{
                position:fixed;
                top:0;
                left:0;
                width:100%;
                height:100%;
                background:rgba(0,0,0,.5);
            }
            .acti-box.active{
                transition:all .5s ease;
                bottom:0;
            }
            .acti-box{
                position:absolute;
                left:.2rem;
                bottom:-3rem;
                width:7.1rem;
                transition:all .5s ease;
                ul{
                    border-radius:5px;
                    overflow:hidden;
                    text-align:center;
                    li{
                        width:100%;
                        height:.9rem;
                        background:#fff;
                        line-height:.9rem;
                        font-size:.36rem;
                        color:#007aff;
                    }
                    li:nth-child(1){
                        border-bottom:1px solid #d6d6de;
                    }
                }
                .btn{
                    width:100%;
                    background:#fff;
                    line-height:.9rem;
                    font-size:.36rem;
                    color:#007aff;
                    text-align:center;
                    margin:.15rem 0;
                    border-radius:5px;
                }
            }
        }
    }
</style>