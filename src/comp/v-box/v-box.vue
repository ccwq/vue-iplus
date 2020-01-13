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

            //数字后面追加的单位
            unit: {
                type:String,
                default:""
            },
        },


        methods: {
            sizeHandler(w,h) {
                const m = this;
                if (m.unit) {
                    m.size = [w, h].map(el=>el + m.unit);
                }else{
                    m.size = [w, h];
                }
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
