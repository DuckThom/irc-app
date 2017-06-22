<template>
    <div id="chat-form" v-on:submit="sendMessage">
        <input type="hidden" v-bind:value="buffer.name" id="buffer-name" />
        <input v-model="messageText" placeholder="Message..." id="chat-input" v-on:keyup.enter="sendMessage" />
    </div>
</template>

<script>
    let data = {
        messageText: ''
    };

    export default {
        props: ['buffer'],
        data: function () {
            return data;
        },
        mounted() {
            console.log('Messages component mounted.')
        },
        methods: {
            sendMessage: function () {
                window.socket.emit('send-message', {
                    to: this.buffer.name,
                    text: this.messageText
                });

                this.messageText = '';
            }
        }
    }
</script>