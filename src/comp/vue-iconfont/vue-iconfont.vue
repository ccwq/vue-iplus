<template>
    <svg class="svg-icon" aria-hidden="true">
<!--        <use xlinkHref="`#${icon}`"/>-->
        <use xlink:href="`#${icon}`"/>
    </svg>
</template>

<script>
export default {
    name: "vue-iconfont",
    props: {
        icon: {
            default: "",
            type: String
        },
    },
}
</script>


