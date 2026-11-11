import {Flex, Typography} from "antd";
import {useQuery} from '@tanstack/react-query'
import productApi from '../../apis/product.api.ts'
import useQueryConfig from '../../hooks/useQueryConfig'

import type {ProductListConfig} from '../../types/product.type.ts';
import PhotoSlider from "../../components/ImageSlider";
import Banner from "../../components/Banner";
import ProductSlider from "../../components/ProductSlider";
import Pagination from "../../components/Pagination";

const {Title} = Typography;

const slider1 = [
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800',
    'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800',
    'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=800',
    'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800',
];

const bannerImages = [
    'https://cdn.hstatic.net/files/200000886795/file/pc-web.jpg',
    'https://cdn.hstatic.net/files/200000887901/file/pc__2__48ef8a77b6904c0caa7c4f7e3df4b809.jpg',
    'https://cdn.hstatic.net/files/200000887901/file/2560x961__6_.jpg',
    'https://cdn.hstatic.net/files/200000887901/file/2560x961__4_.jpg'
];

const App = () => {
    const queryConfig = useQueryConfig()

    const {data: productsData} = useQuery({
        queryKey: ['products', queryConfig],
        queryFn: () => {
            return productApi.getProducts(queryConfig as ProductListConfig)
        },
        staleTime: 3 * 60 * 1000
    })

    const products = productsData?.data.data.products
    const pagination = productsData?.data.data.pagination

    return (
        <>
            <Banner images={bannerImages}/>
            <div className="my-4 px-6">
                <div className="py-6">
                    <Flex justify="center" align='center' gap='small'>
                        <img style={{width: 32, height: 32}}
                             src="https://file.hstatic.net/200000887901/file/isolation_mode_ab277d5f3bda477c8ea36037876365f6.svg"
                             alt="BỘ SƯU TẬP MỚI"/>
                        <Title level={4} style={{margin: 0}}>ARISTINO X KOL</Title>
                    </Flex>
                </div>
                <PhotoSlider images={slider1}/>
                <div className="py-6">
                    <Flex justify="center" align='center' gap='small'>
                        <img style={{width: 32, height: 32}}
                             src="https://file.hstatic.net/200000887901/file/isolation_mode_ab277d5f3bda477c8ea36037876365f6.svg"
                             alt="BỘ SƯU TẬP MỚI"/>
                        <Title level={4} style={{margin: 0}}>BỘ SƯU TẬP MỚI</Title>
                    </Flex>
                </div>
                {products && <ProductSlider products={products}/>}
                <div className="py-4">
                    {pagination && <Pagination queryConfig={queryConfig} defaultCurrent={pagination.page} pageSize={pagination.limit} total={pagination.page_size * pagination.limit }/>}
                </div>
            </div>
        </>
    )
}

export default App;