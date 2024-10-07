
const http = require('http')
const fs = require('fs/promises')
const { v4: uuidv4 } = require('uuid')

const servidor = http.createServer(async (req, res) => {
    const { searchParams, pathname } = new URL(req.url, `http://${req.headers.host}`)
    const params = new URLSearchParams(searchParams)

    if (pathname == '/anime' && req.method == 'GET') {

        try {
            const lecturaArchivo = await fs.readFile('anime.json')
            res.statusCode = 200
            res.write(lecturaArchivo)
            res.end()

        } catch (error) {
            res.write("Ha ocurrido un error al obtener los datos", error)
        }
    }

    if (pathname == '/anime' && req.method == 'POST') {

        try {
            const archivoOriginal = await fs.readFile('anime.json');
            const datosOriginales = JSON.parse(archivoOriginal);
            const id = uuidv4()
            let datosAnimes;

            req.on('data', (data) => {
                datosAnimes = JSON.parse(data)
            })
            req.on('end', async () => {
                datosOriginales[id] = datosAnimes;
                await fs.writeFile('anime.json', JSON.stringify(datosOriginales, null, 2))
                res.write("Anime agregado correctamente")
                res.end()
            
            })
        } catch (error) {
            res.write("No se ha podido crear el nuevo anime", error)
            res.end()
        }
    }

    if (pathname == '/anime' && req.method == 'PUT') {
        const id = params.get('id')
        try {
            const datosArchivo = await fs.readFile('anime.json');
            const objetoAnimesOriginal = JSON.parse(datosArchivo)

            let datosModificar
            req.on('data', (datos) => {
                datosModificar = JSON.parse(datos);
            })

            req.on('end', async () => {
                const animeOriginal = objetoAnimesOriginal[id]
                const animeActualizado = { ...animeOriginal, ...datosModificar }

                objetoAnimesOriginal[id] = animeActualizado

                await fs.writeFile('anime.json', JSON.stringify(objetoAnimesOriginal, null, 2))

                res.write("Datos modificados correctamente")
                res.end()
            })
        } catch (error) {
            res.write("Hubo un error en la petición para modificar", error)
            res.end()
        }
    }

    if (pathname == '/anime' && req.method == 'DELETE') {

        try {
            const animesOriginales = await fs.readFile('anime.json')
            const objetoAnimesOriginales = JSON.parse(animesOriginales)
            const id = params.get('id');
            delete objetoAnimesOriginales[id]

            await fs.writeFile('anime.json', JSON.stringify(objetoAnimesOriginales, null, 2));

            res.write("El anime se ha sido eliminado");
            res.end()
        } catch (error) {
            res.write("Hubo un error en la petición para eliminar", error)
            res.end()
        }
    }
   
    //  else {    (pathname == '/' && req.method == 'GET')
    //        res.write("No existe la ruta consultada")
    //        res.end()
        
    // }
})
   servidor.listen(8000, function () {
        console.log("Servidor iniciado en el puerto 8000")
    })

    module.exports = { servidor }