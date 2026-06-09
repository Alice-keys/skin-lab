import { createApp } from 'vue'
import './style.css'
import App from './app.vue'
import i18n from './i18n.js'
import router from './router.js'
import PrimeVue from 'primevue/config'
import Material from '@primeuix/themes/material'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import {
  Avatar, Badge, Button, Card, Carousel, Checkbox,
  Chip, DataTable, Dialog, Divider, Drawer,
  FloatLabel, Image, InputNumber, InputText,
  Menu, Menubar, Message, OverlayBadge,
  Password, ProgressBar, RadioButton, Rating,
  Select, SelectButton, Skeleton, Slider,
  Tag, Textarea, Toast, Toolbar, Tooltip
} from 'primevue'
import ToastService from 'primevue/toastservice'

const app = createApp(App)

// noinspection JSCheckFunctionSignatures
app
  .use(i18n)
  .use(router)
  .use(PrimeVue, { ripple: true, theme: { preset: Material } })
  .use(ToastService)
  .component('pv-avatar',        Avatar)
  .component('pv-badge',         Badge)
  .component('pv-button',        Button)
  .component('pv-card',          Card)
  .component('pv-carousel',      Carousel)
  .component('pv-checkbox',      Checkbox)
  .component('pv-chip',          Chip)
  .component('pv-data-table',    DataTable)
  .component('pv-dialog',        Dialog)
  .component('pv-divider',       Divider)
  .component('pv-drawer',        Drawer)
  .component('pv-float-label',   FloatLabel)
  .component('pv-image',         Image)
  .component('pv-input-number',  InputNumber)
  .component('pv-input-text',    InputText)
  .component('pv-menu',          Menu)
  .component('pv-menubar',       Menubar)
  .component('pv-message',       Message)
  .component('pv-overlay-badge', OverlayBadge)
  .component('pv-password',      Password)
  .component('pv-progress-bar',  ProgressBar)
  .component('pv-radio-button',  RadioButton)
  .component('pv-rating',        Rating)
  .component('pv-select',        Select)
  .component('pv-select-button', SelectButton)
  .component('pv-skeleton',      Skeleton)
  .component('pv-slider',        Slider)
  .component('pv-tag',           Tag)
  .component('pv-textarea',      Textarea)
  .component('pv-toast',         Toast)
  .component('pv-toolbar',       Toolbar)
  .directive('tooltip',          Tooltip)
  .mount('#app')
