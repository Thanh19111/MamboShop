import {Rate} from "antd";
import {useState} from "react";
import {createSearchParams, useNavigate} from "react-router-dom";
import path from "../../constants/paths.ts";
import type {QueryConfig} from "../../hooks/useQueryConfig.tsx";

interface Props {
    queryConfig: QueryConfig
}

const App = ({queryConfig}: Props) => {
    const [selectedRating, setSelectedRating] = useState<number>(0);
    const navigate = useNavigate();

    const handleRateChange = (value: number) => {
        setSelectedRating(value);
        
        navigate({
            pathname: path.products,
            search: createSearchParams({
                ...queryConfig,
                rating_filter: String(value)
            }).toString()
        })
    };

    return (
        <Rate
            allowHalf
            value={selectedRating}
            onChange={handleRateChange}
            className="text-yellow-500 text-sm"
        />
    )
}

export default App;