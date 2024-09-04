/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient, VirtualAccountStatus } from "@prisma/client";
import logger from "../logger";
import FlutterwaveService from "./FlutterwaveService";

const prisma = new PrismaClient()

interface CreateVritualAccountParams {
    email: string
    bvn: string
    phonenumber: string
    lastname: string
    firstname: string
    userId: string
}

interface VirtualPayloadParams {
    userId: string
    number: string
    balance: number
    status: string
    bankName: string
    data: any
}

class VirtualAccountService {

    // Check if virtual account exists for a user using userId
    async isVirtualAccount(userId: string) {
        const check = await prisma.virtualAccount.findFirst({
            where: {
                userId,
            },
        });

        if (check) {
            return true
        } else {
            return false
        }
    }  
    
    // Create Virtual Account for a user using userId
    async createVirtualAccount(data: CreateVritualAccountParams) {
        try {
            // prepare the data for flutterwave
            const payload = {
                ...data,
                is_permanent: true,
                tx_ref: data.userId,
                narration: 'APAY/' + data?.firstname + ' ' + data?.lastname
            }

            const response = await FlutterwaveService.createVirtualAccount(payload)

            // console.log('Virtual Response: ', response)


            if (response) {
                // insert virtual account into db
                const virtualpayload = {
                    userId: data.userId,
                    number: response.data.account_number,
                    status: VirtualAccountStatus.ACTIVE,
                    bankName: response.data.bank_name,
                    data: response.data
                }

                const virtualAccount = await prisma.virtualAccount.create({
                    data: virtualpayload
                })

                if (virtualAccount) {
                    return virtualAccount
                } else {
                    return false
                }
            } else {
                return false
            }
        } catch (error) {
            logger.error(error)
            return false
        }
    }
    
    // Get virtual account for a user using userId
    async getVirtualAccount(userId: string) {
        const check = await prisma.virtualAccount.findFirst({
            where: {
                userId
            }
        })

        if (check) {
            return check
        } else {
            return false
        }
    }
}

export default new VirtualAccountService()