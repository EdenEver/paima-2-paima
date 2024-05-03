# Lib P2P tutorial

This repository contains the code for the tutorial on how to create a simple P2P network using JS.

## Notes

Libp2p is a modular system of protocols, specifications and libraries that enable the development of peer-to-peer network applications. Not all modules are required for all applications, and developers can choose which modules to use based on their specific needs.

The only two modules needed is a transport and crypto module. The transport module is responsible for dialing and listening to connections, while the crypto module is responsible for encrypting and decrypting messages. On top of this, it is recommended to use a stream multiplexer, which is a module that allows multiple streams to be multiplexed over a single connection.

### Transport

The transport module is responsible for dialing and listening to connections. It is the module that is responsible for the actual communication between peers. What protocol to use is up to the developer, but some common protocols are TCP, WebSockets, and WebRTC. Not all protocols are supported by all runtimes, some are only supported in the browser, while others are only supported in Node.js.

### Addressing

An address is a string that identifies a peer. It is used to dial and listen to connections. An address is composed of a protocol, an identifier, and a set of parameters. The protocol is the name of the protocol used to communicate with the peer, the identifier is a string that uniquely identifies the peer, and the parameters are a set of key-value pairs that are used to configure the protocol.

#### Multiaddr

A multiaddr is a self-describing address that can be used to represent any address. It is a binary format that can be converted to and from a string format. It is composed of a set of components, each of which represents a part of the address. Each component has a code that identifies the protocol used, and a value that represents the address. The value can be a string, a number, or a binary blob.

outer, lower level protocols encapsulated by higher level protocols, for example, IP encapsulates TCP, which encapsulates websockets.

example:

```
/ip4/0.0.0.0/tcp/4001/ws
```

#### Dns

An IP can be resolved from a domain name using the DNS protocol, for example

```
/dns/example.com/tcp/4001/ws
```

#### listen addresses

A listen address is an address that a peer listens on for incoming connections. It is used to identify the peer to other peers. A peer can listen on multiple addresses, each of which can be used to connect to the peer. This will effectively make the peer a server, as it will be able to accept incoming connections from other peers, and thus it will not be able to be run in a browser.


### Peer discovery


## From discord

### STUN / TURN NAT hole punching 

So for the browser-to-brower use-case, assuming that both are behind NAT, there’s a good chance that a TURN server will be required to establish a connection.

However, unlike STUN servers, TURN servers are more “costly” (and there are far fewer free ones) as they serve as proxies if NAT hole punching fails.
Should be working 🙂

https://delegated-ipfs.dev/routing/v1/providers/bafybeicklkqcnlvtiscr2hzkubjwnwjinvskffn4xorqeduft3wq7vm5u4