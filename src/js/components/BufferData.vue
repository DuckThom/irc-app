<template>
    <div id="buffer-data" v-if="buffer">
        <header>
            <h3>{{ buffer.name }}</h3>
        </header>

        <div id="message-list">
            <div class="message" v-for="message in buffer.messages">
                <span class="from">{{ message.from }}</span>
                <div class="text">{{ message.text }}</div>
            </div>
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