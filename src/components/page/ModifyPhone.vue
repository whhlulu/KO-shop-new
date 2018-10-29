<template>
    <div>
        <div v-title :data-title="title">{{title}}</div>
        <phone-header :text="title"></phone-header>
        <div class="from">
            <div class="input-main phone-number">
                <span class="icon"></span>
                <input type="text" placeholder="请输入验证手机号码" v-model="mobile">
            </div>
            <div class="input-main message">
                <span class="icon"></span>
                <input type="text" placeholder="请输入短信验证码" v-model="message">
                <button class="btn-ver" :class="{active:isActive}" @click="obtain">{{btnText}}</button>
            </div>
            <button class="btn-in" @click="">确认修改</button>
        </div>
    </div>
</template>
<script>
    import phoneHeader from './children/header.vue';
    export default {
        name : 'phone',
        data(){
            return {
                title:'修改手机号绑定',
                username : '',
                mobile:'',
                //短信验证
                message:'',
                btnText:'获取验证码',
                isActive:false,
                scrollWatch:true
            }
        },
        components:{
            phoneHeader
        },
        methods : {
            remove : function(){
                this.$router.go(-1);
            },
            obtain : function(){
                if(!(/^1[345789]\d{9}$/.test(this.mobile))){
                    alert("手机号码有误，请重填");  
                    return false; 
                };
                var _this = this;
                if(this.isActive == true)return;
                this.isActive = true;
                var N = 5,
                    _this = this,
                    clear = null;
                this.btnText = '请'+ N +'秒后重试';
                this.isActive = true;
                this.axios({
                    method:'get',
                    url:API_URL + 'Home/Sign/phoneCode',
                    params:{
                        mobile:this.mobile
                    }
                })
                .then((res) => {
                    console.log(res);
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
    .from{
        background:#fff;
        padding:0 .2rem;
        overflow:hidden;
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
            height:1.1rem;
            border:none;
            border-radius:20px;
            outline:none;
            margin-top:.3rem;
            background:#d0111b;
            font-size:.36rem;
            color:#fff;
        }
    }
</style>