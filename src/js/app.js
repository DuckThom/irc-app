require('./bootstrap');

let Vue = require('vue');

Vue.component('buffers', require('./components/Buffers.vue'));

window.vueApp = new Vue({
    el: '#app',
    components: [
        'buffers'
    ]
});