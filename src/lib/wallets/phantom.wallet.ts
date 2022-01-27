import { Wallet } from "./wallet";
import { 
    PublicKey,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL
} from "@solana/web3.js"

export class PhantomWallet extends Wallet {

    constructor(){
        super();
        this.icon = "https://gblobscdn.gitbook.com/spaces%2F-MVOiF6Zqit57q_hxJYp%2Favatar-1615495356537.png?alt=media" ;
        this.name = "Phantom" ;
        //@ts-ignore
        if ( window.solana && window.solana.isPhantom ){
            this.installed = true ;
        }else if ( localStorage.getItem('phantom') ){
            this.installed = true ;
        }
    }
    async connect() : Promise<Wallet> {
        await super.connect();
        //@ts-ignore
        await window.solana.connect();
        //@ts-ignore
        if ( window.solana.publicKey ){
            //@ts-ignore
            this.provider = window.solana ;
            //@ts-ignore
            this.publicKey = new PublicKey(this.provider.publicKey) ;
        }
        return this ;
    }
    
    async disconnect(): Promise<boolean> {
        //@ts-ignore
        await this.provider.disconnect();
        return true ;
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
        console.log(nt) ;
        return nt ;
    }
    protected async sendTransfer( transaction : Transaction ): Promise<string> {
        return await Wallet.solanaConnection!.sendRawTransaction(transaction.serialize());
    }

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
        const signedMessage = await this.provider.request({
            method : "signMessage",
            params : {
                message : encodedMessage
            }
        });
        return signedMessage.signature ;
    }


}