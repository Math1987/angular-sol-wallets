# Angular Sol Wallets
## Library for Web Wallets on Solana Blockchain

<em>
<p> news on 0.0.19
  <ul>
    <li style="color:darkred">fix: launch wallets only when ask connection</li>
    <li style="color:darkgreen">feat: setEnabledWallets: choose all wallets you want to use. if there is only one wallet enabled, popup will not be displayed.</li>
  </ul>
</em>
</p>
<p>
<br>
This library was generated with <a href= "https://github.com/angular/angular-cli">Angular CLI</a> version 12.1.0.
</p>

## DESCRIPTION

<h3>
Provide a service for using easily wallets on your web Angular project:

![alt text](screenshoot.png)

<br><em>overview of all features:</em>
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
signAndSendTransfer( address : string, sols : number, signedByUser? : CallableFunction ) => signature (as string) 
<br>
signTransaction( transaction : Transaction ) => signature (as string) => signature (as string)
<br>
<br>
setCluster( cluster : Cluster ) <em>default = "devnet"</em>
<br>
setCommitment( commitment : Commitment ) <em>default = "finalized"</em>
<br>
setEnabledWallets( wallets : AvalableWallets[] )
<br>
getPublicKey() => PublicKey
<br><br>
autoConnect : boolean

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
    <span style="color:white">this.solWalletS.signTransfer(myCompanyPublicKey, solAmmount, signedByUserCallback => {
        //Do something like puting a loading popup during solana's transfer verification
    }).then( buffer => {
        this.httpClient.post('https://myserver.io/myAPI/makeTransfer', { transferRow : buffer }).subscribe( res => {
          console.log('Transfer successfully opered:', res.signature);
        });
    }).catch( err => {
      console.log('Error transaction', err );
    });</span>
    httpClient
  }
</pre>

### 4- options / parameters
<borld>Autoconnect:</bold>
<br>Set autoconnect as true on WalletsService make the last wallet used by the client automatically re-connected
<br>(this avoid the user to have to choose again a wallet when making actions with service)
<br>Example of usage in the App constructor :
<pre><code>
  constructor(
    private solWalletS : SolWalletsService
    ){
      this.solWalletS.autoConnect = true ;
      this.solWalletS.wallet.subscribe( wallet => {
        console.log('the last wallet used by the client is automatically connected without any actions.' );
      })
  }
</code></pre>

<borld>SetEnabledWallets:</bold>
<br>Choose the wallets you want to use.
<br>By default all the wallets are enabled.
<pre><code>
  constructor(
    private solWalletS : SolWalletsService
    ){
      this.solWalletS.setEnabledWallets(["Phantom"]);
  }
</code></pre>


### 5- customize 
You can customize the style of the popup, like so: 
<br>
![alt text](screenshoot-custom.png)
<br>
<pre>
  constructor(
    private solWalletS : SolWalletsService
    ){
      this.solWalletS.setCustomClasses({ 
        background : "myBcg",
        card : "myCard",
        wallets : "myWallets"
      });
</pre>
<br>
the css: 
<pre>
.myCard{
    font-family: Impact ;
    background-color: darkblue ;
    border : 1px solid black ;
    border-radius: 3px ;    
    color : white ;
    padding : 5px ;
    min-width: 200px ;
}
.myWallets{
    display : flex ;
    flex-flow: row nowrap ;
    background-color: lightblue ;
    border : 1px solid black ;
    border-radius: 3px ;
    margin : 3px ;
    padding : 3px ;
    align-items : center ;
    justify-content: center ;
    cursor : pointer ;
    transition : 0.5s ;
}
.myWallets:hover{
    transform : scale(1.05,1.05);
}
.myBcg{
    background-color: rgba(255,255,255,0.75) !important ;
}
</pre>


### 6- production
sol-wallet use **devnet** Cluster by default
In production you can use the **mainnet-beta** like this exemple in the appComponent:
<pre>
  constructor(
    private solWalletS : SolWalletsService
    ){
      solWalletS.setCluster("mainnet-beta");
</pre>
