export const checkUserName = (name: string): boolean => {
  return /^[\u4e00-\u9fa5_a-zA-Z0-9_]{3,16}$/ig.test(name)
}

export const checkPassword = (password: string): boolean => {
  return /^[a-zA-Z0-9~!@#%^&*-_=+|;:'",<.>/?`()[{\]}$]{6,16}$/ig.test(password)
}

export const checkPhone = (phone: string): boolean => {
  return /^(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(phone)
}
