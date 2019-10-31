let win = window || {};
const defaultVMKey = "vi";

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

        let opt = Object.assign({}, {
            key: defaultVMKey,
        }, options);

        let host = {};
        win[opt.key] = host;

        vue.mixin({
            mounted(){
                let [key, key_last] = getKeys(this);
                if (!key) {
                    return;
                }

                host[key_last] = this;

                let inst_list = host[key];
                if (!inst_list) {
                    inst_list = [];
                    host[key] = inst_list;
                }

                if (Array.isArray(inst_list)) {
                    inst_list.push(this);
                }else{
                    console.warn(`字段已经被占用，绑定window[${key}]失败`);
                }
            },
            beforeDestroy(){
                let [key, key_last] = getKeys(this);
                if (!key) {
                    return;
                }

                host[key_last] = undefined;

                let inst_list = host[key];
                if (inst_list && Array.isArray( inst_list )) {
                    let index = inst_list.findIndex(el => el === this);
                    if (index + 1) {
                        inst_list.splice(index, 1);
                    }
                }
            },
        })
    }
}


const getKeys = _vm => {
    let name = _vm.$options.name;
    if (!name) {
        return "";
    }
    name = name.replace(/-/g, "_");
    return [

        //列表的key
        "_" + name,

        //最后一个实例的key
        "" + name,
    ];
}