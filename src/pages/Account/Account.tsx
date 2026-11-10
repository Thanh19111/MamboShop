import {useForm} from 'react-hook-form';
import {Button, DatePicker, Flex, Form, Input, type MenuProps, Typography} from 'antd';
import dayjs from 'dayjs';
import {CarOutlined, MailOutlined, ShoppingOutlined, UserOutlined} from "@ant-design/icons";
import SubMenu from "../../components/SubMenu";

const {Title} = Typography;

interface ProfileFormData {
    email: string;
    name: string;
    birthday: dayjs.Dayjs | null;
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
    // 1. Khởi tạo react-hook-form
    const {
        handleSubmit,
        setValue,
        watch,
        formState: {errors, isSubmitting},
    } = useForm<ProfileFormData>({
        defaultValues: {
            email: 'phamthanh12b@gmail.com',
            name: 'Phạm Thành',
            birthday: null,
        },
    });

    // Theo dõi giá trị các trường để đồng bộ với Ant Design Form
    const emailValue = watch('email');
    const nameValue = watch('name');
    const birthdayValue = watch('birthday');

    // 2. Hàm xử lý khi submit thành công qua Ant Design Form
    const onFinish = handleSubmit((data) => {
        const formattedData = {
            ...data,
            birthday: data.birthday ? data.birthday.format('YYYY-MM-DD') : null,
        };
        console.log('Dữ liệu lưu thay đổi:', formattedData);
    });

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
            <Flex justify="center" gap={48} className="flex-col md:flex-row">
                <div className="w-full md:w-1/4">
                    <div className="p-4">
                        <Title level={2} className="text-xl font-bold mb-1 text-gray-900">
                            Xin Chào, Thành Phạm!
                        </Title>
                        <a
                            href="#logout"
                            onClick={(e) => {
                                e.preventDefault();
                                console.log('Đăng xuất');
                            }}
                            className="text-xs uppercase font-semibold text-black underline tracking-wider hover:text-gray-600"
                        >
                            ĐĂNG XUẤT
                        </a>
                    </div>
                    <SubMenu items={accountMenuItems} selectedKeys={'profile'} mode={'vertical'}/>
                </div>

                <div className="w-full md:w-3/4">
                    <div className="border border-gray-200 p-8 rounded-lg shadow-sm">
                        <Title level={3} className="text-lg font-bold uppercase tracking-wide text-gray-900 mb-6">
                            Thông Tin Cá Nhân
                        </Title>

                        <Form
                            name="profile_form"
                            layout="vertical"
                            onFinish={onFinish}
                            requiredMark={false}
                            autoComplete="off"
                        >
                            {/* Trường Email */}
                            <Form.Item
                                label={<span className="text-sm font-medium text-gray-800">Email</span>}
                                validateStatus={errors.email ? 'error' : ''}
                                help={errors.email?.message}
                                className="mb-6"
                            >
                                <Input
                                    size="large"
                                    placeholder="Nhập email"
                                    value={emailValue}
                                    onChange={(e) => setValue('email', e.target.value, {shouldValidate: true})}
                                    className="rounded-md border-gray-300 hover:border-black focus:border-black"
                                />
                            </Form.Item>

                            {/* Trường Họ & Tên */}
                            <Form.Item
                                label={<span className="text-sm font-medium text-gray-800">Họ & Tên</span>}
                                validateStatus={errors.name ? 'error' : ''}
                                help={errors.name?.message}
                                className="mb-6"
                            >
                                <Input
                                    size="large"
                                    placeholder="Nhập họ và tên"
                                    value={nameValue}
                                    onChange={(e) => setValue('name', e.target.value, {shouldValidate: true})}
                                    className="rounded-md border-gray-300 hover:border-black focus:border-black"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="text-sm font-medium text-gray-800">Số điện thoại</span>}
                                className="mb-6">
                                <Input
                                    size="large"
                                    placeholder="Nhập số điện thoại"
                                    className="rounded-md border-gray-300 hover:border-black focus:border-black"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="text-sm font-medium text-gray-800">Địa chỉ</span>}
                                className="mb-6">
                                <Input
                                    size="large"
                                    placeholder="Nhập vào địa chỉ"
                                    className="rounded-md border-gray-300 hover:border-black focus:border-black"
                                />
                            </Form.Item>

                            {/* Trường Sinh nhật */}
                            <Form.Item
                                label={<span className="text-sm font-medium text-gray-800">Sinh nhật</span>}
                                validateStatus={errors.birthday ? 'error' : ''}
                                help={errors.birthday?.message}
                                className="mb-8"
                            >
                                <DatePicker
                                    size="large"
                                    placeholder="Nhập ngày tháng năm"
                                    format="DD/MM/YYYY"
                                    value={birthdayValue}
                                    onChange={(date) => setValue('birthday', date, {shouldValidate: true})}
                                    className="w-full rounded-md border-gray-300 hover:border-black focus:border-black"
                                />
                            </Form.Item>

                            {/* Nút Lưu Thay Đổi */}
                            <Form.Item className="mb-0">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    loading={isSubmitting}
                                    className="bg-black hover:bg-gray-800 text-white font-medium uppercase tracking-wider px-8 h-12 rounded-none border-none shadow-none"
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