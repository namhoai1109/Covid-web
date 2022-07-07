import classNames from "classnames/bind";
import WrapContent from "~/CommonComponent/WrapContent";
import styles from "./FacilityPage.module.scss";

const cx = classNames.bind(styles);

function FacilityPage() {
    return <div className={cx('wrapper')}>
    <div className={cx('row', 'list-item')}>
        <div className={cx('col2-4', 'item')}>Name</div>
        <div className={cx('col2-4', 'item')}>Max No. Patient</div>
        <div className={cx('col2-4', 'item')}>No. Patient</div>
    </div>
    <WrapContent></WrapContent>
</div>;
}

export default FacilityPage;
