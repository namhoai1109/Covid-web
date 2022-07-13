import classNames from "classnames/bind";
import WrapContent from "~/CommonComponent/WrapContent";
import styles from "./FacilityPage.module.scss";
import { useDispatch, useSelector } from "react-redux";
import ListItem from "~/CommonComponent/ListItem";
import { removeFacility } from "../redux/listFacilitySlice";

const cx = classNames.bind(styles);
const test = ['20126045', 'Vu Hoai Nam', '2000'];


function FacilityPage() {
    let deleteState = useSelector(state => state.delete)
    let listFacility = useSelector(state => state.listFacility)
    let dispatch = useDispatch();

    return <div className={cx('wrapper')}>
    <div className={cx('row', 'list-item')}>
        <div className={cx('col2-4', 'item')}>Name</div>
        <div className={cx('col2-4', 'item')}>Max No. Patient</div>
        <div className={cx('col2-4', 'item')}>No. Patient</div>
    </div>
    <WrapContent>
        {listFacility.map((item, index) => {
            return <ListItem 
                key={index}
                infos={item} 
                showDelete={deleteState.isShow} 
                clickDelete={() => {dispatch(removeFacility(index))}}/>
        })}
    </WrapContent>
</div>;
}

export default FacilityPage;
