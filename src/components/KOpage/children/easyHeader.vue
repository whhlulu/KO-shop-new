<template>
    <header class="header">
        <span @click="btnGo" class="btnGo"></span>
        <span class="title">{{title}}</span>
    </header>
</template>
<script>
    export default {
        name: 'easy-header',
        data() {
            return {
            }
        },
        props: {
            title: null,
        },
        methods: {
            btnGo() {
                switch (this.title) {
                    case '我的收藏':
                    case '我的足迹': {
                        this.$router.push({
                            name: 'KOperson'
                        })
                    }
                        break;
                    default:
                        this.$router.go(-1);
                        break;
                }
            },
        }
    }
</script>
<style lang="less" scoped>
    .header {
        width: 100%;
        height: .62rem;
        background: #D19E29;
        padding: .16rem 0;
        text-align: center;
        position: relative;
        color: #fff;
        font-size: .36rem;
        font-weight: bold;
        line-height: .62rem;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
        .btnGo {
            position: absolute;
            left: .2rem;
            top: 50%;
            margin-top: -.23rem;
            width: .46rem;
            height: .46rem;
            background: url(../../../assets/btn-return.png) no-repeat;
            background-size: 100% 100%;
        }
        .title {
            font-size: .32rem;
        }
    }
</style>