import firebase from 'firebase';
import _ from 'lodash';

class PlanejamentoDB {

	constructor(){
	}

	init(){
		this.loadPlanejamento();
	}

	_flat(parent, group, nested, cats){
	  nested.forEach((c) => {
	    if(c.nested && c.nested.length > 0){

	      let groupName = c.name;
	      if (parent != null){
	        groupName = parent.name + "/" + c.name;
	      }

	      this._flat(parent, groupName, c.nested, cats);
	    }else{
	      cats.push({id: c.id, name: c.name, group: group}); 
	    }
	  })
	}

	loadPlanejamento(){
		firebase.database().ref('plan').once("value", (snap) => {
			let cats = [];
	        this._flat(null, null, snap.val(), cats);

			localStorage.planejamento = JSON.stringify	(snap.val());
	    	localStorage.flatPlanejamento = JSON.stringify(cats);
	    });
	}

	findById(id){
		let plan = JSON.parse(localStorage.flatPlanejamento);
		return _.find(plan, {"id": id});
	}

}

export default PlanejamentoDB;