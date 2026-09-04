"use strict";/**
 * Replay embed
 *
 * This file is used to play back downloaded replay files, and can also be
 * used by third parties to embed PS replays. The protocol data to replay
 * should be in
 * `<script type="text/plain" class="battle-log-data">`
 *
 * The replay animation will be put into an existing replay HTML structure if
 * it exists, but if it doesn't, the animation would be put at the bottom of
 * the page.
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */




var uniqueMusicIds={
53:6,
54:6,
55:6,
56:6,
57:6,
58:6,
59:6,
60:6,
61:6,
90:6,
91:6,
92:6,
287:6,
288:6,
289:6,
403:6,
404:6,
405:6,
491:6,
492:6,
493:6,
494:6,
495:6,
496:6,
498:6,
499:6,
500:6,
507:6,
508:6,
509:6,
539:6,
540:6,
541:6,
588:6,
589:6,
590:6,
591:6,
592:6,
593:6,
594:6,
595:6,
596:6,
64:16,
65:16,
89:16,
218:16,
586:17,
587:17,
11:18,
12:18,
13:18,
21:18,
22:18,
23:18,
24:18,
25:18,
131:18,
132:18,
133:18,
228:19,
229:19,
230:19,
231:19,
563:19,
564:19,
565:19,
566:19,
232:20,
407:21,
567:22
};

window.exports=window;

function linkStyle(url){
var linkEl=document.createElement('link');
linkEl.rel='stylesheet';
linkEl.href=url;
document.head.appendChild(linkEl);
}
function requireScript(url){
var scriptEl=document.createElement('script');
scriptEl.src=url;
document.head.appendChild(scriptEl);
}

linkStyle('https://play.pokemonshowdown.com/style/font-awesome.css?');
linkStyle('https://play.pokemonshowdown.com/style/battle.css?a7');
linkStyle('https://play.pokemonshowdown.com/style/replay.css?a7');
linkStyle('https://play.pokemonshowdown.com/style/utilichart.css?a7');

requireScript('https://play.pokemonshowdown.com/js/lib/ps-polyfill.js');
requireScript('https://play.pokemonshowdown.com/config/config.js?a7');
requireScript('https://play.pokemonshowdown.com/js/lib/jquery-1.11.0.min.js');
requireScript('https://play.pokemonshowdown.com/js/lib/html-sanitizer-minified.js');
requireScript('https://itzgray.github.io/gen-5-trainer-tourney-replay-mods/battle-sound.js');
requireScript('https://play.pokemonshowdown.com/js/battledata.js?a7');
requireScript('https://play.pokemonshowdown.com/data/pokedex-mini.js?a7');
requireScript('https://play.pokemonshowdown.com/data/pokedex-mini-bw.js?a7');
requireScript('https://play.pokemonshowdown.com/data/graphics.js?a7');
requireScript('https://play.pokemonshowdown.com/data/pokedex.js?a7');
requireScript('https://play.pokemonshowdown.com/data/moves.js?a7');
requireScript('https://play.pokemonshowdown.com/data/abilities.js?a7');
requireScript('https://play.pokemonshowdown.com/data/items.js?a7');
requireScript('https://play.pokemonshowdown.com/data/teambuilder-tables.js?a7');
requireScript('https://play.pokemonshowdown.com/js/battle-tooltips.js?a7');
requireScript('https://play.pokemonshowdown.com/js/battle.js?a7');

var Replays={
$el:null,
battle:null,
muted:false,
init:function(){var _this=this;
this.$el=$('.wrapper');
if(!this.$el.length){
$('body').append('<div class="wrapper replay-wrapper" style="max-width:1180px;margin:0 auto"><div class="battle"></div><div class="battle-log"></div><div class="replay-controls"></div><div class="replay-controls-2"></div>');
this.$el=$('.wrapper');
}

var id=$('input[name=replayid]').val()||'';
var log=($('script.battle-log-data').text()||'').replace(/\\\//g,'/');

this.$el.on('click','.chooser button',function(e){
_this.clickChangeSetting(e);
});
this.$el.on('click','button',function(e){
var action=$(e.currentTarget).data('action');
if(action)_this[action]();
});

this.battle=new Battle({
id:id,
$frame:this.$('.battle'),
$logFrame:this.$('.battle-log'),
log:log.split('\n'),
isReplay:true,
paused:true,
autoresize:true
});

this.$('.replay-controls-2').html('<div class="chooser leftchooser speedchooser"> <em>Speed:</em> <div><button value="hyperfast">Hyperfast</button><button value="fast">Fast</button><button value="normal" class="sel">Normal</button><button value="slow">Slow</button><button value="reallyslow">Really Slow</button></div> </div> <div class="chooser colorchooser"> <em>Color&nbsp;scheme:</em> <div><button class="sel" value="light">Light</button><button value="dark">Dark</button></div> </div> <div class="chooser soundchooser" style="display:none"> <em>Music:</em> <div><button class="sel" value="on">On</button><button value="off">Off</button></div> </div>');


var rc2=this.$('.replay-controls-2')[0];

if(rc2)rc2.innerHTML=rc2.innerHTML;

if(window.HTMLAudioElement)$('.soundchooser, .startsoundchooser').show();
this.update();
this.battle.subscribe(function(state){return _this.update(state);});
var p1_name=this.battle.p1.name;
var p2_name=this.battle.p2.name;
var p1_id=parseInt(p1_name.split("(",2)[1].split(")",2)[0]);
var p2_id=parseInt(p2_name.split("(",2)[1].split(")",2)[0]);
if(p1_id in uniqueMusicIds&&p2_id in uniqueMusicIds){
var random_player=Math.floor(Math.random()*(2-1+1))+1;
if(random_player===1){
if(uniqueMusicIds[p1_id]===6){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-rival.mp3',19180,57373);
}else
if(uniqueMusicIds[p1_id]===16){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-n1.mp3',19170,73876);
}else
if(uniqueMusicIds[p1_id]===17){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-n2.mp3',83093,170345);
}else
if(uniqueMusicIds[p1_id]===18){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-leader.mp3',18298,91929);
}else
if(uniqueMusicIds[p1_id]===19){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-e4.mp3',89910,163173);
}else
if(uniqueMusicIds[p1_id]===20){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-ghetsis.mp3',15420,139182);
}else
if(uniqueMusicIds[p1_id]===21){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-alder.mp3',29240,78865);
}else
if(uniqueMusicIds[p1_id]===22){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-cynthia.mp3',84116,159090);
}
}else
{
if(uniqueMusicIds[p2_id]===6){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-rival.mp3',19180,57373);
}else
if(uniqueMusicIds[p2_id]===16){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-n1.mp3',19170,73876);
}else
if(uniqueMusicIds[p2_id]===17){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-n2.mp3',83093,170345);
}else
if(uniqueMusicIds[p2_id]===18){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-leader.mp3',18298,91929);
}else
if(uniqueMusicIds[p2_id]===19){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-e4.mp3',89910,163173);
}else
if(uniqueMusicIds[p2_id]===20){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-ghetsis.mp3',15420,139182);
}else
if(uniqueMusicIds[p2_id]===21){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-alder.mp3',29240,78865);
}else
if(uniqueMusicIds[p2_id]===22){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-cynthia.mp3',84116,159090);
}
}
}else
if(p1_id in uniqueMusicIds){
if(uniqueMusicIds[p1_id]===6){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-rival.mp3',19180,57373);
}else
if(uniqueMusicIds[p1_id]===16){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-n1.mp3',19170,73876);
}else
if(uniqueMusicIds[p1_id]===17){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-n2.mp3',83093,170345);
}else
if(uniqueMusicIds[p1_id]===18){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-leader.mp3',18298,91929);
}else
if(uniqueMusicIds[p1_id]===19){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-e4.mp3',89910,163173);
}else
if(uniqueMusicIds[p1_id]===20){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-ghetsis.mp3',15420,139182);
}else
if(uniqueMusicIds[p1_id]===21){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-alder.mp3',29240,78865);
}else
if(uniqueMusicIds[p1_id]===22){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-cynthia.mp3',84116,159090);
}
}else
if(p2_id in uniqueMusicIds){
if(uniqueMusicIds[p2_id]===6){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-rival.mp3',19180,57373);
}else
if(uniqueMusicIds[p2_id]===16){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-n1.mp3',19170,73876);
}else
if(uniqueMusicIds[p2_id]===17){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-n2.mp3',83093,170345);
}else
if(uniqueMusicIds[p2_id]===18){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-leader.mp3',18298,91929);
}else
if(uniqueMusicIds[p2_id]===19){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-e4.mp3',89910,163173);
}else
if(uniqueMusicIds[p2_id]===20){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-ghetsis.mp3',15420,139182);
}else
if(uniqueMusicIds[p2_id]===21){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-alder.mp3',29240,78865);
}else
if(uniqueMusicIds[p2_id]===22){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-cynthia.mp3',84116,159090);
}
}else
if(p1_name.includes("Team Plasma Grunt")||p2_name.includes("Team Plasma Grunt")){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-plasma.mp3',14189,97297);
}else
{
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-trainer.mp3',14629,110109);
}
BattleSound.bgm.push(this.battle.scene.bgm);
},
$:function(sel){
return this.$el.find(sel);
},
clickChangeSetting:function(e){
e.preventDefault();
var $chooser=$(e.currentTarget).closest('.chooser');
var value=e.currentTarget.value;
this.changeSetting($chooser,value,$(e.currentTarget));
},
changeSetting:function(type,value,valueElem){
var $chooser;
if(typeof type==='string'){
$chooser=this.$('.'+type+'chooser');
}else{
$chooser=type;
type='';
if($chooser.hasClass('colorchooser')){
type='color';
}else if($chooser.hasClass('soundchooser')){
type='sound';
}else if($chooser.hasClass('speedchooser')){
type='speed';
}
}
if(!valueElem)valueElem=$chooser.find('button[value='+value+']');

$chooser.find('button').removeClass('sel');
valueElem.addClass('sel');

switch(type){
case'color':
if(value==='dark'){
$(document.body).addClass('dark');
}else{
$(document.body).removeClass('dark');
}
break;

case'sound':

this.muted=value==='off';
this.battle.setMute(this.muted);
this.$('.startsoundchooser').remove();
break;

case'speed':
var fadeTable={
hyperfast:40,
fast:50,
normal:300,
slow:500,
reallyslow:1000
};
var delayTable={
hyperfast:1,
fast:1,
normal:1,
slow:1000,
reallyslow:3000
};
this.battle.messageShownTime=delayTable[value];
this.battle.messageFadeTime=fadeTable[value];
this.battle.scene.updateAcceleration();
break;
}
},
update:function(state){
if(state==='error'){
var m=/^([a-z0-9]+)-[a-z0-9]+-[0-9]+$/.exec(this.battle.id);
if(m){
this.battle.scene.message('<hr /><div class="chat">This replay was uploaded from a third-party server (<code>'+BattleLog.escapeHTML(m[1])+'</code>). It contains errors.</div><div class="chat">Replays uploaded from third-party servers can contain errors if the server is running custom code, or the server operator has otherwise incorrectly configured their server.</div>');
}
return;
}

if(BattleSound.muted&&!this.muted)this.changeSetting('sound','off');

if(this.battle.paused){
var resetDisabled=!this.battle.started?' disabled':'';
this.$('.replay-controls').html('<button data-action="play"><i class="fa fa-play"></i> Play</button><button data-action="reset"'+resetDisabled+'><i class="fa fa-undo"></i> Reset</button> <button data-action="rewind"><i class="fa fa-step-backward"></i> Last turn</button><button data-action="ff"><i class="fa fa-step-forward"></i> Next turn</button> <button data-action="ffto"><i class="fa fa-fast-forward"></i> Go to turn...</button> <button data-action="switchViewpoint"><i class="fa fa-random"></i> Switch sides</button>');
}else{
this.$('.replay-controls').html('<button data-action="pause"><i class="fa fa-pause"></i> Pause</button><button data-action="reset"><i class="fa fa-undo"></i> Reset</button> <button data-action="rewind"><i class="fa fa-step-backward"></i> Last turn</button><button data-action="ff"><i class="fa fa-step-forward"></i> Next turn</button> <button data-action="ffto"><i class="fa fa-fast-forward"></i> Go to turn...</button> <button data-action="switchViewpoint"><i class="fa fa-random"></i> Switch sides</button>');
}
},
pause:function(){
this.battle.pause();
},
play:function(){
this.battle.play();
},
reset:function(){
this.battle.reset();
},
ff:function(){
this.battle.seekBy(1);
},
rewind:function(){
this.battle.seekBy(-1);
},
ffto:function(){var _turn;
var turn=prompt('Turn?');
if(!((_turn=turn)!=null&&_turn.trim()))return;
if(turn==='e'||turn==='end'||turn==='f'||turn==='finish')turn=Infinity;
turn=Number(turn);
if(isNaN(turn)||turn<0)alert("Invalid turn");
this.battle.seekTurn(turn);
},
switchViewpoint:function(){
this.battle.switchViewpoint();
}
};

window.onload=function(){
Replays.init();
};

if(window.matchMedia){
if(window.matchMedia('(prefers-color-scheme: dark)').matches){
document.body.className='dark';
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(event){
document.body.className=event.matches?"dark":"";
});
}
//# sourceMappingURL=replay-embed.js.map
