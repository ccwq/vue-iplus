/**
 * 定义路由项
 * @param path
 * @param component
 * @param others 传入其他配置，当传入配置为数组时候，认为是children
 * @param children
 * @returns {{path: *, component: *}}
 */
export const defineRouter = function (path, component, others, children) {

    //使用other字段传children修正
    if (Array.isArray(others)) {
        children = others;
        others = undefined;
    }


    if (!children && others && others.children) {
        children = others.children;
    }

    return {
        ...others,
        path,
        component,
        children
    };
};