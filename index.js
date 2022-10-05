const fs = require('fs');
const superagent = require('superagent');

//promisify node core(fs) modules
const readFilePromise = file => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if(err) reject(`file not found: ${err}`)
            resolve(data)
        })
    });
}

//promisify node core(fs) modules
const writeFilePromise = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, err => {
            if(err) reject(`could not write to file: ${err}`)
            resolve('success');
        })
    })
}

//using async await to consume promises
const getDogPic = async () => {
    try{
        const data = await readFilePromise(`${__dirname}/dog.txt`);
        console.log(`breed: ${data}`);
    
        const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        console.log(res.body.message);
    
        await writeFilePromise('dog-img.txt', res.body.message);
        console.log('Random dog image saved to file');
    }catch(err){
        console.log(err);
        throw(err);
    }

    return '2 Ready'
}

(async () => {
    try{
        console.log('1 about to get dog image')
        const x = await getDogPic();
        console.log(x)
        console.log('3 done')
    }catch(err){
        console.log('error thrown by throw(err) in getDogPic()')
    }
})();


//calling multiple promises at thesame time
const getDogPics = async () => {
    try{
        const res1 = superagent.get(`https://dog.ceo/api/breed/retriever/images/random`);
        const res2 = superagent.get(`https://dog.ceo/api/breed/retriever/images/random`);
        const res3 = superagent.get(`https://dog.ceo/api/breed/retriever/images/random`);
    
        const all = await Promise.all([res1, res2, res3]);
        const images = all.map(el => el.body.message)
    
        await writeFilePromise('dog-img.txt', images.join('\n'))
    }catch(err){
        console.log('an error occured')
    }
}

getDogPics();

// console.log('1 about to get dog image')
// getDogPic().then(x => {
//     console.log(x);
//     console.log('3 done')
// }).catch(err => {
//     console.log('error thrown by throw(err) in getDogPic()')
// })

// readFilePromise(`${__dirname}/dog.txt`).then(res => {
//     console.log(`breed: ${res}`);
//     return superagent.get(`https://dog.ceo/api/breed/${res}/images/random`);
// }).then((res) => {
//         console.log(res.body.message);
//         return writeFilePromise('dog-img.txt', res.body.message)
//     }).then(() => {
//         console.log('Random dog image saved to file')
//     }).catch(err => {
//         console.log(err.message);
//     });
