import {Card, Typography} from 'antd';
import {PlusOutlined} from "@ant-design/icons";

interface Props {
    image: string;
    brand: string;
    name: string;
    price: number;
    isNew?: boolean;
}

const App = ({
                 name,
                 image,
                 brand,
                 price,
                 isNew
             }: Props) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(amount);
    };

    return (
        <Card
            hoverable
            className="w-full max-w-[280px] rounded-none border border-gray-200 shadow-none transition-all duration-300 bg-white"
            cover={
                <div className="relative group overflow-hidden bg-[#f3f3f3] aspect-[3/4]">
                    {/* Nhãn NEW góc trên bên trái */}
                    {isNew && (
                        <div className="absolute top-3 left-3 bg-black text-white text-[11px] font-bold px-2.5 py-1 tracking-wider uppercase rounded-[2px]">
                            NEW
                        </div>
                    )}

                    {/* Ảnh sản phẩm tràn viền */}
                    <img
                        alt={name}
                        src={image}
                        className="w-full h-full object-cover object-center"
                    />

                    {/* Nút dấu cộng (+) góc dưới bên phải ảnh */}
                    <button
                        className="absolute bottom-3 right-3 w-8 h-8 bg-white border border-gray-300 rounded-[4px] flex items-center justify-center text-black shadow-sm hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation(); // Ngăn sự kiện nổi bọt khi click vào card
                            console.log('Clicked quick add/action');
                        }}
                    >
                        <PlusOutlined className="text-xs font-semibold" />
                    </button>
                </div>
            }
        >
            {/* Phần thông tin căn giữa */}
            <div className="text-center">
                {/* Tên thương hiệu: Đậm, màu đen rõ nét */}
                <h4 className="text-sm font-bold text-gray-900">
                    {brand}
                </h4>

                {/* Tên sản phẩm: Chữ thường, thanh thoát, giới hạn 1 dòng */}
                <h3 className="text-sm font-normal text-gray-800 line-clamp-1">
                    {name}
                </h3>

                {/* Giá tiền: Đậm, nổi bật */}
                <div className="text-base font-bold text-gray-900">
                    {formatCurrency(price)}
                </div>
            </div>
        </Card>
    );
};

export default App;