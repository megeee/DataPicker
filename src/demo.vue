<template>
    <div class="demo">
        <datepicker
            @change="pickDate"
            default-value="2017-05-05"
            format="yyyy-MM-dd"
            placeholder="请选择日期">
        </datepicker>
    </div>    
</template>

<script>
import datepicker from "./components/datepicker"
    export default {
        data () {
            return {

            }
        },
        methods: {
            pickDate (v) {
                console.log(v)
            }
        },
        components: {
            datepicker
        }
    }
</script>
<style>
    body{
        margin:0;
        padding:0;
        font-family:Roboto,Helvetica Neue Light,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;;
    }
    .demo{
        margin:20px;
    }
</style>