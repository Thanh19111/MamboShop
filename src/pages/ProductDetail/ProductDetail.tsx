import React, {useState} from 'react';
import DOMPurify from 'dompurify'
import {Breadcrumb, Button, Image, InputNumber, Rate, Tabs, Typography} from 'antd';
import {
    CarOutlined,
    HeartOutlined,
    SafetyCertificateOutlined,
    ShoppingCartOutlined,
    SyncOutlined
} from '@ant-design/icons';
import {useNavigate, useParams} from 'react-router-dom';
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import productApi from "../../apis/product.api.ts";
import {getIdFromNameId} from "../../utils/utils.ts";
import type {Product} from "../../types/product.type.ts";
import purchaseApi from "../../apis/purchase.api.ts";
import {toast} from "react-toastify";
import {purchasesStatus} from "../../constants/purchase.ts";

const {Title, Text, Paragraph} = Typography;

export default function ProductDetailPage() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const {name} = useParams();
    const id = getIdFromNameId(name as string)

    const {data} = useQuery({
        queryKey: ['product', id],
        queryFn: () => productApi.getProductDetail(id as string)
    })

    const addToCart = useMutation({
        mutationFn: purchaseApi.addToCart
    })

    const productD: Product = data?.data.data

    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState('https://via.placeholder.com/600x800');

    // Danh sách ảnh mẫu của sản phẩm
    const productImages = [
        'https://via.placeholder.com/600x800',
        'https://via.placeholder.com/600x800/eee/333',
        'https://via.placeholder.com/600x800/ccc/222',
    ];

    // Mock thông tin sản phẩm
    const product = {
        name: 'Áo Sơ Mi Nam Công Sở Slim Fit Dài Tay Aristino',
        sku: 'ASM01-TRG',
        price: 790000,
        originalPrice: 990000,
        rating: 4.8,
        reviewCount: 124,
        description: 'Áo sơ mi nam công sở phom dáng Slim Fit ôm nhẹ cơ thể nhưng vẫn đảm bảo sự thoải mái tối đa khi vận động. Chất liệu vải cao cấp mềm mịn, ít nhăn, thấm hút mồ hôi tốt.',
        colors: [
            {name: 'Trắng', code: '#ffffff'},
            {name: 'Xanh nhạt', code: '#dbeafe'},
            {name: 'Đen', code: '#000000'}
        ],
        sizes: ['38', '39', '40', '41', '42']
    };

    const handleAddToCart = () => {
        addToCart.mutate(
            {buy_count: quantity, product_id: productD?._id as string},
            {
                onSuccess: (data) => {
                    toast.success(data.data.message, {autoClose: 1000})
                    queryClient.invalidateQueries({queryKey: ['purchases', {status: purchasesStatus.inCart}]})
                }
            }
        )
    };

    if (!productD) return null
    return (
        <>
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* 1. THANH BREADCRUMB ĐIỀU HƯỚNG */}
                <div className="py-3">
                    <Breadcrumb
                        items={[
                            {title: <span className="cursor-pointer" onClick={() => useNavigate('/')}>Trang chủ</span>},
                            {title: <span className="cursor-pointer">{productD.category.name}</span>},
                            {title: <span className="text-black font-medium">{productD.name}</span>},
                        ]}
                    />
                </div>

                {/* 2. KHU VỰC THÔNG TIN CHÍNH (2 CỘT) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                    {/* CỘT TRÁI: HÌNH ẢNH SẢN PHẨM (Chiếm 6/12 cột) */}
                    <div className="lg:col-span-6 space-y-4">
                        {/* Ảnh lớn chính */}
                        <div className="border border-gray-200 overflow-hidden bg-gray-50">
                            <Image
                                src={activeImage}
                                alt={product.name}
                                className="w-full h-[550px] object-cover"
                                preview={false}
                            />
                        </div>
                        {/* Danh sách ảnh thu nhỏ (Thumbnails) */}
                        <div className="flex gap-3">
                            {productD && productImages.map((img, index) => (
                                <div
                                    key={index}
                                    onClick={() => setActiveImage(img)}
                                    className={`w-20 h-24 border cursor-pointer overflow-hidden transition-all ${
                                        activeImage === img ? 'border-black ring-1 ring-black' : 'border-gray-200 opacity-70 hover:opacity-100'
                                    }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover"/>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CỘT PHẢI: THÔNG TIN VÀ ĐẶT HÀNG (Chiếm 6/12 cột) */}
                    <div className="lg:col-span-6 space-y-6">
                        <div>
                            <Text className="uppercase text-gray-400 tracking-wider">Mã sản
                                phẩm: {productD._id}</Text>
                            <Title level={2} className="uppercase font-normal tracking-wide text-gray-900 mt-1 mb-2">
                                {productD.name}
                            </Title>

                            {/* Đánh giá sao & Đã bán */}
                            <div className="flex items-center gap-3">
                                <Rate disabled allowHalf value={productD.rating} className="text-yellow-500 text-sm"/>
                                <span className="text-xs text-gray-500">(đã bán {productD.sold})</span>
                            </div>
                        </div>

                        {/* Giá tiền */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 border-l-2 border-black">
                            <span
                                className="text-2xl font-bold text-black">{productD.price.toLocaleString('vi-VN')} đ</span>
                            {productD.price && (
                                <span className="text-sm text-gray-400 line-through">
                                {productD.price_before_discount.toLocaleString('vi-VN')} đ
                            </span>
                            )}
                        </div>

                        {/* Mô tả ngắn */}
                        <Paragraph className="text-gray-600 text-sm leading-relaxed">
                            {productD.name}
                        </Paragraph>
                        {/* Chọn số lượng & Nút Mua hàng */}
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-black">Số lượng:</span>
                                <InputNumber
                                    min={1}
                                    max={10}
                                    value={quantity}
                                    onChange={(val) => setQuantity(val || 1)}
                                    className="rounded-none w-24 text-center"
                                />
                            </div>

                            <div className="flex gap-4 pt-2">
                                <Button
                                    type="primary"
                                    icon={<ShoppingCartOutlined/>}
                                    className="flex-1 rounded-none bg-black hover:bg-gray-800 text-white h-12 uppercase tracking-wider font-medium text-xs"
                                    onClick={handleAddToCart}
                                >
                                    Thêm vào giỏ
                                </Button>
                                <Button
                                    className="w-12 h-12 rounded-none border-black text-black flex items-center justify-center hover:bg-gray-50"
                                    icon={<HeartOutlined className="text-lg"/>}
                                />
                            </div>
                        </div>

                        {/* Chính sách hỗ trợ */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 text-center">
                            <div className="flex flex-col items-center gap-1">
                                <CarOutlined className="text-xl text-black"/>
                                <span className="text-xs text-gray-600">Miễn phí vẫn chuyển đơn từ 500k</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <SyncOutlined className="text-xl text-black"/>
                                <span className="text-xs text-gray-600">Đổi trả tận nơi trong 30 ngày</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <SafetyCertificateOutlined className="text-xl text-black"/>
                                <span className="text-xs text-gray-600">Bảo hành chính hãng 6 tháng</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 3. TABS THÔNG TIN CHI TIẾT & BẢO QUẢN */}
                <div className="mt-8 border-t border-gray-200">
                    <Tabs
                        defaultActiveKey="1"
                        centered
                        items={[
                            {
                                key: '1',
                                label: <span className="uppercase font-medium tracking-wider">Mô tả sản phẩm</span>,
                                children: (
                                    <div
                                        className="max-w-3xl mx-auto py-6 text-gray-700 text-sm leading-relaxed space-y-4">
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: DOMPurify.sanitize(productD.description)
                                            }}
                                        />
                                    </div>
                                ),
                            },
                            {
                                key: '2',
                                label: <span className="uppercase font-medium tracking-wider">Hướng dẫn</span>,
                                children: (
                                    <div
                                        className="max-w-3xl mx-auto py-6 text-gray-700 text-sm leading-relaxed space-y-2">
                                    </div>
                                ),
                            },
                        ]}
                    />
                </div>
            </div>
        </>
    );
}