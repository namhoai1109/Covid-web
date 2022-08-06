import classNames from 'classnames/bind';
import WrapContent from '~/CommonComponent/WrapContent';
import styles from './Info.module.scss';
const cx = classNames.bind(styles);

function Info() {
    return (
        <div className={cx('wrapper')}>
            <WrapContent></WrapContent>
        </div>
    );
}

export default Info;
