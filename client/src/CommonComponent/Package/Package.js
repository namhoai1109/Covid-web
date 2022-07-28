import { faBoxArchive, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import styles from './Package.module.scss';
const cx = classNames.bind(styles);

function Package({ infos, deleteState, clickDelete }) {
    return (
        <div className={cx('wrapper')}>
            <button
                onClick={clickDelete}
                className={cx('delete-btn', 'flex-center', {
                    showDelete: deleteState,
                })}
            >
                <FontAwesomeIcon icon={faXmark} />
            </button>
            <div className={cx('icon', 'flex-center')}>
                <FontAwesomeIcon icon={faBoxArchive} />
            </div>
            <span className={cx('title', 'flex-center')}>Package</span>
        </div>
    );
}

export default Package;
