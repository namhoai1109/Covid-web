import Layout from '~/Layout';
import Header from './Header';
import SideBar from './SideBar';

function Doctor() {
    return (
        <Layout Header={Header} Sidebar={SideBar}>
            Doctor
        </Layout>
    );
}

export default Doctor;
