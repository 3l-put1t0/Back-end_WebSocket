import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./src/utils.js";
import { WebSocket } from "./src/webSocket.js";
import { Server } from "socket.io";
import ControlFileManager from "./src/controlData/controlFIleManager.js";

import viewRouter from "./src/routers/view.router.js";

const app = express();

const PORT = 8080;

const FILE_NAME_PRODUCTS = 'products.json'
const PATH = './FILES';
const controlFileManagerProducts = new ControlFileManager(FILE_NAME_PRODUCTS, PATH);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));


//  Accede a la vista realTimeProducts
app.get('/api/realtimeproducts', (req, res) => {
    const data = controlFileManagerProducts.getProducts();
    res.status(201).render('realTimeProducts', {});

    io.on('connect', socket =>{
        console.log('Connect client');
        socket.emit('products', data);
         
    });
});

//  Eliminar productos
app.delete('/api/realtimeproducts/:pid', (req, res) => {
    const { pid } = req.params;
    const exist = controlFileManagerProducts.deleteProducts(pid);
    exist ? res.status(201).json({message: 'success', result: `se elimino producto  con ID ${pid}`}) : res.status(401).json({message: 'error', result: `No existe el id: ${pid} registrado`});
    const data = controlFileManagerProducts.getProducts();
    io.emit('products', data);
});

//  Eliminar productos
app.post('/api/realtimeproducts', (req, res) => {
    const { title, description, code,  price, status, stock, category, thumbnails } = req.body;
    if (!title || !description || !price || !category) res.status(401).json({message: 'error', result: `No registro todos los valores`})
    const obj = { title, description, code,  price, status, stock, category, thumbnails };
    controlFileManagerProducts.createProduct(obj);
    res.status(201).json({message: 'success', result: `se añadio producto`});
    const data = controlFileManagerProducts.getProducts();
    io.emit('products', data);
});

//  Reescribe el archivo products.json con data estupulada en el código
app.post('/api/writeProducts', (req, res) =>{
    const { write } = req.body;
    if (!write === true) return res.status(401).json({message: 'error', result: 'Enviar el dato correcto'});
    controlFileManagerProducts.rewriteFileProducts(write);
    res.status(201).json({message: 'success', result: 'se reescribio el archivo correctamente'});
});


// app.use('/api', viewRouter);

const server = app.listen(PORT, console.log(`LISTENING PORT ${PORT}`));

// const webSocketPersonal = new WebSocket(server);
// const io = webSocketPersonal.generateConnection();
const io = new Server(server);






