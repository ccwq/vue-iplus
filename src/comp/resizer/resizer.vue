<template><div class="resizer-comp" tabindex="-1"></div></template>

<script>

    import debounce from "lodash/debounce";
    import throttle from "lodash/throttle";
    //用来判断是否ie
    function getInternetExplorerVersion () {
        const ua = window.navigator.userAgent

        const msie = ua.indexOf('MSIE ')
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10)
        }

        const trident = ua.indexOf('Trident/')
        if (trident > 0) {
            // IE 11 => return version number
            const rv = ua.indexOf('rv:')
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10)
        }

        const edge = ua.indexOf('Edge/')
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10)
        }

        // other browser
        return -1
    }


    //标识ie
    let isIE


    //避免多次判断
    function initCompat () {
        if (!initCompat.init) {
            initCompat.init = true
            isIE = getInternetExplorerVersion() !== -1
        }
    }

    export default {
        name: 'resizer',

        props:{

            //尺寸偏移
            sizeOffset:{
                default:_=>({
                    width:0,
                    height:0,
                }),
                type:Object,
            },

            debounce:{
                default:120,
                type:Number,
            },


            throttle:{
                default:120,
                type:Number,
            },


            //使debounc和trhottle无效
            fastMode:{
                default:false,
                type:Boolean,
            },
        },

        mounted () {
            const m = this;
            initCompat();

            //尺寸变化的处理
            const _resizeHandler = _=> {
                if (this._w !== this.$el.offsetWidth || this._h !== this.$el.offsetHeight) {
                    this._w = this.$el.offsetWidth;
                    this._h = this.$el.offsetHeight;
                    this.$emit('input',
                        m._w + (m.sizeOffset.width  || 0),
                        m._h + (m.sizeOffset.height || 0),
                    )
                }
            }


            //关闭debounce和throttle
            if (m.fastMode) {
                m.resizeHandler = _resizeHandler;
            }else{
                let _debFunc = debounce(_resizeHandler, m.debounce);
                let _thrFunc = throttle(_resizeHandler, m.throttle);
                m.resizeHandler = _=>{
                    _debFunc();
                    _thrFunc();
                }
            }

            this.$nextTick(() => {
                this._w = this.$el.offsetWidth
                this._h = this.$el.offsetHeight
            })
            const object = document.createElement('object')
            this._resizeObject = object
            object.setAttribute('aria-hidden', 'true')
            object.setAttribute('tabindex', -1)
            object.onload = _=>{
                this._resizeObject.contentDocument.defaultView.addEventListener('resize', this.resizeHandler)
                this.resizeHandler()
            };
            object.type = 'text/html'
            if (isIE) {
                this.$el.appendChild(object)
            }
            object.data = 'about:blank'
            if (!isIE) {
                this.$el.appendChild(object)
            }
        },


        /**
         * 销毁
         */
        beforeDestroy () {
            if (this._resizeObject && this._resizeObject.onload) {
                if (!isIE && this._resizeObject.contentDocument) {
                    this._resizeObject.contentDocument.defaultView.removeEventListener('resize', this.resizeHandler)
                }
                delete this._resizeObject.onload
            }
        },
    }
</script>

<style scoped>
    .resizer-comp {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        width: 100%;
        height: 100%;
        border: none;
        background-color: transparent;
        pointer-events: none;
        display: block;
        overflow: hidden;
        opacity: 0;
    }

    .resize-observer >>> object {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
        pointer-events: none;
        z-index: -1;
    }
</style>
