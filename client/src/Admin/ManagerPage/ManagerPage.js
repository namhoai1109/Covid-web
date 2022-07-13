import classNames from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";
import ListItem from "~/CommonComponent/ListItem";
import WrapContent from "~/CommonComponent/WrapContent";
import styles from "./ManagerPage.module.scss";
import { removeManager } from "../redux/listManagerSlice";
const cx = classNames.bind(styles);

function ManagerPage() {
    let deleteState = useSelector(state => state.delete)
    let listManager = useSelector(state => state.listManager)
    let dispatch = useDispatch();

    return <div className={cx('wrapper')}>
        <div className={cx('row', 'list-item', 'z1')}>
            <div className={cx('col2-4', 'item')}>ID</div>
            <div className={cx('col2-4', 'item')}>Name</div>
            <div className={cx('col2-4', 'item')}>Year of Birth</div>
        </div>
        <WrapContent>
            {listManager.map((item, index) => {
                return <ListItem 
                    key={index} 
                    infos={item} 
                    showDelete={deleteState.isShow} 
                    clickDelete={() => {dispatch(removeManager(index))}} 
                />
            })}
        </WrapContent>
    </div>;
}

export default ManagerPage;
