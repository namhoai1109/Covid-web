import { useCallback, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { getAPI } from '~/APIservices/getAPI';
import classNames from 'classnames/bind';
import styles from './Statistics.module.scss';
const cx = classNames.bind(styles);

function RecoverChart() {
    let [data, setData] = useState({
        options: {
            xaxis: {
                categories: [],
            },
        },
        series: [
            {
                name: 'recover',
                data: [],
            },
        ],
    });

    let [total, setTotal] = useState({
        count: 0,
        from: '',
        to: '',
    });

    let getData = useCallback(async () => {
        let res = await getAPI('stats/recover-day');
        console.log(res);
        if (res.length > 0) {
            let tmp = {
                categories: [],
                data: [],
            };

            res.forEach((item) => {
                tmp.categories.push(item.date);
                tmp.data.push(item.count);
            });
            setData((prev) => ({
                ...prev,
                options: {
                    ...prev.options,
                    xaxis: {
                        categories: tmp.categories,
                    },
                },
                series: [{ ...prev.series, data: tmp.data }],
            }));
        }
    }, []);

    let getTotal = useCallback(async () => {
        let res = await getAPI('stats/recover-all');
        if (res.count) {
            setTotal({
                ...res,
            });
        }
    }, []);

    useEffect(() => {
        getData();
        getTotal();
    }, []);

    return (
        <div>
            <Chart options={data.options} series={data.series} type="bar" width={1000} height={500} />
            <div className={cx('sub-info-chart')}>{`Total recovery: ${total.count}`}</div>
            <div className={cx('sub-info-chart')}>{`(from: ${total.from} - to: ${total.to})`}</div>
        </div>
    );
}

export default RecoverChart;
