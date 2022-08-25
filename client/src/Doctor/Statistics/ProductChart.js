import { useCallback, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { getAPI } from '~/APIservices/getAPI';
import classNames from 'classnames/bind';
import styles from './Statistics.module.scss';
const cx = classNames.bind(styles);

function ProductChart() {
    let [dataChart, setDataChart] = useState({
        options: {
            series: [],
            labels: [],
        },
        series: [],
    });
    console.log(dataChart);

    let [date, setDate] = useState('');

    let getDataChart = useCallback(async () => {
        let res = await getAPI('stats/products');
        console.log(res);
        if (res.length > 0) {
            let tmp = {
                series: [],
                labels: [],
            };

            res.forEach((item) => {
                tmp.series.push(item.count);
                tmp.labels.push(item.product.name);
            });
            setDataChart((prev) => ({
                ...prev,
                options: {
                    ...prev.options,
                    series: tmp.series,
                    labels: tmp.labels,
                },
                series: tmp.series,
            }));
            setDate(res[0].date);
        }
    }, []);

    useEffect(() => {
        getDataChart();
    }, []);

    return (
        <div>
            <Chart options={dataChart.options} series={dataChart.series} type="donut" width={1000} height={500} />
            <div className={cx('sub-info-chart')}>{date}</div>
        </div>
    );
}

export default ProductChart;
