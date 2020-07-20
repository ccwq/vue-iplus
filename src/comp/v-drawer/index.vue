<template>
    <div class="v-drawer-comp"><slot></slot></div>
</template>
<script>
    export default {
        name: "v-drawer",

        data() {
            return {
                expand: false
            }
        },

        props:{
            value:{
                default: false,
                type:Boolean,
            },

            //动画间隔
            duration:{
                default:0.5,
                type:Number,
            },
        },

        methods: {
            open() {
                const m = this;
                let el = m.$el;
                clearTimeout(m.__open_t);
                el.style.transitionDuration = m.duration + "s";
                el.style.transitionProperty = "height";
                el.style.height = el.scrollHeight + "px";
                m.__open_t = setTimeout(_ => {
                    el.style.height = "auto";
                    el.style.overflow="visible";
                }, m.duration * 1000);
            },

            async close(){
                const m = this;
                let el = m.$el;
                clearTimeout(m.__open_t);
                el.style.height = el.scrollHeight + "px";
                el.style.transitionDuration =  m.duration + "s";
                el.style.transitionProperty = "height";
                el.style.overflow="hidden";
                await new Promise(r => setTimeout(r, 0));
                el.style.height = 0 + "px";
            },
        },

        mounted() {
            const m = this;
            let el = m.$el;
            if (el) {
                if (m.value) {
                    el.style.height = "auto";
                }else{
                    el.style.height = 0 + "px";
                    el.style.overflow="hidden";
                }
            }
            m.$watch("value", {
                immediate: false,
                handler(v){
                    v ? m.open() : m.close();
                },
            });
        }
    }
</script>
