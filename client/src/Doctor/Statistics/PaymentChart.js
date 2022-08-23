import { useEffect, useState } from 'react';
import { getAPI } from '~/APIservices/getAPI';
import Chart from 'react-apexcharts';

function PaymentChart() {
    let [dataChart, setDataChart] = useState({
        options: {
            chart: {
                id: 'payment',
            },
            xaxis: {
                categories: [],
            },
        },
        series: [
            {
                name: 'Income',
                data: [],
            },
            {
                name: 'Expense',
                data: [],
            },
        ],
    });

    let getData = async () => {
        let res = await getAPI('stats/income-log');
        if (res.length > 0) {
            let formData = {
                xaxis: [],
                income: [],
                expense: [],
            };

            res.forEach((data) => {
                formData.xaxis.push(data.date);
                formData.income.push(data.income);
                formData.expense.push(data.expense);
            });

            setDataChart((prev) => ({
                ...prev,
                options: {
                    ...prev.options,
                    xaxis: {
                        categories: formData.xaxis,
                    },
                },
                series: [
                    {
                        name: 'Income',
                        data: formData.income,
                    },
                    {
                        name: 'Expense',
                        data: formData.expense,
                    },
                ],
            }));
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return <Chart options={dataChart.options} series={dataChart.series} type="line" width={1000} height={500} />;
}

export default PaymentChart;
