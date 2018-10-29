<template>
  <div>
     <transition name="slide">
	  	<router-view></router-view>
	</transition>
  </div>
</template>

<script>
//	setInterval(function(){
//        localStorage.clear();
//   },1440000);
export default {
        name:'searchList',
        data(){
            return {
                
            }
        },
       mounted(){
       	 
       },
        created(){
//      	this.$router.beforeEach((to, from, next) => {
//			    console.log(from.name,'上一级');
//			    next();
//			});
        },
        methods:{
					
        }
}
</script>
