import classNames from "classnames/bind";
import styles from "./NecessityItem.module.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const cx = classNames.bind(styles);

function NecessityItem() {
    var settings = {
        infinite: true,
        variableWidth: false,
        arrows: true,
        dots: true,
      };

    return ( <div className={cx('wrapper')}>
        <div className={cx('slider')}>
            <Slider {...settings}>
                <div className={cx('img')}>
                    <img src="http://placekitten.com/g/400/200" />
                </div>
                <div className={cx('img')}>
                    <img src="http://placekitten.com/g/400/200" />
                </div>
                <div className={cx('img')}>
                    <img src="http://placekitten.com/g/400/200" />
                </div>
                <div className={cx('img')}>
                    <img src="http://placekitten.com/g/400/200" />
                </div>
                <div className={cx('img')}>
                    <img src="http://placekitten.com/g/400/200" />
                </div>
            </Slider>
        </div>
        <div className={cx('info')}>
            <div>Name</div>
            <div>10000VND/1kg</div>
        </div>
    </div> );
}

export default NecessityItem;