type regularExpType = {
  email: RegExp
}

export const regularExp: regularExpType = {
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/ 
}