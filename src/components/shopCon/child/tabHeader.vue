<template>
  <div>
     <ul class="content">
          <li :class="{active: sortHead == index}" v-for="(item, index) in sortData" :key="index" @click = "proSort(index)">{{item}}</li>
      </ul>
  </div>
</template>
<script>
import qs from "qs"
export default {
  data () {
      return {
          sortHead:this.tabdata,
          store_sort:'',
          store_sales:'',
          grade_id:'',
          shoplists:''
      }
  },
methods:{
    proSort(index){
        this.$store.state.shop_class_show = false;
        if(this.sortHead == index)return;
        this.sortHead = index;
        this.$emit("sortCon",index);
      }
},
  props:{
      sortData:"",
      tabdata:''
  }
}
</script>
<style lang="less" scoped>


.content{
    background-color: #fff;
    display: flex;
    border-bottom: 1/100rem solid #CBCBCB;
    li{
        display: flex;
        height: 50/100rem;
        margin: 20/100rem 0;
        justify-content: center;
        align-items: center;
        flex:1;
        border-right: 1/100rem solid #CBCBCB;
        &:last-child{
            border:0
        }
        
    }
    .active{
        color: #D4B660;
    }
}
</style>
