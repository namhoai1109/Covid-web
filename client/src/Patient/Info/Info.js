import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useCallback, useEffect, useState } from 'react';
import { getAPI } from '~/APIservices/getAPI';
import { putNoDataAPI } from '~/APIservices/putAPI';
import WrapContent from '~/CommonComponent/WrapContent';
import styles from './Info.module.scss';
const cx = classNames.bind(styles);

function Info() {
    let [info, setInfo] = useState(null);
    let [linkState, setLinkState] = useState(false);

    let getInfo = useCallback(async () => {
        let info = await getAPI('patient/info');
        console.log(info);
        let tmp = null;
        if (info) {
            tmp = {
                Name: info.name,
                ['ID number']: info.id_number,
                ['Date of birth']: info.dob,
                Status: info.status,
                Address: info.address,
                Facility: `${info.current_facility.name}-${info.current_facility.location.formattedAddress}`,
            };
        }
        setInfo(tmp);
        setLinkState(info.account.linked);
    });

    useEffect(() => {
        getInfo();
    }, []);

    let handleLink = useCallback(async () => {
        if (!linkState) {
            let res = await putNoDataAPI('patient/link');
            console.log(res);
        }
    });

    return (
        <div className={cx('wrapper')}>
            <WrapContent>
                {info &&
                    Object.keys(info).map((key, index) => {
                        return (
                            <div key={index} className={cx('info-field', 'flex-center')}>
                                <span className={cx('label')}>{key}:</span>
                                <span className={cx('value')}>{info[key]}</span>
                            </div>
                        );
                    })}
                <div className={cx('link-payment', 'flex-center')}>
                    {/* href="http://localhost:2000/" target="_blank" */}
                    <a onClick={handleLink} className={cx('title')}>
                        {linkState ? 'Your account is linked to payment system' : 'Link to payment system'}
                    </a>
                    <FontAwesomeIcon className={cx('icon')} icon={faAnglesRight} />
                </div>
            </WrapContent>
        </div>
    );
}

export default Info;
