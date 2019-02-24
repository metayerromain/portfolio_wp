export function dump(value){
  console.log(value);
}

export function dispachEvent($element, eventName, datas = null){
	var event = $.Event(eventName);

	if(datas !== null){
		for(let [key, value] of Object.entries(datas)){
			event[key] = value
		}
	}

	$element.trigger(event);
}