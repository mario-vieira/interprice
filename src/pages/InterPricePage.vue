<template>
    <div>
        <div class="btn-toolbar" role="toolbar">
            <SingleToggle :options="currencies" @change="setSelectedCurrency" name="currencies"/>
            <MultiToggle :options="years" @change="setSelectedYears" />
            <SingleToggle :options="displayMetrics" name="metrics" @change="setSelectedMetric"/>
        </div>

        <input type="text" class="form-control" :value="searchCompany" @input="setSearchCompany($event.target.value)" placeholder="Filter by company name..."/>


    </div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex';
import MultiToggle from "@/components/MultiToggle.vue";
import SingleToggle from "@/components/SingleToggle.vue";
export default {
    name: "InterPricePage",
    components: {SingleToggle, MultiToggle},
    props: {
        msg: String
    },
    created() {
        this.loadData();
    },
    computed: {
        ...mapState({
            quotes: state => state.quotes.all,
            displayMetrics: state => state.quotes.displayMetrics,
            searchCompany: state => state.quotes.searchCompany,
            selectedYears: state => state.quotes.selectedYears,
            selectedMetric: state => state.quotes.selectedMetric
        }),
        ...mapGetters({
            currencies: "quotes/currencies",
            years: "quotes/years",
            filteredData: "quotes/filteredData"
        })
    },
    methods: {
        ...mapActions({
            loadData: "quotes/loadData",
            setSelectedCurrency: "quotes/setSelectedCurrency",
            setSelectedYears: "quotes/setSelectedYears",
            setSearchCompany: "quotes/setSearchCompany",
            setSelectedMetric: "quotes/setSelectedMetric"
        })
    }
}
</script>

<style scoped>

</style>