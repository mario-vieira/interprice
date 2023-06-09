<template>
    <table class="table">
        <thead>
            <tr>
                <th rowspan="2" class="icon-column"></th>
                <th rowspan="2" class="is-clickable date-column text-nowrap" @click="sortChanged('DateSent')">
                    <span class="gray">Date sent</span> <i :class="sortIcon('DateSent')"></i>
                </th>
                <th rowspan="2" class="is-clickable text-nowrap" @click="sortChanged('Company')">
                    <span class="gray">Company</span> <i :class="sortIcon('Company')"></i>
                </th>
                <th colspan="2" class="text-center" v-for="year in years" :key="year.value">{{ year.title }}</th>
            </tr>
            <tr>
                <th v-for="index in (years.length) * 2" :key="index" class="coupons text-center gray">
                    {{ getCouponType(index) }}
                </th>
            </tr>
        </thead>
        <tbody v-for="company in companies" :key="company.Company">
            <tr @click="toggle(company)" data-bs-toggle="collapse" :data-bs-target="'#' + company.Company" class="accordion-toggle">
                <td>
                    <i v-if="company.Quote" :class="company.expanded ? 'bi-chevron-down' : 'bi-chevron-right'"></i>
                </td>
                <td>
                    {{ company.DateSent }}
                </td>
                <td class="fw-bold" :class="{'gray': !company.Quote}">
                    {{ company.Company }}
                </td>
                <td
                    v-for="index in (years.length) * 2"
                    :key="index" class="text-center"
                    :class="{highlighted: isMinimumValue(index, getMetric(selectedMetric, company.Quote, index))}"
                >
                    {{ displayMetric(selectedMetric, company.Quote, index) }}
                </td>
            </tr>
            <tr v-for="metric in notSelectedMetrics" :key="metric" class="collapse" :id="company.Company">
                <td></td>
                <td></td>
                <td>{{ metric }}</td>
                <td v-for="index in (years.length) * 2" :key="index" class="text-center">
                    {{ displayMetric(metric, company.Quote, index) }}
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr class="border border-dark">
                <td></td>
                <td></td>
                <td>Average by {{selectedMetric}}</td>
                <td v-for="index in (years.length) * 2" :key="index" class="text-center">
                    {{ computeAverage(index) }}
                </td>
            </tr>
        </tfoot>
    </table>
</template>

<script>
export default {
    name: "InterPriceTable",
    props: {
        years: {
            type: Array,
            required: true
        },
        items: {
            type: Array,
            required: true
        },
        selectedMetric: {
            type: String,
            required: true
        },
        notSelectedMetrics: {
            type: Array,
            required: true
        },
        sortBy: {
            type: String,
            required: true
        },
        sortOrder: {
            type: String,
            required: true,
            validator: value => {
                return ['desc', 'asc'].includes(value)
            }
        },
        minimumValues: {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            companies: this.items,
            metricPrefixes: {
                'Spread': '+',
                '3MLSpread': '+',
                'Yield': '',
            },
            metricSuffixes: {
                'Spread': 'bp',
                '3MLSpread': 'bp',
                'Yield': '%',
            },
            decimalPlaces: {
                'Spread': 0,
                '3MLSpread': 0,
                'Yield': 3,
            }
        }
    },
    methods: {
        getCouponType(index) {
            return index % 2 === 0 ? 'FRN' : 'FIX';
        },
        getMetric(metric, quotes, index) {
            if (quotes) {
                let years = this.years.map(y => y.value);
                let year = years[Math.floor((index-1)/2)];
                if (index % 2 === 0) {
                    let quote = quotes.find(q => q.Years === year && q.CouponType === 'FRN');
                    if (quote) {
                        return quote[metric];
                    }
                }
                if (index % 2 === 1) {
                    let quote = quotes.find(q => q.Years === year && q.CouponType === 'FIX');
                    if (quote) {
                        return quote[metric];
                    }
                }
            }
            return '';
        },
        displayMetric(metric, quotes, index) {
            let value = this.getMetric(metric, quotes, index);
            return value ? this.displayPrefix(metric) + value + this.displaySufix(metric) : '';
        },
        displayPrefix(metric) {
            return this.metricPrefixes[metric];
        },
        displaySufix(metric) {
            return this.metricSuffixes[metric];
        },
        computeAverage(index) {
            let years = this.years.map(y => y.value);
            let year = years[Math.floor((index-1)/2)];
            let result = [];
            if (index % 2 === 0) {
                this.companies.forEach((company) => {
                    if (company.Quote) {
                        let quote = company.Quote.find(q => q.Years === year && q.CouponType === 'FRN');
                        if (quote) {
                            result.push(quote[this.selectedMetric]);
                        }
                    }
                })

            }
            if (index % 2 === 1) {
                this.companies.forEach((company) => {
                    if (company.Quote) {
                        let quote = company.Quote.find(q => q.Years === year && q.CouponType === 'FIX');
                        if (quote) {
                            result.push(quote[this.selectedMetric]);
                        }
                    }
                })
            }

            let decimalPlaces = this.decimalPlaces[this.selectedMetric];
            let average = parseFloat(result.reduce((a, b) => a + b, 0) / result.length).toFixed(decimalPlaces);
            return result.length ? this.displayPrefix(this.selectedMetric) + average + this.displaySufix(this.selectedMetric) : '';
        },
        sortIcon(key) {
            if (this.sortBy !== key) {
                return 'bi-caret-up-fill gray';
            }
            return this.sortOrder === 'asc' ? 'bi-caret-up-fill' : 'bi-caret-down-fill'
        },
        sortChanged(key) {
            this.$emit('sortChanged', key);
        },
        toggle(company) {
            company.expanded = !company.expanded;
        },
        isMinimumValue(index, value) {
            let years = this.years.map(y => y.value);
            let year = years[Math.floor((index-1)/2)];
            let couponType = this.getCouponType(index);
            return this.minimumValues[year] && this.minimumValues[year][couponType] && this.minimumValues[year][couponType] === value;
        }
    },
    watch:{
        items(){
            this.companies = this.items;
        }
    }
}
</script>

<style scoped>
.table tbody:last-of-type tr.accordion-toggle td {
    border-bottom: none;
}

.table th {
    text-transform: uppercase;
    font-weight: normal;
    border-color: black;
}

.gray {
    color: var(--bs-gray-400);
}

.is-clickable {
    cursor: pointer;
}

.coupons {
    width: 5%;
}

.icon-column {
    width: 2%;
}

.date-column {
    width: 10%;
}

.highlighted {
    background-color: #f4f2d9;
}
</style>