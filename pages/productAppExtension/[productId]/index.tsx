import { H4, Panel, Text } from "@bigcommerce/big-design";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ErrorMessage from "@components/error";
import Loading from "@components/loading";
import { useProductInfo } from "@lib/hooks";
import { useSession } from "context/session";

const ProductAppExtension = () => {
    const router = useRouter();
    const productId = Number(router.query?.productId);
    const { error, isLoading: isLoadingProduct, product } = useProductInfo(productId);
    const { description, is_visible: isVisible, name, price, type } = product ?? {};   
    const typeCapitalized = type?.replace(/^\w/, (c: string) => c.toUpperCase());
    const isVisibleString = isVisible ? 'True' : 'False';
    const { context } = useSession();
    const [locale, setLocale] = useState('');
    const [isLocaleLoading, setIsLocaleLoading] = useState(true);

    useEffect(() => {
        const url = '/api/locale';

        fetch(`${url}?context=${context}`)
            .then((res) => res.json())
            .then((data) => {
                if (data?.user?.locale) {
                    setIsLocaleLoading(false);
                    setLocale(data.user.locale);
                }
            });
    }, [context]);

    const getPanel = () => {
        switch (locale){
            case 'es-ES': {
                return (
                    <>
                        <Panel header="Información Básica" marginBottom="small">
                            <H4>Nombre</H4>
                            <Text>{name}</Text>
                            <H4>Tipo</H4>
                            <Text>{typeCapitalized}</Text>
                            <H4>Precio (sin impuestos)</H4>
                            <Text>${price}</Text>
                            <H4>Visible en la tienda</H4>
                            <Text>{isVisibleString}</Text>
                        </Panel>
                        <Panel header="Descripción" margin="none">
                            <H4>Descripción</H4>
                            <Text>{description}</Text>
                        </Panel>
                    </>
                );
            }
            default: {
                return (
                    <>
                        <Panel header="Basic Information" marginBottom="small">
                            <H4>Product name</H4>
                            <Text>{name}</Text>
                            <H4>Product type</H4>
                            <Text>{typeCapitalized}</Text>
                            <H4>Default price (excluding tax)</H4>
                            <Text>${price}</Text>
                            <H4>Visible on storefront</H4>
                            <Text>{isVisibleString}</Text>
                        </Panel>
                        <Panel header="Description" margin="none">
                            <H4>Description</H4>
                            <Text>{description}</Text>
                        </Panel>
                    </>
                );
            }
        }
    }

    if (isLoadingProduct || isLocaleLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;

    return getPanel();
};

export default ProductAppExtension;
