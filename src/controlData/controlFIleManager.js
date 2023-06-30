import fs from "fs";
import { dataProduct  } from "../controlData/data/dataProduct.js";
import { dataCarts } from "../controlData/data/dataCarts.js";

const objsProducts = [...dataProduct];
const objsCarts = [...dataCarts];

export default class ControlFileManager{
    
    constructor(nameFile, path){
        this.nameFile = nameFile;
        this.pathRoot = path;
        this.path = `${path}/${nameFile}`;
    }

      // Consulta todos los productos guardados en el archivo
    getProducts() {
        const data = this.readFile(this.path);
        return data;
    }//End getProducts

    // Consulta sólo un producto según su ID
    getProductID(id){
        const data = this.readFile(this.path);
        const obj = data.find(o => o.id == id);
        if (obj) return obj;
        else return false;
        
    }//End getProductsID

    // Devuelve un número determinado de productos
    getProductsLimit(limit){
        const data = this.readFile(this.path);
        if (limit > data.length || limit == 0) limit = data.length;
        if (limit < 0 ) limit = 1; 
        const objs = data.slice(0, limit);
        return objs;
    }//End getProductsLimit

    //Agrega un nuevo objeto al archivo de tipo JSON
    createProduct(obj){
        let newId = 0;
        const objProducts = this.readFile(this.path);
        newId = objProducts.length + 1;
        const {title, description, code, price, status, stock, category, thumbnails} = obj;
        const newObj = {
            id: newId,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        };
        objProducts.push(newObj);
        this.writeFile(this.path, objProducts);
    }// End createProducts

    //Elimina algún producto de archivo JSON
    deleteProducts(id){
        const data = this.readFile(this.path);
        const obj = data.find(u => u.id == id);
        if (Boolean(obj)){

            const position = data.indexOf(obj);

            if(position == 0 || position == data.length){
                position == 0 ? data.shift() : data.pop();
                this.writeFile(this.path, data);
            }else{
                const obj_1 = data.slice(0, position);
                const obj_2 = data.slice(position+1, data.length);
                const newObj = obj_1.concat(obj_2);
                this.writeFile(this.path, newObj);
            }
            return true;
        }else {
            console.log("No existe el ID del producto")
            return false;
        }
    }

    // Actualiza la información del archivo JSON
    updateProducts(id, obj){
        const {title, description, code, price, status, stock, category, thumbnails} = obj;
        id < 0 ? id = 0 : id;
        const objProducts = this.readFile(this.path);
        const objProduct = objProducts.find(u => u.id == id);
        const { id: _id, 
                title: _title, 
                description: _description, 
                code: _code,
                price: _price, 
                status: _status,
                stock: _stock,
                category: _category,
                thumbnails: _thumbnails} = objProduct;
        const position = objProducts.indexOf(objProduct);

        const objUpdate = {
            id: _id,
            title: Boolean(title) ? title :_title,
            description: Boolean(description) ? description : _description,
            code: Boolean(code) ? code : _code,
            price: Boolean(price) ? Number(price) : Number(_price),
            status:  status === _status ? _status : status,
            stock: Boolean(stock) ? Number(stock) : Number(_stock),
            category: Boolean(category) ? category : _category,
            thumbnails: thumbnails.length > 0 ? thumbnails : _thumbnails
        } 
        objProducts.splice(position, 1, objUpdate)
        this.writeFile(this.path, objProducts);

    }//End updateProducts

    //Agrega un nuevo objeto al archivo de tipo JSON
    createCarts(obj){
        let newId = 0;
        const objCarts = this.readFile(this.path);
        newId = objCarts.length + 1;
        const {products} = obj;
        const newObj = {
            id: newId,
            products
        };
        objCarts.push(newObj);
        this.writeFile(this.path, objCarts);
    }// End createProducts

    // Busca los nombres de los productos con base a los idps de los productos
    //  anidados en el carrito
    findProductID(objSelect){
        const data = this.readFile(`${this.pathRoot}/products.json`);
        const showProduct = []
        objSelect.forEach(element => {
            const {product, quantity} = element;
            const dataProduct = data.find(el => el.id == product);
            const {id, title} = dataProduct;
            const characterProduts = {id, title, quantity};
            showProduct.push(characterProduts);
        });
        return showProduct;
    }//End findProduct

    // Busca en el archivo de carrito el id correspondiente para añadir productos
    addProductsCartID(cid, pid){
        const dataCarts = this.readFile(`${this.pathRoot}/carts.json`);
        const _dataCart = dataCarts.find(el => el.id == cid);
        const existProd = _dataCart.products.findIndex(el => el.product == pid);
        let _quantity = 0;
        if (existProd == -1) {
            const product = Number(pid);
            const quantity =  _quantity + 1;
            const newProd = {product, quantity}; 
            _dataCart.products.push(newProd);
        }else {
            const _dataProduct = _dataCart.products.find(el => el.product == pid);
            const {product, quantity: _c} = _dataProduct;
            const quantity = _c + 1;
            const updateProd = {product, quantity};
            _dataCart.products.splice(existProd, 1 ,updateProd);
        }
        this.writeFile(this.path, dataCarts);        
    }//End addProductsCartID

    //Escribe el archivo desde el servicio web
    rewriteFileProducts(write){
        console.log('rewrite ', this.nameFile);
        console.log('rewrite ', this.path);
        if (write === true) this.writeFile(this.path, objsProducts);
        else return 'Error al reescribir el archivo';
    }

     //Escribe el archivo desde el servicio web
     rewriteFileCarts(write){
        console.log('rewrite ', this.nameFile);
        console.log('rewrite ', this.path);
        if (write === true) this.writeFile(this.path, objsCarts);
        else return 'Error al reescribir el archivo';
    }

    // Escribe el archivo tipo JSON con la información indicada y lo guarda en la ruta indicada
    writeFile(path, data) {
        fs.writeFileSync(path, JSON.stringify(data), (er) => {
            er ? console.log('Error al escribir el archivo: ', er) : console.log('Se escribio el archivo');
        });
    }//END Metodo writeFile

    // Lee el archivo tipo JSON en la ruta indicada 
    readFile(path){
        try{
            const dataJSON = fs.readFileSync(path, "utf-8");
            const data = JSON.parse(dataJSON);
            console.log(`Se leyó el archivo ${this.nameFile}`);
            return data;
        }catch(er){
            console.log(`No se pudo leer el archivo ${this.nameFile}`, er);
        }
    }//END METODO readFile


}
