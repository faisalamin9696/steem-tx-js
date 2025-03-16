# steem-tx

Lightweight and complete JavaScript library for Steem blockchain - Web and NodeJS.

#### Why this?

The most lightweight while being a complete library.

Some libraries are not easy to integrate and in some cases are incompatible with some frameworks like [Nativescript](https://www.nativescript.org/)

Steem-tx is a solution to such cases when the other libraries are not working.

## Installation

```bash
npm install steem-tx --save
```

## Usage

**Browser:**

```html
<script src="https://cdn.jsdelivr.net/npm/steem-tx/dist/steem-tx.min.js"></script>
```

`steemTx` is available after including /dist/steem-tx.min.js file in your html file.

**NodeJS:**

```js
// ES Module
import * as steemTx from "steem-tx"

// OR import what you use
import { call, Transaction, PrivateKey } from "steem-tx"

// OR in CommonJS environments using dynamic import()
const steemTx = await import("steem-tx")

// OR import what you use
const { call, Transaction, PrivateKey } = await import("steem-tx")
```

## Usage examples

**Configuration**

Set or get configs:

```js
// default values that are already defined in config.js
steemTx.config.node: [
  'https://api.steemit.com',
]
// OR steemTx.config.node = "https://api.steemit.com"
steemTx.config.chain_id = "0000000000000000000000000000000000000000000000000000000000000000"
steemTx.config.address_prefix = "STM"
steemTx.config.axiosAdapter = null
steemTx.config.timeout: 5, // 5 seconds
steemTx.config.retry: 5 // consecutive retries on one call
```

You can define a different adapter if your environment doesn't support 'xhr' or 'http'  
See https://github.com/haverstack/axios-fetch-adapter  
Example:

```js
import fetchAdapter from "@haverstack/axios-fetch-adapter"
steemTx.config.axiosAdapter = fetchAdapter
```

**Create transaction:**

```js
const tx = new steemTx.Transaction(trx?)
```

or

```js
const tx = new steemTx.Transaction()
tx.create(operations, (expiration = 60))
```

Example:

```js
const operations = [
  [
    "vote",
    {
      voter: "guest123",
      author: "guest123",
      permlink: "20191107t125713486z-post",
      weight: 9900,
    },
  ],
]

const tx = new steemTx.Transaction()
tx.create(operations).then(() => console.log(tx.transaction))
```

**Sign transaction:**

```js
const myKey = "5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg"
const privateKey = steemTx.PrivateKey.from(myKey)

tx.sign(privateKey)
console.log(tx.signedTransaction)
```

**Broadcast transaction:**

```js
tx.broadcast().then((res) => console.log(res))
```

**Get transaction digest and id**

Will return the hash and transaction id without broadcasting the transaction.

```js
const digest = tx.digest()
// { digest: Uint8Array, txId: string }
```

**Make node call:**

```js
steemTx.call(method, params = [], timeout = 10): Promise
```

Example:

```js
steemTx
  .call("condenser_api.get_accounts", [["faisalamin"]])
  .then((res) => console.log(res))
```

**Sign message and verify sginature:**

```js
steemTx.PrivateKey.sign(message: Uint8Array)
steemTx.PublicKey.verify(message: Uint8Array, signature: Signature)
```

Example:

```js
const { sha256 } = require("steem-tx/helpers/crypto")

const privateKey = steemTx.PrivateKey.from(
  "5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg"
)
const publicKey = steemTx.PublicKey.from(
  "STM6aGPtxMUGnTPfKLSxdwCHbximSJxzrRjeQmwRW9BRCdrFotKLs"
)
const message = sha256("testing")
const signature = privateKey.sign(message)
const verify = publicKey.verify(message, signature) // true
```

Or create Sginature from string:

```js
const signature = steemTx.Signature.from(
  "1f019dc13a308cef138162cc16ab7c3aa1891941fddec66d83ff29b01b649a86600802d301f13505abc8c9ccbbeb86852fc71134fe209a6e717c6fd7b4cd1505a2"
)
```

**Generate random key**

```js
steemTx.PrivateKey.randomKey()
```

**Retrieve public key from Signature**

```js
const signature = steemTx.Signature.from(string)
signature.getPublicKey(message)
```

For example we find the public key used for signing this transaction:  
https://steemdb.io/tx/6b10e6021b9a1b435e278704fb0dd9b4deb27217

```js
const signature = steemTx.Signature.from(
  "203dfa2f2620f94a033c424710bbf22c518e1d9aec4170b342789acdc714bf0b483ff1e2ec1fcd5607e5df767ba09751792484a7ac1cf31c94cf55b1e81df6be30"
)
const trx = new steemTx.Transaction({
  ref_block_num: 30883,
  ref_block_prefix: 3663302639,
  expiration: "2023-05-26 07:49:44",
  operations: [
    [
      "vote",
      {
        voter: "faisalamin",
        author: "afa.hb03",
        permlink:
          "esp-engcoastal-sentry-splinterlands-art-contest-week-242-by-afahb03",
        weight: 2000,
      },
    ],
  ],
  extensions: [],
})
const { digest } = trx.digest()
const publicKey = signature.getPublicKey(digest).toString()
// STM8WWUYHMdHLgEHidYCztswzfZCViA16EqGkAxt7RG4dWwDpFtCF
// To find which account has this public key
const account = await steemTx.call("condenser_api.get_key_references", [
  ["STM8WWUYHMdHLgEHidYCztswzfZCViA16EqGkAxt7RG4dWwDpFtCF"],
])
// steemauto
```

**Encode/Decode Memo**

```js
import { Memo, PrivateKey, PublicKey } from "steem-tx"

// sender private key
const privateKey = PrivateKey.from("...")
// receiver public memo key
const publicKey = PublicKey.from("...")

// must have #
const memo = "#testing"
const encryptedMemo = await Memo.encode(privateKey, publicKey, memo)

// Decode using receiver's private memo key
const decryptedMemo = await Memo.decode(privateKey, encryptedMemo)
```

### Utils

In browser build `utils` is exported. For example:

```
steemTx.utils.validateUsername('test')
```

**Validate Username**  
Example:

```js
import { validateUsername } from "steem-tx/helpers/utils.js"
console.log(validateUsername("test"))
// null
console.log(validateUsername("Big"))
// Account name should start with a lowercase letter.
```

**makeBitMaskFilter - get_account_history**  
Example:

```js
import { call } from "steem-tx"
import { makeBitMaskFilter, operations as op } from "steem-tx/helpers/utils.js"
const filter = makeBitMaskFilter([op.transfer, op.transfer_to_vesting])
call("condenser_api.get_account_history", [
  "faisalamin",
  -1,
  1,
  ...filter,
]).then((res) => console.log(res))
```

**buildWitnessSetProperties**  
Needed for `witness_set_properties` operation.

Example:

```js
import { buildWitnessSetProperties } from "steem-tx/helpers/utils.js"
const owner = "faisalamin"
const props = {
  key: "STM1111111111111111111111111111111114T1Anm", // Required - signing key
  account_creation_fee: "0.000 STEEM", // optional
  account_subsidy_budget: 10000, // optional
  account_subsidy_decay: 330782, // optional
  maximum_block_size: 65536, // optional
  sbd_interest_rate: 0, // optional
  sbd_exchange_rate: { base: "0.250 SBD", quote: "1.000 STEEM" }, // optional
  url: "https://testurl", // optional
  new_signing_key: "STM1111111111111111111111111111111114T1Anm", // optional
}
const witnessOps = buildWitnessSetProperties(owner, props)
const trx = new Transaction().create(witnessOps)
```

**Retrying and failover**  
Steem-tx will retry and change the node to the next in the array IF `steemTx.config.node` provided as array which by default is.  
By default steem-tx will use the timeout and retry values from the global config but you can supply timeout and retry values per request as well.

```js
// timeout: 5, retry: 3
steemTx
  .call("condenser_api.get_accounts", [["faisalamin"]], 5, 3)
  .then((res) => console.log(res))
// retrying applies to broadcasting as well
tx.broadcast(5, 3)
```

Note: Retrying a transaction is safe in this implementation as the chain won't accept a duplicate transaction.  
Note: retry = 5 will actually make 6 calls.  
Note: Failover will happen on any error and switch to the next node.

## License

MIT
