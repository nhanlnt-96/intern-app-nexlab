<template>
  <q-avatar v-if="url" :size="size">
    <img :src="avatarUrl" alt="user-avatar" />
  </q-avatar>
  <q-avatar v-else color="primary" text-color="white" size="35px">
    {{ firstName.substring(0, 1).toUpperCase() }}
  </q-avatar>
</template>

<script lang="ts">
export default {
  name: "UserAvatar",
  props: {
    avatarUrl: {
      type: String
    },
    firstName: {
      type: String
    },
    size: {
      type: String,
      default: "35px"
    }
  },
  data() {
    return {
      url: null as string | null
    };
  },
  methods: {
    checkUrlLink() {
      const image = new Image();
      image.src = this.avatarUrl;
      image.onload = () => {
        return this.url = this.avatarUrl;
      };
      image.onerror = image.onabort = () => {
        return this.url = null;
      };
    }
  },
  created() {
    this.checkUrlLink();
  }
};
</script>

<style scoped>

</style>
