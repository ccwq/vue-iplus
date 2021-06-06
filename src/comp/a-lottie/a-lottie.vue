<template> <div class="a-lottie-comp"></div></template>
<script>
import lottie from 'lottie-web';

export default {
    name:"a-lottie",
    props: {
        noAutoplay:{
            type:Boolean,
            default:false,
        },
        loop:{
            type:Boolean,
            default:false,
        },
        path:{
            type:String,
            default:"",
        },
        options: {
            type: Object,
            default:__=>({}),
        },
        height: Number,
        width: Number,
    },

    data() {
        return {
            style: {
                width: this.width ? `${this.width}px` : '100%',
                height: this.height ? `${this.height}px` : '100%',
                overflow: 'hidden',
                margin: '0 auto'
            }
        }
    },

    methods: {
        create() {
            const m = this;
            const {path, loop, noAutoplay,options} = m;
            const autoplay = !noAutoplay;
            if (m.anim) {
                m.anim.destroy();
                m.anim = "";
            }
            m.anim = lottie.loadAnimation({
                container: this.$el,
                renderer: 'svg',
                path,
                loop,
                autoplay,
                ...options,
            });
            m.$emit('animCreated', m.anim);
        }
    },

    mounted() {
        const m = this;
        m.$watch("path", {
            immediate:true,
            handler(){
                m.create();
            },
        })

        m.__destroy.then(resp=>{
            m.anim.destroy();
        })
    }
}
</script>


