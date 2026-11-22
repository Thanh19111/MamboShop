import React, {useState} from 'react';
import {Button, Divider, Image, InputNumber, Table, Typography} from 'antd';
import {ArrowLeftOutlined, DeleteOutlined, ShoppingOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import {useMutation, useQuery} from "@tanstack/react-query";
import {purchasesStatus} from "../../constants/purchase.ts";
import purchaseApi from "../../apis/purchase.api.ts";
import type {Purchase} from "../../types/purchase.type.ts";
import {toast} from "react-toastify";

const {Title} = Typography;

const App = () => {
    const navigate = useNavigate();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    // 1. Gọi API lấy giỏ hàng từ server
    const {data: purchasesInCartData, refetch} = useQuery({
        queryKey: ['purchases', {status: purchasesStatus.inCart}],
        queryFn: () => purchaseApi.getPurchases({status: purchasesStatus.inCart})
    });

    // Delete item form cart
    const deletePurchases = useMutation({
        mutationFn: purchaseApi.deletePurchase,
        onSuccess: () => {
            refetch()
        }
    })

    const updatePurchase = useMutation({
        mutationFn: purchaseApi.updatePurchase,
        onSuccess: () => {
            refetch()
        }
    })

    const purchaseOrder = useMutation({
        mutationFn: purchaseApi.buyProducts,
        onSuccess: (data) => {
            refetch()
            toast.success(data.data.message, {
                position: 'top-center',
                autoClose: 1000
            })
        }
    })

    const purchases: Purchase[] = purchasesInCartData?.data.data || [];

    // Xử lý thay đổi số lượng sản phẩm (Gọi API update ở đây sau)
    const handleQuantityChange = (id: string, quantity: number | null) => {
        if (!quantity) return;
        updatePurchase.mutate({product_id: id, buy_count: quantity})
    };

    // Xóa sản phẩm khỏi giỏ
    const handleRemoveItem = (id: string) => {
        setSelectedRowKeys(prev => prev.filter(key => key !== id))
        deletePurchases.mutate([id])
    };

    const handlePurchaseOrder = () => {
        if (selectedItems.length <= 0) return

        const body = selectedItems.map((purchase) => ({
            product_id: purchase.product._id,
            buy_count: purchase.buy_count
        }))
        purchaseOrder.mutate(body)
    }

    // 2. Cấu hình các cột khớp với cấu trúc object Purchase của API
    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'product',
            key: 'product',
            render: (_: any, record: Purchase) => (
                <div className="flex items-center gap-4">
                    <Image
                        src={record.product.image}
                        alt={record.product.name}
                        width={80}
                        height={100}
                        className="object-cover border border-gray-200"
                        preview={false}
                    />
                    <div>
                        <h4 className="font-medium text-sm text-gray-900 m-0 line-clamp-2">
                            {record.product.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                            Phân loại: {record.product.category?.name || 'Mặc định'}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            width: 140,
            render: (price: number) => (
                <span className="font-medium text-sm text-black">
                    {price.toLocaleString('vi-VN')} đ
                </span>
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'buy_count',
            key: 'buy_count',
            width: 130,
            render: (_: any, record: Purchase) => (
                <InputNumber
                    min={1}
                    max={99}
                    value={record.buy_count}
                    onChange={(val) => handleQuantityChange(record.product._id, val)}
                    className="rounded-none text-center"
                />
            ),
        },
        {
            title: 'Thành tiền',
            key: 'total',
            width: 150,
            render: (_: any, record: Purchase) => (
                <span className="font-bold text-sm text-black">
                    {(record.price * record.buy_count).toLocaleString('vi-VN')} đ
                </span>
            ),
        },
        {
            title: '',
            key: 'action',
            width: 60,
            render: (_: any, record: Purchase) => (
                <Button
                    type="text"
                    icon={<DeleteOutlined className="text-gray-400 hover:text-red-600 text-base"/>}
                    onClick={() => handleRemoveItem(record._id)}
                />
            ),
        },
    ];

    // 3. Tính tổng tiền dựa hoàn toàn trên dữ liệu API thực tế (`purchases`)
    const selectedItems = purchases.filter(item => selectedRowKeys.includes(item._id));
    const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.buy_count, 0);

    // Cấu hình chọn hàng (Checkbox)
    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
    };

    return (
        <div className="max-w-[1400px] min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Tiêu đề trang */}
            <div className="flex items-center justify-between border-b border-gray-200 mb-8">
                <Title level={3} className="uppercase m-0 tracking-wider">
                    Giỏ Hàng Của Bạn ({purchases.length})
                </Title>
                <Button
                    type="link"
                    icon={<ArrowLeftOutlined/>}
                    onClick={() => navigate(-1)}
                    className="text-black hover:text-gray-600 p-0 font-medium"
                >
                    Tiếp tục mua sắm
                </Button>
            </div>

            {purchases.length === 0 ? (
                /* Giao diện khi giỏ hàng trống */
                <div className="text-center py-20 bg-gray-50 border border-dashed border-gray-300">
                    <ShoppingOutlined className="text-5xl text-gray-300 mb-4"/>
                    <p className="text-gray-500 mb-6">Giỏ hàng của bạn đang trống</p>
                    <Button
                        type="primary"
                        className="rounded-none bg-black hover:bg-gray-800 text-white px-8 h-10 uppercase tracking-wider text-xs font-medium"
                        onClick={() => navigate('/')}
                    >
                        Khám phá sản phẩm ngay
                    </Button>
                </div>
            ) : (
                /* Giao diện chính: 2 cột (Bảng sản phẩm + Thanh toán) */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* CỘT TRÁI: BẢNG SẢN PHẨM */}
                    <div className="lg:col-span-8 overflow-x-auto">
                        <Table
                            rowKey="_id"
                            dataSource={purchases}
                            columns={columns}
                            rowSelection={rowSelection}
                            pagination={false}
                            className="border border-gray-100"
                        />
                    </div>

                    {/* CỘT PHẢI: TỔNG KẾT ĐƠN HÀNG */}
                    <div className="lg:col-span-4 bg-gray-50 p-6 border border-gray-200">
                        <Title level={5} className="uppercase tracking-wider pb-4 border-b border-gray-200 m-0">
                            Cộng Giỏ Hàng
                        </Title>

                        <div className="py-4 space-y-3">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Tạm tính ({selectedItems.length} sản phẩm):</span>
                                <span className="font-medium text-black">{totalPrice.toLocaleString('vi-VN')} đ</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Phí vận chuyển:</span>
                                <span className="text-gray-900 font-medium">Tính khi thanh toán</span>
                            </div>
                        </div>

                        <Divider className="my-2"/>

                        <div className="flex justify-between items-center py-3">
                            <span className="font-bold text-base uppercase">Tổng cộng:</span>
                            <span className="font-bold text-xl text-black">{totalPrice.toLocaleString('vi-VN')} đ</span>
                        </div>

                        <Button
                            type="primary"
                            disabled={selectedRowKeys.length === 0}
                            className="w-full rounded-none bg-black hover:bg-gray-800 text-white h-12 uppercase tracking-wider font-medium text-xs mt-4 disabled:bg-gray-300 disabled:text-gray-500"
                            onClick={handlePurchaseOrder}
                            loading={purchaseOrder.isPending}
                        >
                            Tiến hành thanh toán
                        </Button>

                        <p className="text-xs text-gray-400 text-center mt-3">
                            (Đã bao gồm thuế VAT nếu có)
                        </p>
                    </div>

                </div>
            )}
        </div>
    );
}

export default App;