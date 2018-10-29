<template>
    <div>
        <order-nav></order-nav>
        <order-con></order-con>
    </div>
</template>
<script>
    import orderNav from './children/headerNav.vue';
    import orderCon from './whole.vue';
    export default {
        name : 'order',
        data(){
            return {
                scrollWatch:true
            }
        },
        mounted() {
            document.body.scrollTop = 0;
        },
        destroyed(){
            this.scrollWatch = false;
        },
        components:{
            orderNav,
            orderCon
        }
    }
</script>