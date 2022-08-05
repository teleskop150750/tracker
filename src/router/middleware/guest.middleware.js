export default function guest({ next, store }) {
  if (!store.getters["auth/check"]) {
    store.commit("auth/INIT");

    if (!store.getters["auth/check"]) {
      next();
    } else {
      next({ name: "Home" });
    }
  } else {
    next({ name: "Home" });
  }
}
