<template>
  <div>
    <!-- <keep-alive> -->
            <!-- <router-view v-if="$route.meta.keepAlive"></router-view> -->
        <!-- 这里是会被缓存的视图组件 -->  
        <!-- </keep-alive> -->
        <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      
    }
  },
}
</script>
