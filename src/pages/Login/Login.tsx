import {Link, useNavigate} from 'react-router-dom'
import {Button, Flex, Form, Input, Menu, type MenuProps} from "antd";
import {type Schema} from "../../utils/rules.ts";
import useCurrentUser from "../../hooks/useCurrentUser.tsx";
import {toast} from "react-toastify";

const menuItems: MenuProps['items'] = [
    {
        key: 'login',
        label: <Link to={"/account/login"}><span className="text-base font-medium px-4">Đăng Nhập</span></Link>,
    },
    {
        key: 'register',
        label: <Link to={"/account/register"}><span className="text-base font-medium px-4">Đăng Ký</span></Link>,
    }
];

type LoginForm = Pick<Schema, 'email' | 'password'>

const App = () => {
    const {loginMutation} = useCurrentUser();
    const navigate = useNavigate()
    const [form] = Form.useForm();

    // 2. Hàm xử lý khi submit thành công
    const onFinish = (data: LoginForm) => {
        loginMutation.mutate(data, {
            onSuccess: () => {
                toast.success('Đăng nhập thành công')
                navigate('/')
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
    };

    // 3. Hàm xử lý khi validate lỗi
    const onFinishFailed = (errorInfo: any) => {
        console.log('Lỗi validate:', errorInfo);
    };

    return (
        <div className='bg-white min-h-screen py-8 border border-gray-200'>
            <Menu mode="horizontal"
                  selectedKeys={["login"]}
                  items={menuItems}
                  className="flex justify-center border-b border-gray-200 bg-transparent clean-auth-menu"
            />
            <Flex justify="center">
                <div className="w-full max-w-[420px] px-6 py-[48px]">
                    <Form
                        form={form}
                        name="basic_form"
                        layout="vertical" // Kiểu hiển thị: 'horizontal', 'vertical', hoặc 'inline'
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        {/* Field Tên đăng nhập */}
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{required: true, message: 'Vui lòng nhập email đăng nhập!'}]}
                        >
                            <Input placeholder="Nhập email..."/>
                        </Form.Item>

                        {/* Field Mật khẩu */}
                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[{required: true, message: 'Vui lòng nhập mật khẩu!'}]}
                        >
                            <Input.Password placeholder="Nhập password..."/>
                        </Form.Item>

                        {/* Nút Submit */}
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loginMutation.isPending} // Antd v5 / React Query v5 dùng isPending
                                block // Tùy chọn: làm nút phủ kín chiều rộng form cho đẹp
                            >
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Flex>
        </div>
    )
}

export default App;
