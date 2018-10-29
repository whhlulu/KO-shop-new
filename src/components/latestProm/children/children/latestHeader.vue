<template>
    <div>
        <header class="text-center">{{title}}</header>
    </div>
</template>
<script>
    export default {
        name : 'latestHeade',
        props:{
            title:''
        }
    }
</script>
<style lang="less" scoped>
    header{
        height: .7rem;
        line-height:.7rem;
        background:url(../../../../assets/latest-bj.png) no-repeat center #f1f1f1;
        background-size:1.88rem .04rem;
        font-size:.28rem;
        color:#ce0a14;
    }
</style>