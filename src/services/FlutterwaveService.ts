import axios from 'axios';


const axiosInstance = axios.create({
    baseURL: process.env.FLW_BASE_URL,
    headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
    },
})

interface CreateVritualAccountParams {
    email: string
    is_permanent: boolean
    bvn: string
    tx_ref: string
    phonenumber: string
    lastname: string
    narration: string
}

interface AccountResolveParams {
    account_number: string
    bank_code: string
}

class FlutterwaveService {

    // create virtual account
    async createVirtualAccount(data: CreateVritualAccountParams) {
        try {
            const response = await axiosInstance.post('/virtual-account-numbers', data).then((res) => res.data).catch((err) => err)
            return response
        } catch (e) {
            return e
        }
    }

    // async get virtual account
    async getVirtualAccount(accountNumber: string) {
        try {
            const response = await axiosInstance.get(`/virtual-account-numbers/${accountNumber}`).then((res) => res.data).catch((err) => err)
            return response
        } catch (e) {
            return e
        }
    }

    // async get list of banks in Nigeria
    async getBanks() {
        try {
            const response = await axiosInstance.get('/banks/NG').then((res) => res.data).catch((err) => err)
            return response
        } catch (e) {
            return e
        }
    }

    // async post account resolve
    async accountResolve(data: AccountResolveParams) {
        try {
            const payload = {
                account_number: data.account_number,
                account_bank: data.bank_code
            }
            const response = await axiosInstance.post(`/accounts/resolve`, payload).then((res) => res.data).catch((err) => err)
            return response
        } catch (e) {
            return e
        }
    }

    // async get bills categories with params
    async getBillsCategories() {
        try {
            const response = await axiosInstance.get(`/top-bill-categories`, {
                params: {
                    country: 'NG',
                }
            }).then((res) => res.data)
              .catch((err) => {
                  console.error('Error Response:', err.response ? err.response.data : err.message);
                  return err;
              });
            return response;
        } catch (e) {
            console.log('Error: ', e);
            return e;
        }
    }

    // async get bill's items
    async getBillItems(category: string) {
        try {
            const response = await axiosInstance.get(`/bills/${category}/billers`, {
                params: {
                    country: 'NG',
                }
            }).then((res) => res.data)
              .catch((err) => {
                  console.error('Error Response:', err.response ? err.response.data : err.message);
                  return err;
              });
            return response;
        } catch (e) {
            console.log('Error: ', e);
            return e;
        }
    }

    // async get bill's information
    async getBillInformation(billerCode: string) {
        try {
            const response = await axiosInstance.get(`/billers/${billerCode}/items`, {
                params: {
                    country: 'NG',
                }
            }).then((res) => res.data)
              .catch((err) => {
                  console.error('Error Response:', err.response ? err.response.data : err.message);
                  return err;
              });
            return response;
        } catch (e) {
            console.log('Error: ', e);
            return e;
        }
    }

    // async validate bills
    async validateBill(billerCode: string, customer: string, itemCode: string) {
        try {
            const response = await axiosInstance.get(`/bill-items/${itemCode}/validate`, {
                params : {
                    country: 'NG',
                    customer,
                    code: billerCode
                }
            }).then((res) => res.data)
              .catch((err) => {
                  console.error('Error Response:', err.response ? err.response.data : err.message);
                  return err;
              });
            return response;
        } catch (e) {
            console.log('Error: ', e);
            return e;
        }
    }
    
}

export default new FlutterwaveService()