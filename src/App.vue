<template>
  <div id="app">
    <InterPricePage />
  </div>
</template>

<script>
import InterPricePage from "./pages/InterPricePage.vue";

export default {
  name: "App",
  components: {
      InterPricePage
  }
};
</script>

<style>
#app {
  padding: 60px;
}

.btn-group > .btn-container:not(:last-child) .btn {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

.btn-group > .btn-container:not(:first-child) .btn {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

.btn-toolbar {
    gap: 40px;
    padding: 20px 0;
}

.btn-outline-primary {
    --bs-btn-color: #527094 !important;
    --bs-btn-border-color: #527094 !important;
    --bs-btn-hover-bg: #527094 !important;
    --bs-btn-hover-border-color: #527094 !important;
    --bs-btn-active-bg: #527094 !important;
    --bs-btn-active-border-color: #527094 !important;
    --bs-btn-disabled-color: #527094 !important;
    --bs-btn-disabled-border-color: #527094 !important;
}
</style>
