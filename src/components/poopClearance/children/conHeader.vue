<template>
    <div>
        <div class="header text-center">{{title}}</div>
    </div>
</template>
<script>
    export default {
        name : 'conHeader',
        props:{
            title:''
        },
        mounted(){
            
        }
    }
</script>
<style lang="less" scoped>
    .header{
        height: .8rem;
        line-height: .8rem;
        font-size: .36rem;
        background:url(../../../assets/conHeader.png) no-repeat;
        background-size:100% 100%;
    }
</style>