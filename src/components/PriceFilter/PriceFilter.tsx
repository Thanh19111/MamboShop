import {Button, Flex, Input} from "antd";
import {useState} from "react";
import type {QueryConfig} from "../../hooks/useQueryConfig.tsx";
import {createSearchParams, useNavigate} from "react-router-dom";
import path from "../../constants/paths.ts";

interface Props {
    queryConfig: QueryConfig;
}

const App = ({queryConfig}: Props) => {
    const [priceMin, setPriceMin] = useState("");
    const [priceMax, setPriceMax] = useState("");
    const navigate = useNavigate();

    const handleApplyPrice = () => {
        if (!isValid(priceMin, priceMax)) return
        navigate({
            pathname: path.products,
            search: createSearchParams({
                ...queryConfig,
                price_max: priceMax,
                price_min: priceMin
            }).toString()
        })
    }

    const isValid = (priceMin: string, priceMax: string): boolean => {
        try {
            let min = parseFloat(priceMin)
            let max = parseFloat(priceMax)
            return max >= min
        } catch {
            return false;
        }
    }

    return (
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
    )
}

export default App