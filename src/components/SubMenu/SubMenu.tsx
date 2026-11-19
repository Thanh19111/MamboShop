import {Menu, type MenuProps} from "antd";

interface Props {
    items: MenuProps['items']
    selectedKeys: string
    mode: 'vertical' | 'horizontal'
}

const App = ({items, mode, selectedKeys}: Props) => {
    return (
        <Menu
            mode={mode}
            selectedKeys={[selectedKeys]}
            items={items}
            className="border-r-0 text-gray-700 bg-transparent"
        />
    )
}

export default App;