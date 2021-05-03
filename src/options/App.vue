<template>
  <div class="home-wrap">
    <div>{{ num }}</div>
    <span>{{ num + 1 }}</span>
    <p>888</p>
    <IconClose />
    <UIButton @click="handleAdd">add</UIButton>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import UIButton from './components/ui-button.vue'
import IconClose from '../icons/close.vue'

export default defineComponent({
  components: {
    UIButton,
    IconClose
  },
  props: {},
  setup() {
    const num = ref(1)
    const handleAdd = () => {
      num.value++
    }

    return {
      num,
      handleAdd
    }
  }
})
</script>

<style lang="scss">
.home-wrap {
  div {
    color: red;
  }
  span {
    color: blue;
  }
}
</style>
