<template>
    <div id="buffer">
        <div id="buffer-list">
            <button class="buffer-button" v-on:click="setActive" v-for="buffer in buffers">
                {{ buffer.name }}
            </button>
        </div>

        <buffer-data v-bind:buffer="activeBuffer"></buffer-data>

        <chat-input v-bind:buffer="activeBuffer"></chat-input>
    </div>
</template>

<script>
    const BufferData = require('./BufferData.vue');
    const ChatInput = require('./ChatInput.vue');

    let data = {
        buffers: [],
        activeBuffer: false
    };

    function addMessageToBuffer (buffer, message) {
        let messageList = document.getElementById('message-list');

        buffer.unread = true;
        buffer.messages.push(message);

        if (buffer === data.activeBuffer) {
            messageList.scrollTop = messageList.scrollHeight;
        }
    }

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
                        unread: true,
                        active: false
                    };

                    data.buffers.push(buffer);

                    if (data.buffers.length === 1) {
                        data.activeBuffer = buffer;
                    }
                } else {
                    addMessageToBuffer(data.buffers[bufferIndex], message);
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
                        unread: true,
                        active: false
                    };

                    data.buffers.push(buffer);

                    if (data.buffers.length === 1) {
                        data.activeBuffer = buffer;
                    }
                } else {
                    addMessageToBuffer(data.buffers[bufferIndex], message);
                }
            });

            console.log('Messages component mounted.')
        },
        components: {
            'buffer-data': BufferData,
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