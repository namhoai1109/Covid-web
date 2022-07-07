import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './Wrapper.module.scss';
const cx = classNames.bind(styles);

function Wrapper({ children }) {
    return <div className={cx('wrapper', 'glassmorphism')}>{children}</div>;
}

Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Wrapper;
