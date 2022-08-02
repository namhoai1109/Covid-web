import classNames from 'classnames/bind';
import styles from './NecessityItem.module.scss';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { memo } from 'react';

const cx = classNames.bind(styles);

function NecessityItem({ infos, showDelete, clickDelete = () => {}, onClick = () => {} }) {
    var settings = {
        infinite: true,
        variableWidth: false,
        arrows: true,
        dots: true,
    };

    return (
        <div className={cx('wrapper')}>
            <button
                onClick={clickDelete}
                className={cx('delete-btn', 'flex-center', {
                    delete: showDelete,
                })}
            >
                <FontAwesomeIcon icon={faXmark} />
            </button>
            <div className={cx('slider')}>
                <Slider {...settings}>
                    {infos.images.map((linkImg, index) => {
                        return (
                            <div key={index} className={cx('img')}>
                                <img src={`http://localhost:5000/${linkImg}`} />
                            </div>
                        );
                    })}
                </Slider>
            </div>
            <div onClick={onClick} className={cx('info')}>
                <div>{infos.name}</div>
                <div className={cx('price', 'flex-center')}>
                    <span>{`${infos.price}VND`}</span>
                    <span>{`/${infos.quantity_unit}`}</span>
                </div>
            </div>
        </div>
    );
}

export default memo(NecessityItem);
