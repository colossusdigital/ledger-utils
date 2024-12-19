const axios = require('axios');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const {AxiosError} = require("axios");
const readline = require('readline');
class Utils{
    apiKeyId = ""
    apiKeySecret =""
    apiKeySecretHex =""
    vaultUrl = ""
    headers = {
        'X-Ledger-Workspace': process.env.WORKSPACE,
        'Content-Type': 'application/json',
    }
    constructor(){
        this.apiKeyId = process.env.API_KEY_ID
        this.apiKeySecret = process.env.API_KEY_SECRET
        this.vaultUrl = process.env.VAULT_URL
        this.apiKeySecretHex =  process.env.API_KEY_SECRET_HEX
    }

    async generateToken(){
        try{
            const data = {
                api_key_id: this.apiKeyId,
                api_key_secret: this.apiKeySecret
            }
          const response = await axios.post(`${this.vaultUrl}/auth/token`, data, { headers: this.headers })
            return response.data.access_token
        } catch (e) {
            this.checkError(e)
        }
    }

    async decodeRequestChallenge(requestId){
        try {
            this.headers['Authorization'] = `Bearer ${await this.generateToken()}`;
            const response = await axios.get(`${this.vaultUrl}/requests/${requestId}/challenge`, { headers: this.headers });
            return response.data.challenge
        } catch (e) {
            this.checkError(e)
        }
    }

    signChallenge(challenge) {
        const key = Buffer.from(this.apiKeySecretHex, 'hex');
        const privateKey = crypto.createPrivateKey({
            key: key,
            format: 'pem'
        });
        const decodedData = Buffer.from(challenge, 'base64').toString('hex');
        return jwt.sign(
            Buffer.from(decodedData, "hex"),
            privateKey.export({
                format: 'pem',
                type: 'sec1'
            }),
            {
                algorithm: 'ES256',
                header: {
                    alg: 'ES256',
                    typ: 'JWT',
                },
            });
    }

    async approveReject(requestId, type){
        try {
            if(!['approve', 'reject'].includes(type)){
                throw new Error('Invalid type')
            }
            const challengeData = await this.decodeRequestChallenge(requestId);
            const challengeJson = JSON.parse(Buffer.from(challengeData, 'base64').toString('utf-8'))
            const dataToSign = challengeJson.data.digests[0].digest
            return this.askToContinue(dataToSign, requestId, type, challengeData)
        } catch (e) {
            this.checkError(e)
        }
    }

    async continueFlow(requestId, type,  challengeData){
        try {
            const body = { jws: this.signChallenge(challengeData) }
            const response = await axios.post(`${this.vaultUrl}/requests/${requestId}/${type}`, body, { headers: this.headers });
            return response.data
        } catch (e) {
            this.checkError(e)
        }
    }

    checkError(e){
        if(e instanceof AxiosError) {
            throw e.response.data
        } else {
            throw e
        }
    }

    askToContinue(hash, requestId, type, challengeData) {
        return new Promise((resolve, reject) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question(`The hash you are ${type === 'approve' ? 'approving' : 'rejecting'} is: ${hash}\nDo you want to continue? (y/n): `, (answer) => {
                if (answer.toLowerCase() === 'y') {
                    resolve(this.continueFlow(requestId, type, challengeData));
                    rl.close();
                } else {
                    rl.close();
                    process.exit(1);
                }
                // else {
                //     console.log('Invalid response. Use "y" to continue or "n" to abort.');
                //     this.askToContinue(hash, requestId, type, challengeData);
                // }
            });
        });

    }

}

module.exports = Utils;
