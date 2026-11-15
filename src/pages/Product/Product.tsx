import {Button, Col, Flex, Input, Layout, type MenuProps, Pagination, Rate, Row, Select, Space, Typography} from 'antd';
import ProductCard from "../../components/ProductCard";
import {UnorderedListOutlined} from "@ant-design/icons";
import {useState} from "react";
import useQueryConfig from "../../hooks/useQueryConfig.tsx";
import {useQuery} from "@tanstack/react-query";
import productApi from "../../apis/product.api.ts";
import type {ProductListConfig} from "../../types/product.type.ts";

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

    const products = productsData?.data.data.products
    const pagination = productsData?.data.data.pagination

    const sampleProduct = {
        image: 'https://cdn.hstatic.net/products/200000887901/m-aristino-regular-fit-ajk004bh0__10__00822add8cfa471bbdd0f8037fd1a0ee_6be6f5dd182e4afca45823949ce50781_1024x1024.jpg', // Link ảnh mẫu của bạn
        brand: 'Aristino Business',
        name: 'Áo Halfzip Nam Aristino Business...',
        price: 2200000,
        isNew: true
    };

    // Dữ liệu mẫu danh sách sản phẩm
    const mockProducts = [
        {
            _id: '1',
            image: 'https://cdn.hstatic.net/products/200000887901/m-aristino-regular-fit-ajk004bh0__10__00822add8cfa471bbdd0f8037fd1a0ee_6be6f5dd182e4afca45823949ce50781_1024x1024.jpg',
            brand: 'Aristino Business',
            name: 'Áo Halfzip Nam Aristino Business...',
            price: 2200000,
            isNew: true,
        },
        // ... Thêm các sản phẩm khác từ API của bạn
    ];

    const categoryItems: MenuProps['items'] = [
        {
            key: 'all',
            label: 'Tất cả sản phẩm',
        },
        {
            key: 'ao',
            label: 'Áo Nam',
            children: [
                {key: '60aba4e24efcc70f8892e1c6', label: 'Áo thun'},
                {key: 'ao-so-mi', label: 'Áo sơ mi'},
                {key: 'ao-polo', label: 'Áo Polo'},
            ],
        },
        {
            key: 'phu-kien',
            label: 'Phụ Kiện & Khác',
            children: [
                {key: '60afacca6ef5b902180aacaf', label: 'Đồng hồ'},
                {key: '60afafe76ef5b902180aacb5', label: 'Điện thoại'},
            ],
        },
    ];

    const handleCategorySelect: MenuProps['onClick'] = (e) => {
        console.log('Lọc theo category ID:', e.key);
        // Gọi setSearchParams({ ...queryConfig, category: e.key, page: '1' }) ở đây
    };

    const handleSortChange = (value: string) => {
        console.log('Sắp xếp theo:', value);
        // Gọi setSearchParams({ ...queryConfig, sort_by: value }) ở đây
    };

    // State lưu giá trị khoảng giá
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);

    // Xử lý khi bấm nút ÁP DỤNG khoảng giá
    const handleApplyPrice = () => {
        //onFilterChange({ price_min: priceMin, price_max: priceMax });
    };

    // Xử lý khi chọn danh mục
    const handleSelectCategory = (id: string) => {
        setSelectedCategory(id);
        //onFilterChange({ category: id });
    };

    // Xử lý khi chọn đánh giá sao
    const handleSelectRating = (rating: number) => {
        setSelectedRating(rating);
        //onFilterChange({ rating_filter: rating });
    };

    // Xử lý xóa tất cả
    const handleClearAll = () => {
        setPriceMin('');
        setPriceMax('');
        setSelectedCategory(null);
        setSelectedRating(null);
        //onReset();
    };

    const handleRateChange = (value: number) => {
        setSelectedRating(value);
        onFilterChange({rating_filter: value});
    };

    const categories = [
        {_id: '60aba4e24efcc70f8892e1c6', name: 'Áo thun'},
        {_id: '60afacca6ef5b902180aacaf', name: 'Đồng hồ'},
        {_id: '60afafe76ef5b902180aacb5', name: 'Điện thoại'}]

    return (
        <div className="mx-auto p-4 bg-white">
            <Layout>
                {/* 1. SIDE MENU BÊN TRÁI (Ẩn trên mobile, hiện trên màn hình từ lg trở lên) */}
                <Sider width="25%" className="hidden lg:block border-r border-gray-100 h-full">
                    <Space vertical className="w-full bg-white text-gray-900">
                        {/* 1. TẤT CẢ DANH MỤC */}
                        <Space vertical className="px-2">
                            <Space>
                                <div className="mb-2">
                                    <UnorderedListOutlined/>
                                </div>
                                <Title className="uppercase" level={5}>
                                    Danh Mục Sản Phẩm
                                </Title>
                            </Space>
                            <ul>
                                {categories.map((cat) => (
                                    <li
                                        key={cat._id}
                                        onClick={() => handleSelectCategory(cat._id)}
                                        className={`p-2 cursor-pointer text-sm transition-all ${
                                            selectedCategory === cat._id
                                                ? 'text-black font-bold translate-x-1'
                                                : 'text-gray-600 hover:text-black'
                                        }`}
                                    >
                                        {cat.name}
                                    </li>
                                ))}
                            </ul>
                        </Space>
                        {/* 2. KHOẢNG GIÁ */}
                        <Space vertical className="px-2">
                            <Title level={5} className="tracking-wider uppercase text-black">
                                Khoảng Giá
                            </Title>
                            <Flex gap={3}>
                                <Input
                                    placeholder="TỪ (đ)"
                                    value={priceMin}
                                    onChange={(e) => setPriceMin(e.target.value)}
                                    className="rounded-none text-xs border-gray-300 hover:border-black focus:border-black"
                                />
                                <Input
                                    placeholder="ĐẾN (đ)"
                                    value={priceMax}
                                    onChange={(e) => setPriceMax(e.target.value)}
                                    className="rounded-none text-xs border-gray-300 hover:border-black focus:border-black"
                                />
                                <Button
                                    type="primary"
                                    className="w-[35%] rounded-none bg-black hover:bg-gray-800 text-white font-medium uppercase tracking-wider"
                                    onClick={handleApplyPrice}>
                                    Áp dụng
                                </Button>
                            </Flex>
                        </Space>
                        <Space vertical={false} className="px-2">
                            <Title level={5} className="uppercase">
                                Đánh giá
                            </Title>
                            <div className="mb-2">
                                <Rate
                                    allowHalf
                                    value={selectedRating || 0}
                                    onChange={handleRateChange}
                                    className="text-yellow-500 text-sm"
                                />
                            </div>
                        </Space>
                        <Button
                            type='primary'
                            className="uppercase"
                            onClick={handleClearAll}>
                            Xóa bộ lọc
                        </Button>
                    </Space>
                </Sider>

                {/* 2. KHU VỰC HIỂN THỊ SẢN PHẨM BÊN PHẢI */}
                <Content className="bg-white">
                    {/* Thanh công cụ phía trên (Tiêu đề + Sắp xếp) */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200">
                        <Title level={4} className="uppercase p-2">
                            Tất Cả Sản Phẩm
                        </Title>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Sắp xếp theo:</span>
                            <Select
                                defaultValue="newest"
                                style={{width: 180}}
                                onChange={handleSortChange}
                                options={[
                                    {value: 'newest', label: 'Mới nhất'},
                                    {value: 'price_asc', label: 'Giá: Thấp đến Cao'},
                                    {value: 'price_desc', label: 'Giá: Cao đến Thấp'},
                                    {value: 'sold', label: 'Bán chạy nhất'},
                                ]}
                            />
                        </div>
                    </div>

                    {/* Lưới danh sách Product Card (Responsive: 2 cột mobile, 3 cột tablet, 4 cột desktop) */}
                    <div className="p-4 h-[800px] overflow-y-auto pr-2">
                        <Row gutter={[16, 24]}>
                            {products && products.map((product) => (
                                <Col key={product._id} xs={12} sm={12} md={8} xl={6}>
                                    <ProductCard image={product.image} name={product.name} brand={product.brand}
                                                 price={product.price} isNew={false}/>
                                </Col>
                            ))}
                        </Row>
                    </div>


                    {/* Thanh phân trang dưới cùng */}
                    {
                        pagination && <div className="py-2">
                            <Pagination
                                align="center"
                                current={pagination.page}
                                pageSize={pagination.limit}
                                total={pagination.page_size * pagination.limit}
                                onChange={(page) => console.log('Chuyển sang trang:', page)}
                            />
                        </div>
                    }
                </Content>
            </Layout>
        </div>
    )
}

export default App;
