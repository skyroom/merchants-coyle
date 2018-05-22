<template lang='html'>
	<div>
		<div id="index">
        欢迎光临蔚为大观点餐平台管理系统
    	</div>
	</div>
</template>
<script>
import BaseComponent from './base';
import Auth from './auth';

export default{
    extends: BaseComponent,
    mixins: [Auth],
};
</script>
<style lang='less'>
#index {
    font-size: 20px;
    color: rgb(225, 229, 234);
    font-weight: bolder;
}
</style>
