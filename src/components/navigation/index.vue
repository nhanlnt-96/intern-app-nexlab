<template>
  <div class="navigation-container">
    <navigation-bar v-if="!getCurrentScreenWidth()"></navigation-bar>
    <navigation-menu v-else></navigation-menu>
  </div>
</template>

<script lang="ts">
import NavigationBar from "./NavigationBar.vue";
import NavigationMenu from "./NavigationMenu.vue";

export default {
  name: "Header",
  components: { NavigationMenu, NavigationBar },
  methods: {
    getCurrentScreenWidth() {
      const width = this.$q.screen.width;
      if (width <= 1024) {
        return true;
      }
      return false;
    }
  },
  watch: {
    "$q.screen.width"() {
      this.getCurrentScreenWidth();
    }
  }
};
</script>

<style lang="scss" scoped>
.navigation-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
}
</style>
