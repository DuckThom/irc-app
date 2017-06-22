<template>
    <div id="join-button">
        <div id="join-overlay"
             v-bind:class="{ 'hidden' : overlayHidden }">
            <button id="close-overlay" v-on:click="closeOverlay">x</button>

            <input v-model.trim="channel"
                   v-on:keyup.enter="joinChannel"
                   placeholder="Channel or username" />
        </div>

        <button id="join-channel-button" v-on:click="openOverlay">+</button>
    </div>
</template>

<script>
    let data = {
        channel: "",
        overlayHidden: true
    };

    export default {
        data: function () {
            return data;
        },
        methods: {
            joinChannel: function () {
                console.log(data.channel);

                window.socket.emit('join-channel', {
                    channel: data.channel
                });

                data.channel = "";

                this.closeOverlay();
            },

            closeOverlay: function () {
                console.log('closing overlay');

                data.overlayHidden = true;
            },

            openOverlay: function () {
                console.log('opening overlay');

                data.overlayHidden = false;
            }
        }
    }
</script>