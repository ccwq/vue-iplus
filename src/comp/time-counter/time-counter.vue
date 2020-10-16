
<script>
    /**
     * 一个没有外观的倒计时组件
     */

    /**
     * 保存的键的前缀
     */
    const key_prefix = "time-counter";

    /**
     * 容差毫秒数
     */
    const ignoreTimeGap = 99;

    const inervalGap = 300;


    /**
     * 保存数据到LocalStorage
     * @param key
     * @param data
     */
    const setLS = function(key, data){
        localStorage.setItem(key_prefix + key, JSON.stringify({data}))
    }

    /**
     * 获取数据
     * @param key
     * @returns {undefined|*}
     */
    const getLS = function(key){
        let data = localStorage.getItem(key_prefix + key);
        if(!data)   return undefined;
        try {
            data = JSON.parse(data);
        }catch (e) {
            return undefined
        }
        return data.data;
    }


    const now = function(){
        return new Date() * 1;
    }

    export default {
        name: "time-counter",
        data() {
            return {
                playing$$: false,

                //结束的时间点
                endTimeDot:0,


                __interval:"",

                now: 0,

                timelong: 0,
            }
        },
        methods: {
            _step(){
                const m = this;
                m.now = now();
                if (!m.remaining) {
                    m.playing = false;
                }
            },


            _saveEndTimeDot(){
                const m = this;
                setLS(m.key, m.endTimeDot)
            },

            _readEndTimeDot(){
                return getLS(this.key);
            },


        },

        props:{
            /**
             * tKey相同的counter使用同一个存储
             */
            tKey:{
                type:[Number, String],
                default: "time-counter"
            },



            value: {
                type: Number,
                default: 30,
            }
        },

        watch: {
            value: {
                immediate: true,
                handler(sec) {
                    const m = this;
                    if (!sec) {
                        m.playing = false;
                    }else{
                        if (sec !== m.remainingBySecond) {
                            m.playing = true;
                        }
                    }
                }
            }
        },


        computed: {

            /**
             * 剩余多久到
             * @returns {number}
             */
            remaining(){
                const m = this;
                let dd = m.endTimeDot - m.now;
                if (dd > ignoreTimeGap) {
                    return dd;
                }else{
                    return 0;
                }
            },

            /**
             * 剩余多少毫秒
             * @returns {number}
             */
            remainingBySecond(){
                const m = this;
                return ~~(m.remaining/1000);
            },

            key(){
                const m = this;
                return m.tKey + "-end-time-dot";
            },
            playing: {
                get(){return this.timeCouterPlaying$$},
                set(boo){
                    const m = this;
                    if (m.playing) {
                        console.warn("请先停止当前的计时");
                        return;
                    }

                    //设置状态
                    m.playing$$ = boo;

                    //停止脉冲
                    if (m.__interval) {
                        clearInterval(m.__interval);
                    }

                    //
                    if (boo) {

                        m.endTimeDot = now() + m.value * 1000;
                        m._step();
                        m._saveEndTimeDot();
                        m.$emit("on-start");

                        //开启脉冲
                        m.__interval = setInterval(_=>{
                            m._step();
                        }, inervalGap);
                    }else{
                        if (m.remaining) {
                            //中断
                            m.$emit("on-stop");
                        }else{
                            //结束
                            m.$emit("on-complete");
                        }
                    }
                }
            }
        },

        beforeDestroy(){
            const m = this;
            clearInterval(m.__interval);
        },

        mounted() {
            const m = this;
            m.endTimeDot = m._readEndTimeDot();
            m.now = now();

            if (m.remaining) {
                m.$emit("input", m.remainingBySecond);
                m.$nextTick(_=>{
                    m.playing = true;
                })
            }

            m.$watch("remainingBySecond", {
                immediate: true,
                handler(sec){
                    m.$emit("input", sec);
                }
            })
        }
    }
</script>
<template>
    <div class="timer-counter-comp">
        <slot
            name="default"
            :remaining="remaining"
            :second="remainingBySecond"
        ></slot>
    </div>
</template>