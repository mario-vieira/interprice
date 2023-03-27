<template>
    <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
        <div class="btn-container" v-for="option in options" :key="option.value" >
            <input type="radio" class="btn-check" :name="name" :id="option.title" autocomplete="off"
                   :checked="option.checked" @change="$emit('change', option.value)"
            >
            <label class="btn btn-outline-primary" :for="option.title">{{option.title}}</label>
        </div>
    </div>
</template>

<script>
export default {
    name: "SingleToggle",
    props: {
        name: {
            type: String,
            required: true
        },
        options: {
            type: Array,
            required: true
        },
    }
}
</script>

<style scoped>

</style>