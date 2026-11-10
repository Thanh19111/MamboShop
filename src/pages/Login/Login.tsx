import {useNavigate} from 'react-router-dom'

import {useContext} from 'react'
import {Button, Flex, Form, Input, Menu, type MenuProps} from "antd";
import {AppContext} from "../../contexts/app.context.tsx";
import {type Schema} from "../../utils/rules.ts";
import {useMutation} from "@tanstack/react-query";
import authApi from "../../apis/auth.api.ts";

type FormData = Pick<Schema, 'email' | 'password'>

const menuItems: MenuProps['items'] = [
    {
        key: 'login',
        label: <span className="text-base font-medium px-4">Đăng Nhập</span>,
    },
    {
        key: 'register',
        label: <span className="text-base font-medium px-4">Đăng Ký</span>,
    },
];

export default function Login() {
    const {setIsAuthenticated, setProfile} = useContext(AppContext)
    const navigate = useNavigate()
    const [form] = Form.useForm();

    const loginMutation = useMutation({
        mutationFn: (body: FormData) => authApi.login(body)
    })

    // 2. Hàm xử lý khi submit thành công
    const onFinish = (data: FormData) => {
        console.log(data)
        loginMutation.mutate(data, {
            onSuccess: (data) => {
                setIsAuthenticated(true)
                setProfile(data.data.data.user)
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
    const onFinishFailed = (errorInfo) => {
        console.log('Lỗi validate:', errorInfo);
    };

    return (
        <div className='bg-white'>
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
