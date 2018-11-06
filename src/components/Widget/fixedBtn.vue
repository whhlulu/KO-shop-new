<template>
  <div>
      <footer>
          <button :text="text" @click="tolink">{{text}}</button>
      </footer>
  </div>
</template>
<script>
    import qs from 'qs';
    import { Toast } from 'mint-ui';
    export default {
        name : 'fixedBtn',
        props:{
            text:null,
            id:'',
            to:'',
            data:'',
            province:'',
            city:'',
            area:'',
            street:'',
        },
        methods:{
            goGoodsOrder(){
                if(sessionStorage.getItem('goods_data')){
                    let data = JSON.parse(sessionStorage.getItem('goods_data'));
                    this.$router.push({
                        name: 'order',
                        params: {
                            good_id:data.id,
                            num:data.num,
                            id: 2
                        }
                    });
                }else{
                    Toast("发生异常！")
                    this.$router.push("/home")
                }
            },
            goCartOrder(){
                if(sessionStorage.getItem('cart_id')){
                    let data = sessionStorage.getItem('cart_id');
                    this.$router.push({
                        name: 'cartOrder',
                        params: {
                            cart_id: data
                        }
                    });
                }else{
                    Toast("发生异常！")
                    this.$router.push("/home")
                }
            },
            SetMealOrder(){
                if(sessionStorage.getItem('collocation_info')){
                    let data = sessionStorage.getItem('collocation_info');
                    this.$router.push({
                        name: 'comboOrder',
                        params: {
                            obj: data
                        }
                    });
                }else{
                    Toast("发生异常！")
                    this.$router.push("/home")
                }
            },
            SetMealCartOrder(){
                if(sessionStorage.getItem('collocation_cart_id')){
                    let data = JSON.parse(sessionStorage.getItem('collocation_cart_id'));
                    this.$router.push({
                        name: 'cartOrderPackage',
                        params: {
                            cart_id: data.id,
                            oldPrice: data.oldPrice,
                            reduction :data.reduction
                        }
                    });
                }else{
                    Toast("发生异常！")
                    this.$router.push("/home")
                }
            },
            SetMeal(){
                if(sessionStorage.getItem('set_meal_id')){
                    let data = sessionStorage.getItem('set_meal_id');
                    this.$router.push({
                        name: 'orderPackage',
                        params: {
                            set_meal_id: data
                        }
                    });
                }else{
                    Toast("发生异常！")
                    this.$router.push("/home")
                }
            },
            //处理选中的发票
            invoiceProcessing(id){
                //店铺id发票id是否开发票
                if(sessionStorage.getItem('invoiceGroup')){
                    let arr = JSON.parse(sessionStorage.getItem('invoiceGroup'));
                    
                    if(arr[this.$route.params.id]){
                        arr[this.$route.params.id] = {id:id,translate:1};
                    }else{
                        arr[this.$route.params.id] = {id:id,translate:1};
                    }
                    
                    sessionStorage.setItem('invoiceGroup',JSON.stringify(arr));
                }else{
                    let invoiceGroup = {};
                    let store_id = this.$route.params.id;
                    invoiceGroup[store_id] ={id:id,translate:1};
                    sessionStorage.setItem('invoiceGroup',JSON.stringify(invoiceGroup));
                }
                //发票选中信息
                if(sessionStorage.getItem('invoiceInit')){ //存在是修改
                    let invoiceIndex = JSON.parse(sessionStorage.getItem('invoiceInit'));
                    if(invoiceIndex[this.$route.params.id]){
                        invoiceIndex[this.$route.params.id][0] = this.$store.state.type;
                        invoiceIndex[this.$route.params.id][1] = this.$store.state.rise;
                        invoiceIndex[this.$route.params.id][2] = this.$store.state.content;
                    }else{
                        invoiceIndex[this.$route.params.id] = [this.$store.state.type,this.$store.state.rise,this.$store.state.content];
                    }
                        sessionStorage.setItem('invoiceInit',JSON.stringify(invoiceIndex));
                }else{ //不存在 新保存一条
                    let invoiceInit = {};
                    let store_id = this.$route.params.id;
                    invoiceInit[store_id] = [this.$store.state.type,this.$store.state.rise,this.$store.state.content];
                    sessionStorage.setItem('invoiceInit',JSON.stringify(invoiceInit));
                }
            },
            //保存发票信息
            saveInvoice(route){
                if(this.$store.state.invoice == false){
                    if(sessionStorage.getItem('invoiceGroup')){
                        let arr = JSON.parse(sessionStorage.getItem('invoiceGroup'));
                        this.$set(arr[this.$route.params.id],"translate",0)
                        delete arr[this.$route.params.id].id;
                        sessionStorage.setItem('invoiceGroup',JSON.stringify(arr));
                    }
                    if(sessionStorage.getItem('invoiceInit')){
                        let index = JSON.parse(sessionStorage.getItem('invoiceInit'));
                        delete index[this.$route.params.id];
                        sessionStorage.setItem('invoiceInit',JSON.stringify(index));
                    }
                    if(route === 1){
                            this.goGoodsOrder();
                        }else if(route === 2){
                            this.goCartOrder();
                        }else if(route === 3){
                            this.SetMealOrder();
                        }else if(route === 4){
                            this.SetMealCartOrder();
                        }else{
                            this.SetMeal();
                        }
                        return;
                }
                if(this.$store.state.type_id == ''){
                    Toast({
                        message: '请选择发票类型',
                        duration: 1000
                    });
                    return;
                }
                if(this.$store.state.rise_id == ''){
                    Toast({
                        message: '请选择或添加发票抬头',
                        duration: 1000
                    });
                    return;
                };
                if(this.$store.state.content_id == ''){
                    Toast({
                        message: '请选择发票内容',
                        duration: 1000
                    });
                    return;
                }
                let sign = sessionStorage.getItem('invoiceSign');
                if(sign && this.$store.state.invoice == true){
                    console.log(1)
                    this.axios.post(this.$httpConfig.cartPackageInvoices,qs.stringify({
                        raised_id:this.$store.state.rise_id,
                        content_id:this.$store.state.content_id,
                        type_id:this.$store.state.type_id
                        })).then((res) => {
                            if(res.data.status==10001){
                                    this.$router.push('/LogIn');
                            }else {
                                if(res.data.status == 1){
                                    this.invoiceProcessing(res.data.data.invoice_id);
                                        // this.$store.state.invoice_package_arr[this.$store.state.invoicePackageIndex] = res.data.data.invoice_id;
                                    if(route === 1){
                                        this.goGoodsOrder();
                                    }else if(route === 2){
                                        this.goCartOrder();
                                    }else if(route === 3){
                                        this.SetMealOrder();
                                    }else if(route === 4){
                                        this.SetMealCartOrder();
                                    }else{
                                        this.SetMeal();
                                    }
                                }else{
                                    Toast(res.data.message);
                                }
                            }
                        }).catch((err) => {
                            console.log(err);
                        });
                                
                }
                if(!sign && this.$store.state.invoice == true){
                    console.log(2)
                    this.axios.post(this.$httpConfig.invoicesOrderAdd,qs.stringify({
                        raised_id:this.$store.state.rise_id,
                        content_id:this.$store.state.content_id,
                        type_id:this.$store.state.type_id
                        })).then((res) => {
                            if(res.data.status==10001){
                                    this.$router.push('/LogIn');
                            }else {
                                if(res.data.status == 1){
                                    this.invoiceProcessing(res.data.data.invoice_id);
                                    if(route === 1){
                                        this.goGoodsOrder();
                                    }else if(route === 2){
                                        this.goCartOrder();
                                    }else if(route === 3){
                                        this.SetMealOrder();
                                    }else if(route === 4){
                                        this.SetMealCartOrder();
                                    }else{
                                        this.SetMeal();
                                    }
                                }else{
                                    Toast(res.data.message);
                                }
                            }
                        }).catch((err) => {
                            console.log(err);
                        });
                }
            },  
            tolink(){
                switch(this.to){
                    case '/address':
                        if(this.data.realname == ''){
                            Toast('收货人姓名不能为空');
                            return;
                        }
                        if(!(/^1[345789]\d{9}$/.test(this.data.mobile))){
                            Toast('手机号格式错误');
                            return;
                        }
                        if(this.data.address == ''){
                            Toast('请填写详细地址');
                            return;
                        }
                        if(this.province){
                            this.axios.post(this.$httpConfig.editAddress,qs.stringify({
                                id:this.data.id,
                                realname:this.data.realname,
                                mobile: this.data.mobile,
                                prov:this.province,
		                        city:this.city,
		                        dist:this.area,
                                address:this.data.address,
                                status:this.data.status
                            })).then((res) => {
                            	if(res.data.status==10001){
							            this.$router.push('/LogIn');
							    }else {
		                            Toast(res.data.message);
		                            if(res.data.status == 1){
		                            this.$router.back();
		                          }
		                       }
                            }).catch((err) => {
                                console.log(err);
                            });
                        }else{
                            this.axios.post(this.$httpConfig.editAddress,qs.stringify({
                                id:this.data.id,
                                realname:this.data.realname,
                                mobile: this.data.mobile,
                                prov:this.data.prov,
		                        city:this.data.city,
		                        dist:this.data.dist,
                                address:this.data.address,
                                status:this.data.status
                            })).then((res) => {
                            	if(res.data.status==10001){
							            this.$router.push('/LogIn');
							    }else {
		                            Toast(res.data.message);
		                            if(res.data.status == 1){
		                            this.$router.back();
		                          }
		                       }
                            }).catch((err) => {
                                console.log(err);
                            });
                        }
                        break;
                    case '/newaddress':
                        if(!this.data.realname){
                            Toast('收货人姓名不能为空');
                            return;
                        }
                        if(!(/^1[3|4|5|7|8][0-9]{9}$/.test(this.data.mobile))){
                        	 Toast('请输入正确手机号');
                            return;
                        }
                        if(!this.data.addressAll){
                            Toast('请选择地址');
                            return;
                        }
                        if(!this.data.address){
                            Toast('请填写详细地址');
                            return;
                        }
                        this.axios.post(this.$httpConfig.addAddress, qs.stringify({
                            realname:this.data.realname,
                            mobile:this.data.mobile,
                            prov:this.province,
                            city:this.city,
                            dist:this.area,
//                         	area:this.street,
                            address:this.data.address,
//                          default:this.data.value,
                            status:this.data.value
                        })).then((res) => {
                        	if(res.data.status==10001){
					               this.$router.push('/LogIn');
					        }else {
									Toast(res.data.message);
                            if(res.data.status == 1){
                                 this.$router.back();
                            }
                         }
                        }).catch((err) => {
                            console.log(err);
                        });
                        break;
                    case '/IntegralMall':
                        this.$router.push('/IntegralMall');
                        break;
                    case '/order1':
                        this.saveInvoice(1);
                        break;
                    case '/order2':
                        this.saveInvoice(2);
                        break;
                    case '/order3':
                        this.saveInvoice(3);
                        break;
                    case '/order4':
                        this.saveInvoice(4);
                        break;
                    case '/order5':
                        this.saveInvoice(5);
                        break;
                        default:;
                }
            }
        },
        watch:{
            
        }  
    }
</script>
<style lang="less" scoped>
    footer{
        width: 100%;
        height: .9rem;
        button{
            position:fixed;
            bottom:0;
            left:0;
            border:none;
            font-size:.32rem;
            color:#fff;
            width: 100%;
            height: .9rem;
            background:#D19E29;
            outline: none;
        }
        button:active{
            box-shadow: 0 -2px 5px #ccc;
        }
    }
</style>