const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const app = require('express')();
const cors = require('cors')({ origin: true });

const config = {
    apiKey: "AIzaSyAGcUq4EvHVJGeqW9XJrdzv4inK_fwZwjM",
    authDomain: "codechella-b0537.firebaseapp.com",
    databaseURL: "https://codechella-b0537.firebaseio.com",
    projectId: "codechella-b0537",
    storageBucket: "codechella-b0537.appspot.com",
    messagingSenderId: "850498170091",
    appId: "1:850498170091:web:feb7573df334290d3562ae",
    measurementId: "G-0JY8R011BD"
}

const firebase = require('firebase');
firebase.initializeApp(config);

const db = admin.firestore();

app.get('/tweets', (req, res) => {
    cors(req, res, () => {
        db.collection('TweetsAndResponses').get()
            .then(data => {
                let TweetsAndResponses = [];
                data.forEach(doc => {
                    TweetsAndResponses.push({
                        data: doc.data(),
                    });
                });
                return res.json(TweetsAndResponses);
            })
            .catch(err => console.error(err))
    })
})

app.post('/tweets', (req, res) => {
    admin.firestore().collection('TweetsAndResponses')
        .add(req.body)
        .then((doc) => {
            res.json({ message: 'document ${} created successfully' });
        })
        .catch((err) => {
            res.status(500).json({ error: 'something went wrong' });
            console.log(err);
        })
})


app.get('/PlantNames', (req, res) => {
    cors(req, res, () => {
        db.collection('plantNames').get()
            .then(data => {
                let TweetsAndResponses = [];
                data.forEach(doc => {
                    TweetsAndResponses.push({
                        name: doc.id,
                        counter: doc.data().counter,
                    });
                });
                return res.json(TweetsAndResponses);
            })
            .catch(err => console.error(err))
    })
})


app.post('/PlantNames', (req, res) => {
    //console.log(req.body.PlantName)
    const usersRef = db.collection('plantNames').doc(req.body.PlantName)
    usersRef.get()
        .then((docSnapshot) => {
            if (docSnapshot.exists) {
                let currentVal = docSnapshot.data().counter;
                usersRef.set({ counter: currentVal + 1 })
                    .then(() => {
                        res.json({ message: "Works!" });
                    })
                    .catch((err) => {
                        res.status(400).json({ error: { err } })
                    })
            }
            else {
                usersRef.set({ counter: 1 })
                    .then(() => {
                        res.json({ message: "Works!" });
                    }) // create the document
            }
        });

    // admin.firestore().collection('plantNames')
    // .doc(req.body.PlantName).set({counter:"1"})
    // .then((doc) => {
    //     res.json({message: 'document ${} created successfully'});
    // })
    // .catch((err)=>{
    //     res.status(500).json({error:'something went wrong'});
    //     console.log(err);
    // })
})




exports.api = functions.https.onRequest(app);