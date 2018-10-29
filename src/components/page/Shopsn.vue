<template>
    <div class="shopsn1">
        <div class="z_shopsn" v-html="datas">
          {{datas}}
        </div>
    </div>
</template>
<script>
    export default {
        name : 'shopsn',
        data(){
           return {
                datas:''
           }
        },
        mounted() {
        }      
    }
</script>
<style lang="less" scoped>
   .shopsn{
     width: 100%;
     height: 1.5rem;
     .z_shopsn{
       text-align: center;
       color: #666;
       line-height: 1.5rem;
     }
   }
</style>