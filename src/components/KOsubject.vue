<template>
    <div>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
        <foot-nav></foot-nav>
    </div>
</template>
<script>
    import footNav from './footer/KOfooter.vue'
    export default {
        name : 'KOsubject',
        data(){
            return {
                
            }
        },
        components:{
            footNav
        }
    }
</script>