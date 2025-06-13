export let effects = [];

export function addEffect(x,y,text,color){
   effects.push({
    x, y, text, color, opacity:1
   });
};

