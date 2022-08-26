import { createRouter, createWebHistory } from 'vue-router'
import { loadLayout } from './layout/loadLayout'

import store from '../store/index'
import auth from './middleware/auth.middleware'
import guest from './middleware/guest.middleware'
import middlewarePipeline from './middleware/middlewarePipeline'

const routes = [
    {
        path: '/time',
        name: 'time',
        component: () => import(/* webpackChunkName: "time" */ '../pages/Time.vue'),
        meta: {
            layout: 'error',
        },
    },
    {
        path: '/test3',
        name: 'test3',
        component: () => import(/* webpackChunkName: "test3" */ '../pages/Test3.vue'),
        meta: {
            layout: 'error',
        },
    },
    {
        path: '/test',
        name: 'test',
        component: () => import(/* webpackChunkName: "test" */ '../pages/Test.vue'),
        meta: {
            layout: 'error',
        },
    },
    {
        path: '/test2',
        name: 'test2',
        component: () => import(/* webpackChunkName: "test2" */ '../pages/Test2.vue'),
        meta: {
            layout: 'error',
        },
    },
    {
        path: '/table',
        name: 'table',
        component: () => import(/* webpackChunkName: "table" */ '../pages/Table.vue'),
        meta: {
            layout: 'default',
        },
    },
    {
        path: '/',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '../pages/Home.vue'),
        meta: { layout: 'default', middleware: [auth] },
    },
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "login" */ '../pages/Login.vue'),
        meta: {
            layout: 'login',
            middleware: [guest],
        },
    },
    {
        path: '/register',
        name: 'register',
        component: () => import(/* webpackChunkName: "register" */ '../pages/Register.vue'),
        meta: {
            layout: 'login',
            middleware: [guest],
        },
    },
    {
        path: '/created-by-me',
        name: 'created-by-me',
        component: () => import(/* webpackChunkName: "created-by-me" */ '../pages/CreatedByMeTasks.vue'),
        meta: {
            layout: 'default',
            middleware: [auth],
        },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import(/* webpackChunkName: "notFound" */ '../pages/NotFound.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(loadLayout)

router.beforeEach((to, from, next) => {
    const middleware = to.meta.middleware
    const context = { to, from, next, store }

    if (!middleware) {
        return next()
    }

    middleware[0]({
        ...context,
        next: middlewarePipeline(context, middleware, 1),
    })
})

export default router
