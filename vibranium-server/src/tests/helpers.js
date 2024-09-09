export const excessiveString = "a".repeat(1000);
export const excessiveArray = Array(1000).fill(0);
export const excessiveObject = Object.fromEntries(Array(1000).fill([0, 0]));

export function maketoken(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function makeMongoId() {
  return maketoken(24);
}

export function checkIsHashed(password) {
  // Regular expressions for different hash types
  const md5Pattern = /^[a-f0-9]{32}$/;
  const sha1Pattern = /^[a-f0-9]{40}$/;
  const sha256Pattern = /^[a-f0-9]{64}$/;
  const bcryptPattern = /^\$2[abxy]\$.{56}$/;

  // Check if the password matches any common hash pattern
  if (
    md5Pattern.test(password) ||
    sha1Pattern.test(password) ||
    sha256Pattern.test(password) ||
    bcryptPattern.test(password)
  ) {
    return true;
  }
  return false;
}
