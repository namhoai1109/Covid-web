import Chart from 'react-apexcharts';

function PatientChart() {
    let state = {
        options: {
            chart: {
                id: 'patient',
            },
            xaxis: {
                categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            },
        },
        series: [
            {
                name: 'FO',
                data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
            },
            {
                name: 'F1',
                data: [50, 40, 54, 100, 99, 45, 22, 67, 11],
            },
            {
                name: 'F2',
                data: [42, 64, 88, 23, 64, 78, 22, 54, 76],
            },
            {
                name: 'F3',
                data: [70, 91, 125, 33, 78, 11, 56, 97, 24],
            },
        ],
    };

    return (
        <div>
            <Chart options={state.options} series={state.series} type="line" width={1000} height={500} />
        </div>
    );
}

export default PatientChart;
