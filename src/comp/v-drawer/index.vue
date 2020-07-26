<template>
    <div class="v-drawer-comp"><slot></slot></div>
</template>
<script>
    import debounce from "lodash/debounce"
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
                el.style.overflow="hidden";
                await new Promise(r => setTimeout(r, 10));
                el.style.height = 0 + "px";
            },
        },

        mounted() {
            const m = this;
            let el = m.$el;
            el.style.transitionProperty = "height";
            if (el) {
                if (m.value) {
                    el.style.height = "auto";
                }else{
                    el.style.height = 0 + "px";
                    el.style.overflow="hidden";
                }
            }

            const changeHandler = debounce(v=>{
                v ? m.open() : m.close();
            }, 30);

            m.$watch("value", {
                immediate: false,
                handler:changeHandler,
            });

            m.$watch("duration", {
                immediate: true,
                handler(duration){
                    el.style.transitionDuration =  m.duration + "s";
                }
            })
        }
    }
</script>
