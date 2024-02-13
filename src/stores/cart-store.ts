import { ProductProps } from "@/utils/data/products"
import { create } from "zustand"
import { createJSONStorage, persist } from 'zustand/middleware'
import * as cartInMemory from './helpers/cart-in-memory'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type BagProps = ProductProps & {
    quantity: number
}

type StateProps = {
    bag: BagProps[]
    add: (product: ProductProps) => void
    remove: (productId: string) => void
    clear: () => void
}

export const useCartStore = create(
    persist<StateProps>((set) => ({
        bag: [],
        add: (product: ProductProps) => set((state) => ({
            bag: cartInMemory.add(state.bag, product)
        })),
        remove: (productId: string) => set((state) => ({
            bag: cartInMemory.remove(state.bag, productId)
        })),
        clear: () => set({ bag: [] })
    }), {
        name: "nlw-expert:cart",
        storage: createJSONStorage(() => AsyncStorage)
    }))