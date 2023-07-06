import { IJoke } from './models/IJoke';
import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';

const ENCODING = 'utf-8';
const PORT = process.env.PORT || 3000;

const server = http.createServer(async (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (request.method === 'OPTIONS') {
        response.writeHead(200);
        response.end();
        return;
    }

    if (request.url === '/api/jokes' && request.method === 'POST') {
        let data = '';
        request.on('data', function (chunk) {
            data += chunk;
        });
        request.on('end', async function () {
            const joke = await addJoke(data);
            response.writeHead(200);
            response.end(JSON.stringify(joke));
        });
    } else if (request.url === '/api/jokes' && request.method === 'GET') {
        getJokes()
            .then((allJokes) => {
                response.writeHead(200, { 'Content-type': 'text/json' });
                response.end(JSON.stringify(allJokes));
            })
            .catch((error) => {
                console.error(error);
                response.writeHead(500);
                response.end();
            });
    } else if (request.url?.startsWith('/api/like') && request.method === 'PUT') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: any = url.parse(request.url, true).query;
        if (await addLikesOrDislikes(params, true)) {
            response.writeHead(200);
            response.end();
        } else {
            response.writeHead(400);
            response.end();
        }
    } else if (request.url?.startsWith('/api/dislike') && request.method === 'PUT') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: any = url.parse(request.url, true).query;
        if (await addLikesOrDislikes(params, false)) {
            response.writeHead(200);
            response.end();
        } else {
            response.writeHead(400);
            response.end();
        }
    } else {
        response.writeHead(404);
        response.end();
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

function readFileAsync(path: string): Promise<string> {
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
        const dataPath = path.join(__dirname, 'data');
        const data = await readdirAsync(dataPath);

        for (let i = 0; i < data.length; i++) {
            const pathToFile = path.join(dataPath, `${i}.json`);
            const jokeString = await readFileAsync(pathToFile);
            const joke: IJoke = JSON.parse(jokeString);
            arrayJokes = [...arrayJokes, joke];
        }

        return arrayJokes;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function addJoke(jokeFile: string): Promise<IJoke> {
    try {
        console.log(jokeFile);
        const joke = JSON.parse(jokeFile) as IJoke;
        const dataPath = path.join(__dirname, "data");
        const data = path.join(dataPath, `${(await fs.promises.readdir(dataPath)).length}.json`);
        joke.likes = 0;
        joke.dislikes = 0;

        await fs.promises.writeFile(data, JSON.stringify(joke));
        return joke;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function addLikesOrDislikes(params: { id: number }, check: boolean): Promise<boolean> {
    if (isNaN(params.id)) {
        return false;
    }

    const dataPath = path.join(__dirname, 'data');
    const jokesNum = (await fs.promises.readdir(dataPath)).length;

    if (params.id < 0 || params.id >= jokesNum) {
        return false;
    }

    const filePath = path.join(dataPath, `${params.id}.json`);
    const jokeString = await readFileAsync(filePath);
    const joke = JSON.parse(jokeString) as IJoke;

    if (check) {
        joke.likes++;
    } else {
        joke.dislikes++;
    }

    await fs.promises.writeFile(filePath, JSON.stringify(joke));
    return true;
}