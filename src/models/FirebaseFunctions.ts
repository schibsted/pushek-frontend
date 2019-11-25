import {Device} from "../types/Device";

const axios = require('axios');

class FirebaseFunctions {

    static getAxiosInstance() {
            return axios.create({
                baseURL: process.env.REACT_APP_FIREBASE_FUNCTIONS_URL,
                headers: {'Access-Control-Allow-Origin': '*'}
            });
    }

    static async generatePin (): Promise<string> {
        const response = await FirebaseFunctions.getAxiosInstance().post('/pins');
        return response.data;
    }

    static push = async (device: Device, body: Object) => {

        const request = {
            token: device.token,
            pusherType: device.pusherType,
            body,
        };

        const response = await FirebaseFunctions.getAxiosInstance().post(`/examplePush`, request);
        return response.data;
    };

    static getPushDefinition = async () => {

        const response = await FirebaseFunctions.getAxiosInstance().get(`/examplePush`);
        return response.data;
    }
}

export default FirebaseFunctions;
