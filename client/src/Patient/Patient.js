import Layout from '~/Layout';
import Header from './Header';
import SideBar from './SideBar';

function Patient() {
    return (
        <Layout Header={Header} Sidebar={SideBar}>
            Patient
        </Layout>
    );
}

export default Patient;
