export function generateGuestRandomUsername(): string {
  return 'guest' + Math.floor(Math.random() * 9000000000) + 1000000000;
}

export function generateRandomString(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPRSUVWXYZ';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
