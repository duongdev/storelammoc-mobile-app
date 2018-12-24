export interface Variant {
  id: string
  sku: string
}

export interface Product {
  id: string
  name: string
  slug: string
  variants: Variant[]
}
