import env from 'constants/env'

const instanceSearch = async (
  text: string,
  __mask = 'products(id,name,slug,images,variants(name,sku,price))',
) => {
  try {
    const response = await fetch(
      `${
        env.API_URL
      }/v2/products/search?q=${text}&perPage=${10}&__mask=${__mask}`,
    )
    return await response.json()
  } catch (error) {
    console.warn(error)
    throw error
  }
}

export default instanceSearch
