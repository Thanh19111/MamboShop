import {Input} from 'antd';

const {Search} = Input;

interface Props {
    placeholder?: string;
    handleSearch: (value: string) => void; // Hàm callback nhận từ khóa khi người dùng tìm kiếm
}

const App = ({
                 placeholder = "Tìm kiếm sản phẩm...",
                 handleSearch}: Props) => {
    return (
        <Search size={"medium"} placeholder={placeholder} onSearch={handleSearch} enterButton/>
    );
}

export default App;