import {SERVER_URL} from './consts';

export default class LoginService {
    static loginUser(userName, passWord) {
        return fetch(`${SERVER_URL}/login?userName=${userName}&passWord=${passWord}`)
            .then(response => response.json())
    }
}
