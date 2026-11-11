import {Button, DatePicker, Flex, Form, Input, type MenuProps, Typography} from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {CarOutlined, MailOutlined, ShoppingOutlined, UserOutlined} from "@ant-design/icons";
import SubMenu from "../../components/SubMenu";
import {useContext} from "react";
import {AppContext} from "../../contexts/app.context.tsx";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import userApi from "../../apis/user.api.ts";
import {setProfileToLS} from "../../utils/auth.ts";
import authApi from "../../apis/auth.api.ts";
import {purchasesStatus} from "../../constants/purchase.ts";

const {Title} = Typography;
dayjs.extend(utc);

interface formData {
    name: string
    phone: string
    address: string
    avatar: string
    date_of_birth: Date
}


const accountMenuItems: MenuProps['items'] = [
    {
        key: 'profile',
        icon: <UserOutlined/>,
        label: <span className="font-medium">Thông Tin Cá Nhân</span>,
    },
    {
        key: 'history',
        icon: <ShoppingOutlined/>,
        label: <span className="font-medium">Lịch Sử Đặt Hàng</span>,
    },
    {
        key: 'shipping',
        icon: <CarOutlined/>,
        label: <span className="font-medium">Thông Tin Giao Hàng</span>,
    },
    {
        key: 'newsletter',
        icon: <MailOutlined/>,
        label: <span className="font-medium">Đăng Ký Nhận Tin</span>,
    },
];

export default function UserProfileForm() {
    const {profile, reset, setProfile, setIsAuthenticated} = useContext(AppContext);
    const [form] = Form.useForm();

    const queryClient = useQueryClient()

    const updateProfileMutation = useMutation({
        mutationFn: userApi.updateProfile
    })

    const onFinishFailed = (errorInfo) => {
        console.log('Lỗi validate:', errorInfo);
    };

    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            console.log(111)
            setIsAuthenticated(false)
            setProfile(null)
            queryClient.removeQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
        }
    })

    const handleLogout = () => {
        logoutMutation.mutate()
    }

    const onFinish = (data: formData) => {
        data.avatar = 'conchocaobangbopc';
        updateProfileMutation.mutate(data, {
            onSuccess: (res) => {
                setProfile(res.data.data)
                setProfileToLS(res.data.data)
            },
            onError: (error: any) => {
                const formError = error.response?.data?.data;
                if (formError) {
                    // ✅ Sửa thành Object.keys(formError)
                    Object.keys(formError).forEach((key) => {
                        form.setFields([
                            {
                                name: key as keyof FormData,
                                errors: [formError[key]] // Lấy thông báo lỗi tương ứng của field đó
                            }
                        ]);
                    });
                }
            }
        })
    }

    console.log(profile)
    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
            <Flex justify="center" gap={48} className="flex-col md:flex-row">
                <div className="w-full md:w-1/4">
                    <div className="p-4">
                        <Title level={2} className="text-xl font-bold mb-1 text-gray-900">
                            Xin chào, {profile?.name}!
                        </Title>
                        <button onClick={handleLogout} className="text-xs uppercase font-semibold text-black underline tracking-wider hover:text-gray-600 cursor-pointer">ĐĂNG XUẤT
                        </button>
                    </div>
                    <SubMenu items={accountMenuItems} selectedKeys={'profile'} mode={'vertical'}/>
                </div>

                <div className="w-full md:w-3/4">
                    <div className="border border-gray-200 p-8 rounded-lg shadow-sm">
                        <Title level={3} className="text-lg font-bold uppercase tracking-wide text-gray-900 mb-6">
                            Thông Tin Cá Nhân
                        </Title>

                        <Form
                            form={form}
                            name="profile_form"
                            layout="vertical"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"

                            initialValues={{
                                // Chuyển string thành dayjs object ngay tại initialValues
                                date_of_birth: dayjs.utc(profile?.date_of_birth || null),
                                name: profile?.name || null,
                                phone: profile?.phone || null,
                                address: profile?.address || null
                            }}
                        >
                            {/* Trường Email */}
                            <Form.Item
                                label={<span className="text-sm font-medium text-gray-800">Email</span>}
                                className="mb-6"
                            >
                                <Input
                                    value={profile?.email || ''}
                                    size="large"
                                    placeholder="Nhập email"
                                    className="rounded-md border-gray-300 hover:border-black focus:border-black"
                                />
                            </Form.Item>

                            {/* Trường Họ & Tên */}
                            <Form.Item
                                label={<span className="text-sm font-medium text-gray-800">Họ & Tên</span>}
                                className="mb-6"
                                name="name"
                            >
                                <Input
                                    size="large"
                                    placeholder="Nhập họ và tên"
                                    className="rounded-md border-gray-300 hover:border-black focus:border-black"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="text-sm font-medium text-gray-800">Số điện thoại</span>}
                                className="mb-6"
                                name="phone"
                            >
                                <Input
                                    size="large"
                                    placeholder="Nhập số điện thoại"
                                    className="rounded-md border-gray-300 hover:border-black focus:border-black"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="text-sm font-medium text-gray-800">Địa chỉ</span>}
                                className="mb-6"
                                name="address"
                            >
                                <Input
                                    size="large"
                                    placeholder="Nhập vào địa chỉ"
                                    className="rounded-md border-gray-300 hover:border-black focus:border-black"
                                />
                            </Form.Item>

                            {/* Trường Sinh nhật */}
                            <Form.Item
                                label={<span className="text-sm font-medium text-gray-800">Sinh nhật</span>}
                                className="mb-8"
                                name="date_of_birth"
                            >
                                <DatePicker
                                    size="large"
                                    placeholder="Nhập ngày tháng năm"
                                    format="DD/MM/YYYY"
                                    className="w-full rounded-md border-gray-300 hover:border-black focus:border-black"
                                />
                            </Form.Item>

                            {/* Nút Lưu Thay Đổi */}
                            <Form.Item className="mb-0">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="medium"
                                    loading={updateProfileMutation.isPending}
                                    className="bg-black hover:bg-gray-800 text-white tracking-wider px-8 h-12 rounded-none border-none shadow-none"
                                >
                                    Lưu Thay Đổi
                                </Button>
                            </Form.Item>
                        </Form>

                    </div>
                </div>
            </Flex>
        </div>
    );
}