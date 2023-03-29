import data from '../../assets/data.json';

const state = {
    all: null,
    defaultCurrency: 'USD',
    selectedCurrency: 'USD',
    selectedYears: [],
    selectedMetric: 'Spread',
    searchCompany: '',
    sortBy: 'DateSent',
    sortOrder: 'desc',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    minimumValuesPerYearAndCoupon: {},
    displayMetrics: [
        {
            title: 'Spread',
            value: 'Spread',
            checked: true
        },
        {
            title: 'Yield',
            value: 'Yield',
            checked: false
        },
        {
            title: '3MLSpread',
            value: '3MLSpread',
            checked: false
        }
    ]
}

const getters = {
    currencies(state) {
        let currencies = [];
        state.all.Items.forEach(item => {
            if (item.Quote) {
                item.Quote.forEach(quote => {
                    if (!currencies.some(currency => currency.value === quote.Currency)) {
                        currencies.push(
                            {
                                title: quote.Currency,
                                value: quote.Currency,
                                checked: quote.Currency === state.defaultCurrency
                            }
                        );
                    }
                });
            }
        });
        return currencies;
    },
    years(state) {
        let yearsForCurrency = [];
        state.all.Items.forEach(item => {
            if (item.Quote) {
                item.Quote.forEach(quote => {
                    if (quote.Currency === state.selectedCurrency) {
                        if (!yearsForCurrency.some(y => y.value === quote.Years)) {
                            yearsForCurrency.push(
                                {
                                    title: quote.Years + ' YRS',
                                    value: quote.Years,
                                    checked: true
                                }
                            );
                        }
                    }
                });
            }
        });
        return yearsForCurrency;
    },
    filteredData(state) {
        let companies = [];

        state.all.Items.forEach((item) => {
            if (item.Company.toLowerCase().includes(state.searchCompany.toLowerCase())) {
                companies.push({...item});
            }
        });
        state.minimumValuesPerYearAndCoupon = {};

        companies.forEach((company) => {
            company.expanded = false;
            if (company.Quote) {
                let quotes = [];
                company.Quote.forEach((quote) => {
                    if (quote.Currency === state.selectedCurrency && state.selectedYears.some(year => year.value === quote.Years)) {
                        quotes.push(quote);
                    }
                });

                quotes.sort((a, b) => a.years - b.years);
                quotes.forEach((quote) => {
                    //debugger; // eslint-disable-line no-debugger
                    if (state.minimumValuesPerYearAndCoupon[quote.Years]) {
                        if (state.minimumValuesPerYearAndCoupon[quote.Years][quote.CouponType]) {
                            if (state.minimumValuesPerYearAndCoupon[quote.Years][quote.CouponType] > quote[state.selectedMetric]) {
                                state.minimumValuesPerYearAndCoupon[quote.Years][quote.CouponType] = quote[state.selectedMetric];
                            }
                        } else {
                            state.minimumValuesPerYearAndCoupon[quote.Years][quote.CouponType] = quote[state.selectedMetric];
                        }
                    } else {
                        state.minimumValuesPerYearAndCoupon[quote.Years] = {[quote.CouponType]: quote[state.selectedMetric]};
                    }
                })
                company.Quote = quotes;
            }
        });

        // Sort by selected key and then by Preferred flag
        companies.sort((a, b) => {
            if (!a.Quote) {
                return 1;
            }
            if (state.sortOrder === 'desc') {
                if (a[state.sortBy] > b[state.sortBy]) return -1;
                if (a[state.sortBy] < b[state.sortBy]) return 1;
                if (a.Preferred > b.Preferred) return -1;
                if (a.Preferred < b.Preferred) return 1;
            } else {
                if (a[state.sortBy] > b[state.sortBy]) return 1;
                if (a[state.sortBy] < b[state.sortBy]) return -1;
                if (a.Preferred > b.Preferred) return 1;
                if (a.Preferred < b.Preferred) return -1;
            }

            return 0;
        });
        return companies;
    },
    notSelectedMetrics(state) {
        let metrics = [];
        state.displayMetrics.forEach((metric) => {
            if (metric.value !== state.selectedMetric) {
                metrics.push(metric.title);
            }
        });
        return metrics;
    }
}

const actions = {
    loadData({state, getters}) {
        state.all = data;
        state.all.Items.forEach((item) => {
            if (item.DateSent) {
                let date =  new Date(item.DateSent);
                item.DateSent = date.getDate() + '-' + state.months[date.getMonth()] + '-' + String(date.getUTCFullYear()).slice(-2)
            }
        })
        getters.years.forEach((year) => {
            state.selectedYears.push({value: year.value, title: year.value + ' YRS', checked: true});
        })
    },
    setSelectedCurrency({commit, getters}, currency) {
        commit('setSelectedCurrency', currency);
        commit("setSelectedYears", getters.years);
    },
    setSelectedYears({commit}, years) {
        commit('setSelectedYears', years);
    },
    setSearchCompany({commit}, text) {
        commit('setSearchCompany', text);
    },
    setSelectedMetric({commit}, metric) {
        commit('setSelectedMetric', metric);
    },
    setSortBy({state, commit}, sortBy) {
        if (sortBy === state.sortBy) {
            commit('setSortOrder', state.sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            commit('setSortOrder', 'desc');
        }
        commit('setSortBy', sortBy);
    }
}
const mutations = {
    setSelectedCurrency(state, currency) {
        state.selectedCurrency = currency;
    },
    setSelectedYears(state, years) {
        state.selectedYears = years;
    },
    setSearchCompany(state, text) {
        state.searchCompany = text;
    },
    setSelectedMetric(state, metric) {
        state.selectedMetric = metric;
    },
    setSortBy(state, sortBy) {
        state.sortBy = sortBy;
    },
    setSortOrder(state, sortOrder) {
        state.sortOrder = sortOrder;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}