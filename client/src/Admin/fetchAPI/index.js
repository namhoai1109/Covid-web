import { getAPI } from '~/APIservices/getAPI';
import { setListFacility } from '../redux/listFacilitySlice';
import { addManager, clearList } from '../redux/listManagerSlice';

export let initListManager = async (dispatch) => {
    try {
        let doctors = await getAPI('admin/doctors');
        dispatch(clearList());
        doctors.forEach((doctor) => {
            if (doctor.id_number !== null || doctor.account !== null) {
                dispatch(
                    addManager({
                        username: doctor.id_number,
                        name: doctor.name,
                        status: doctor.account.status,
                        _id: doctor._id,
                        id_account: doctor.account._id,
                    }),
                );
            }
        });
    } catch (err) {
        console.log(err);
    }
};

export let getListFacility = async (dispatch) => {
    let list = await getAPI('facility/get/all');
    dispatch(setListFacility(list));
};
