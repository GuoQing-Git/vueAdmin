import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const ShopIdKey = 'Shop-Id'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getShopId() {
  return Cookies.get(ShopIdKey)
}

export function setShopId(token) {
  return Cookies.set(ShopIdKey, token)
}

export function removeShopId() {
  return Cookies.remove(ShopIdKey)
}
