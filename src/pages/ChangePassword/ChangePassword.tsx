import {Button, Flex, Form, Input, type MenuProps, message, Typography} from 'antd';
import {CarOutlined, KeyOutlined, LockOutlined, MailOutlined, ShoppingOutlined, UserOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {useContext} from "react";
import {AppContext} from "../../contexts/app.context.tsx";
import authApi from "../../apis/auth.api.ts";
import {purchasesStatus} from "../../constants/purchase.ts";
import SubMenu from "../Account/components/SubMenu";
import {Link} from "react-router-dom";
import userApi from "../../apis/user.api.ts";

const {Title, Text} = Typography;

interface ChangePasswordFormValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
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
        icon: <KeyOutlined />,
        label: <Link to="/user/password"><span className="font-medium">Đổi mật khẩu</span></Link>,
    },
    {
        key: 'newsletter',
        icon: <MailOutlined/>,
        label: <span className="font-medium">Đăng Ký Nhận Tin</span>,
    },
];

const App = () => {
    const queryClient = useQueryClient()
    const {profile, setProfile, setIsAuthenticated} = useContext(AppContext);

    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            setIsAuthenticated(false)
            setProfile(null)
            queryClient.removeQueries({queryKey: ['purchases', {status: purchasesStatus.inCart}]})
        }
    })

    const handleLogout = () => {
        logoutMutation.mutate()
    }

    const [form] = Form.useForm<ChangePasswordFormValues>();
    const [messageApi, contextHolder] = message.useMessage();

    const changePasswordMutation = useMutation({
        mutationFn: userApi.updateProfile,
        onSuccess: () => {
            messageApi.success('Đổi mật khẩu thành công!');
            form.resetFields();
        },
        onError: (error: any) => {
            messageApi.error("Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.");
        },
    });

    const onFinish = (values: ChangePasswordFormValues) => {
        const body = {
            password: values.currentPassword,
            new_password: values.newPassword
        }
        changePasswordMutation.mutate(body);
    };

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
                    <SubMenu items={accountMenuItems} selectedKeys={'password'} mode={'vertical'}/>
                </div>

                <div className="w-full md:w-3/4">
                    <div className="border border-gray-200 p-8 rounded-lg shadow-sm">
                        <div>{contextHolder}</div>
                        <Title level={3} className="uppercase tracking-wider m-0 text-black">
                            Đổi Mật Khẩu
                        </Title>
                        <Text className="text-gray-500 text-sm mt-2 block">
                            Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác.
                        </Text>
                        <div className="py-4 w-[70%]">
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish}
                                requiredMark={false}
                                className="space-y-2"
                            >
                                <Form.Item
                                    label={
                                        <span
                                            className="text-xs font-semibold uppercase tracking-wider text-gray-800">
                                        Mật khẩu hiện tại
                                      </span>
                                    }
                                    name="currentPassword"
                                    rules={[
                                        {required: true, message: 'Vui lòng nhập mật khẩu hiện tại'},
                                    ]}
                                >
                                    <Input.Password
                                        size="large"
                                        prefix={<LockOutlined className="text-gray-400 mr-2"/>}
                                        placeholder="Nhập mật khẩu hiện tại"
                                        className="rounded-none border-gray-300 hover:border-black focus:border-black"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={
                                        <span
                                            className="text-xs font-semibold uppercase tracking-wider text-gray-800">
                                        Mật khẩu mới
                                      </span>
                                    }
                                    name="newPassword"
                                    dependencies={['currentPassword']}
                                    rules={[
                                        {required: true, message: 'Vui lòng nhập mật khẩu mới'},
                                        {min: 6, message: 'Mật khẩu mới phải có ít nhất 6 ký tự'},
                                        ({getFieldValue}) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('currentPassword') !== value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    new Error('Mật khẩu mới không được trùng với mật khẩu cũ')
                                                );
                                            },
                                        }),
                                    ]}>
                                    <Input.Password
                                        size="large"
                                        prefix={<LockOutlined className="text-gray-400 mr-2"/>}
                                        placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                                        className="rounded-none border-gray-300 hover:border-black focus:border-black"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={
                                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-800">
                                        Xác nhận mật khẩu mới
                                      </span>
                                    }
                                    name="confirmPassword"
                                    dependencies={['newPassword']}
                                    rules={[
                                        {required: true, message: 'Vui lòng xác nhận mật khẩu mới'},
                                        ({getFieldValue}) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('newPassword') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    new Error('Mật khẩu xác nhận không khớp với mật khẩu mới')
                                                );
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password
                                        size="large"
                                        prefix={<LockOutlined className="text-gray-400 mr-2"/>}
                                        placeholder="Nhập lại mật khẩu mới"
                                        className="rounded-none border-gray-300 hover:border-black focus:border-black"
                                    />
                                </Form.Item>

                                <div className="pt-4">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={changePasswordMutation.isPending}
                                        className="w-full sm:w-auto min-w-[200px] h-12 rounded-none bg-black hover:bg-gray-800! text-white uppercase tracking-wider text-xs font-semibold border-none">
                                        Đổi mật khẩu
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </Flex>
        </div>

    );
}

export default App;