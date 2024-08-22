import { Dojah } from "dojah-typescript-sdk";
import axios from "axios";

const dojah = new Dojah({
    appId: process.env.LIVE_DOJAN_APP_ID,
    authorization: process.env.LIVE_DOJAN_PRIVATE,
    basePath: process.env.LIVE_DOJAN_URL
});

const axiosInstance  = axios.create({
    baseURL: process.env.LIVE_DOJAN_URL,
    headers: {
        AppId: process.env.LIVE_DOJAN_APP_ID,
        Authorization: process.env.LIVE_DOJAN_PRIVATE
    },
})


class VerificationService {

    async getScreeningInfoResponse() {
        const response = await dojah.aml.getScreeningInfo({});

        return response
    }

    // Get BVN Advance
    async getBVNAdvanceResponse(bvn: number) {
        try {
            // console.log('BVN: ', bvn)
            const response = await axiosInstance.get(`/api/v1/kyc/bvn/advance?bvn=${bvn}`).then((res) => res.data).catch((err) => err)
            return response
        } catch (e) {
            // console.log('BVN Error: ', e)
            return e
        }
    }

    // Get NIN Adance
    async getNINAdvanceResponse(nin: number) {
        try {
            const response = await axiosInstance.get(`/api/v1/kyc/nin?nin=${nin}`).then((res) => res.data).catch((err) => err)
            return response
        } catch (e) {
            return e
        }
    }

    // Get Phone Number
    async getPhoneNumberAdvanceResponse(phoneNumber: number) {
        try {
            const response = await axiosInstance.get(`/api/v1/kyc/phone_number/basic?phone_number=${phoneNumber}`).then((res) => res.data).catch((err) => err)
            return response
        } catch (e) {
            return e
        }
    }
}

export default new VerificationService