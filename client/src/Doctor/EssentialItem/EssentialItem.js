import classNames from "classnames/bind";
import styles from "./EssentialItem.module.scss";
import WrapContent from "~/CommonComponent/WrapContent";

const cx = classNames.bind(styles);

function EssentialItem() {
    return ( <div className={cx('wrapper')}>
        <WrapContent>
        </WrapContent>
    </div> );
}

export default EssentialItem;