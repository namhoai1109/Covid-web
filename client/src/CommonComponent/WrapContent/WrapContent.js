import classNames from "classnames/bind";
import styles from "./WrapContent.module.scss";

const cx = classNames.bind(styles);

function WrapContent({children}) {
    return  <div className={cx('wrapper','glassmorphism')}>
        {children}
    </div>
}

export default WrapContent