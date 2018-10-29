<template>
    <div>
        <div v-title :data-title="title">{{title}}</div>
        <newHeader :text="title" :set="true"></newHeader>
        <list></list>

        <div class="load-wrap" v-show="load_wrap" @touchmove.prevent><mt-spinner type="triple-bounce" color="rgb(38, 162, 255)"></mt-spinner></div>
    </div>
</template>
<script>
    import newHeader from './children/header';
    import list from './children/news_list';
    import qs from 'qs';
    export default {
        name : 'news_list',
        data(){
            return {
                title:'我的消息',
                load_wrap:true
            }
        },
        components:{
            newHeader,
            list
        },
        mounted(){
            if(sessionStorage.getItem('user_ID')){
                this.axios.post(API_URL + 'Home/News/my_news',qs.stringify({
                    app_user_id:sessionStorage.getItem('user_ID')
                })).then((res) => {
                    this.$store.state.news_data = res.data.data;
                    this.load_wrap = false;
                }).catch((err) => {
                    console.log(err);
                });
            }else{
                this.$router.push('/LogoIn')
            }
        }
    }
</script>
<style scoped lang="less">

</style>