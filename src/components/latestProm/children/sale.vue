<template>
    <div>
        <sale-header :title="title"></sale-header>
        <sale-item-list :data="data"></sale-item-list>
    </div>
</template>
<script>
    import saleHeader from './children/latestHeader';
    import saleItemList from './children/saleCon';
    export default {
        name : 'sale',
        data(){
            return {
                title:'人气特卖'
            }
        },
        props:{
            data:''
        },
        components:{
            saleHeader,
            saleItemList
        }
    }
</script>
