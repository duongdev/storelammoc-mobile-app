import env from 'constants/env'

const quickSearch = async (
  text: string,
  __mask = 'products(id,name,slug,images,variants(name,sku,price))',
) => {
  try {
    const response = await fetch(
      `${
        env.API_URL
      }/v2/products/search?q=${text}&perPage=${10}&__mask=${__mask}`,
    )
    const { products } = await response.json()

    return {
      text,
      products,
    }
  } catch (error) {
    console.warn(error)
    throw error
  }
}

export default quickSearch
