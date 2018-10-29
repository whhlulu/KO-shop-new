
<template>
</template>
    <!-- 三千 新增-->
<script>
    import { Toast } from 'mint-ui';
    import QS from 'qs';


export default {
        created() {
            let user_ID = this.$route.params.userId;
            sessionStorage.setItem('user_ID', user_ID);
            localStorage.setItem('user_ID',user_ID);
            this.$router.push({
                path : '/home'
            });
            
        },


    }
</script>



