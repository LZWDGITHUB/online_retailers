<template>
    <div class="home">
        登陆成功
    </div>
</template>
<script>
import {getUserList} from '@/api/index.js'
export default {
    mounted () {
        let params = {params: {query: '', pagenum: 1, pagesize:  1}}
        getUserList(params).then(res => {
            window.console.log(res)
        })
    }
}
</script>
<style lang="scss" scoped>

</style>
