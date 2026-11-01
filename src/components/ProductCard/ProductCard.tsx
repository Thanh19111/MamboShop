import {Card, Space, Typography} from 'antd';
import {EditOutlined, EllipsisOutlined, SettingOutlined} from "@ant-design/icons";

const {Meta} = Card;
const {Text} = Typography;

interface Props {
    name: string;
    price: number;
    rating: number;
}

const App = ({
                 name,
                 price,
                 rating
             }: Props) => {
    return (
        <Card
            hoverable
            cover={
                <img
                    draggable={false}
                    alt="example"
                    src="https://cdn.hstatic.net/products/200000887901/m-aristino-regular-fit-ajk008bh0__13__d32dbfc587b64c64ad077b8a309a5bf4_3afc3f01c2034baf830a29704f9d1775_1024x1024.jpg"
                />
            }
            actions={[
                <SettingOutlined key="setting"/>,
                <EditOutlined key="edit"/>,
                <EllipsisOutlined key="ellipsis"/>,
            ]}
        >
            <Meta
                title={
                    <Space vertical>
                        <Text>Aristino</Text>
                        <Text ellipsis={{ tooltip: name }}>{name}</Text>
                    </Space>

                }
                description={
                    <Space vertical>
                        <Text>{price}đ</Text>
                    </Space>
                }
            />
        </Card>
    );
};

export default App;