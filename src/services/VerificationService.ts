import { Dojah } from "dojah-typescript-sdk";

const dojah = new Dojah({
    appId: process.env.LIVE_DOJAN_APP_ID,
    authorization: process.env.LIVE_DOJAN_PRIVATE,
    basePath: process.env.LIVE_DOJAN_URL
});


class VerificationService {

    async getScreeningInfoResponse() {
        const response = await dojah.aml.getScreeningInfo({});

        return response
    }

    // Get BVN Advance
    async getBVNAdvanceResponse(bvn: number) {
        try {
            console.log('BVN: ', bvn)
            const response = await dojah.nigeriaKyc.getBasicBvn({ bvn });
            return response
        } catch (e) {
            return e
        }
    }
}

export default new VerificationService