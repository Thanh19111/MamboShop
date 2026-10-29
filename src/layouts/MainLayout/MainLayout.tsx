import React from 'react';
import {Affix, Layout} from 'antd';
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const {Content} = Layout;

interface Props {
    children: React.ReactNode;
}

const App = ({children}: Props) => (
    <Layout>
        <Affix offsetTop={0}>
            <Header/>
        </Affix>
        <Content>{children}</Content>
        <Footer/>
    </Layout>
);

export default App;