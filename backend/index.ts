import { IJoke } from "./models/IJoke";
import path from "path";
import fs from "fs";
import http from "http";
import url from "url";

const ENCODING = 'utf-8';
const PORT = process.env.PORT || 3000;

const server = http.createServer(async(request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');

    if(request.url === '/api/jokes' && request.method === 'POST'){
        let data = '';
        request.on('data', function (chunk){
            data += chunk;
        });
        request.on('end', function (){
            addJoke(data);
        });
        response.writeHead(200);
        response.end();
    }
    else if(request.url === '/api/jokes' && request.method === 'GET'){
        getJokes()
            .then((allJokes) => {
                response.writeHead(200, { "Content-type": "text/json" });
                response.end(JSON.stringify(allJokes));
            })
            .catch((error) => {
                console.error(error);
                response.writeHead(500);
                response.end();
            });
    }
});

server.listen(PORT);

function readdirAsync(path: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function readFileAsync(path: string, encoding: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(path, ENCODING, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

async function getJokes(): Promise<IJoke[]> {
    try {
        let arrayJokes: IJoke[] = [];
        let dataPath = path.join(__dirname, "data");
        let data = await readdirAsync(dataPath);

        for (let i = 0; i < data.length; i++) {
            let pathToFile = path.join(dataPath, `${i}.json`);
            let jokeString = await readFileAsync(pathToFile, "utf-8");
            let joke: IJoke = JSON.parse(jokeString);
            arrayJokes = [...arrayJokes, joke];
        }

        return arrayJokes;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


async function addJoke(jokeFile: string) {
    try {
        let joke = JSON.parse(jokeFile);
        let dataPath = path.join(__dirname, "data");
        let data = path.join(dataPath, `${fs.readdirSync(dataPath).length}.json`);
        joke.likes = 0;
        joke.dislikes = 0;

        await new Promise<void>((resolve, reject) => {
            fs.writeFile(data, JSON.stringify(joke), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

function addLike() {
    
}

// {
//     "compilerOptions": {
//       "module": "es2020",
//       "moduleResolution": "node",
//       "outDir": "./dist",
//       "target": "es6",
//       "esModuleInterop": true
//     }
// }