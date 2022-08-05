export default function auth({ next, store }) {
  const loginQuery = { name: "Login" };

  if (!store.getters["auth/check"]) {
    store.commit("auth/INIT");

    if (!store.getters["auth/check"]) {
      next(loginQuery);
    } else {
      next();
    }
  } else {
    next();
  }
}
