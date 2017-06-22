<template>
    <div id="buffer">
        <div id="buffer-list">
            <button class="buffer-button" v-on:click="setActive" v-for="buffer in buffers">
                {{ buffer.name }}
            </button>

            <join-button></join-button>
        </div>

        <buffer-data v-bind:buffer="activeBuffer"></buffer-data>

        <div v-if="!bottomOfMessageList">
            <button id="scroll-to-bottom-button" v-on:click="scrollToBottom">
                <i class="fa fa-arrow-down" aria-hidden="true"></i>
            </button>
        </div>

        <chat-input v-bind:buffer="activeBuffer"></chat-input>
    </div>
</template>

<script>
    const BufferData = require('./BufferData.vue');
    const ChatInput = require('./ChatInput.vue');
    const JoinButton = require('./JoinButton.vue');
    const config = require('../../../config.json');
    const Vue = require('vue');

    let data = {
        bottomOfMessageList: true,
        buffers: [],
        activeBuffer: false
    };

    let methods = {
        setActive: function (event) {
            let bufferName = event.target.innerText;
            let bufferIndex = data.buffers.findIndex(function (buf) {
                return buf.name === bufferName;
            });

            data.activeBuffer = data.buffers[bufferIndex];

            methods.checkBottomMessageList();
            methods.scrollToLastMessage();
        },

        scrollToBottom: function (event) {
            methods.scrollToLastMessage(true);
        },

        checkBottomMessageList: function () {
            Vue.nextTick(function () {
                let ml = document.getElementById('message-list');

                if (ml === null) {
                    return;
                }

                data.bottomOfMessageList = ml.offsetHeight + ml.scrollTop === ml.scrollHeight;
            });
        },

        addMessageToBuffer: function (buffer, message) {
            buffer.unread = true;
            buffer.messages.push(message);

            if (buffer.name === data.activeBuffer.name) {
                Vue.nextTick(function () {
                    methods.scrollToLastMessage();
                });
            }
        },

        scrollToLastMessage: function (force = false) {
            let messageList = document.getElementById('message-list');

            if (messageList === null) {
                return;
            }

            // Check if the user is not at the bottom of the list
            if (!data.bottomOfMessageList && !force) {
                return;
            }

            let messages = messageList.getElementsByClassName('message');

            messages[messages.length - 1].scrollIntoView({
                block: 'end',
                behavior: 'smooth'
            });
        }
    };

    export default {
        data: function () {
            return data;
        },
        mounted() {
            this.$on('message-scroll', function (eventData) {
                data.bottomOfMessageList = eventData.bottom;
            });

            window.addEventListener('resize', function () {
                methods.checkBottomMessageList();
            });

            window.socket.on('channel-message-receive', function (eventData) {
                let bufferName = eventData.to;
                let message = {
                    text: eventData.message,
                    from: eventData.from,
                    highlight: (eventData.message.indexOf(config.irc.nickname) > -1)
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
                } else {
                    methods.addMessageToBuffer(data.buffers[bufferIndex], message);
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
                } else {
                    methods.addMessageToBuffer(data.buffers[bufferIndex], message);
                }
            });

            console.log('Messages component mounted.')
        },
        components: {
            'buffer-data': BufferData,
            'chat-input': ChatInput,
            'join-button': JoinButton
        },
        methods: methods
    }
</script>