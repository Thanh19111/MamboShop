import {useNavigate} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import {useMutation} from '@tanstack/react-query'

import {useContext} from 'react'
import {Button, Flex, Form, Input, Menu, type MenuProps, Typography} from "antd";
import {AppContext} from "../../contexts/app.context.tsx";
import {schema, type Schema} from "../../utils/rules.ts";
import authApi from "../../apis/auth.api.ts";

type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])
const {Text} = Typography
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
    const {setIsAuthenticated, isAuthenticated, setProfile} = useContext(AppContext)
    const navigate = useNavigate()

    // 1. Khởi tạo react-hook-form
    const {
        handleSubmit,
        setValue,
        watch,
        formState: {errors, isSubmitting},
    } = useForm<FormData>({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        },
    });

    // Lấy giá trị hiện tại của form từ hook để truyền vào Antd Input
    const emailValue = watch('email');
    const passwordValue = watch('password');

    const loginMutation = useMutation({
        mutationFn: (body: FormData) => authApi.login(body)
    })

    // 2. Hàm submit cuối cùng được gọi khi Antd Form validate thành công
    const onFinish = handleSubmit((data) => {
        loginMutation.mutate(data, {
            onSuccess: (data) => {
                setIsAuthenticated(true)
                setProfile(data.data.data.user)
                console.log(data)
                console.log(isAuthenticated)
                navigate('/')
            }
        })
    })

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
                        name="auth_form"
                        layout="vertical"
                        onFinish={onFinish} // Antd Form sẽ gọi hàm này khi submit
                        requiredMark={false}
                        autoComplete="off"
                    >
                        {/* TRƯỜNG EMAIL */}
                        <Form.Item
                            label={<span className="text-gray-800 font-medium text-sm">Email<Text type='danger'>*</Text></span>}
                            // Dùng validateStatus và help của Antd để hiển thị lỗi từ Yup
                            validateStatus={errors.email ? 'error' : ''}
                            help={errors.email?.message}
                            className="mb-4"
                        >
                            <Input
                                size="large"
                                placeholder="Nhập email của bạn"
                                value={emailValue}
                                onChange={(e) => setValue('email', e.target.value, {shouldValidate: true})}
                            />
                        </Form.Item>

                        {/* TRƯỜNG MẬT KHẨU */}
                        <Form.Item
                            label={<span className="text-gray-800 font-medium text-sm">Mật Khẩu<Text
                                type='danger'>*</Text></span>}
                            validateStatus={errors.password ? 'error' : ''}
                            help={errors.password?.message}
                            className="mb-4"
                        >
                            <Input.Password
                                size="large"
                                placeholder="Nhập mật khẩu"
                                value={passwordValue}
                                onChange={(e) => setValue('password', e.target.value, {shouldValidate: true})}
                            />
                        </Form.Item>
                        {/* NÚT SUBMIT */}
                        <Form.Item className="mb-0">
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={isSubmitting || loginMutation.isPending}
                                className="w-full bg-black hover:bg-gray-800 text-white font-medium h-12 border-none shadow-none">
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Flex>
        </div>
    )
}
