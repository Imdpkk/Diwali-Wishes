const stage = document.getElementById('diyaStage');
const lightButton = document.getElementById('lightButton');
const caption = document.getElementById('diyaCaption');
const wishTitle = document.getElementById('personalWish');
const nameInput = document.getElementById('visitorName');
const nameForm = document.getElementById('nameForm');
const shareStatus = document.getElementById('shareStatus');
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
let lit = false;
let musicOn = false;
let particles = [];
const diwaliMusic = document.getElementById('diwaliMusic');
diwaliMusic.volume = 0.12;
const musicButton = document.getElementById('musicButton');
const musicLabel = document.getElementById('musicLabel');

function revealText(element, delay = 0){
  const text = element.textContent;
  element.textContent = '';
  element.classList.add('is-revealing');
  let wordIndex = 0;
  text.split(/(\s+)/).forEach((part) => {
    if(!part) return;
    if(/^\s+$/.test(part)){
      element.appendChild(document.createTextNode(part));
      return;
    }
    const span = document.createElement('span');
    span.textContent = part;
    span.style.animationDelay = `${delay + wordIndex * 0.12}s`;
    element.appendChild(span);
    wordIndex++;
  });
}

document.querySelectorAll('.reveal-text').forEach((element, index) => revealText(element, index * 0.35));
document.querySelectorAll('.load-reveal').forEach((element, index) => {
  element.style.animationDelay = `${0.15 + index * 0.14}s`;
});

function revealLabel(element, delay = 0){
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while(walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach((node) => {
    const fragment = document.createDocumentFragment();
    [...node.textContent].forEach((character, index) => {
      if(/\s/.test(character)){
        fragment.appendChild(document.createTextNode(character));
        return;
      }
      const span = document.createElement('span');
      span.textContent = character;
      span.style.animationDelay = `${delay + index * 0.045}s`;
      fragment.appendChild(span);
    });
    node.replaceWith(fragment);
  });
}

document.querySelectorAll('.eyebrow, .card-kicker, .card-footer').forEach((element, index) => {
  element.classList.add('letter-reveal');
  revealLabel(element, 0.35 + index * 0.2);
});

function lightDiya(){
  lit = !lit;
  stage.classList.toggle('lit', lit);
  caption.textContent = lit ? 'The light is yours to share' : 'Tap the diya to spread the light';
  lightButton.innerHTML = lit ? 'Diya is glowing <span>✦</span>' : 'Light the diya <span>✦</span>';
  if(lit) burst(window.innerWidth * .5, window.innerHeight * .48, 65);
}
lightButton.addEventListener('click', lightDiya);
stage.addEventListener('click', () => { if(!lit) lightDiya(); });

nameForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  wishTitle.textContent = name ? `A very Happy Diwali, ${name}!` : 'Wishing you a very Happy Diwali';
  revealText(wishTitle);
  shareStatus.textContent = name ? `Your personal wish is ready for ${name}.` : 'Your greeting is ready.';
});

function resizeCanvas(){
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
function burst(x,y,count=55){
  const colors = ['#ffe5a1','#f3bd60','#e98a42','#fff4d1','#c98b43'];
  for(let i=0;i<count;i++){
    const angle = Math.random()*Math.PI*2;
    const speed = 1.1 + Math.random()*4.2;
    particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:45+Math.random()*35,max:80,size:1+Math.random()*2,color:colors[Math.floor(Math.random()*colors.length)]});
  }
}
function animate(){
  ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
  particles = particles.filter(p=>p.life>0);
  for(const p of particles){
    p.x+=p.vx;p.y+=p.vy;p.vy+=.035;p.vx*=.986;p.vy*=.986;p.life--;
    ctx.globalAlpha=Math.max(0,p.life/p.max);
    ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();
  }
  ctx.globalAlpha=1;
  requestAnimationFrame(animate);
}
animate();
document.getElementById('fireworkButton').addEventListener('click',()=>{
  for(let i=0;i<4;i++) setTimeout(()=>{
    burst(window.innerWidth*(.18+Math.random()*.64),window.innerHeight*(.16+Math.random()*.42),65);
  },i*260);
});

function currentShareUrl(){
  const url=new URL(window.location.href);
  const name=nameInput.value.trim();
  if(name)url.searchParams.set('to',name);else url.searchParams.delete('to');
  return url.toString();
}
function personalizeFromUrl(){
  const recipient=new URLSearchParams(window.location.search).get('to');
  if(recipient){nameInput.value=recipient;wishTitle.textContent=`A very Happy Diwali, ${recipient}!`;revealText(wishTitle);}
}
personalizeFromUrl();

function tryAutoplay(){
  diwaliMusic.play().then(()=>{
    musicOn = true;
    musicButton.setAttribute('aria-pressed','true');
    musicLabel.textContent='Pause music';
  }).catch(()=>{
    shareStatus.textContent='Tap Play music to enjoy the soft Diwali soundtrack.';
  });
}
window.addEventListener('load', tryAutoplay);
musicButton.addEventListener('click',()=>{
  if(musicOn){
    diwaliMusic.pause();
    musicOn = false;
    musicLabel.textContent='Play music';
    musicButton.setAttribute('aria-pressed','false');
    return;
  }
  diwaliMusic.play().then(()=>{
    musicOn = true;
    musicLabel.textContent='Pause music';
    musicButton.setAttribute('aria-pressed','true');
    shareStatus.textContent='Soft Diwali music is playing.';
  }).catch(()=>{
    shareStatus.textContent='Music could not be played. Please try again.';
  });
});
document.getElementById('shareButton').addEventListener('click',async()=>{
  const url=currentShareUrl();
  const shareData={title:'A Diwali wish for you',text:'A little light, a lot of happiness. Open your Diwali greeting:',url};
  if(navigator.share){try{await navigator.share(shareData);shareStatus.textContent='Thanks for sharing the light!';}catch(e){if(e.name!=='AbortError')shareStatus.textContent='Sharing was not available. You can copy the link instead.';}}
  else{try{await navigator.clipboard.writeText(url);shareStatus.textContent='Personalized link copied. Share it with someone special!';}catch(e){shareStatus.textContent='Use the Copy link button or copy the page address.';}}
});
document.getElementById('copyButton').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(currentShareUrl());shareStatus.textContent='Personalized link copied to clipboard.';}
  catch(e){shareStatus.textContent='Clipboard access is unavailable. Copy the address from your browser.';}
});
