import Axios from 'axios';
import { SESSION_API_URL } from '../../constants';

export function login(credentials) {
    return Axios.post(`${SESSION_API_URL}/user/login`, credentials);
}

export function logout() {
    return Axios.get(`${SESSION_API_URL}/user/logout`);
}

export function getUserData() {
    return Axios.get(`${SESSION_API_URL}/user/getUserData`).then(response => {
        // TODO: remove after date format will be unix timestamp
        const { data = {} } = response;
        const { user = {} } = data;
        const birthdayData = user.birthday || '';
        const [year, month, day] = birthdayData.split('-');
        const formattedBirthdayData = new Date(`${year}-${month}-${day}`);
        return {
            data: {
                user: {
                    ...user,
                    birthday: moment(formattedBirthdayData).unix()
                }
            }
        };
    });
}

export function updateUserData(userData) {
    return Axios.post(`${SESSION_API_URL}/user/updateUserData`, userData);
}
