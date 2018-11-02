<template>
  <div  v-loading="loading" element-loading-text="上传中……" element-loading-background="hsla(0,0%,100%,.9)">
    <div v-title data-title="我要开店">我要开店</div>
    <top-header :text="title"></top-header>
    <con-header :text ="text[0]" :prompt = "prompt"></con-header>
     <ul class="per-center">
         <li>
            <span> 营业执照号:</span><input class="singo" type="text" placeholder="请输入营业执照号..." v-model="license_number"/>
        </li>
        <li>
            <span> 执照有效期:</span>
            <input type="date" placeholder="请输入起始日期" v-model="validity_start"/>—
            <input type="date" placeholder="请输入起始日期" v-model="validity_end"/>
        </li>
         <li class="businessScope">
            <span> 法定经营范围:</span>
            <textarea type="text" placeholder="请输入法定经营范围..." v-model="scope_of_operation"></textarea>
        </li>
    </ul>
    <div class="idPhotos">
        <h4>营业执照电子版</h4>
        <div>
            <div>
            	<input type="file"  @change="getFile($event)"  v-if="!ImgUrl" class="file"/>
            	<img :src="URL + ImgUrl" v-show="ImgUrl" class="photo" @click="remove"/>
            	 
            </div>
            <!-- <h6>示例</h6>
            <div></div> -->
        </div>
        <p>
	      	  图片建议使用4：3的jpg、gif、png格式的图片，并且图片大小不得超过1M
        </p>
    </div>
    <button @click="nextinfor">提交以上信息,并填写下一页</button>
  </div>
</template>
<script>
import QS from 'qs';
import { Field, Popup, Radio, Toast } from 'mint-ui';
import topHeader from '@/components/page/children/header.vue';
import conHeader from '@/com/conHeader'; // 内容头
export default {
  data () {
      return {
          title:'填写入驻资料',
          text:['企业营业执照'],
          prompt:"(按照证书上的内容逐字填写)",
          license_number:'',
          validity_start:'',
          validity_end:"",
          scope_of_operation:"",
          img:"",
          file:"",
          hide:'',
          size:'',
          loading:false,
          ImgUrl:'',
          shopInfo:{}
      }
  },
  created(){
    if(sessionStorage.getItem('admissionInfo')){
        let shopInfo =  JSON.parse(sessionStorage.getItem('admissionInfo'));
        this.license_number = shopInfo.license_number;
        this.scope_of_operation = shopInfo.scope_of_operation;
        this.ImgUrl = shopInfo.electronic_version;
    }
    if(sessionStorage.getItem('kd_time')){
        let kd_time =  JSON.parse(sessionStorage.getItem('kd_time'));
        this.validity_start = kd_time.validity_start;
        this.validity_end = kd_time.validity_end;
    }
  },
  methods:{
  	remove(){
  		this.ImgUrl=false;
  	},
  	getFile(e){
          this.loading = true;
        //	上传图片
        var file = e.target.files[0]; 
        //限制图片规格尺寸
        var fileSize = 0;         
		     if (!e.target.files) {     
		       var filePath = e.target.value;     
		       var fileSystem = new ActiveXObject("Scripting.FileSystemObject");        
		       var file = fileSystem.GetFile (filePath);     
		       fileSize = file.Size;    
		     } else {    
		      fileSize = e.target.files[0].size;     
		      }   
		      var size = fileSize / 1024;
		      
		       //上传图片
		         var that = this;
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = function(){
	        	that.hide = this.result;
	      }  
				let param = new FormData() // 创建form对象
				    param.append('adv_content', file, file.name) // 通过append向form对象添加数据
				    param.append('chunk', '0') // 添加form表单中其他数据
				let config = {    
					headers: {
						'Content-Type': 'multipart/form-data'
					}   
				}
				this.axios.post(this.$httpConfig.uploadImage, param, config)
					.then((res) => {
                        this.loading = false;
                        if(res.data.status === 1) {
                            that.ImgUrl = res.data.data;
                            Toast({
                                message: res.data.message,
                                duration: 1000
                            });
                        }else{
                            Toast({
                                message: res.data.message,
                                duration: 1000
                            });
                        }
					})

		  },
			nextinfor: function() {
				if(this.license_number==''){
                    Toast({
						message: '营业执照不能为空',
						duration: 1000
					});
					return;
				}
				if(this.validity_start>this.validity_end){
                    Toast({
						message: '开始时间大于结束时间',
						duration: 1000
					});
					return;
				}
				if(this.scope_of_operation==''){
                    Toast({
						message: '法定经营范围不能为空',
						duration: 1000
					});
					return;
                }
                if(this.ImgUrl ==''){
                    Toast({
						message: '请上传营业执照',
						duration: 1000
					});
					return;
                }
                let time1 = new Date(this.validity_start);
                let validity_start = time1.getTime()/1000;
                let time2 = new Date(this.validity_end);
                let validity_end = time2.getTime()/1000;
                if(sessionStorage.getItem('admissionInfo')){
                    let shopInfo =  JSON.parse(sessionStorage.getItem('admissionInfo'));
                    shopInfo.license_number = this.license_number;
                    shopInfo.validity_start = validity_start;
                    shopInfo.validity_end = validity_end;
                    shopInfo.scope_of_operation = this.scope_of_operation;
                    shopInfo.electronic_version = this.ImgUrl;
                    sessionStorage.setItem('admissionInfo',JSON.stringify(shopInfo));
                    sessionStorage.setItem('kd_time',JSON.stringify({validity_start:this.validity_start,validity_end:this.validity_end}));
                    this.$router.push({
                        name: "organizationPhotos"
                    })
                }else{
                    Toast({
                          message: '入驻信息错误',
                          duration: 1000
						});
                }
			},
			load(){
				
			}
	

  },
  components:{
    topHeader,
    conHeader
  }
}
</script>
<style lang="less" scoped>
.idPhotos{
    border-bottom: 1/100rem solid #fff;
    padding: 0 27/100rem;
    h4{
        padding: 30/100rem 0 25/100rem;
        color:#BDBDBD;
        font-size: 32/100rem;
    }
  background-color: #fff;
  div{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        font-size: 32/100rem;
        color:#959595;
        h6{
            padding:0  30/100rem;
        }
       div{
            width: 280/100rem;
            height: 210/100rem;
            border: 1/100rem solid #BDBDBD;
            .photo{
            	width: 100%;
            	height: 100%;
            }
            .file{
            	opacity: 0;
            	width: 100%;
            	height: 100%;
            }
       }
       div:last-child{
           border: 1/100rem dashed  #BDBDBD;
       }
      
  }
   p{   
       margin: 30/100rem 0 40/100rem;
        font-size: 24/100rem;
        color: #959595;
        text-align: left;
       }
}

.per-center{
     
    li{
        background-color: #fff;
        border-bottom: 1px solid #F1F1F1;
        height: 90/100rem;
        display: flex;
        align-items: center;
        font-size: 28/100rem;
        padding: 0 20/100rem;
        span{
          width: 100px;
          font-size: 32/100rem;
          color: #BDBDBD
        }
       
        input{
          width: 260/100rem;
          height: 90/100rem;
          border:0;
          font-size: 28/100rem;
          padding-left: 20/100rem;
          box-sizing: border-box
        }
        .singo{
        	width: 5rem;
          height: 90/100rem;
          border:0;
          font-size: 28/100rem;
          padding-left: 20/100rem;
          box-sizing: border-box
        }
        div{
            font-size: 32/100rem;
            display: flex;
            align-items: center;
             color: #BDBDBD
        }
    }
    .businessScope{
         margin-bottom:10/100rem;
          height: 260/100rem;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        span{
            width: 100%;
            height: 90/100rem;
            display: flex;
            align-items: center;
            text-align: left;
        }
       
        textarea{
            width: 700/100rem;
            height: 160/100rem;
            resize: none;
            border:0;
            padding:10/100rem;
        }
    }
    a{
      width: 100%;height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .rightImg{
        margin-left: 20/100rem;
        width: 24/100rem;
        height: 44/100rem;
    }
   
}
 button{
    margin: 45/100rem 20/100rem 25/100rem;
    height: 90/100rem;
    color:#fff;
    background-color: #D19E29;
    border-radius: 90/100rem;
    border:0;
    width:710/100rem;
    outline:none;
    font-size: 32/100rem
}
p{
    text-align: center;
    line-height:normal;
    .reds{
        color:#FE0100
    }
}
</style>

