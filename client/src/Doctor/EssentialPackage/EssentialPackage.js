import classNames from 'classnames/bind';
import WrapContent from '~/CommonComponent/WrapContent';
import styles from './EssentialPackage.module.scss';
import Package from '~/CommonComponent/Package';
import { useSelector } from 'react-redux';
const cx = classNames.bind(styles);

function EssentialPackage() {
    let deleteState = useSelector((state) => state.deleteState.state);

    return (
        <div className={cx('wrapper')}>
            <WrapContent>
                <div className={cx('row', 'packages')}>
                    <div className={cx('col2', 'package')}>
                        <Package deleteState={deleteState} />
                    </div>
                </div>
            </WrapContent>
        </div>
    );
}

export default EssentialPackage;
