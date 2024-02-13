import { ProductProps } from "@/utils/data/products";
import { create } from "zustand";
import * as cartInMemory from './helpers/cart-in-memory'

export type BagProps = ProductProps & {
    quantity: number
}

type StateProps = {
    bag: BagProps[]
    add: (product: ProductProps) => void
}

export const useCartStore = create<StateProps>((set) => ({
    bag: [],
    add: (product: ProductProps) => set((state) => ({
        bag: cartInMemory.add(state.bag, product)
    }))
}))