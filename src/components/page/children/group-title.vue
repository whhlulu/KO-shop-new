<template>
    <div class="title">{{title}}</div>
</template>
<script>
    export default {
        name : 'hotHeader',
        props:{
            title:''
        }
    }
</script>
<style lang="less" scoped>
    .title{
        width:100%;
        height:.94rem;
        background:url(../../../assets/group-title.png) no-repeat #f1f1f1;
        background-size:100% 100%;
        text-align:center;
        line-height:.94rem;
        font-size:.36rem;
        color:#fc5742;
        font-weight:bold;
    }
</style>