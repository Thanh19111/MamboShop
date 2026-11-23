import {Button, Col, Drawer, Flex, Layout, Row, Typography} from 'antd';
import ProductCard from "../../components/ProductCard";
import useQueryConfig from "../../hooks/useQueryConfig.tsx";
import {useQuery} from "@tanstack/react-query";
import productApi from "../../apis/product.api.ts";
import type {ProductListConfig} from "../../types/product.type.ts";
import Pagination from "../../components/Pagination";
import AsideFilter from "../../components/AsideFilter";
import categoryApi from "../../apis/category.api.ts";
import Sort from "../../components/Sort/Sort.tsx";
import {useState} from "react";
import {UnorderedListOutlined} from "@ant-design/icons";

const {Sider, Content} = Layout;
const {Title} = Typography;

const App = () => {
    const queryConfig = useQueryConfig()

    const {data: productsData} = useQuery({
        queryKey: ['products', queryConfig],
        queryFn: () => {
            return productApi.getProducts(queryConfig as ProductListConfig)
        },
        staleTime: 3 * 60 * 1000
    })

    const {data: categoriesData} = useQuery({
        queryKey: ['categories', queryConfig],
        queryFn: () => {
            return categoryApi.getCategories()
        },
        staleTime: 3 * 60 * 1000
    })

    const categories = categoriesData?.data.data || []
    const products = productsData?.data.data.products || []
    const pagination = productsData?.data.data.pagination

    const [open, setOpen] = useState(false);

    return (
        <div className="mx-auto p-4 bg-white min-h-screen">
            <Layout>
                {/* 1. SIDE MENU BÊN TRÁI (Ẩn trên mobile, hiện trên màn hình từ lg trở lên) */}
                <Sider width="25%" className="hidden lg:block border-r border-gray-100 h-full">
                    <AsideFilter queryConfig={queryConfig} categories={categories}/>
                </Sider>

                {/* 2. KHU VỰC HIỂN THỊ SẢN PHẨM BÊN PHẢI */}
                <Content className="bg-white">
                    {/* Thanh công cụ phía trên (Tiêu đề + Sắp xếp) */}
                    <div className="py-2 border-b border-gray-200">
                        <Title level={5} className="uppercase p-2">
                            Tất Cả Sản Phẩm
                        </Title>
                        <Flex justify='space-between'>
                            <div>
                                <div className='ml-2 lg:hidden block'>
                                    <Button onClick={() => setOpen(true)}>
                                        <UnorderedListOutlined/>
                                    </Button>
                                </div>
                            </div>
                            <Drawer
                                placement={'left'}
                                onClose={() => setOpen(false)}
                                open={open}
                                key={'left'}
                                size={350}>
                                <AsideFilter queryConfig={queryConfig} categories={categories}/>
                            </Drawer>
                            <Sort queryConfig={queryConfig}/>
                        </Flex>
                    </div>

                    {/* Lưới danh sách Product Card (Responsive: 2 cột mobile, 3 cột tablet, 4 cột desktop) */}
                    <div className="p-4 h-[700px] overflow-y-auto pr-2">
                        <Row gutter={[16, 24]}>
                            {products && products.map((product) => (
                                <Col key={product._id} xs={12} sm={12} md={8} xl={6}>
                                    <ProductCard product={product}/>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    {/* Thanh phân trang dưới cùng */}
                    {pagination && <div className="py-2">
                        <Pagination
                            queryConfig={queryConfig}
                            current={pagination.page}
                            pageSize={pagination.limit}
                            total={pagination.page_size * pagination.limit}
                        />
                    </div>
                    }
                </Content>
            </Layout>
        </div>
    )
}

export default App;
