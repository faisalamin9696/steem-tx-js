import { PrivateKey as PK } from './helpers/PrivateKey'
import { PublicKey as PubK } from './helpers/PublicKey'
import { Signature as Sig } from './helpers/Signature'
import { Memo as MemoType } from './helpers/memo'

declare module 'steem-tx'

export class PrivateKey extends PK {}
export class PublicKey extends PubK {}
export class Signature extends Sig {}

/** Transaction for steem blockchain */
export class Transaction {
  constructor(trx?: object)

  /** Broadcast the signed transaction.
   * @param {number}timeout - optional - default 5 seconds
   * @param {number}retry - optional - default 5 times
   */
  broadcast(timeout?: number, retry?: number): Promise<{
    id: number
    jsonrpc: string
    result: { tx_id: string; status: string }
  } | {error: object}>

  /** Create the transaction by operations
   * @param {[Array]} operations
   * @param {Number} expiration Optional - Default 60 seconds
   */
  create(
    operations: any[],
    expiration?: number
  ): Promise<{
    expiration: string
    extensions: any[]
    operations: any[]
    ref_block_num: number
    ref_block_prefix: number
  }>

  /** Sign the transaction by key or keys[] (supports multi signature).
   * It is also possible to sign with one key at a time for multi signature.
   * @param {PrivateKey|[PrivateKey]} keys single key or multiple keys in array
   */
  sign(keys: PrivateKey | PrivateKey[]): {
    expiration: string
    extensions: any[]
    operations: any[]
    ref_block_num: number
    ref_block_prefix: number
    signatures: string[]
  }

  /** Return the transaction hash which can be used to verify against a signature */
  digest(): {
    digest: Uint8Array,
    txId: string
  }

  /**
   * Add a signature to already created transaction. You can add multiple signatures to one transaction but one at a time.
   * This method is used when you sign your transaction with other tools instead of built-in .sign() method.
   */
  addSignature(signature: string): {
    expiration: string
    extensions: any[]
    operations: any[]
    ref_block_num: number
    ref_block_prefix: number
    signatures: string[]
  }
}

/** steem-tx configurations */
export const config: {
  address_prefix: string
  chain_id: string
  node: string[] | string,
  axiosAdapter: null | 'xhr' | 'http' | any,
  timeout: number
  retry: number
}

/**
 * Make calls to a steem node
 * @param {string}method - e.g. condenser_api.get_dynamic_global_properties
 * @param {[any]|object}params - array or object
 * @param {number}timeout - optional - default 5 seconds
 * @param {number}retry - optional - default 5 times
 */
export function call(method: string, params?: any[] | object, timeout?: number, retry?: number): Promise<any>

export const Memo: MemoType
