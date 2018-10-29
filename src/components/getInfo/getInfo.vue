<!-- 青菜  新增-->
<script>
var urlParam1 =window.location.href;
var	urlParam2 = urlParam1.split('?');
var urlParam3 = urlParam2[1].split('=');
var	urlParam = urlParam3[1];
export default {
        created() {
            console.log(urlParam1)
        	console.log(urlParam)

            sessionStorage.setItem('user_ID', urlParam);
            localStorage.setItem('user_ID',urlParam);
                this.$router.push({
                    path : '/home'
                });

        },


    }
</script>



