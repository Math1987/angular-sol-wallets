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
  async connectWallet() : Promise<Wallet> {
      this.selected = this.wallets[0] ;
      await this.wallets[0].connect();
      return this.selected
  }
  async disconnectWallet(){
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
  async sendTransactinon( destinationPubkey : string, sols : number ) : Promise<string | null | undefined> {
    if ( this.selected ){
      let signature =  this.selected.sendTransaction(destinationPubkey, sols) ;
      return signature ;
    }
    throw Error('No wallet selected.');
  }
}
