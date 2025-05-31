import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/home'),
  },
  {
    path: '/storage/files',
    name: 'files',
    component: () => import('@/pages/files'),
  },
  {
    path: '/tools/password-generator',
    name: 'password-generator',
    component: () => import('@/pages/password-generator'),
  },
]
