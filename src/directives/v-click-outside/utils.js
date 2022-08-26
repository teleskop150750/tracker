export const isVue3 = true

// eslint-disable-next-line
export const directiveHooks = {
    beforeMount: isVue3 ? 'beforeMount' : 'bind',
    updated: isVue3 ? 'updated' : 'update',
    unmounted: isVue3 ? 'unmounted' : 'unbind',
}
