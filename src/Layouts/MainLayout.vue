<template>
  <div>
    <Navbar v-if="showLayout" />           <!-- only show if layout enabled -->
    <main :style="{ marginTop: showLayout ? '80px' : '0' }">
      <router-view />
    </main>
    <Footer v-if="showLayout" />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "MainLayout",
  components: { Navbar, Footer },
  computed: {
    showLayout() {
      // Hide layout for routes with meta: { layout: false }
      return this.$route.meta.layout !== false;
    },
  },
};
</script>

<style scoped>
main {
  min-height: calc(100vh - 120px); /* leave space for Navbar/Footer if visible */
}
</style>
