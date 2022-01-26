# SolWallets
## Angular library for Web Wallets on Solana Blockchain

<em>
<h3> news on 0.0.6
<br>Add signMessage function
<br>Update readme
</h3>
</em>
<br>
<p>
Version 0.0.5 <strong>only Phantom is implemented</strong> 
<br>
This library was generated with <a href= "https://github.com/angular/angular-cli">Angular CLI</a> version 12.1.0.
</p>

## DESCRIPTION

<p>
Provide a service for using easily wallets on your web Angular project:
<br><em>basic async functions:</em>
<br>

<span style="color:lightBlue"> 
connect() => Wallet Object
<br>
disconnect() => boolean
<br>
signMessage( message : string) => signature (as string)
<br>
sendTransaction( address : string, sols : number) => signature (as string)
</span>
</p>

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
<strong style="color : white">import { SolWalletsModule } from 'sol-wallets';</strong>

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

### 3- use **SolWalletService** in a component

Example in the appComponent:
<br>*the functions in the component are called buy a click event in the html template*

<pre style="color : gray" >
import { Component } from '@angular/core';
<span style="color:white">import { SolWalletsService, Wallet } from "sol-wallets" ;</span>

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    <span style="color:white">private solWalletS : SolWalletsService</span>
    ){}

  connect(){
    <span style="color:white">this.solWalletS.connectWallet().then( wallet => {
      console.log("Wallet connected successfully with this address:", wallet.publicKey);
    }).catch(err => {
      console.log("Error connecting wallet", err );
    })</span>
  }
  disconnect(){
    <span style="color:white">this.solWalletS.disconnectWallet();</span>
  }
  signMessage(){
     <span style="color:white">this.solWalletS.signMessage("HELLO WORLD!").then( signature => {
      console.log('Message signed:', signature);
    }).catch( err => {
      console.log('err transaction', err );
    })</span>
  }
  sendTransactinon(){
    <span style="color:white">this.solWalletS.sendTransactinon("FfYeVASAm2nDzcC5ckorecT1u8ybFwrCZnMi8sXrtf3P", 0.01 ).then( signature => {
      console.log('Transaction successfully opered:', signature);
    }).catch( err => {
      console.log('Error transaction', err );
    });</span>
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
