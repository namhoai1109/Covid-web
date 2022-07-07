import classNames from "classnames/bind";
import WrapContent from "~/CommonComponent/WrapContent";
import styles from "./ManagerPage.module.scss";

const cx = classNames.bind(styles);

function ManagerPage() {
    return <div className={cx('wrapper')}>
        <div className={cx('row', 'list-item')}>
            <div className={cx('col2-4', 'item')}>ID</div>
            <div className={cx('col2-4', 'item')}>Name</div>
            <div className={cx('col2-4', 'item')}>Year of Birth</div>
        </div>
        <WrapContent></WrapContent>
    </div>;
}

export default ManagerPage;
