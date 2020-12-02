import darkThemeRunner from "./dark.theme"


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
    install(Vue, options){
        const {echarts, name="e-charts", defaultTheme="dark"} = options;

        if (!echarts) {
            throw new Error("require field lost:options.echarts");
        }

        darkThemeRunner(echarts);

        //注入echarts
        echartsComp.props.__apache_echarts = {
            default: echarts,
        };
        echartsComp.props.theme.default = defaultTheme;
        echartsComp.name = name;
        Vue.component(name, echartsComp);
    }
}