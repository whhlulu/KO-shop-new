<template>
<div style="background:#fff;position:absolute;top:0;left:0;right:0;bottom:0;">
    <div v-title :data-title="title">{{title}}</div>
    <div class="teacher-main">
        <header class="header">
            <span @click="btnGo" class="btnGo"></span>
            {{title}}
        </header>
    </div>
    <div class="wrap">
        <div class="input-main passWord">
            <span class="icon"></span>
            <input type="password" placeholder="请输入原密码...." v-model="pass">
        </div>
         <div class="input-main passWord">
            <span class="icon"></span>
            <input type="password" placeholder="请输入新密码...." v-model="password">
        </div>
        <div class="input-main passWord">
            <span class="icon"></span>
            <input type="password" placeholder="请再次输入新密码...." v-model="re_password">
        </div>
        
        <button class="btn-in" @click="register">确定</button>
    </div>
</div>
    
</template>
<script>
    import qs from 'qs';
    import { Toast } from 'mint-ui';
    export default {
        data(){
            return {
                title:'修改密码',
                password:'',
                re_password:'',
                pass:''
            }
        },
        methods:{
            btnGo(){//路由回退一步
                this.$router.go(-1)
            },
            register(){
                if(this.password.length<6&&this.password.length>12){
                    Toast("请输入密码");
                    return false;
                }
                 if(this.re_password !=this.password){
                    Toast("再次输入的密码不一致");
                    return false;
                }
                 if(this.password.length<6 ||this.re_password.length<6){
                 	Toast('请至少输入6位');
                 	return false;
                 }
                this.axios.post(this.$httpConfig.resetPassword,qs.stringify({
                    password:this.pass,
                    new_password1:this.password,
                    new_password2:this.re_password
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
            }
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
    .wrap{
        padding:0 .6rem;
        background:#fff;
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
        .passWord{
            .icon{
                background:url(../../assets/passWord.png) no-repeat center;
                background-size:.44rem .51rem;
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
            margin-bottom:.5rem;
        }
        .btn-in:active{
            box-shadow: 0 5px 5px #ccc;
        }
    }  
</style>