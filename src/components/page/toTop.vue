<template>
	<div class="slide" ref="img">
		<img class="to-top" v-if="status" @click="toTop" :class="fade_out"  ref="img" src="../../assets/totop-1.png" alt="">
	</div>
</template>
<script>

	export default {
		name: 'fadeOut',
		data() {
			return {
                fade_out:'to-top',
                status:false
			}
        },
        methods:{
            toTop(){
                $('html,body').animate({scrollTop: '0px'}, 300);
            }
        },
		mounted(){
            let _this = this;
            window.addEventListener('scroll',function(){
                if(!_this.$refs.img)return;
                let scrollHeight= document.documentElement.scrollTop || document.body.scrollTop;
                if(scrollHeight > 1000){
                    _this.status = true;
                    _this.fade_out = 'fadeIn';
                }else{
                    _this.fade_out = 'fadeOut';
                }
            })
        }
		
	}

</script>

<style lang="less" scoped>
	.slide {
		.to-top{
            position: fixed;
			width: .75rem;
			height: .75rem;
			bottom: 1.6rem;
            right: .3rem;
            z-index: 9999999;
        }
        .fadeOut{
            pointer-events:none;
            -webkit-animation:FadeOut .5s linear forwards;
            animation:FadeOut .5s linear forwards;
            @-webkit-keyframes FadeOut{
                0%{
                    opacity:1
                    }
                100%{
                    opacity:0
                    }
                }
                @keyframes FadeOut{
                0%{
                    opacity:1
                    }
                100%{
                    opacity:0
                    }
                }
        }
        .fadeIn{
            -webkit-animation:FadeIn .5s linear forwards;
            animation:FadeIn .5s linear forwards;
            @-webkit-keyframes FadeIn{
                0%{
                    opacity:0
                    }
                100%{
                    opacity:1
                    }
                }
            @keyframes FadeIn{
                0%{
                    opacity:0
                    }
                100%{
                    opacity:1
                    }
                }
        }
    }
		
</style>