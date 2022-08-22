import classNames from 'classnames/bind';
import { useCallback, useEffect, useState } from 'react';
import { getAPI } from '~/APIservices/getAPI';
import styles from './History.module.scss';
const cx = classNames.bind(styles);

function HistoryConsumption() {
    let [his, setHis] = useState([]);
    let getHis = useCallback(async () => {
        let his = await getAPI('patient/paid-packages-logs');
        console.log(his);
        setHis(his);
    }, []);

    useEffect(() => {
        getHis();
    }, []);
    return <div>Consumption History</div>;
}

export default HistoryConsumption;
