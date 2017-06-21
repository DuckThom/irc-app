<template>
    <div id="buffer">
        <div id="buffer-list">
            <button class="buffer-button" v-on:click="setActive" v-for="buffer in buffers">
                {{ buffer.name }}
            </button>
        </div>

        <div id="buffer-data">
            <messages v-bind:buffer="activeBuffer"></messages>

            <chat-input v-bind:buffer="activeBuffer"></chat-input>
        </div>
    </div>
</template>

<script>
    const Messages = require('./Messages.vue');
    const ChatInput = require('./ChatInput.vue');

    let data = {
        buffers: [],
        activeBuffer: false
    };

    export default {
        data: function () {
            return data;
        },
        mounted() {
            window.socket.on('channel-message-receive', function (eventData) {
                let bufferName = eventData.to;
                let message = {
                    text: eventData.message,
                    from: eventData.from
                };

                let bufferIndex = data.buffers.findIndex(function (buf) {
                    return buf.name === bufferName;
                });

                if (bufferIndex === -1) {
                    let buffer = {
                        messages: [ message ],
                        name: bufferName,
                        unread: true
                    };

                    data.buffers.push(buffer);

                    if (data.buffers.length === 1) {
                        data.activeBuffer = buffer;
                    }
                } else {
                    data.buffers[bufferIndex].unread = true;
                    data.buffers[bufferIndex].messages.push(message);
                }
            });

            window.socket.on('private-message-receive', function (eventData) {
                let bufferName = eventData.from;
                let message = {
                    text: eventData.message,
                    from: eventData.from
                };

                let bufferIndex = data.buffers.findIndex(function (buf) {
                    return buf.name === bufferName;
                });

                if (bufferIndex === -1) {
                    let buffer = {
                        messages: [ message ],
                        name: bufferName,
                        unread: true
                    };

                    data.buffers.push(buffer);

                    if (data.buffers.length === 1) {
                        data.activeBuffer = buffer;
                    }
                } else {
                    data.buffers[bufferIndex].unread = true;
                    data.buffers[bufferIndex].messages.push(message);
                }
            });

            console.log('Messages component mounted.')
        },
        components: {
            'messages': Messages,
            'chat-input': ChatInput
        },
        methods: {
            setActive: function (event) {
                let bufferName = event.target.innerText;

                let bufferIndex = data.buffers.findIndex(function (buf) {
                    return buf.name === bufferName;
                });

                data.activeBuffer = data.buffers[bufferIndex];

                console.log("switched to " + bufferName);
            }
        }
    }
</script>