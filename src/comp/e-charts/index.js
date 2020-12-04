import darkThemeRunner from "./dark.theme"
import echartsComp from "./ECharts.vue";

const noop = _ => _;

export const colorLs = [
    "#feb64d",
    "#ff7c7c",
    "#5bc49f",
    '#29b84c',
    '#a5b924',
    '#1564c0',
    "#60acfc",
    "#32d3eb",
];

export const getColor = function(index){
    return colorLs[index % colorLs.length];
}

export default {

    /**
     * 安装echarts
     * @param Vue
     * @param options 可以传入一个配置对象或者直接传入echarts实例
     * @param options 可以为echarts实例
     * @param options.echarts
     * @param options.name 绑定组件的名称
     * @param options.defaultTheme 默认主题
     * @param options.baseOption 默认配置
     * @param options.optionHook 配置被应用前允许在此进行修改
     */
    install(Vue, options = {}){

        //允许直接传入echarts实例
        if (options.version) {
            options = {
                echarts:options
            }
        }

        const {
            echarts,
            name = "e-charts",
            defaultTheme = "dark",
            baseOption = {},
            optionHook = noop,
        } = options;

        if (!echarts) {
            throw new Error("require field lost:options.echarts");
        }

        darkThemeRunner(echarts);

        const props = echartsComp.props;



        Object.assign(props, {

            //注入echarts
            __apache_echarts: {
                default: __ => echarts,
            },

            //主题
            theme:{
                default: defaultTheme
            },

            baseOption:{
                default: _ => baseOption
            },

            optionHook:{
                default:_=>optionHook,
            },
        });

        echartsComp.name = name;
        Vue.component(name, echartsComp);
    }
}