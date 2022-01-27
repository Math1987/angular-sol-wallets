# Angular Sol Wallets
## Angular library for Web Wallets on Solana Blockchain

<em>
<h2> news on 0.0.10<h2>

  <ul>
    <li style="color:darkgreen">Add <strong>signTransfer</strong> function to send a buffer on the server if you prefer to make the transfer from your server</li>
    <li>Auto-connection to the wallet if not yet connected when using transfer method or other</li>
    <li>Add comments & update readme </li>
    <li style="color:darkred">Depreciate <em>sendTransaction</em>, use <em>signAndSendTransfer</em> instead</li>
  </ul>

</em>

<p>
<strong>Only Phantom is implemented</strong> 
<br>
This library was generated with <a href= "https://github.com/angular/angular-cli">Angular CLI</a> version 12.1.0.
</p>

## DESCRIPTION
<h3>
Provide a service for using easily wallets on your web Angular project:
<br><em>overview of all (async) functions:</em>
<br>
</h3>
<br>
<p>
<span style="color:lightBlue"> 
connect() => Wallet Object
<br>
disconnect() => boolean
<br>
signMessage( message : string) => signature (as string)
<br>
signTransfer( address : string, sols : number) => Buffer
<br>
signAndSendTransfer( address : string, sols : number) => signature (as string)
</span>
</p>
<br>
<h2>
USAGE
</h2>

### 1- Install the library
<p>
Open terminal in your Angular project root folder and run: 
<br>
</p>

<pre>npm i --save angular-sol-wallets</pre>

<p>
If needed, install the peer dependencies

<pre>npm i --save @solana/web3.js</pre>

You may have to add the global variable in *prolyfills.ts* file 

<pre>
 (window as any)['global'] = window;
</pre>

And add the following allowedCommonJsDependencies in the angular.json **build options** file to disable warnings

<pre>
  "allowedCommonJsDependencies": [
    "@solana/buffer-layout",
    "borsh",
    "bs58",
    "buffer",
    "jayson/lib/client/browser",
    "rpc-websockets",
    "secp256k1",
    "tweetnacl"
  ]
</pre>

### 2- import the module
<p>
Example in the AppModule:
<br>
</p>

<pre style="color : gray">
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
<strong style="color : white">import { SolWalletsModule } from 'angular-sol-wallets';</strong>

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
declarations: [
    AppComponent
],
<span style="color:lightgray">
imports: [
    BrowserModule,
    AppRoutingModule,
    <strong style="color : white">SolWalletsModule</strong>
],
</span>
</pre>

### 3- use **SolWalletsService** in a component

Example in the appComponent:
<br>*the functions in the component are called buy a click event in the html template*

<pre style="color : gray" >...
<span style="color:white">import { SolWalletsService, Wallet } from "angular-sol-wallets" ;</span>
...
export class AppComponent {
  constructor(
    private httpClient : HttpClient,
    <span style="color:white">private solWalletS : SolWalletsService</span>
    ){}

  connect(){
    <span style="color:white">this.solWalletS.connect().then( wallet => {
      console.log("Wallet connected successfully with this address:", wallet.publicKey);
    }).catch(err => {
      console.log("Error connecting wallet", err );
    })</span>
  }
  disconnect(){
    <span style="color:white">this.solWalletS.disconnect();</span>
  }
  signMessage(){
     <span style="color:white">this.solWalletS.signMessage("HELLO WORLD!").then( signature => {
      console.log('Message signed:', signature);
    }).catch( err => {
      console.log('err transaction', err );
    })</span>
  }
  makeATransfer( myCompanyPublicKey : string, solAmmount : number){
    <span style="color:white">this.solWalletS.signAndSendTransfer(myCompanyPublicKey, solAmmount ).then( signature => {
      console.log('Transfer successfully opered:', signature);
    }).catch( err => {
      console.log('Error transaction', err );
    });</span>
  }
  sendTransferToServer( myCompanyPublicKey : string, solAmmount : number){
    <span style="color:white">this.solWalletS.signTransfer(myCompanyPublicKey, solAmmount ).then( buffer => {
        this.httpClient.post('https://myserver.io/myAPI/makeTransfer', { transferRow : buffer }).subscribe( res => {
          console.log('Transfer successfully opered:', res.signature);
        });
    }).catch( err => {
      console.log('Error transaction', err );
    });</span>
    httpClient
  }
</pre>



### 4- production
sol-wallet use **devnet** Cluster by default
In production you can use the **mainnet-beta** like this exemple in the appComponent:
<pre>
  constructor(
    private solWalletS : SolWalletsService
    ){
      solWalletS.setCluster("mainnet-beta");
</pre>
