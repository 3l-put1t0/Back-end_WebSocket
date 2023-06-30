import { Server } from "socket.io";
import ControlFileManager from "./controlData/controlFIleManager.js";

export class WebSocket{
    
    FILE_NAME_PRODUCTS = 'products.json'
    PATH = './FILES';
    
    ControlFileManagerProducts = new ControlFileManager(this.FILE_NAME_PRODUCTS, this.PATH);

    constructor(server){
        this.io = new Server(server); 
        this.data = this.ControlFileManagerProducts.getProducts();
    }    

    generateConnection(){
        this.io.on('connect', socket =>{
            console.log('Se establecio coneción con un webSocket');
            this.io.emit('products', this.data);
            
        });

        return this.io;
    }
 
}