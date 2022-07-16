import classNames from "classnames/bind";
import styles from "./CovidPatient.module.scss";
import WrapContent from "~/CommonComponent/WrapContent";

const cx = classNames.bind(styles);

function ListPatient() {
    return ( <div className={cx('wrapper')}>
        <WrapContent>
        </WrapContent>
    </div> );
}

export default ListPatient;