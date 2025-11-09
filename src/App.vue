<template>
  <div id="app">
    <router-view /> <!-- The layouts will render here -->
    <Toaster position="top-right" rich-colors />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
