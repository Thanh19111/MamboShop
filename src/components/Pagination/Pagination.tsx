import {Pagination} from 'antd';
import {createSearchParams, useLocation, useNavigate} from "react-router-dom";
import type {QueryConfig} from "../../hooks/useQueryConfig.tsx";

interface Props {
    queryConfig: QueryConfig
    current: number
    pageSize: number
    total: number
}
const App = ({queryConfig, current, pageSize, total} : Props) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handlePageChange = (page: number) => {
        const newSearchParams = createSearchParams({
            ...queryConfig,
            page: page.toString(), // Cập nhật số trang mới
        }).toString();

        navigate({
            pathname: location.pathname,
            search: newSearchParams,
        });
    };
    return (
        <Pagination onChange={handlePageChange} align="center" defaultCurrent={current} total={total} pageSize={pageSize} />
    )
}

export default App;