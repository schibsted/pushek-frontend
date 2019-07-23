import {Device} from "../types/Device";

const axios = require('axios');

interface DeviceTypeList {
    [key: string]: Device
}

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

    static registerDevice = async (pin: string, system: string) => {

        const device: DeviceTypeList = {
            android: {
                "token": "token",
                "systemName": "Android",
                "systemVersion": "12.0.1",
                "pusherType": "FCM"
            },
            ios: {
                "token": "token",
                "systemName": "IOS",
                "systemVersion": "20.0.1",
                "pusherType": "APNS"
            }
        };

        if(typeof device[system] !== "undefined") {
            FirebaseFunctions.getAxiosInstance().post(`/pins/${pin}`, device[system]);
        }
    }

}

export default FirebaseFunctions;
