<template>
    <div>
        <div class="btn-toolbar" role="toolbar">
            <SingleToggle :options="currencies" @change="setSelectedCurrency" name="currencies"/>
            <MultiToggle :options="years" @change="setSelectedYears" />
            <SingleToggle :options="displayMetrics" name="metrics" @change="setSelectedMetric"/>
        </div>

        <input
            type="text"
            class="form-control search-bar"
            placeholder="Filter by company name..."
            :value="searchCompany"
            @input="setSearchCompany($event.target.value)"/>

        <InterPriceTable
            :years="selectedYears"
            :items="filteredData"
            :selected-metric="selectedMetric"
            :not-selected-metrics="notSelectedMetrics"
            :sortBy="sortBy"
            :sortOrder="sortOrder"
            :minimumValues="minimumValues"
            @sortChanged="setSortBy"
        />
    </div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex';
import MultiToggle from "@/components/MultiToggle.vue";
import SingleToggle from "@/components/SingleToggle.vue";
import InterPriceTable from "@/components/InterPriceTable.vue";
export default {
    name: "InterPricePage",
    components: {InterPriceTable, SingleToggle, MultiToggle},
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
            selectedMetric: state => state.quotes.selectedMetric,
            sortBy: state => state.quotes.sortBy,
            sortOrder: state => state.quotes.sortOrder,
            minimumValues: state => state.quotes.minimumValuesPerYearAndCoupon
        }),
        ...mapGetters({
            currencies: "quotes/currencies",
            years: "quotes/years",
            filteredData: "quotes/filteredData",
            notSelectedMetrics: "quotes/notSelectedMetrics"
        })
    },
    methods: {
        ...mapActions({
            loadData: "quotes/loadData",
            setSelectedCurrency: "quotes/setSelectedCurrency",
            setSelectedYears: "quotes/setSelectedYears",
            setSearchCompany: "quotes/setSearchCompany",
            setSelectedMetric: "quotes/setSelectedMetric",
            setSortBy: "quotes/setSortBy"
        })
    }
}
</script>

<style scoped>
.search-bar {
    width: 20%;
}
</style>