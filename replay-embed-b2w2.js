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
358:23,
344:23,
813:23,
345:20,
341:24,
536:24,
776:24,
781:24,
153:18,
154:18,
155:18,
156:18,
157:18,
158:18,
159:18,
160:18,
764:18,
765:18,
766:18,
767:18,
768:18,
769:18,
770:18,
771:18,
5:16,
6:16,
782:16,
783:16,
784:16,
785:16,
161:17,
162:17,
163:17,
166:17,
167:17,
168:17,
368:17,
369:17,
370:17,
378:17,
379:17,
380:17,
588:17,
589:17,
590:17,
684:17,
685:17,
686:17,
693:17,
694:17,
695:17,
696:17,
697:17,
698:17,
701:17,
702:17,
703:17,
794:17,
795:17,
796:17,
371:6,
632:6,
709:6,
710:6,
711:6,
4:6,
706:6,
707:6,
708:6,
38:19,
40:19,
41:19,
42:19,
143:19,
144:19,
145:19,
146:19,
772:19,
773:19,
774:19,
775:19,
777:19,
778:19,
779:19,
780:19,
201:21,
202:21,
456:22,
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
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-rival.mp3',14636,52816);
}else
if(uniqueMusicIds[p1_id]===16){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-n.mp3',19667,74333);
}else
if(uniqueMusicIds[p1_id]===17){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-rival.mp3',8692,70233);
}else
if(uniqueMusicIds[p1_id]===18){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-leader.mp3',17363,90998);
}else
if(uniqueMusicIds[p1_id]===19){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-e4.mp3',21211,94477);
}else
if(uniqueMusicIds[p1_id]===20){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-ghetsis.mp3',26600,86600);
}else
if(uniqueMusicIds[p1_id]===21){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-alder.mp3',28586,78241);
}else
if(uniqueMusicIds[p1_id]===22){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-cynthia.mp3',8500,83500);
}else
if(uniqueMusicIds[p1_id]===23){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-colress.mp3',13229,117178);
}else
if(uniqueMusicIds[p1_id]===24){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-iris.mp3',11000,103500);
}
}else
{
if(uniqueMusicIds[p2_id]===6){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-rival.mp3',14636,52816);
}else
if(uniqueMusicIds[p2_id]===16){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-n.mp3',19667,74333);
}else
if(uniqueMusicIds[p2_id]===17){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-rival.mp3',8692,70233);
}else
if(uniqueMusicIds[p2_id]===18){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-leader.mp3',17363,90998);
}else
if(uniqueMusicIds[p2_id]===19){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-e4.mp3',21211,94477);
}else
if(uniqueMusicIds[p2_id]===20){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-ghetsis.mp3',26600,86600);
}else
if(uniqueMusicIds[p2_id]===21){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-alder.mp3',28586,78241);
}else
if(uniqueMusicIds[p2_id]===22){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-cynthia.mp3',8500,83500);
}else
if(uniqueMusicIds[p2_id]===23){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-colress.mp3',13229,117178);
}else
if(uniqueMusicIds[p1_id]===24){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-iris.mp3',11000,103500);
}
}
}else
if(p1_id in uniqueMusicIds){
if(uniqueMusicIds[p1_id]===6){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-rival.mp3',14636,52816);
}else
if(uniqueMusicIds[p1_id]===16){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-n.mp3',19667,74333);
}else
if(uniqueMusicIds[p1_id]===17){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-rival.mp3',8692,70233);
}else
if(uniqueMusicIds[p1_id]===18){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-leader.mp3',17363,90998);
}else
if(uniqueMusicIds[p1_id]===19){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-e4.mp3',21211,94477);
}else
if(uniqueMusicIds[p1_id]===20){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-ghetsis.mp3',26600,86600);
}else
if(uniqueMusicIds[p1_id]===21){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-alder.mp3',28586,78241);
}else
if(uniqueMusicIds[p1_id]===22){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-cynthia.mp3',8500,83500);
}else
if(uniqueMusicIds[p1_id]===23){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-colress.mp3',13229,117178);
}else
if(uniqueMusicIds[p1_id]===24){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-iris.mp3',11000,103500);
}
}else
if(p2_id in uniqueMusicIds){
if(uniqueMusicIds[p2_id]===6){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-rival.mp3',14636,52816);
}else
if(uniqueMusicIds[p2_id]===16){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-n.mp3',19667,74333);
}else
if(uniqueMusicIds[p2_id]===17){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-rival.mp3',8692,70233);
}else
if(uniqueMusicIds[p2_id]===18){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-leader.mp3',17363,90998);
}else
if(uniqueMusicIds[p2_id]===19){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-e4.mp3',21211,94477);
}else
if(uniqueMusicIds[p2_id]===20){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-ghetsis.mp3',26600,86600);
}else
if(uniqueMusicIds[p2_id]===21){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-alder.mp3',28586,78241);
}else
if(uniqueMusicIds[p2_id]===22){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw-cynthia.mp3',8500,83500);
}else
if(uniqueMusicIds[p2_id]===23){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-colress.mp3',13229,117178);
}else
if(uniqueMusicIds[p1_id]===24){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-iris.mp3',11000,103500);
}
}else
if(p1_name.includes("Team Plasma")||p2_name.includes("Team Plasma")){
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-plasma.mp3',14636,101906);
}else
{
this.battle.scene.bgm=new BattleBGM('https://raw.githubusercontent.com/ItzGray/snakewood-showdown-audio/main/bw2-trainer.mp3',14636,110088);
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
