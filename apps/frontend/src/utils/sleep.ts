export const sleep = async (duration: number = 300) => {
  await new Promise((resolve) => setTimeout(resolve, duration))
}
