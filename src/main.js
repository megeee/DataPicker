import Vue from 'vue'
import demo from './demo'

Vue.config.productionTip = false

new Vue({
    el: '#demo',
    template: '<demo/>',
    components: { demo }
})