<template>
	<div>
		<div class="hd clearfix">
			<div class="title fl">{{text}} <span>{{prompt}}</span> </div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'conHeader',
		data() {
			return {

			}
		},
		props: {
			text: null,
			prompt: ''
		},
		methods: {}
	}
</script>
<style scoped lang="less">
	.hd {
		padding: .2rem;
		.title {
			border-left: 3px solid #E8C441;
			padding-left: .2rem;
			font-size: .32rem;
			color: #111111;
		}
		span {
			font-size: 18/100rem;
			color: #989898;
		}
	}
</style>