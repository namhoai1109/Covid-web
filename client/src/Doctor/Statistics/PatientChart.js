import { useCallback, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { getAPI } from '~/APIservices/getAPI';

function PatientChart() {
    let [dataChart, setDataChart] = useState({
        options: {
            chart: {
                id: 'patient',
            },
            xaxis: {
                categories: [],
            },
        },
        series: [
            {
                name: 'FO',
                data: [],
            },
            {
                name: 'F1',
                data: [],
            },
            {
                name: 'F2',
                data: [],
            },
            {
                name: 'F3',
                data: [],
            },
        ],
    });

    let getChart = useCallback(async () => {
        let dataChart = await getAPI('stats/status');
        if (dataChart.length > 0) {
            let formData = {
                xaxis: [],
                F0: [],
                F1: [],
                F2: [],
                F3: [],
            };
            dataChart.forEach((data) => {
                formData.xaxis.push(data.date);
                formData.F0.push(data.F0);
                formData.F1.push(data.F1);
                formData.F2.push(data.F2);
                formData.F3.push(data.F3);
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
                        ...prev.series[0],
                        data: formData.F0,
                    },
                    {
                        ...prev.series[1],
                        data: formData.F1,
                    },
                    {
                        ...prev.series[2],
                        data: formData.F2,
                    },
                    {
                        ...prev.series[3],
                        data: formData.F3,
                    },
                ],
            }));
        }
    });

    useEffect(() => {
        getChart();
    }, []);

    return (
        <div>
            <Chart options={dataChart.options} series={dataChart.series} type="line" width={1000} height={500} />
        </div>
    );
}

export default PatientChart;
