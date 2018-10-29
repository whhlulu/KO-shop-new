<template>
    <div class="info">
        <div class="z_info">
          s-h-o-p-s-n
        </div>
    </div>
</template>
<script>
    export default {
        name : 'paymentinfo',
        data(){
           return {
               
           }
        },
        mounted() {
        }      
    }
</script>
<style lang="less" scoped>
   .info{
     width: 100%;
     height: 1.5rem;
     .z_info{
       text-align: center;
       color: #666;
       line-height: 1.5rem;
     }
     .shop{
         display: none;
     }
    .sn{
        display: none;
    }
   }
</style>