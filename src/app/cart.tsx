import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { Input } from "@/components/input";
import { LinkButton } from "@/components/link-button";
import { Product } from "@/components/product";
import { BagProps, useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/utils/functions/format-currency";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { Alert, Linking, ScrollView, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import colors from "tailwindcss/colors";

export default function Cart() {

    const cartStore = useCartStore()

    const navigation = useNavigation()

    const [address, setAddress] = useState("")

    const totalAmountWithoutFormat = cartStore.bag.reduce((total, product) =>
        total + (product.price * product.quantity),
        0
    )
    const total = formatCurrency(totalAmountWithoutFormat)

    function handleProductRemove(product: BagProps) {
        Alert.alert("Remover", `Deseja remover ${product.title} do carrinho?`, [
            {
                text: "Cancelar",
            },
            {
                text: "Remover",
                onPress: () => cartStore.remove(product.id)
            }
        ])
    }

    function handleOrder() {
        const bag = cartStore.bag

        if (bag.length === 0) {
            return Alert.alert("Pedido", "Monte seu pedido para fazer o envio!")
        }

        if (address.trim().length === 0) {
            return Alert.alert("Pedido", "Informe os dados da entrega.")
        }

        const products = bag.map((product) => `\n ${product.title.includes("X-") ? "🍔" : product.title.includes("Hmmm") ? "🥤" : "🍨"} ${product.quantity} ${product.title}`).join("")

        const message = `
            📃 *NOVO PEDIDO* 📃
            \n 📍 Entregar para: ${address}

            ${products}

            \n Valor total: *${total}*
        `

        Linking.openURL(`http://api.whatsapp.com/send?phone=${process.env.EXPO_PUBLIC_PHONE_NUMBER}&text=${message}`)

        cartStore.clear()
        navigation.goBack()
    }

    return (
        <View className="flex-1 pt-8">
            <Header title="Seu carrinho" />
            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                extraHeight={100}
            >
                <ScrollView>
                    <View className="p-5 flex-1">
                        {cartStore.bag.length > 0 &&
                            <View className="border-b border-slate-700">
                                {
                                    cartStore.bag.map(product => {
                                        return <Product
                                            key={product.id}
                                            data={product}
                                            onPress={() => handleProductRemove(product)}
                                        />
                                    })
                                }
                            </View>
                        }
                        {cartStore.bag.length === 0 &&
                            <View className="items-center gap-1 my-8">
                                <Ionicons name="clipboard-outline" color={colors.slate[400]} size={32} />
                                <Text className="font-body text-slate-400 text-center">
                                    Seu carrinho está vazio.
                                </Text>
                            </View>
                        }
                        <View className="flex-row gap-2 items-center mt-5 mb-4">
                            <Text className="text-white text-xl font-subtitle">Total:</Text>
                            <Text className="text-lime-400 text-2xl font-heading">{total}</Text>
                        </View>

                        <Input
                            placeholder="Informe o endereço de entrega com rua, bairro, CEP, número e complemento..."
                            value={address}
                            onChangeText={setAddress}
                            blurOnSubmit={true}
                            onSubmitEditing={handleOrder}
                            returnKeyType="next"
                        />
                    </View>
                </ScrollView>
            </KeyboardAwareScrollView>

            <View className="p-5 gap-5">
                <Button onPress={handleOrder}>
                    <Button.Text>Enviar pedido</Button.Text>
                    <Button.Icon><Feather name="arrow-right-circle" size={20} /></Button.Icon>
                </Button>
                <LinkButton title="Voltar ao cardápio" href="/" />
            </View>
        </View>
    )
}