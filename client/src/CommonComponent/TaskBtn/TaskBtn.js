import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './TaskBtn.module.scss';
import { forwardRef } from 'react';

const cx = classNames.bind(styles);

let TaskBtn = forwardRef(({ to, icon, title, disabled, active, onClick }, ref) => {
    let Comp = 'div';
    if (to) Comp = Link;

    return (
        <Comp
            ref={ref}
            to={to}
            className={cx('btn', {
                disabled: disabled,
                active: active,
            })}
            onClick={onClick}
        >
            {title}
            {icon && <span className={cx('icon')}>{icon}</span>}
        </Comp>
    );
});

export default TaskBtn;
