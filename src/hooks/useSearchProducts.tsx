import useQueryConfig from "./useQueryConfig.tsx";
import {createSearchParams, useNavigate} from "react-router-dom";
import omit from "lodash/omit";
import path from "../constants/paths.ts";
import {useState} from "react";

const App = () => {
    const [searchValue, setSearchValue] = useState('');
    const queryConfig = useQueryConfig()
    const navigate = useNavigate()

    const handleSearch = (name: string) => {
        const trimmed = name.trim();
        if (!trimmed) return;

        const config = queryConfig.order
            ? omit({...queryConfig, name: trimmed}, ['order', 'sort_by'])
            : {...queryConfig, name: trimmed}
        navigate({
            pathname: path.products,
            search: createSearchParams(config).toString()
        })
    }

    return {searchValue, setSearchValue, handleSearch}
}

export default App;