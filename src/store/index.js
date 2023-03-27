import Vue from 'vue';
import Vuex from 'vuex';
import quotes from "@/store/modules/quotes";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        quotes
    }
});