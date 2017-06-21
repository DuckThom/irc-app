<template>
    <div id="message-list" v-if="buffer">
        <div class="message" v-for="message in buffer.messages">
            <span class="from">{{ message.from }}</span>
            <div class="text">{{ message.text }}</div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['buffer'],
        data: function () {
            return {};
        },
        mounted() {
            console.log('Messages component mounted.')
        }
    }
</script>