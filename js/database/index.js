import PlanejamentoDB from './PlanejamentoDB';

let planejamento = new PlanejamentoDB();
let database = {
	planejamento: planejamento,
	init: function (){
		this.planejamento.init();
	}
}
export { database };