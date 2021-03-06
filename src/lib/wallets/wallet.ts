import { 
    Connection,
    clusterApiUrl,
    Cluster,
    PublicKey,
    Transaction,
    Commitment,
    Blockhash
}from "@solana/web3.js" ;

export type AvalableWallets = "Phantom" | "Solflare" ;

export class Wallet {

    static solanaConnection : Connection | null = null ;
    static cluster : Cluster = "devnet" ;
    static commitment : Commitment = "finalized" ;
    static provider : any = null ;
    publicKey : PublicKey | null = null ;
    installed = false ;
    connected = false ;
    icon : string = "" ;
    name : string = "" ;

    constructor(){}

    async connect() : Promise<Wallet> {
        if ( !Wallet.solanaConnection )            
        Wallet.solanaConnection = new Connection(clusterApiUrl(Wallet.cluster)) ;
        return this ;
    }
    async disconnect(): Promise<boolean> {
        if ( Wallet.provider ){
            Wallet.provider.disconnect();
            this.connected = false ;
        }
        return true ;
    }
    async signMessage(message : string ) : Promise<string | null | undefined>{
        throw Error( "No wallet.")
    }

    async signTransfer( destinationPubkey: string, sols : number ): Promise<Transaction> {
        throw Error( "No wallet.")
    }
    async signTransaction( transaction : Transaction ): Promise<Transaction> {
        //@ts-ignore
        const nt = await this.provider.signTransaction(transaction) ;
        return nt ;
    }

    protected async sendTransfer( transaction : Transaction ): Promise<string> {
        return await Wallet.solanaConnection!.sendRawTransaction(transaction.serialize());
    }

    async signAndSendTransfer( destinationPubkey: string, sols : number, signedCallBack? : CallableFunction ) : Promise<string> {
        await this.connect();
        const transaction = await this.signTransfer(destinationPubkey, sols);
        if (signedCallBack){
            signedCallBack(transaction);
        }
        const signature = await this.sendTransfer(transaction);
        await Wallet.solanaConnection?.confirmTransaction(signature!, Wallet.commitment )! ;
        return signature ;
    }


    async sendTransaction( destinationPublickKey : string, sol : number ) : Promise<string | undefined | null > {
        return null ;
    }

}