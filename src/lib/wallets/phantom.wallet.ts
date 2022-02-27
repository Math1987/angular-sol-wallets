import { Wallet } from "./wallet";
import { 
    PublicKey,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL
} from "@solana/web3.js"

export class PhantomWallet extends Wallet {

    static async create(){

        const phantomWallet = new PhantomWallet();
        //@ts-ignore
        if ( window.solana && window.solana.isPhantom ){
            
            phantomWallet.installed = true ;
            localStorage.setItem('phantom', "installed");


        }else if ( localStorage.getItem('phantom') ){
            phantomWallet.installed = true ;
        }
        return phantomWallet ;

    }

    
    constructor(){
        super();
        this.icon = "https://gblobscdn.gitbook.com/spaces%2F-MVOiF6Zqit57q_hxJYp%2Favatar-1615495356537.png?alt=media" ;
        this.name = "Phantom" ;
    }
    private stakeConnection(){
        //@ts-ignore
        this.provider = window.solana ;
        //@ts-ignore
        this.publicKey = new PublicKey(this.provider.publicKey) ;
        this.connected = true ;
    } 
    async connect() : Promise<Wallet> {
        await super.connect();

        try{
            //@ts-ignore
            await window.solana.connect({ onlyIfTrusted : true });
            this.stakeConnection();

        }catch(e){

        }

        //@ts-ignore
        if ( Wallet.provider !== null || Wallet.provider !== window.solana ){
            //@ts-ignore
            await window.solana.connect();
            this.stakeConnection();
        }
        return this ;
    }
    async disconnect(){
        //@ts-ignore
        await window.solana.request({ method: "disconnect" });
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
        const signedMessage = await this.provider.request({
            method : "signMessage",
            params : {
                message : encodedMessage
            }
        });
        return signedMessage.signature ;
    }


}