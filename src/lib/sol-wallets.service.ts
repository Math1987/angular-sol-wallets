import { Injectable } from '@angular/core';
import { PhantomWallet } from './wallets/phantom.wallet';
import { Wallet } from './wallets/wallet';
import { Cluster } from '@solana/web3.js' ;


@Injectable({
  providedIn: 'root'
})
export class SolWalletsService {

  wallets : Wallet[] = [] ;
  selected : Wallet | null = null ;

  constructor() {
      document.addEventListener('DOMContentLoaded', () => {
        this.wallets.push(new PhantomWallet());
      });
  }
  setCluster( cluster : Cluster ){
    Wallet.cluster = cluster ;
  }
  async connect() : Promise<Wallet> {
      this.selected = this.wallets[0] ;
      await this.wallets[0].connect();
      return this.selected
  }
  async disconnect(){
    if ( this.selected ){
      return this.selected.disconnect();
    }
    throw Error('No wallet selected.');
  }
  async signMessage( message : string ) : Promise<string | null | undefined> {
    if ( this.selected ){
      let signature =  this.selected.signMessage( message ); ;
      return signature ;
    }
    throw Error('No wallet selected.');
  }
  /**
   * Create a client-side signature of a transfer transaction to send to your server.
   * Return a promise with a buffer of the serialized transaction.
   * @param destinationPubkey the address of the receiver
   * @param sols the ammount in SOLS to send from the client to the receiver
   */
  async signTransfer( destinationPubkey : string, sols : number ) : Promise<Buffer> {
    if ( this.selected )
    return await (await this.selected.signTransfer(destinationPubkey, sols)).serialize();
    throw Error('No wallet selected.');
  }
  /**
   * Create, send an wait for confirmation of a transfer transaction
   * Return a promise with a string signature.
   * @param destinationPubkey the address of the receiver
   * @param sols the ammount in SOLS to send from the client to the receiver
   */
  async signAndSendTransfer( destinationPubkey : string, sols : number ) : Promise<string | null | undefined> {
    if ( this.selected )
      return this.selected.signAndSendTransfer( destinationPubkey, sols );
    throw Error('No wallet selected.');
  }

  /**
   * !!DE<PRECIATED FUNCTION!!
   * @param destinationPubkey the address of the receiver
   * @param sols the ammount in SOLS to send from the client to the receiver
   * @returns 
   */
  async sendTransaction( destinationPubkey : string, sols : number ) : Promise<string | null | undefined> {
    if ( this.selected )
      return this.selected.sendTransaction(destinationPubkey, sols) ;
    throw Error('No wallet selected.');
  }
  
}
