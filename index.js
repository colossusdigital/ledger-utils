require('dotenv').config()
const { Command } = require('commander');
const Utils = require("./utils/functions");
const program = new Command();

function validateType(value) {
    const allowedTypes = ['approve', 'reject'];
    if (!allowedTypes.includes(value)) {
        throw new Error(`The value "${value}" is invalid. Use one of: ${allowedTypes.join(', ')}`);
    }
    return value;
}

function checkEnvVariables() {
    const requiredEnvVars = [
        'WORKSPACE',
        'API_KEY_ID',
        'API_KEY_SECRET',
        'API_KEY_SECRET_HEX',
        'VAULT_URL'
    ];

    requiredEnvVars.forEach((envVar) => {
        if (!process.env[envVar]) {
            console.error(`Error: Environment variable ${envVar} is missing!`);
            process.exit(1);  // Termina il processo con codice di errore
        }
    });
}

checkEnvVariables()
program
    .version('1.0.0')
    .requiredOption('-r, --request_id <number>', 'Request id transaction')
    .requiredOption('-t, --type <approve | reject>', 'Specify the type of action (approve or reject)', validateType);

program.parse(process.argv);
const options = program.opts();

const utils = new Utils();
utils.approveReject(options.request_id, options.type).then(r => {
    console.log(r)
}).catch(e => {
    console.error(e)
})
