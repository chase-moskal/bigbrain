
export const sleep = (milliseconds: number) =>
new Promise((resolve, reject) => setTimeout(resolve, milliseconds))
