import {Button, DatePicker, Flex, Form, Input, type MenuProps, Typography} from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {KeyOutlined, MailOutlined, ShoppingOutlined, UserOutlined} from "@ant-design/icons";
import SubMenu from "../../components/SubMenu";
import {useMutation} from "@tanstack/react-query";
import userApi from "../../apis/user.api.ts";
import {Link} from "react-router-dom";
import useCurrentUser from "../../hooks/useCurrentUser.tsx";
import {toast} from "react-toastify";

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
    const [form] = Form.useForm();
    const {profile, handleSetProfile, handleLogout} = useCurrentUser();

    const updateProfileMutation = useMutation({
        mutationFn: userApi.updateProfile
    })

    const onFinishFailed = (errorInfo: any) => {
        console.log('Lỗi validate:', errorInfo);
    };

    const onFinish = (data: formData) => {
        const body = {
            name: data.name,
            phone: data.phone,
            address: data.address,
            avatar: "dev",
            date_of_birth: new Date(data.date_of_birth).toISOString()
        }

        updateProfileMutation.mutate(body, {
            onSuccess: (res) => {
                handleSetProfile(res.data.data)
                toast.success('Đổi thông tin cá nhân thành công')
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

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
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

export default App;