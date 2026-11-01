import type {MenuProps} from 'antd';
import {Menu} from 'antd';

// Định nghĩa cấu trúc danh sách Menu (bao gồm cả các cấp Dropdown)
const items: MenuProps['items'] = [
    {
        label: 'Trang Chủ',
        key: 'home',
    },
    {
        label: 'Bộ Sưu Tập Mới',
        key: 'new-collection',
    },
    {
        label: 'Sản Phẩm',
        key: 'products',
        // 💡 Thêm thuộc tính children để tự động tạo Dropdown danh sách khi hover
        children: [
            {
                type: 'group',
                label: 'Áo Nam',
                children: [
                    {label: 'Áo Sơ Mi Nam', key: 'ao-so-mi'},
                    {label: 'Áo Polo Nam', key: 'ao-polo'},
                    {label: 'Áo T-Shirt (Phông)', key: 'ao-tshirt'},
                    {label: 'Áo Vest / Blazer', key: 'ao-vest'},
                ],
            },
            {
                type: 'group',
                label: 'Quần Nam',
                children: [
                    {label: 'Quần Tây / Âu', key: 'quan-tay'},
                    {label: 'Quần Khaki', key: 'quan-khaki'},
                    {label: 'Quần Short', key: 'quan-short'},
                    {label: 'Quần Jeans', key: 'quan-jeans'},
                ],
            },
        ],
    },
    {
        label: 'Phụ Kiện',
        key: 'accessories',
        children: [
            {label: 'Cà Vạt / Nơ', key: 'ca-vat'},
            {label: 'Thắt Lưng Da', key: 'that-lung'},
            {label: 'Ví Da', key: 'vi-da'},
            {label: 'Giày Da / Loafer', key: 'giay-da'},
        ],
    },
    {
        label: 'Khuyến Mãi',
        key: 'sale',
    },
];

const App = () => {
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