<script setup lang="ts">
import Icon from '@/components/Icon.vue'
import ImageView from '@/components/ImageView.vue'
import router from '@/router'
import { ref } from 'vue'

const input = ref<string>('')

function search() {
  if (input.value.trim()) {
    router.push('/products?filter=' + encodeURIComponent(input.value.trim()))
  }
}
</script>

<template>
  <div id="search" class="control has-icons-right">
    <input
      v-model="input"
      class="input is-rounded is-primary"
      type="text"
      :placeholder="$t('search.products')"
      @keydown.enter="search"
    />
    <Icon icon="fa-search" class="is-small is-right mr-2" />
  </div>

  <div class="columns my-5">
    <ImageView class="column" overlay image="home/products.png" :text="$t('home.all-products')" link="products" />
    <ImageView class="column" overlay image="home/livraison.png" :text="$t('home.delivery-info')" link="#" />
    <ImageView class="column" overlay image="home/news.png" :text="$t('home.news')" link="#" />
  </div>

  <div class="box">
    <h2 class="title is-5 has-text-centered">{{ $t('home.quality-information') }}</h2>
    <div class="columns is-justify-content-space-evenly my-5">
      <ImageView class="column" image="home/speed.png" size=15 :text="$t('home.quick-deliveries')" />
      <ImageView class="column" image="home/security.png" size=10 :text="$t('home.assurance-&-refunds')" />
      <ImageView class="column" image="home/satisfaction.png" size=10 :text="$t('home.guaranteed-satisfaction')" />
    </div>
  </div>
</template>

<style scoped>
#search {
  width: 75%;
  margin: auto;
}

.box {
  width: 100%;
}
</style>
