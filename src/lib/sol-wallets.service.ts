import { ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Injectable, Injector } from '@angular/core';
import { PhantomWallet } from './wallets/phantom.wallet';
import { SolflareWallet } from './wallets/solfare.wallet';

import { Wallet, AvalableWallets } from './wallets/wallet';
import { Cluster, Commitment, Transaction } from '@solana/web3.js' ;
import { ModalComponent } from './modal/modal/modal.component';
import { ReplaySubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SolWalletsService {

  private walletsReady : ReplaySubject<boolean> = new ReplaySubject<boolean>();

  autoConnect : boolean = false ;

  wallet : ReplaySubject<Wallet | null> = new ReplaySubject<Wallet | null>();
  wallets : Wallet[] = [] ;
  enabledWallets : AvalableWallets[] = ["Phantom", "Solflare"];
  selected : Wallet | null = null ;
  classes : { background? : string, card? : string, wallets? : string } = {} ;


  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {

    this.wallet.subscribe( w => {
      this.selected = w ;
    });


    document.addEventListener('DOMContentLoaded', () => {

      const buildWallets = async () => {
        setTimeout(() => {
            this.initWallets();
        },0);
      }
      if (document.readyState === 'complete') {
        buildWallets();
      }else{
        function listener() {
          window.removeEventListener('load', listener);
          buildWallets();
        }
        window.addEventListener('load', listener);
      }

    });

  }

  async initWallets(){

    if ( this.enabledWallets.filter( n => n === "Phantom").length >= 1 ){
      this.wallets.push(await PhantomWallet.create());
    }
    if ( this.enabledWallets.filter( n => n === "Solflare").length >= 1 ){
      this.wallets.push(await SolflareWallet.create());
    }


    const connecteds = this.wallets.filter( w => w.connected );
    if ( connecteds.length >= 1 && this.autoConnect ){
      if ( localStorage.getItem("selected-wallet") ){
        try{
          const wallet = this.wallets.filter( w => w.name === localStorage.getItem("selected-wallet") )[0] ;
          this.selectWallet(wallet);
          wallet.connect();
        }catch(e){
          const wallet = connecteds[0] ;
          this.selectWallet(wallet);
          wallet.connect();
        }
      }
    }
    this.walletsReady.next(true);
  }

  private selectWallet(wallet : Wallet | null){
    this.wallet.next(wallet);
    if ( wallet ){
      localStorage.setItem('selected-wallet', wallet!.name );
    }else{
      localStorage.removeItem('selected-wallet');
    }
  }

  setCluster( cluster : Cluster ){
    Wallet.cluster = cluster ;
  }
  setCommitment( commitment : Commitment ){
    Wallet.commitment = commitment ;
  }
  setCustomClasses( classes : { background? : string, card? : string, wallets? : string}){
      this.classes = classes ;
  }
  setEnabledWallets( wallets : AvalableWallets[] ){
    this.enabledWallets = wallets ;
  }


  getPublicKey(){
    if ( this.selected ){
      return this.selected.publicKey ;
    }
    return null ;
  }
  /**
   * Open the wallet(s) of client
   * @returns a promise with the Wallet selected by the user
   */
  connect() : Promise<Wallet> {
    return new Promise((resolve, reject) => {

      this.walletsReady.subscribe( ready => {

        const wallets = this.wallets
        .filter( w => w.installed )
        .filter( w => this.enabledWallets.filter( e => e === w.name).length >= 1 ) ;


        if ( wallets.length > 1 && this.selected === null ){

          const modalComponent = this.componentFactoryResolver
          .resolveComponentFactory(ModalComponent)
          .create(this.injector);

          this.appRef.attachView(modalComponent.hostView);

          const domElem = (modalComponent.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;

            if ( this.classes.background ){
              domElem.classList.add(this.classes.background);
            }
            
            if ( this.classes.card ){
              const card = domElem.querySelector('#wallet-container') as HTMLDivElement;
              card.className = this.classes.card ;
            }
            if ( this.classes.wallets ){
              const card = domElem.querySelector('#wallet-container') as HTMLDivElement;
              card.addEventListener('DOMNodeInserted', elem => {
                //@ts-ignore 
                elem.target.className = this.classes.wallets ;
              });
            }

          modalComponent.instance.wallets = wallets ;

          modalComponent.instance.quitEvent.subscribe( () => {

            this.appRef.detachView(modalComponent.hostView);
            modalComponent.destroy();

          });

          modalComponent.instance.selectEvent.subscribe( selectedWallet => {

            this.disconnect().finally( () => {

              selectedWallet.connect().then( res => {

                this.appRef.detachView(modalComponent.hostView);
                modalComponent.destroy();
                this.selectWallet(selectedWallet)
                resolve(selectedWallet) ;
    
              });

            });

          });
          document.body.appendChild(domElem);

        }else if ( wallets.length === 1 && this.selected === null ){

          this.selectWallet(wallets[0]);
          wallets[0].connect().then( w => {
            resolve(this.selected!) ;
          });
          
        }else{
          resolve(this.selected!);
        }
      });


    });

  }
  async disconnect(){
    if ( this.selected ){
      this.selected.disconnect();
      await this.selectWallet(null) ;
      return true ;
    }
    throw Error('No wallet selected.');
  }
  /**
   * Sign a message on client-side
   * @param message 
   * @returns a promise with the message signature.
   */
  async signMessage( message : string ) : Promise<string | null | undefined> {
    if ( !this.selected ){
      await this.connect();
    }
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
    if ( !this.selected ){
      await this.connect();
    }
    return await (await this.selected!.signTransfer(destinationPubkey, sols)).serialize();
  }
  /**
   * Create a client-side signature of your custom solana transaction.
   * @param transaction 
   * @returns signature
   */
  async signTransaction( transaction : Transaction ) : Promise<Buffer> {
    if ( !this.selected ){
      await this.connect();
    }
    if ( this.selected ){
      return await ( await this.selected!.signTransaction(transaction)).serialize();
    }else{
      throw Error("No wallet connected.");
    }
  }

  /**
   * Create, send an wait for confirmation of a transfer transaction
   * Return a promise with a string signature.
   * @param destinationPubkey the address of the receiver
   * @param sols the ammount in SOLS to send from the client to the receiver
   * @param signedByUser? optionnal: callbalck when user have signed the transaction in him wallet
   */
  async signAndSendTransfer( destinationPubkey : string, sols : number, signedByUser? : CallableFunction ) : Promise<string | null | undefined> {
    if ( !this.selected ){
      await this.connect();
    }
    return this.selected!.signAndSendTransfer( destinationPubkey, sols, signedByUser );
  }
  /**
   * !!DE<PRECIATED FUNCTION!!
   * @param destinationPubkey the address of the receiver
   * @param sols the ammount in SOLS to send from the client to the receiver
   * @returns 
   */
  async sendTransaction( destinationPubkey : string, sols : number ) : Promise<string | null | undefined> {
    if ( !this.selected ){
      await this.connect();
    }
    return this.selected!.sendTransaction(destinationPubkey, sols) ;
  }
  
}
