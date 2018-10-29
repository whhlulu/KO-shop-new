<template>
    <div ref="box">
        <div v-title :data-title="title">{{title}}</div>
        <header class="header">
			<span class="customTitle">{{title}}</span>
		</header>
        <div class="from">
            <div class="input-main phone-number">
                <span class="icon"></span>
                <input type="text" maxlength="11"  placeholder="请输入验证手机号码" v-model="mobile">
            </div>
            <div class="input-main message">
                <span class="icon"></span>
                <input type="text" placeholder="请输入短信验证码" v-model="message">
                <button class="btn-ver" :class="{active:isActive}" @click="obtain">{{btnText}}</button>
            </div>
            <button class="btn-in" @click="nextStep">下一步</button>
        </div>
    </div>
</template>

<script>
import { Toast } from 'mint-ui';
import QS from 'qs';
export default {
    name: 'authLogin',
    data(){
        return {
            title:'手机号码绑定',
            username : '',
            mobile:'',
            //短信验证
            message:'',
            btnText:'获取验证码',
            isActive:false,
            scrollWatch:true,
        }
    },
    mounted(){
        document.body.scrollTop = 0;
        this.$refs.box.style.height = "100%";
        this.$refs.box.style.backgroundColor = "#fff";
    },
    methods:{
        toLink(link){
            this.$router.push(link);
        },
        //下一步
         nextStep(){
            if(!(/^1[34578]\d{9}$/.test(this.mobile))){ 
                Toast("手机号码有误，请重填");  
                return false; 
            };
            if(isNaN(this.message)){ 
                Toast("手机验证码有误，请重填");  
                return false; 
            };
            this.axios.post(this.$httpConfig.bindAccount,QS.stringify({
                mobile:this.mobile,
                verify:this.message,
            })).then((res) => {

                Toast(res.data.message);   

                if(res.data.status == 1) {
                    this.$router.push({
                        name: 'person'
                    })   
                }
            }).catch((err) => {
                console.info('FailtrueErr', err);
            });
        },
        //获取短信
        obtain (){
            if(!(/^1[34578]\d{9}$/.test(this.mobile))){ 
                Toast("手机号码有误，请重填");  
                return false; 
            };
            var _this = this;
            if(this.isActive == true)return;
            this.isActive = true;
            var N = 60,
                _this = this,
                clear = null;
            this.btnText = '请'+ N +'秒后重试';
            this.isActive = true;
            this.axios.post(this.$httpConfig.thiredCheckMobile,QS.stringify({
                    mobile:this.mobile
            }))
            .then((res) => {
                if(res.data.status==10001){
                    this.$router.push('/LogIn');
                }else{
                    Toast(res.data.message);
                    if(res.data.message=="该手机号已绑定其他账号!"){
                        clearTimeout(clear)
                        _this.isActive = false;
                            this.btnText = '获取验证码';
                            this.mobile = '';
                    }else if(res.data.status == 1){
                        Toast(res.data.message);
                        
                    }
                }
            }).catch((err) => {
                console.info('FailtrueErr', err);
            });
            clear = setInterval(function(){
                _this.btnText = '请'+ N-- +'秒后重试';
                if(N < 0){
                    clearInterval(clear);
                        _this.btnText = '再次获取验证码';
                        _this.isActive = false;
                }
            },1000);
        }
    }
}
</script>
<style lang="less" scoped>
    div{
        .header {
            width: 100%;
            height: .62rem;
            background: #D19E29;
            padding: .16rem 0;
            text-align: center;
            color: #fff;
            font-size: .36rem;
            font-weight: bold;
            line-height: .62rem;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1;
            .customTitle {
                font-size: .32rem;
            }
        }
        .from{
            background:#fff;
            padding:0 .2rem;
            overflow:hidden;
            padding-top: 1rem;
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
            .phone-number{
                .icon{
                    background:url(../../../assets/images/mobild.png) no-repeat center;
                    background-size:.36rem .5rem;
                }
            }
            .message{
                .icon{
                    background:url(../../../assets/images/code.png) no-repeat center;
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
            .btn-in{
                width:100%;
                height:1rem;
                border:none;
                border-radius:1.1rem;
                outline:none;
                margin-top:.3rem;
                background:#C79A01;
                font-size:.36rem;
                color:#fff;
            }
        }
    }
</style>