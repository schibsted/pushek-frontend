import {AxiosInstance} from "axios";

const axios = require('axios');



class FirebaseFunctions {

    getAxiosInstance() {

        // if(typeof axiosInstance !== AxiosInstance) {
            const axiosInstance: AxiosInstance = axios.create({
                baseURL: process.env.REACT_APP_FIREBASE_FUNCTIONS_URL,
                headers: {'Access-Control-Allow-Origin': '*'}
            })
        // }

        return axiosInstance;
    }

    generatePin = async () => {
        const pins =  await this.getAxiosInstance().post('/pins');
console.log(pins);
        return pins;
    }


}

export default FirebaseFunctions;
