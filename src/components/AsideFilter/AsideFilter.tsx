import {Button, Space, Typography} from 'antd';
import {UnorderedListOutlined} from "@ant-design/icons";
import {useState} from "react";
import type {Category} from "../../types/category.type.ts";
import type {QueryConfig} from "../../hooks/useQueryConfig.tsx";
import path from '../../constants/paths.ts';
import {createSearchParams, Link, useNavigate} from "react-router-dom";
import RatingFilter from "../RatingFilter/RatingFilter.tsx";
import PriceFilter from "../PriceFilter/PriceFilter.tsx";
import omit from "lodash/omit";

const {Title, Text} = Typography;

interface Props {
    categories: Category[]
    queryConfig: QueryConfig
}

const App = ({categories, queryConfig}: Props) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleClearAll = () => {
        setSelectedCategory(null);
        navigate({
            pathname: path.products,
            search: createSearchParams(omit(queryConfig, ['price_min', 'price_max', 'rating_filter', 'category'])).toString()
        })
    };

    return (
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
                        <li key={cat._id} className="p-1">
                            <Link
                                to={{
                                    pathname: path.products,
                                    search: createSearchParams({
                                        ...queryConfig,
                                        page: "1",
                                        category: cat._id
                                    }).toString()
                                }}
                                className={`cursor-pointer text-sm transition-all ${
                                    selectedCategory === cat._id
                                        ? 'text-black font-bold translate-x-1'
                                        : 'text-gray-600 hover:text-black'
                                }`}>
                                <Text>
                                    {cat.name}
                                </Text>
                            </Link>
                        </li>
                    ))}
                </ul>
            </Space>
            {/* 2. KHOẢNG GIÁ */}
            <Space vertical className="px-2">
                <Title level={5} className="tracking-wider uppercase text-black">
                    Khoảng Giá
                </Title>
                <PriceFilter queryConfig={queryConfig}/>
            </Space>
            <Space vertical={false} className="px-2">
                <Title level={5} className="uppercase">
                    Đánh giá
                </Title>
                <div className="mb-2">
                    <RatingFilter queryConfig={queryConfig}/>
                </div>
            </Space>
            <Button
                type='primary'
                className="uppercase"
                onClick={handleClearAll}>
                Xóa bộ lọc
            </Button>
        </Space>
    )
}

export default App;