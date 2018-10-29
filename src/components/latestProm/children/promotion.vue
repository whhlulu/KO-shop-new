<template>
    <div>
        <pro-header :title="title"></pro-header>
        <img class="banner" v-lazy="URL + item.pic_url" v-for="item in banner" :key="item.id">
        <pro-item-list :data="data"></pro-item-list>
        <pro-header :title="hot_selected"></pro-header>
        <hot-selected-list :data="data.promotions" :banner="data.promotions_img"></hot-selected-list>
    </div>
</template>
<script>
    import proHeader from './children/latestHeader';
    import proItemList from './children/latestCon.vue';
    import hotSelectedList from '@/components/Widget/moveCon';
    export default {
        name : 'promotion',
        data(){
            return {
                title:'热卖促销',
                hot_selected:'热卖精选'
            }
        },
        props:{
            banner:'',
            data:''
        },
        components:{
            proHeader,
            proItemList,
            hotSelectedList
        }
    }
</script>
<style lang="less" scoped>
    .banner{
        width: 100%;
    }
</style>