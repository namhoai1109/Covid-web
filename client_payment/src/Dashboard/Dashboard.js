import classNames from 'classnames/bind';
import styles from './Dashboard.module.scss';

const cx = classNames.bind(styles);

function Dashboard() {
    return (
        <div className={cx('fit-screen', 'flex-center')}>
            <div className={cx('container')}>
                <div className={cx('flex-center')}>
                    <span>ID:</span>
                    <span>20126045</span>
                </div>
                <div className={cx('flex-center')}>
                    <span>Password:</span>
                    <span>********</span>
                </div>
                <div className={cx('flex-center')}>
                    <span>Balance:</span>
                    <span>2 000 000 VND</span>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
