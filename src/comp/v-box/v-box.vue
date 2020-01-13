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
            ._container
                slot( :size="size" :width="size[0]" :height="size[1]")
        slot(name="footer")

</template>
<script>
    export default {
        name: "v-box",
        data(){
            return {
                size:[],
            }
        },

        props: {
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
                m.$emit("change", m.size);
            }
        },
    }
</script>
<style scoped lang="less">
    .v-box-comp {
        display:flex;
        flex-direction: column;
        align-items: stretch;

        ._container_wp{
            position: relative;
            flex: 1;
        }
        ._container{
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            overflow-y: auto;
        }
    }
</style>
