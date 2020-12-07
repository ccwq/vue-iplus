<template lang="pug">
    v-box.echarts-comp(@change="_updateSizeHandler"): .el(ref="el")
</template>
<script>
import vBox from "../v-box"
import merge from "lodash/merge";
import size from "lodash/size";
import isPlainObject from "lodash/isPlainObject";
import BPromise from "ipro/src/promise/BPromise"
export default {
    name: "e-charts",
    components:{vBox},
    props:{

        /**
         * 会被作为配置基准
         */
        baseOption:{
            type:Object,
            default:_=>({})
        },

        /**
         * 配置被应用前允许在此进行修改
         */
        optionHook: {
            type:Function,
            default:_=>_,
        },

        options:{
            type:[Object, String],
            default:_=>{},
        },
        option:{
            type:[Object, String],
            default:_=>{},
        },

        //图表
        series: {
            type:[Array, Object, String],
            default:"",
        },


        beforeOptions: {
            type:Function,
            default:opt=>opt,
        },

        on:{
            type:Array,
            default:_=>[],
        },

        zrOn: {
            type:Array,
            default:_=>[],
        },

        theme:{
            default:"",
            type:String,
        }
    },

    computed: {

        /**
         * 合并配置
         */
        opt() {
            const m = this;
            let ret = merge({}, this.baseOption, this.options, this.option);
            let _series = m.series;
            if (_series) {
                if (isPlainObject(_series)) {
                    _series = [_series];
                }
                ret.series = _series;
            }

            return ret;
        }
    },

    watch:{
        on:{
            deep: false,
            immediate: true,
            async handler(ls, _ls){
                const m = this;
                await m._init_promise;
                (_ls || []).forEach(([event])=>{
                    let ret = ls.find(el => el[0] == event);
                    if (!ret) {
                        m._ins.off(event);
                    }
                })
                ls.forEach(el=>{
                    m._ins.on(...el);
                })
            }
        },


        zrOn:{
            deep: false,
            immediate: true,
            async handler(ls, _ls){
                const m = this;
                await m._init_promise;
                (_ls || []).forEach(([event])=>{
                    let ret = ls.find(el => el[0] == event);
                    if (!ret) {
                        m._ins.getZr().off(event);
                    }
                })
                ls.forEach(([eventName, handler])=>{
                    m._ins.getZr().on(eventName, e=>{
                        handler(e, m);
                    });
                })
            }
        },


        opt:{
            deep: false,
            immediate: true,
            handler(option){
                this.updateOption(option);
            }
        },

        series:{
            deep: false,
            immediate: false,
            handler(){
                this.updateOption(this.opt);
            }
        }
    },

    methods: {
        async updateOption(opt) {
            const m = this;
            if(size(opt)){
                await m._init_promise;
                opt = m.optionHook(opt) || opt;
                m._ins.setOption(opt)
            }
        },

        async _updateSizeHandler(){
            const m = this;
            await m._init_promise;
            m._ins.resize();
        },
    },

    created(){
        const m = this;
        m._init_promise = new BPromise;
    },

    mounted(){
        const m = this;
        m._ins = m.__apache_echarts.init(m.$refs.el,  m.theme);
        m._init_promise._resolve(m._ins) ;
    },

    beforeDestroy() {
        const m = this;
        if(!m._ins){
            m.on.forEach(([event])=>{
                m._ins.off(event);
            })
            m._ins.dispose();
        }
    }
}
</script>
<style lang="less">
.echarts-comp {
    ._container {
        overflow: visible !important;
    }
    .el {
        width: 100%;
        height: 100%;
    }



}
</style>
