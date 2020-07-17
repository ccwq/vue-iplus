<template lang="pug">
    .v-box-comp()
        slot(name="header")
        ._container_wp
            resizer(
                v-if="!disableSizeCalc"
                @input="sizeHandler"
                :offsetHeight="offsetX"
                :offsetWidth="offsetY"
            )
            ._container(v-if="!raiseSlot")
                slot( :size="size" :width="size[0]" :height="size[1]")
            template( v-else)
                span.__slot_anchor(ref="slot_anchor")
                slot( :size="size" :width="size[0]" :height="size[1]" className="_container")
        slot(name="footer")

</template>
<script>
    import resizer from "../resizer/"
    export default {
        name: "v-box",
        components: {resizer},
        data(){
            return {
                size:[],
            }
        },

        props: {

            //提升slot，以替换container的位置
            //需要slot为单节点
            raiseSlot:{
                type:Boolean,
                default: false,
            },
            offsetX:{
                type:Number,
                default:0,
            },

            offsetY: {
                type:Number,
                default:0,
            },

            /**
             * 禁止在尺寸变化时禁止催促件
             */
            disableSizeCalc:{
                type:Boolean,
                default: false,
            },
        },


        methods: {
            sizeHandler(w,h) {
                const m = this;
                m.size = [w, h];
            },

            getContainerRef(){

            },
        },

        mounted() {
            const m = this;
            m.$refs.slot_anchor.nextElementSibling.classList.add("_container");
        }
    }
</script>
<style lang="less">
    .v-box-comp {
        display:flex;
        flex-direction: column;
        align-items: stretch;

        >._container_wp{
            position: relative;
            flex: 1;
            >._container{
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                overflow-y: auto;
            }
        }
    }
</style>
