import { post, get, del, hasBackend } from "./client";

export async function loginApi(username, password) {
  return post("/api/users/login/", { username, password });
}

export async function signupApi(username, email, password) {
  return post("/api/users/signup/", { username, email, password, password_confirm: password });
}

export async function logoutApi() {
  return post("/api/users/logout/", {});
}

export async function getMeApi() {
  return get("/api/users/me/");
}

export async function getWatchlistApi() {
  return get("/api/stocks/watchlist/");
}

export async function addWatchlistApi(ticker) {
  return post("/api/stocks/watchlist/", { ticker });
}

export async function removeWatchlistApi(ticker) {
  return del("/api/stocks/watchlist/", { ticker });
}
