import {ServerActions} from '../actions';
import accounting from 'accounting';

const CLIENT_ID = '578946882467-ehbf8fj6ajb6cnfr97sd5rfg8m6igf1m.apps.googleusercontent.com';
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
const SHEET_ID = '';
const DISCOVERY_URL = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

var gapi = require("exports?gapi!../gapi.js");

const SheetApi = {

  _saidas: [],
  _planejamento: [],

  auth(callback){
    gapi.auth.authorize({
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true
    }, callback);
  },

  callApi(call){
    setTimeout(() => {
      this.auth(() => {
        gapi.client.load(DISCOVERY_URL).then(call)
      });
    }, 100);
  },

  fetchSaidas(){
    this.callApi(() => {
        gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: '19PqAyxiP6HpvktKU8ynDJ6oob8MMH0HbmlAuMoWpx0Q',
          range: 'Saida!$A4:$F',
        }).then((response) => {
          this._saidas = _.map(response.result.values, (o)=>{
            return {
              "descricao": o[0],
              "categoria": o[1],
              "data": o[2],
              "mes_ano": o[3],
              "valor": accounting.unformat(o[4], ','),
              "meio_pagamento": o[5],
            }
          })
          ServerActions.fetched({});
        }, this.handleError);
    });
  },


  fetchPlanejamento(){
    this.callApi(() => {
        gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: '19PqAyxiP6HpvktKU8ynDJ6oob8MMH0HbmlAuMoWpx0Q',
          range: 'Planejamento!$C1:$Z',
        }).then((response) => {
          let data = response.result.values;
          let planejamento = [];

          let header = data[0];
          for(let i=1; i < header.length; i++){
            planejamento.push({"mes": header[i], "plan":[]});
          }

          for (let i=1; i < data.length; i++){
            let row = data[i];

            for(let x=1; x < row.length; x++){
              console.log(planejamento[x-1]);
              planejamento[x-1].plan.push([row[0], row[x]]);
            }
          }

          console.log(planejamento);

          ServerActions.fetched({});
        }, this.handleError);
    });
  },

  getPlanejamento(){
    return this._planejamento;
  },

  getSaidas(){
    return this._saidas;
  }

}

export default SheetApi;
