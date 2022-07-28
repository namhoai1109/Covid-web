import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { PlusIcon } from '~/CommonComponent/icons';
import { FormInput } from '~/CommonComponent/Popper';
import SelectOption from '~/CommonComponent/SelectOption';
import WrapContent from '~/CommonComponent/WrapContent';
import styles from './EssentialPackage.module.scss';

const cx = classNames.bind(styles);

function InputPackage() {
    return (
        <div className={cx('wrapper')}>
            <WrapContent>
                <button className={cx('submit-btn', 'flex-center')}>
                    <PlusIcon width="2.5rem" height="2.5rem" />
                </button>
                <div className={cx('input-field', 'flex-center')}>
                    <span className={cx('label')}>Name</span>
                    <FormInput />
                </div>
                <div className={cx('input-field', 'flex-center')}>
                    <span className={cx('label')}>Maximum number of packages</span>
                    <FormInput tiny />
                </div>
                <div className={cx('input-field', 'flex-center')}>
                    <span className={cx('label')}>Limited time</span>
                    <FormInput tiny />
                    <div className={cx('select-field')}>
                        <SelectOption options={[]} tiny />
                    </div>
                </div>
                <div className={cx('input-field', 'flex-center')}>
                    <span className={cx('label', 'title')}>Add products</span>
                    <div className={cx('icon', 'flex-center')}>
                        <PlusIcon width="2rem" height="2rem" />
                    </div>
                </div>
            </WrapContent>
        </div>
    );
}

export default InputPackage;
