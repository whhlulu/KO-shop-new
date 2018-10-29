<template>
  <div>
      <ul class="content">
          <li :class="{active: sortHead == index}" v-for="(item, index) in sortData" :key="index" @click = "proSort(index)">
              <div>
                  <h4>{{appraisalNum[index]}}</h4>
                  <h6>{{item}}</h6>
              </div>
          </li>
      </ul>
  </div>
</template>
<script>
export default {
  data () {
      return {
          sortHead:this.tabdata,
      }
  },
  methods:{
    proSort(index){
        if(this.sortHead == index)return;
        this.sortHead = index;
        window.scroll(0,0);
        this.$emit("sortCon",index);
      }
  },
  props:{
      sortData:"",
      tabdata:'',
      appraisalNum:'',
      count:''
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
        height: 80/100rem;
        padding: 20/100rem 0;
        margin:0 .6rem;
        justify-content: center;
        align-items: center;
        flex:1;
        div{
            text-align: center;
            h4{
                font-size: .4rem;
            }
            h6{
                font-size: .24rem;
                color: #CECECE;
            }
        }
    }
    .active{
        border-bottom: 3/100rem solid #D4B660;
    }
}
</style>
