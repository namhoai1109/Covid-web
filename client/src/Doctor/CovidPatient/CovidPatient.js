import classNames from "classnames/bind";
import WrapContent from "~/CommonComponent/WrapContent";
import styles from "./CovidPatient.module.scss";
import { patientFields } from "../staticVar";

const cx = classNames.bind(styles);

function CovidPatient() {
    return ( <div className={cx('wrapper')}>
        <div className={cx('row','z1', 'list-item')}>
            {patientFields.map((field, index) => {
                return <div className={cx('col2-4', 'item')} key={index}>{field}</div>;
            })}
        </div>
        <WrapContent>
        </WrapContent>
    </div> );
}

export default CovidPatient;