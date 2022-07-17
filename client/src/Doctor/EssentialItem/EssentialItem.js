import classNames from "classnames/bind";
import styles from "./EssentialItem.module.scss";
import WrapContent from "~/CommonComponent/WrapContent";
import NecessityItem from "~/CommonComponent/NecessityItem";

const cx = classNames.bind(styles);

function EssentialItem() {
    return ( <div className={cx('wrapper')}>
        <WrapContent>
            <div className={cx('row', 'wrap-list')}>
                <div className={cx('col2', 'item')}>
                    <NecessityItem />
                </div>
            </div>
        </WrapContent>
    </div> );
}

export default EssentialItem;