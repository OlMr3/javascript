
function randomDiap(n,m) {
    return Math.floor(Math.random()*(m-n+1))+n;
}

function mood(colorsCount) {
const colors=[ '', 'красный', 'оранжевый', 'жёлтый', 'зелёный', 'голубой', 'синий', 'фиолетовый' ];
let used={};
console.log( 'цветов: ' + colorsCount );
for ( let i=1; i<=colorsCount; i++ ) {
    const n=randomDiap(1,7);
    const colorName=colors[n];
    if ( colorName in used )
        continue;
    used[colorName]=true;
    console.log(colorName);
}
}
mood(3);