# SolWallets
## Angular library for Web Wallets on Solana Blockchain

<p>
Version 0.0.1 <strong>only Phantom is implemented</strong> 
<br>
This library was generated with <a href= "https://github.com/angular/angular-cli">Angular CLI</a> version 12.1.0.
</p>

<p>
Provide a service for using easily wallets on your web Angular project:
<br><em>basic async functions:</em>
<br>

<span style="color:lightBlue"> 
connect()
<br>
disconnect()
<br>
sendTransaction( address : string, sols : number)
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

<pre>npm i --save sol-wallets</pre>

<p>
If needed, install the peer dependencies

<pre>npm i --save @solana/web3.js</pre>

You may have to add the global variable in *prolyfills.ts* file 

<pre>
/***************************************************************************************************
 * APPLICATION IMPORTS
 */
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
<span style="color:lightGray">
export class AppComponent {
  constructor(
    <span style="color:white">private solWalletS : SolWalletsService</span>
    ){}

  connect(){
    <span style="color:white">this.solWalletS.connectWallet().then( wallet => {
      console.log("Wallet connected successfully.");
      console.log("public address is", wallet.publicKey );
    }).catch(err => {
        console.log("Error connecting wallet", err );
    })</span>
  }
  disconnect(){
    <span style="color:white">this.solWalletS.disconnectWallet();</span>
  }
  send(){
    <span style="color:white">this.solWalletS.sendTransactinon("FfYeVASAm2nDzcC5ckorecT1u8ybFwrCZnMi8sXrtf3P", 0.01 ).then( signature => {
      //the signature of the confirmed transaction
    }).catch( err => {
      console.log('Error transaction', err );
    });</span>
  }
</span>
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
