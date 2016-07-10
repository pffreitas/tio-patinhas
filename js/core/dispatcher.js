import { Dispatcher } from 'flux';

const flux = new Dispatcher();

export function register( callback ) {
  return flux.register( callback );
}

export function dispatch( actionType, action ) {

  if(flux.isDispatching()) {
    window.setTimeout(function(){
      flux.dispatch( actionType, action );
    });
  } else {
    flux.dispatch( actionType, action );
  }

}
