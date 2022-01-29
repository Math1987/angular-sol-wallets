import { ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Injectable, Injector } from '@angular/core';
import { PhantomWallet } from './wallets/phantom.wallet';
import { SolflareWallet } from './wallets/solfare.wallet';

import { Wallet } from './wallets/wallet';
import { Cluster } from '@solana/web3.js' ;
import { ModalComponent } from './modal/modal/modal.component';


@Injectable({
  providedIn: 'root'
})
export class SolWalletsService {

  wallets : Wallet[] = [] ;
  selected : Wallet | null = null ;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {
      document.addEventListener('DOMContentLoaded', () => {
        this.wallets.push(new PhantomWallet());
        this.wallets.push(new SolflareWallet());
      });
  }
  setCluster( cluster : Cluster ){
    Wallet.cluster = cluster ;
  }
  /**
   * Open the wallet(s) of client
   * @returns a promise with the Wallet selected by the user
   */
  connect() : Promise<Wallet> {
    return new Promise((resolve, reject) => {

      if ( this.wallets.length > 0 ){

        const modalComponent = this.componentFactoryResolver
        .resolveComponentFactory(ModalComponent)
        .create(this.injector);

        this.appRef.attachView(modalComponent.hostView);
        const domElem = (modalComponent.hostView as EmbeddedViewRef<any>)
          .rootNodes[0] as HTMLElement;

        modalComponent.instance.wallets = this.wallets.filter( w => {
          if ( w.installed ){
            return true ;
          }
          return false ;
        });

        modalComponent.instance.selectEvent.subscribe( selectedWallet => {

          console.log('select wallet', selectedWallet );
          this.disconnect().finally( () => {

            selectedWallet.connect().then( res => {

              this.appRef.detachView(modalComponent.hostView);
              modalComponent.destroy();
              this.selected = selectedWallet ;
              resolve(selectedWallet) ;
  
            });

          });

        });
        document.body.appendChild(domElem);

      }else if ( this.wallets.length === 1 ){

        this.selected = this.wallets[0] ;
        this.wallets[0].connect().then( w => {
          resolve(this.selected!) ;
        });
        
      }


    });

  }
  async disconnect(){
    if ( this.selected ){
      return this.selected.disconnect();
    }
    throw Error('No wallet selected.');
  }
  /**
   * Sign a message on client-side
   * @param message 
   * @returns a promise with the message signature.
   */
  async signMessage( message : string ) : Promise<string | null | undefined> {
    await this.connect();
    let signature =  this.selected!.signMessage( message ); ;
    return signature ;
  }
  /**
   * Create a client-side signature of a transfer transaction to send to your server.
   * @param destinationPubkey the address of the receiver
   * @param sols the ammount in SOLS to send from the client to the receiver
   * @returns a promise with a buffer of the serialized transaction.
   */
  async signTransfer( destinationPubkey : string, sols : number ) : Promise<Buffer> {
    await this.connect();
    return await (await this.selected!.signTransfer(destinationPubkey, sols)).serialize();
  }
  /**
   * Create, send an wait for confirmation of a transfer transaction
   * Return a promise with a string signature.
   * @param destinationPubkey the address of the receiver
   * @param sols the ammount in SOLS to send from the client to the receiver
   */
  async signAndSendTransfer( destinationPubkey : string, sols : number ) : Promise<string | null | undefined> {
    await this.connect();
    return this.selected!.signAndSendTransfer( destinationPubkey, sols );
  }
  /**
   * !!DE<PRECIATED FUNCTION!!
   * @param destinationPubkey the address of the receiver
   * @param sols the ammount in SOLS to send from the client to the receiver
   * @returns 
   */
  async sendTransaction( destinationPubkey : string, sols : number ) : Promise<string | null | undefined> {
    await this.connect();
    return this.selected!.sendTransaction(destinationPubkey, sols) ;
  }
  
}
