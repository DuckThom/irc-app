<template>
    <form id="chat-form" v-on:submit="sendMessage">
        <input type="text" placeholder="Message..." id="chat-input" />
    </form>
</template>

<script>
    export default {
        props: ['buffer'],
        data: function () {
            return {};
        },
        mounted() {
            console.log('Messages component mounted.')
        },
        methods: {
            sendMessage: function (event) {
                event.preventDefault();
                const input = document.getElementById('chat-input');

                console.log(input.value);
                input.value = "";
            }
        }
    }
</script>