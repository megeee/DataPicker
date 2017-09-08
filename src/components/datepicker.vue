<!--
* @DatePicker 日期选择组件
* @author: Jeff Guo
* @github: https://github.com/megeee/DataPicker
-->
<template>
    <div class="datetime-picker" :style="{ width:width }">
        <input
            type="text"
            name="name"  
            :value='value'          
            readonly
            @click="show = !show"
            :placeholder="placeholder"
        >
        <div class="picker-wrap" v-show="show">
            <table class="date-picker">
                <thead>
                    <tr class="date-head">
                        <th colspan="4">
                            <span class="btn-prev" @click="setYear('-')">&lt;</span>
                            <span class="show-month">{{ formatDate(now,"yyyy") }}</span>
                            <span class="btn-next" @click="setYear('+')">&gt;</span>
                        </th>
                        <th colspan="3">
                            <span class="btn-prev" @click="setMonth('-')">&lt;</span>
                            <span class="show-month">{{ formatDate(now,"MM") }}</span>
                            <span class="btn-next" @click="setMonth('+')">&gt;</span>
                        </th>
                    </tr>
                    <tr class="date-days" style="border-bottom:1px solid #f5f5f5">
                        <td v-for="week in weeks"> {{ week }} </td>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="i in 6">
                        <td v-for="j in 7"
                        :date='days[(i == 1 ? j-1 : (i-1) * 7 + j-1)].day'
                        :style="days[(i == 1 ? j-1 : (i-1) * 7 + j-1)].now ? '':'color:#ccc'"
                        :class="days[(i == 1 ? j-1 : (i-1) * 7 + j-1)].day == formatDate(!value ? now :value) ? 'active':''"
                        @click="pickDate(days[(i == 1 ? j-1 : (i-1) * 7 + j-1)].day)"
                        >
                            {{ days[(i == 1 ? j-1 : (i-1) * 7 + j-1)].day.substring(8,10) }}
                        </td>
                    </tr>
                </tbody>
            </table>            
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            show:false,
            value:'',
            now: new Date(),
            weeks:['日','一','二','三','四','五','六'],
            days:[]
        }
    },
    props: {
        width: { 
            type: String, 
            default: '242px' 
        },
        placeholder: { 
            type:String, 
            default: '' 
        },
        defaultValue: {
            type: String,
            default: ''
        },
        //可以是： 'yyyy-MM-dd, yyyy.MM.dd, yyyy/MM/dd'
        format: {
            type:String,
            default: 'yyyy-MM-dd'
        }
    },
    created () {
        if(this.defaultValue){
            this.value = this.defaultValue;
            this.now = new Date(this.defaultValue);
        }
        this.getDays();
    },
    mounted () {
        document.addEventListener('click', (e) => {
            if(this.show){
                if (!this.$el.contains(e.target)) this.show = false
            }            
        })
    },
    methods: {

        pickDate (date) {
            this.now = new Date(date);
            this.value = date;
            this.$emit('change',date);
            this.getDays();
        },

        getDays () {

            let [nowMonthFirstDay,nowMonthLastDay,preMonthLastDay,lastMonthLastDay] = [
                 new Date(this.now.getFullYear(),this.now.getMonth(),1),//当月的第一天
                 new Date(this.now.getFullYear(),this.now.getMonth()+1,0),//当月的最后一天
                 new Date(this.now.getFullYear(),this.now.getMonth(),0),//上个月的最后一天
                 new Date(this.now.getFullYear(),this.now.getMonth()+1,1)//当月的第一天是周内
            ];
            let couFirstDay = nowMonthFirstDay.getDay(); //当月的第一天是周内

            let startDays = (()=>{
                let tempArr = [];
                let length = couFirstDay === 0 ? 7 : couFirstDay;                
                for(let i=length; i>0; i--){
                    tempArr.push({
                        now:false,
                        day:this.formatDate(new Date(this.now.getFullYear(),this.now.getMonth()-1,preMonthLastDay.getDate()-i+1))
                    })
                }
                return tempArr
            })();

            let nowDays = (()=>{
                let tempArr = [];
                let length = nowMonthLastDay.getDate();
                for(let i=0; i<length; i++){
                    tempArr.push({
                        now:true,
                        day:this.formatDate(new Date(this.now.getFullYear(),this.now.getMonth(),i+1))
                    })
                }
                return tempArr;
            })();

            let endDays = (()=>{
                let tempArr = [];
                let length = 42 - nowMonthLastDay.getDate() - startDays.length;
                for(let i=0; i<length; i++){
                    tempArr.push({
                        now:false,
                        day: this.formatDate(new Date(this.now.getFullYear(),this.now.getMonth()+1,i+1))
                    })
                }
                return tempArr;
            })();

            this.days = startDays.concat(nowDays, endDays);

        },

        setMonth (type) {
            type = type === '+' ? 1 : -1;
            this.now = new Date(this.now.getFullYear(),this.now.getMonth()+type);
            this.getDays();
        },
        setYear (type) {
            type = type === '+' ? 1 : -1;
            this.now = new Date(this.now.getFullYear()+type,this.now.getMonth());
            this.getDays();
        },
        formatDate  (date,format) {
            if (typeof date === 'string') {
                date = new Date(Date.parse(date.replace(/-\/./g, "/")));
            }
            let newFormat = format || this.format
            , o = {
                "M+" : date.getMonth()+1,                 //月份
                "d+" : date.getDate(),                    //日
                "h+" : date.getHours(),                   //小时
                "m+" : date.getMinutes(),                 //分
                "s+" : date.getSeconds(),                 //秒
                "q+" : Math.floor((date.getMonth()+3)/3), //季度
                "S"  : date.getMilliseconds()             //毫秒
            };
            if(/(y+)/.test(newFormat)){
                newFormat = newFormat.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
            }
            for(let k in o){
                if(new RegExp("("+ k +")").test(newFormat)){
                    newFormat = newFormat.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                }
            }
            return newFormat;
        }

    }

}

</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
highlight = #3bb4f2
.datetime-picker
    position relative
    display inline-block
    -webkit-font-smoothing antialiased
    color #333
    & > *
        box-sizing border-box
    & > input
        width 100%
        padding 5px 10px
        height 35px
        outline 0 none
        border 1px solid #ddd
        font-size 13px
        border-radius 5px
        cursor pointer
        /*&:focus*/
            /*border 1px solid #f95d5d*/
            /*box-shadow 0px 0px 10px 0px #f95d5d*/
    .picker-wrap
        position absolute
        z-index 1000
        width 242px
        height 280px
        margin-top 1px
        background #fff
        box-shadow 0 0 6px rgba(0,0,0,.3)
        table 
            width 100%
            border-collapse collapse
            border-spacing 0
            text-align center
            font-size 13px
            tr
                height 34px
                border 0 none
            th,td
                user-select none
                width 34px
                height 34px
                padding 0
                border 0 none
                line-height 34px
                text-align center
            td 
                transition background .1s
                cursor pointer
                &:hover
                    background #f0f0f0
                &.date-pass,&.date-future
                    color #aaa
                &.active
                    background highlight
                    color #fff
                &.other
                    color:#ccc
        .date-head
            background highlight
            text-align center
            color #fff
            font-size 14px
            .date-days
                color highlight
                font-size 14px
                border 1px solid #ccc
            .show-year
                display inline-block
                min-width 62px
                vertical-align middle
            .show-month
                display inline-block
                min-width 28px
                vertical-align middle
        .btn-prev,.btn-next 
            cursor pointer
            display inline-block
            padding 0 10px
            vertical-align middle
        .btn-prev:hover,.btn-next:hover
            background rgba(16, 160, 234, 0.5)
</style>