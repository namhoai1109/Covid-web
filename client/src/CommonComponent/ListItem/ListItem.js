import classNames from 'classnames/bind';
import { TrashIcon } from '~/CommonComponent/icons';
import styles from './ListItem.module.scss';

const cx = classNames.bind(styles);

function ListItem({ infos, showDelete, clickDelete = () => {} }) {
    let valInfos = Object.keys(infos).map((key) => infos[key]);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('row')}>
                {valInfos.map((info, index) => {
                    return (
                        <div className={cx('col2-4', 'flex-center')} key={index}>
                            {info}
                        </div>
                    );
                })}
            </div>
            <button
                onClick={clickDelete}
                className={cx('delete-btn', {
                    showDelete: showDelete,
                })}
            >
                <TrashIcon />
            </button>
        </div>
    );
}

export default ListItem;
