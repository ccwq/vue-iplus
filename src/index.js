import debounce from "./mixin/debounce-method";
import throttle from "./mixin/throttle-method";
import debugMix from "./mixin/console-by-name";

import resizer from "./comp/resizer"

/**
 * 用来辅助调试vue组件
 */
export default {

    /**
     *
     * @param vue
     * @param options
     * @param options.key 在window上绑定的对象名
     */
    install(vue, options) {


        vue.mixin(debounce);
        vue.mixin(throttle);
        vue.mixin(debugMix);

        vue.component(resizer.$options.name, resizer);

    }
}
