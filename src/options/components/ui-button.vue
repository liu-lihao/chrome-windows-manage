<template>
  <button class="ui-button-wrap" v-on="$listeners" v-bind="$attrs">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  inheritAttrs: false,
  props: {},
  setup() {
    return {}
  }
})
</script>

<style lang="scss">
.ui-button-wrap {
  border: 1px solid red;
}
</style>
