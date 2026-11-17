import {Select, Space} from "antd";
import type {QueryConfig} from "../../hooks/useQueryConfig.tsx";
import {order, sortBy} from "../../constants/product.ts";
import {createSearchParams, useNavigate} from "react-router-dom";
import _ from 'lodash';
import path from "../../constants/paths.ts";
import omit from "lodash/omit";

interface Props {
    queryConfig: QueryConfig
}

const App = ({queryConfig}: Props) => {
    const navigate = useNavigate()
    const orderByPrice = [order.asc, order.desc]

    const handleSortChange = (value: string) => {
        _.includes(orderByPrice, value) ? handlePriceOrder(value) : handleSort(value)
    };

    const handlePriceOrder = (orderBy: string) => {
        navigate({
            pathname: path.products,
            search: createSearchParams({
                ...queryConfig,
                sort_by: sortBy.price,
                order: orderBy
            }).toString()
        })
    }

    const handleSort = (sortBy: string) => {
        navigate({
            pathname: path.products,
            search: createSearchParams(
                omit(
                    {
                        ...queryConfig,
                        sort_by: sortBy
                    },
                    ['order']
                )
            ).toString()
        })
    }

    return (
        <Space>
            <span className="text-sm text-gray-500">Sắp xếp theo:</span>
            <Select
                style={{width: 180}}
                defaultValue={sortBy.view}
                onChange={handleSortChange}
                options={[
                    {value: sortBy.createdAt, label: 'Mới nhất'},
                    {value: sortBy.sold, label: 'Bán chạy nhất'},
                    {value: sortBy.view, label: 'Phổ biến'},
                    {value: order.asc, label: 'Giá: Thấp đến Cao'},
                    {value: order.desc, label: 'Giá: Cao đến Thấp'}

                ]}
            />
        </Space>
    )
}

export default App;