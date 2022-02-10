import { Wallet } from "./wallet";
import { 
    PublicKey,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL
} from "@solana/web3.js"

import * as bs58 from "bs58" ;

import * as web3 from "@solana/web3.js" ;

export class SolflareWallet extends Wallet {

    constructor(){
        super();
        this.icon = 'https://lh3.googleusercontent.com/uKZnhWrko3Chg3GkcqPZdj7RqfY0_toJ6s7JLWVMvBFb63pICmRYRsURzknIyuN0MeVlBSdTzNMm72zx0nh7-gJp1w=w128-h128-e365-rj-sc0x00ffffff';
        this.name = "Solflare" ;
        //@ts-ignore
        if ( window.solflare &&window.solflare?.isSolflare ){
            this.installed = true ;
            localStorage.setItem('solfare', "installed");
        }else if ( localStorage.getItem('solfare') ){
            this.installed = true ;
        }
    }
    async connect() : Promise<Wallet> {
        await super.connect();
        //@ts-ignore
        if ( Wallet.provider !== null || Wallet.provider !== window.solflare ){
            //@ts-ignore
            await window.solflare.connect();
            //@ts-ignore
            if ( window.solflare.publicKey ){
                //@ts-ignore
                this.provider = window.solflare ;
                //@ts-ignore
                this.publicKey = new PublicKey(this.provider.publicKey) ;
            }
        }
        return this ;
    }
    


    async signTransfer(destinationPubkey: string, sol: number): Promise<Transaction> {
        const payerPubKey = this.publicKey ;
        const destinationPubKey = new PublicKey(destinationPubkey) ;
        const transaction = new Transaction();
        transaction.add( SystemProgram.transfer({
          fromPubkey : payerPubKey!,
          toPubkey : destinationPubKey,
          lamports : sol*LAMPORTS_PER_SOL
        }));
        const blockhash = await Wallet.solanaConnection?.getRecentBlockhash();
        transaction.recentBlockhash = blockhash!.blockhash ;
        transaction.feePayer = payerPubKey! ;
        //@ts-ignore
        const nt = await this.provider.signTransaction(transaction) ;
        return nt ;
    }

    /**
     * depreciated
     * @param destinationPublickKey 
     * @param sol 
     * @returns 
     */
    async sendTransaction( destinationPublickKey : string, sol : number ){

        const payerPubKey = this.publicKey ;
        const destinationPubKey = new PublicKey(destinationPublickKey) ;
    
        // const senderAccountInfo = await Wallet.solanaConnection?.getAccountInfo(payerPubKey!);
        // const receiverAccountInfo = await Wallet.solanaConnection?.getAccountInfo(destinationPubKey);
    
        const transaction = new Transaction();
        transaction.add( SystemProgram.transfer({
          fromPubkey : payerPubKey!,
          toPubkey : destinationPubKey,
          lamports : sol*LAMPORTS_PER_SOL
        }));
    
        const blockhash = await Wallet.solanaConnection?.getRecentBlockhash();
        transaction.recentBlockhash = blockhash!.blockhash ;
        transaction.feePayer = payerPubKey! ;
    
        //@ts-ignore
        const transactionSigned = await this.provider.signTransaction(transaction) ;
        let signature = await Wallet.solanaConnection?.sendRawTransaction(transactionSigned.serialize());
        let result = await Wallet.solanaConnection?.confirmTransaction(signature!, "singleGossip" )! ;
        return signature ;

    }
    async signMessage(message : string ){
        const encodedMessage = new TextEncoder().encode(message);
        //@ts-ignore
        const signedMessage = await this.provider.signMessage(encodedMessage, "utf8");
        const signature = bs58.encode(signedMessage.signature) ;
        return signature ;
    }


}