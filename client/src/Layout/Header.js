import classNames from 'classnames/bind';
import styles from './Layout.module.scss';

const cx = classNames.bind(styles);

function Header({ children }) {
    return <header className={cx('header')}>{children}</header>;
}

export default Header;
