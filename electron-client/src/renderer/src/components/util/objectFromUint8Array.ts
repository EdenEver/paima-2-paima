import { RpcMessage } from "edenever"

export const objectFromUint8Array = (ua: Uint8Array): RpcMessage =>
  JSON.parse(new TextDecoder().decode(ua)) as RpcMessage
