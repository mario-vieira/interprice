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
                                    title: quote.Years + 'YRS',
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
            if (item.Company.includes(state.searchCompany)) {
                companies.push({...item});
            }
        });
        companies.forEach((company) => {
            if (company.Quote) {
                let quotes = [];
                company.Quote.forEach((quote) => {
                    //debugger; // eslint-disable-line no-debugger
                    if (quote.Currency === state.selectedCurrency && state.selectedYears.includes(quote.Years)) {
                        quotes.push(quote);
                    }
                });
                quotes.sort((a, b) => a.years - b.years);
                company.Quote = quotes;
            }
        });
        return companies;
    }
}

const actions = {
    loadData({state}) {
        state.all = data;
    },
    setSelectedCurrency({commit, getters}, currency) {
        commit('setSelectedCurrency', currency);
        let years = getters.years.map(year => year.value);
        commit("setSelectedYears", years);
    },
    setSelectedYears({commit}, years) {
        commit('setSelectedYears', years);
    },
    setSearchCompany({commit}, text) {
        commit('setSearchCompany', text);
    },
    setSelectedMetric({commit}, metric) {
        commit('setSelectedMetric', metric);
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
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}