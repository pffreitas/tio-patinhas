import firebase from 'firebase';

export default class PlanejamentoDB {

	constructor(){

	}

	findCategoriaById(id, callback){
		firebase.database()
	  	.ref(`categorias/${id}`)
	  	.once("value")
	  	.then((snap) => {
	  		callback(snap.val());
	  	});
	}

}

