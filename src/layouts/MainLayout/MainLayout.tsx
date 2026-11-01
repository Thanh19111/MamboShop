import React from 'react';
import {Affix, Layout} from 'antd';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import {Outlet} from "react-router-dom";

const {Content} = Layout;

interface Props {
    children?: React.ReactNode;
}

const App = ({children}: Props) => (
    <Layout>
        <Affix offsetTop={1}>
            <Header/>
        </Affix>
        <Content>
            {children}
            <Outlet/>
        </Content>
        <Footer/>
    </Layout>
);

export default App;