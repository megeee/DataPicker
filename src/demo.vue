<template>

    <div class="demo_block">
        <h2>基本用法：</h2>
        <div class="source">
            <lz-datepicker
                @change="pickDate"
                placeholder="请选择日期">
            </lz-datepicker>
        </div>
    </div>
    
</template>

<script type="text/ecmascript-6">
import lzDatepicker from "./datepicker"
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
            lzDatepicker
        }
    }
</script>