import {useNavigate} from 'react-router-dom'
import {useForm} from 'react-hook-form' // Vẫn giữ react-hook-form để validate schema
import {yupResolver} from '@hookform/resolvers/yup'
import {useMutation} from '@tanstack/react-query'
import omit from 'lodash/omit'
import {useContext} from 'react'
import {Button, Flex, Typography, Form, Input, Menu, type MenuProps} from "antd"
import {AppContext} from "../../contexts/app.context.tsx"
import {schema, type Schema} from "../../utils/rules.ts"
import authApi from "../../apis/auth.api.ts"

const {Text} = Typography
type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'>
const registerSchema = schema.pick(['email', 'password', 'confirm_password'])

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

export default function Register() {
    const {setIsAuthenticated, setProfile} = useContext(AppContext)
    const navigate = useNavigate()

    // 1. Khởi tạo react-hook-form
    const {
        handleSubmit,
        setValue,
        watch,
        formState: {errors, isSubmitting},
    } = useForm<FormData>({
        resolver: yupResolver(registerSchema),
        defaultValues: {
            email: '',
            password: '',
            confirm_password: '',
        },
    });

    // Lấy giá trị hiện tại của form từ hook để truyền vào Antd Input
    const emailValue = watch('email');
    const passwordValue = watch('password');
    const confirmPasswordValue = watch('confirm_password');

    const registerAccountMutation = useMutation({
        mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
    })

    // 2. Hàm submit cuối cùng được gọi khi Antd Form validate thành công
    const onFinish = handleSubmit((data) => {
        const body = omit(data, ['confirm_password'])
        registerAccountMutation.mutate(body, {
            onSuccess: (data) => {
                setIsAuthenticated(true)
                setProfile(data.data.data.user)
                navigate('/')
            }
        })
    })

    return (
        <div className='bg-white py-[64px]'>
            <Menu mode="horizontal"
                  selectedKeys={["register"]}
                  style={{fontSize: "12px"}}
                  items={menuItems}
                  className="flex justify-center border-b border-gray-200 bg-transparent clean-auth-menu"
            />
            <Flex justify="center">
                <div className="w-full max-w-[420px] px-6">

                    {/* 3. Dùng trực tiếp <Form> của Ant Design */}
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
                            label={<span className="text-gray-800 font-medium text-sm">Mật Khẩu<Text type='danger'>*</Text></span>}
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

                        {/* TRƯỜNG NHẬP LẠI MẬT KHẨU */}
                        <Form.Item
                            label={<span className="text-gray-800 font-medium text-sm">Nhập lại Mật Khẩu<Text type='danger'>*</Text></span>}
                            validateStatus={errors.confirm_password ? 'error' : ''}
                            help={errors.confirm_password?.message}
                            className="mb-6"
                        >
                            <Input.Password
                                size="large"
                                placeholder="Nhập lại mật khẩu"
                                value={confirmPasswordValue}
                                onChange={(e) => setValue('confirm_password', e.target.value, {shouldValidate: true})}
                            />
                        </Form.Item>

                        {/* NÚT SUBMIT */}
                        <Form.Item className="mb-0">
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={isSubmitting || registerAccountMutation.isPending}
                                className="w-full bg-black hover:bg-gray-800 text-white font-medium h-12 border-none shadow-none"
                            >
                                Đăng ký
                            </Button>
                        </Form.Item>
                    </Form>

                </div>
            </Flex>
        </div>
    )
}