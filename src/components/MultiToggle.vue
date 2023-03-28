<template>
    <div class="btn-group" role="group">
        <div class="btn-container" v-for="option in dataOptions" :key="option.value">
            <input type="checkbox" class="btn-check" :id="option.value" autocomplete="off" :checked="option.checked" @change="onChange(option)">
            <label class="btn btn-outline-primary" :for="option.value"> {{ option.title }} </label>
        </div>
    </div>
</template>

<script>
export default {
    name: "MultiToggle",
    props: {
        options: {
            type: Array,
            required: true
        },
    },
    data() {
        return {
            dataOptions: this.options
        }
    },
    methods: {
        onChange(option) {
            option.checked = !option.checked;
            let optionsChecked = [];
            this.options.forEach(option => {
                if (option.checked) {
                    optionsChecked.push(option);
                }
            })
            this.$emit('change', optionsChecked)
        }
    },
    watch: {
        options() {
            this.dataOptions = this.options;
        }
    }
}
</script>

<style scoped>

</style>