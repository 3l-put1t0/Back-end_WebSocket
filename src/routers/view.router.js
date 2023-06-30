import { Router } from "express";
import ControlFileManager from "../controlData/controlFIleManager.js";
import { Server } from "socket.io";

const router = Router();

const FILE_NAME_PRODUCTS = 'products.json'
const FILE_NAME_CARTS = 'carts.json'
const PATH = './FILES';
const controlFileManagerProducts = new ControlFileManager(FILE_NAME_PRODUCTS, PATH);
const controlFileManagerCarts = new ControlFileManager(FILE_NAME_CARTS, PATH);

//  Accede a la vista HOME
router.get('/home', (req, res) => {
    const products = controlFileManagerProducts.getProducts();
    const contador = 0;
    const data = { products, contador }
    res.status(201).render('home', data);
});
//  Accede a la vista realTimeProducts
router.get('/realtimeproducts', (req, res) => {
    res.status(201).render('realTimeProducts', {});
});

//  Eliminar productos
router.delete('/realtimeproducts/:pid', (req, res) => {
    const { pid } = req.params;
    const exist = controlFileManagerProducts.deleteProducts(pid);
    exist ? res.status(201).json({message: 'success', result: `se elimino producto  con ID ${pid}`}) : res.status(401).json({message: 'error', result: `No existe el id: ${pid} registrado`});
    const data = controlFileManagerProducts.getProducts();
    
});

//  Reescribe el archivo products.json con data estupulada en el código
router.post('/writeProducts', (req, res) =>{
    const { write } = req.body;
    if (!write === true) return res.status(401).json({message: 'error', result: 'Enviar el dato correcto'});
    controlFileManagerProducts.rewriteFileProducts(write);
    res.status(201).json({message: 'success', result: 'se reescribio el archivo correctamente'});
});
//  Reescribe el archivo carts.json con data estupulada en el código
router.post('/writeCarts', (req, res) =>{
    const { write } = req.body;
    if (!write === true) return res.status(401).json({message: 'error', result: 'Enviar el dato correcto'});
    controlFileManagerCarts.rewriteFileCarts(write);
    res.status(201).json({message: 'success', result: 'se reescribio el archivo correctamente'});
});

export default router;