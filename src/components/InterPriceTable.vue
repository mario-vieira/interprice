<template>
    <table class="table">
        <thead>
            <tr>
                <th rowspan="2"></th>
                <th rowspan="2" class="is-clickable" @click="sortChanged('DateSent')">
                    <span class="gray">Date sent</span> <i :class="sortIcon('DateSent')"></i>
                </th>
                <th rowspan="2" class="is-clickable" @click="sortChanged('Company')">
                    <span class="gray">Company</span> <i :class="sortIcon('Company')"></i>
                </th>
                <th colspan="2" class="text-center" v-for="year in years" :key="year.value">{{ year.title }}</th>
            </tr>
            <tr>
                <th v-for="index in (years.length) * 2" :key="index" class="text-center gray">
                    {{ displayCouponType() }}
                </th>
            </tr>
        </thead>
        <tbody v-for="company in companies" :key="company.Company">
            <tr data-bs-toggle="collapse" :data-bs-target="'#' + company.Company" class="accordion-toggle">
                <td><i class="bi-chevron-down"></i></td>
                <td>{{ company.DateSent }}</td>
                <td>{{ company.Company }}</td>
                <td v-for="index in (years.length) * 2" :key="index" class="text-center">
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
        companies: {
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
    },
    data() {
        return {
            metricPrefixes: {
                'Spread': '+',
                '3MLSpread': '+',
                'Yield': '',
            },
            metricSuffixes: {
                'Spread': 'bp',
                '3MLSpread': 'bp',
                'Yield': '%',
            }
        }
    },
    methods: {
        displayCouponType(index) {
            return index % 2 === 0 ? 'FRN' : 'FIX'
        },
        displayMetric(metric, quotes, index) {
            if (quotes) {
                //debugger; // eslint-disable-line no-debugger

                let years = this.years.map(y => y.value);
                let year = years[Math.floor((index-1)/2)];
                if (index % 2 === 0) {
                    let quote = quotes.find(q => q.Years === year && q.CouponType === 'FRN');
                    if (quote) {
                        return this.displayPrefix(metric) + quote[metric] + this.displaySufix(metric);
                    }
                }
                if (index % 2 === 1) {
                    let quote = quotes.find(q => q.Years === year && q.CouponType === 'FIX');
                    if (quote) {
                        return this.displayPrefix(metric) + quote[metric] + this.displaySufix(metric);
                    }
                }
            }
            return '';
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

            return result.length ?
                this.displayPrefix(this.selectedMetric) + Math.round(result.reduce((a, b) => a + b, 0) / result.length) + this.displaySufix(this.selectedMetric)
                : '';
        },
        sortIcon(key) {
            if (this.sortBy !== key) {
                return 'bi-caret-up-fill gray';
            }
            return this.sortOrder === 'asc' ? 'bi-caret-up-fill' : 'bi-caret-down-fill'
        },
        sortChanged(key) {
            this.$emit('sortChanged', key);
        }
    },

}
</script>

<style scoped>
.table tbody:last-of-type tr.accordion-toggle td {
    border-bottom: none;
}

.table th {
    text-transform: uppercase;
    font-weight: normal;
}

.gray {
    color: var(--bs-gray-400);
}

.is-clickable {
    cursor: pointer;
}
</style>