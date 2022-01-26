import { 
    Connection,
    clusterApiUrl,
    Cluster,
    PublicKey
}from "@solana/web3.js" ;

export class Wallet {

    static solanaConnection : Connection | null = null ;
    static cluster : Cluster = "devnet" ;
    static provider : any = null ;
    publicKey : PublicKey | null = null ;
    installed = false ;
    icon : string = "" ;
    name : string = "" ;

    constructor(){}

    async connect(){
        if ( !Wallet.solanaConnection ){
            Wallet.solanaConnection = new Connection(clusterApiUrl(Wallet.cluster)) ;
        }
        return true ;
    }
    async disconnect(){
        return true ;
    }
    async signMessage(message : string ) : Promise<string | null | undefined>{
        return null ;
    }
    async sendTransaction( destinationPublickKey : string, sol : number ) : Promise<string | undefined | null > {
        return null ;
    }

}