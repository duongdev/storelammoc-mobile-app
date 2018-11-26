import find from 'lodash/find'
import get from 'lodash/get'

import env from 'constants/env'
import { AsyncStorage } from 'react-native'
import { Product, Variant } from 'types/products'

export const searchByText = async (
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

/**
 * Gets product by SKU.
 * @param sku Variant SKU
 */
export const getProductBySKU = async (
  sku: Variant['sku'],
): Promise<Product | null> => {
  try {
    // Get cached product from AsyncStorage
    const productJSON = await AsyncStorage.getItem(`@sku:${sku}`)

    try {
      return JSON.parse(productJSON!)
    } catch (error) {
      // productJSON is undefined or invalid JSON
      // ignore this error, go to next steps.
    }

    // If no cached product found, try to fetch it from the server.
    const response = await fetch(`${env.API_URL}/v2/products/${sku}?sku=true`)

    // Bad statuses. See https://httpstatuses.com
    if (response.status < 200 && response.status >= 400) return null

    const product: Product = await response.json()

    // Cache product to AsyncStorage
    await AsyncStorage.setItem(`@sku:${sku}`, JSON.stringify(product))

    return product
  } catch (error) {
    console.warn(error)
    return null
  }
}

export const getProductNavData = (product: Product, sku: Variant['sku']) => {
  const navData: {
    id: Product['id']
    slug: Product['slug']
    variantId?: Variant['id']
  } = {
    id: product.id,
    slug: product.slug,
    variantId: get(find(product.variants, { sku }), 'id'),
  }

  return navData
}
