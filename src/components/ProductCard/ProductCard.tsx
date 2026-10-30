import {Badge, Card, Space, Typography} from 'antd';

const {Meta} = Card;

const {Text} = Typography;

export interface Props {
    name: string;
    price: number;
}

const App = ({
                 name,
                 price
             }: Props) => {
    return (
        <Space align="center">
            <Badge.Ribbon text="New" color="red">
                <Card
                    hoverable
                    variant="borderless"
                    style={{width: 320}}
                    cover={
                        <img
                            draggable={false}
                            alt="example"
                            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                        />
                    }
                >
                    <Meta
                        title={
                            <Text className="font-bold text-black block text-center">
                                Aristino
                            </Text>
                        }
                        description={
                            <Space
                                vertical
                                size={4}
                                style={{width: '100%', textAlign: 'center'}}
                            >
                                <Text
                                    className="text-gray-600 text-sm block"
                                    ellipsis={{
                                        tooltip: name,
                                    }}
                                >
                                    {name}
                                </Text>

                                <Text className="text-black font-bold text-base block">
                                    {price}
                                </Text>
                            </Space>
                        }
                    />
                </Card>
            </Badge.Ribbon>
        </Space>
    );
}

export default App;