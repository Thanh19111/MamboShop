import {Flex, type MenuProps, Typography} from 'antd';
import {KeyOutlined, MailOutlined, ShoppingOutlined, UserOutlined} from "@ant-design/icons";
import {useQuery} from "@tanstack/react-query";
import {purchasesStatus} from "../../constants/purchase.ts";
import {createSearchParams, Link} from "react-router-dom";
import SubMenu from "../../components/SubMenu";
import useQueryParams from "../../hooks/useQueryParams.tsx";
import purchaseApi from "../../apis/purchase.api.ts";
import type {PurchaseListStatus} from "../../types/purchase.type.ts";
import path from "../../constants/paths.ts";
import classNames from 'classnames'
import {formatCurrency, generateNameId} from "../../utils/utils.ts";
import useCurrentUser from "../../hooks/useCurrentUser.tsx";

const {Title} = Typography;

const purchaseTabs = [
    {status: purchasesStatus.all, name: 'Tất cả'},
    {status: purchasesStatus.waitForConfirmation, name: 'Chờ xác nhận'},
    {status: purchasesStatus.waitForGetting, name: 'Chờ lấy hàng'},
    {status: purchasesStatus.inProgress, name: 'Đang giao'},
    {status: purchasesStatus.delivered, name: 'Đã giao'},
    {status: purchasesStatus.cancelled, name: 'Đã hủy'}
]

const accountMenuItems: MenuProps['items'] = [
    {
        key: 'profile',
        icon: <UserOutlined/>,
        label: <Link to="/user/profile"><span className="font-medium">Thông Tin Cá Nhân</span></Link>,
    },
    {
        key: 'history',
        icon: <ShoppingOutlined/>,
        label: <Link to="/user/purchase"><span className="font-medium">Lịch Sử Đặt Hàng</span></Link>
    },
    {
        key: 'password',
        icon: <KeyOutlined/>,
        label: <Link to="/user/password"><span className="font-medium">Đổi mật khẩu</span></Link>,
    },
    {
        key: 'newsletter',
        icon: <MailOutlined/>,
        label: <span className="font-medium">Đăng Ký Nhận Tin</span>,
    },
];

const App = () => {
    const {profile, logoutMutation} = useCurrentUser();
    const queryParams: { status?: string } = useQueryParams()
    const status: number = Number(queryParams.status) || purchasesStatus.all

    const {data: purchasesInCartData} = useQuery({
        queryKey: ['purchases', {status}],
        queryFn: () => purchaseApi.getPurchases({status: status as PurchaseListStatus})
    })

    const handleLogout = () => logoutMutation.mutate()

    const purchasesInCart = purchasesInCartData?.data.data
    const purchaseTabsLink = purchaseTabs.map((tab) => (
        <Link
            key={tab.status}
            to={{
                pathname: path.historyPurchase,
                search: createSearchParams({
                    status: String(tab.status)
                }).toString()
            }}
            className={classNames('flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center', {
                'border-b-orange text-orange': status === tab.status,
                'border-b-black/10 text-gray-900': status !== tab.status
            })}
        >
            {tab.name}
        </Link>
    ))

    return (
        <div className="max-w-7xl min-h-screen mx-auto px-6 md:px-12 py-8">
            <Flex justify="center" gap={48} className="flex-col md:flex-row">
                <div className="w-full md:w-1/4">
                    <div className="p-4">
                        <Title level={2} className="text-xl font-bold mb-1 text-gray-900">
                            Xin chào, {profile?.name}!
                        </Title>
                        <button onClick={handleLogout}
                                className="text-xs uppercase font-semibold text-black underline tracking-wider hover:text-gray-600 cursor-pointer">ĐĂNG
                            XUẤT
                        </button>
                    </div>
                    <SubMenu items={accountMenuItems} selectedKeys={'history'} mode={'vertical'}/>
                </div>

                <div className="w-full md:w-3/4">
                    <div className="border border-gray-200 p-8 rounded-lg shadow-sm">
                        <Title level={3} className="text-lg font-bold uppercase tracking-wide text-gray-900 mb-6">
                            Thông Tin Đơn Hàng
                        </Title>
                        <div className='overflow-x-auto'>
                            <div className='min-w-[700px]'>
                                <div className='sticky top-0 flex rounded-t-sm shadow-sm'>{purchaseTabsLink}</div>
                                <div>
                                    {purchasesInCart?.map((purchase) => (
                                        <div key={purchase._id}
                                             className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm'>
                                            <Link to={`${path.products}/${generateNameId({
                                                name: purchase.product.name,
                                                id: purchase.product._id
                                            })}`}
                                                  className='flex'>
                                                <div className='flex-shrink-0'>
                                                    <img className='h-20 w-20 object-cover' src={purchase.product.image}
                                                         alt={purchase.product.name}/>
                                                </div>
                                                <div className='ml-3 flex-grow overflow-hidden'>
                                                    <div className='truncate'>{purchase.product.name}</div>
                                                    <div className='mt-3'>x{purchase.buy_count}</div>
                                                </div>
                                                <div className='ml-3 flex-shrink-0'>
                                                    <span className='truncate text-gray-500 line-through'>
                                                        ₫{formatCurrency(purchase.product.price_before_discount)}
                                                    </span>
                                                    <span
                                                        className='ml-2 truncate text-orange'>₫{formatCurrency(purchase.product.price)}</span>
                                                </div>
                                            </Link>
                                            <div className='flex justify-end'>
                                                <div>
                                                    <span>Tổng giá tiền</span>
                                                    <span className='ml-4 text-xl text-orange'>
                                                        ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Flex>
        </div>
    );
}

export default App;