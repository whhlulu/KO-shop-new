<template>
    <div class="container">
        <p class="fail-info">{{$route.params.info}}</p>
        <p class="to-link">{{time}}秒 正在为您跳转到登录</p>
    </div>
    
</template>
<script>
export default {
    name : 'authError',
    data(){
        return {
            time:3
        }
    },
    mounted(){
        let _this = this;
        let clear = null;
        clear = setInterval(function(){
            _this.time--;
            if(_this.time <= 0){
                clearInterval(clear);
                    _this.$router.push('/logIn');
            }
        },1000);
    }
}
</script>
<style lang="less" scoped>
    .container{
        p{
            color: gray;
            font-size:.3rem; 
            text-align: center;
        }
        .fail-info{
            padding-top: 3rem; 
        }
        .to-link{
            padding-top:.2rem;
        }
    }
    
</style>
