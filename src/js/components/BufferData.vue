<template>
    <div id="buffer-data">
        <div v-if="buffer">
            <header>
                <h3>{{ buffer.name }}</h3>
            </header>

            <div id="message-list" v-on:scroll="checkBottomOfMessages">
                <div v-bind:class="{ highlight : message.highlight }" class="message"
                     v-for="message in buffer.messages">
                    <span class="sender">@{{ message.from }}</span>
                    <div class="text">{{ message.text }}</div>
                </div>
            </div>
        </div>
        <div class="no-buffer-selected" v-else="buffer">
            <h2>Select a buffer on the left or join a new channel</h2>
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
            console.log('BufferData component mounted.')
        },
        methods: {
            checkBottomOfMessages: function (event) {
                let messageList = event.target;

                this.$parent.$emit('message-scroll', {
                    bottom: (messageList.offsetHeight + messageList.scrollTop === messageList.scrollHeight)
                })
            }
        }
    }
</script>