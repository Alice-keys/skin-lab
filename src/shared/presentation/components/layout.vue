<script setup>
import { onMounted, ref } from 'vue'
import AnnouncementBar    from './announcement-bar.vue'
import Navbar             from './navbar.vue'
import FooterContent      from './footer-content.vue'
import SubscriptionPopUp  from '../../../subscription/presentation/components/subscription-pop-up.vue'
import { subscriptionStore } from '../../../subscription/application/subscription.store.js'

const showPopUp = ref(false)

onMounted(() => {
  if (subscriptionStore.isFirstVisit()) {
    setTimeout(() => { showPopUp.value = true }, 1500)
  }
})

const onSubscribed = () => { showPopUp.value = false }
const onDismissed  = () => { showPopUp.value = false }
</script>

<template>
  <div id="app-layout">
    <announcement-bar />
    <navbar />
    <main class="main-content">
      <router-view />
    </main>
    <footer-content />
    <pv-toast position="bottom-right" />
    <subscription-pop-up
      v-if="showPopUp"
      @subscribed="onSubscribed"
      @dismissed="onDismissed"
    />
  </div>
</template>

<style scoped>
#app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
