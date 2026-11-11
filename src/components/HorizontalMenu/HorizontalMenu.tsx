import type {MenuProps} from 'antd';
import {Menu} from 'antd';

// Định nghĩa cấu trúc danh sách Menu (bao gồm cả các cấp Dropdown)
interface Props {
    items: MenuProps['items']
}


const App = ({items}: Props) => {
    const onClick: MenuProps['onClick'] = (e) => {
        console.log('Bạn vừa click vào menu key:', e.key);
    };

    return <Menu
        onClick={onClick}
        mode="horizontal"        // 👈 Đặt mode="horizontal" để dàn trang thành Menu ngang
        items={items}
        triggerSubMenuAction="hover" // 👈 Thiết lập hover để hiện dropdown (mặc định của Antd)
    />
}

export default App;