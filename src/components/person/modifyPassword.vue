<template>
    <div>
        <div v-title :data-title="text">{{text}}</div>
        <mo-header :text="text"></mo-header>
        <ul class="from-wrap">
            <li>
                <span class="icon"><i></i></span>
                <input type="password" placeholder="请输入原密码..." v-model="password">
            </li>
            <li>
                <span class="icon"><i></i></span>
                <input type="password" placeholder="请输入新密码..." v-model="newPassword1">
            </li>
            <li>
                <span class="icon"><i></i></span>
                <input type="password" placeholder="请再次输入新密码..." v-model="newPassword2">
            </li>
        </ul>
        <div class="modify-btn" @click="modify">确认修改</div>
    </div>
</template>
<script>
    import moHeader from '@/components/page/children/header.vue';
    import qs from 'qs';
    import { Toast } from 'mint-ui';
    export default {
        name : 'modify',
        data(){
            return {
                text:'修改密码',
                password:'',
                newPassword1:'',
                newPassword2:''
            }
        },
        methods:{
            modify(){
                this.axios.post(this.$httpConfig.resetPassword,qs.stringify({
                    password:this.password,
                    newPassword1:this.newPassword1,
                    newPassword2:this.newPassword2
                })).then((res) => {
                	if(res.data.status==10001){
                		this.$router.push('/LogIn');
                	}else{
                    Toast(res.data.msg);
                    if(res.data.status == 0)return;
                    this.$router.push('/person');
                  }
                }).catch((err) => {
                    console.log(err)
                });
            }
        },
        components:{
            moHeader
        }
    }
</script>
<style lang="less" scoped>
    .from-wrap{
        padding:.4rem .2rem;
        background:#fff;
        li{
            width:6rem;
            height:1.1rem;
            margin-bottom:.2rem;
            padding-left:1.1rem;
            position:relative;
            .icon{
                position:absolute;
                left:0;
                top:0;
                width:1.1rem;
                height:1.1rem;
                i{
                    position:absolute;
                    left:0;
                    top:0;
                    bottom:0;
                    right:0;
                    margin:auto;
                }
            }
            input{
                width:6rem;
                height:1.1rem;
                border:none;
                outline:none;
                font-size:.4rem;
            }
        }
        li:nth-child(1){
            .icon{
                i{
                    width:.44rem;
                    height:.5rem;
                    background:url(../../assets/passWord.png) no-repeat;
                    background-size:100% 100%;
                }
            }
        }
        li:nth-child(2){
            .icon{
                i{
                    width:.44rem;
                    height:.5rem;
                    background:url(../../assets/password_ico_02.png) no-repeat;
                    background-size:100% 100%;
                }
            }
        }
        li:nth-child(3){
            .icon{
                i{
                    width:.44rem;
                    height:.5rem;
                    background:url(../../assets/password_ico_03.png) no-repeat;
                    background-size:100% 100%;
                }
            }
        }
    }
    .modify-btn{
        width:7.1rem;
        height:.9rem;
        color:#fff;
        font-size:.32rem;
        color:#fff;
        background:#d0111b;
        text-align:center;
        line-height:.9rem;
        text-align:center;
        border-radius:20px;
        margin:.2rem auto;
    }
    .modify-btn:active{
        box-shadow: 0 5px 5px #ccc;
    }
</style>