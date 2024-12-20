# Ledger Utils

## Description
**Ledger Utils** is a script developed by Colossus to provide Institutional Hub clients with an add-on that allows them to approve and/or reject transactions on their Ledger Enterprise account. The script communicates with the Ledger Enterprise APIs, enabling users to interact directly, bridging the platform's lack of a built-in interface for transaction approval or rejection.

## Technologies Used
- **Language:** Node.js
- **Primary Dependency:** [ledger-approver](https://www.npmjs.com/package/ledger-approver)

## Prerequisites
- Install Node.js (latest version recommended).
- Clone the `ledger-utils` repository.
- Configure the required environment variables.

## Configuration
The following environment variables must be set for the script to work:

- `API_KEY_SECRET`
- `API_KEY_ID`
- `API_KEY_SECRET_HEX`
- `WORKSPACE`
- `VAULT_URL`

To set up these environment variables, create a `.env` file in the root directory of the script and add the following parameters:

```env
API_KEY_SECRET=your_api_key_secret
API_KEY_ID=your_api_key_id
API_KEY_SECRET_HEX=your_api_key_secret_hex
WORKSPACE=your_workspace
VAULT_URL=your_vault_url
```

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/colossus/ledger-utils.git
   cd ledger-utils
   ```
2. Install the dependencies:
   ```bash
   npm i
   ```

## Usage
The script can be executed via the terminal. The main commands include:

### View Available Commands
```bash
node index.js --help
```

### Approve a Transaction
```bash
node index.js -r <TRANSACTION_ID> -t approve
```

### Reject a Transaction
```bash
node index.js -r <TRANSACTION_ID> -t reject
```

Replace `<TRANSACTION_ID>` with the ID of the transaction received from Ledger Enterprise.

### Example
```bash
node index.js -r 12345 -t approve
```

## Error Handling
The script includes a descriptive error handler. Example:

- Attempting to approve/reject an invalid transaction:
  ```json
  {
    "code": 404,
    "message": "Request does not exist",
    "name": "RESOURCE NOT FOUND"
  }
  ```

## Limitations
- The script requires the latest version of Node.js installed on the machine.

## License
This script is proprietary to **Colossus** and is distributed to Institutional Hub clients under the **MIT License**. Refer to the `LICENSE` file for more details.

## Contact
For assistance or further information, contact the Colossus support team.
