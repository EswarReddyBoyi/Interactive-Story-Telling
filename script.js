/**
 * script.js - Multi-Story Interactive Story Engine
 * - Stories embedded to avoid CORS/fetch issues
 * - Story selector (fantasy, scifi, mystery)
 * - Each node supports an 'image' property (relative path or URL)
 * - Save/load per-story, back, restart, breadcrumbs, keyboard shortcuts
 */

/* ---------------- STORIES (embedded) ---------------- */
const STORIES = {
  fantasy: {
    id: "fantasy",
    title: "The Last Lantern",
    subtitle: "A dark-fantasy choose-your-own-adventure",
    start: "intro",
    nodes: {
      /* ~36 nodes (large story) */
      "intro": {
        title: "The Lantern’s Call",
        text: "You arrive at the border of a silent village. An old woman presses a flickering lantern into your hands and whispers, 'The land needs light.'",
        image: "assets/bg-village.jpg",
        choices: [
          { id: "accept", label: "Accept the lantern and step forward" },
          { id: "decline", label: "Decline and walk away" }
        ]
      },

      "accept": {
        title: "Crossroads",
        text: "A fork: a forest path (murmurs) and a road leading to a ruined castle. The lantern trembles toward the forest.",
        image: "assets/forest.jpg",
        choices: [
          { id: "forest_entry", label: "Enter the forest" },
          { id: "castle_gate", label: "Walk to the castle" }
        ]
      },

      "decline": {
        title: "Missed Destiny",
        text: "You walk away. Fog swallows the path and whispers follow you forever. Regret colors your nights.",
        image: "assets/road.jpg",
        choices: [
          { id: "intro", label: "Turn back (restart)" }
        ]
      },

      /* FOREST BRANCH (deep branching, many nodes) */
      "forest_entry": {
        title: "Forest Edge",
        text: "Trees close overhead. A hooded stranger steps out and offers a riddle.",
        image: "assets/forest.jpg",
        choices: [
          { id: "riddle_offer", label: "Hear the riddle" },
          { id: "ignore_stranger", label: "Ignore and push on" }
        ]
      },

      "riddle_offer": {
        title: "A Riddle Spoken",
        text: "'I am not alive, but I grow; I don't have lungs but I need air. What am I?'",
        image: "assets/forest-path.jpg",
        choices: [
          { id: "answer_fire", label: "Fire" },
          { id: "answer_other", label: "Shadow" }
        ]
      },

      "answer_fire": {
        title: "Answer: Fire",
        text: "The stranger smiles and hands you a SILVER KEY. A hidden path opens to an ancient temple.",
        image: "assets/forest-key.jpg",
        choices: [
          { id: "temple_approach", label: "Approach the temple" },
          { id: "camp_forest", label: "Camp and rest" }
        ]
      },

      "answer_other": {
        title: "Wrong Answer",
        text: "The stranger's eyes flash. A curse: your lantern sputters and the forest's paths twist. You struggle to find your way out.",
        image: "assets/forest-dark.jpg",
        choices: [
          { id: "lost_end", label: "Struggle to escape" }
        ]
      },

      "camp_forest": {
        title: "Night Watch",
        text: "At night you dream of the village's children. The lantern warms you and heals your resolve.",
        image: "assets/camp.jpg",
        choices: [
          { id: "temple_approach", label: "Head to the temple at dawn" }
        ]
      },

      "temple_approach": {
        title: "Ruined Temple",
        text: "Vines clothe old stone. A door requires the SILVER KEY. The lantern hums as you insert it.",
        image: "assets/temple.jpg",
        choices: [
          { id: "enter_hall", label: "Use the key and enter" },
          { id: "search_surroundings", label: "Search the ruins first" }
        ]
      },

      "search_surroundings": {
        title: "Hidden Offering",
        text: "In the grass you find a small carved statue — a clue. It hints the crystal inside the hall will test compassion.",
        image: "assets/temple-statue.jpg",
        choices: [
          { id: "enter_hall", label: "Enter the hall" }
        ]
      },

      "enter_hall": {
        title: "Hall of Echoes",
        text: "An echoing chamber. A pedestal holds a crystal that radiates sorrow. A voice says: 'Will you carry the world’s grief?'",
        image: "assets/hall.jpg",
        choices: [
          { id: "take_crystal", label: "Take the crystal" },
          { id: "reject_crystal", label: "Leave it and step away" }
        ]
      },

      "take_crystal": {
        title: "Bearing Sorrow",
        text: "The crystal fuses with your lantern. It blazes with painful light — you feel the weight of every life nearby.",
        image: "assets/crystal.jpg",
        choices: [
          { id: "forest_exit", label: "Leave forest carrying the light" }
        ]
      },

      "reject_crystal": {
        title: "Refusal",
        text: "You leave the crystal. The chamber quiets. You exit with the lantern unchanged — still humble, still mortal.",
        image: "assets/hall-quiet.jpg",
        choices: [
          { id: "forest_exit", label: "Exit the forest" }
        ]
      },

      "forest_exit": {
        title: "Forest Edge Again",
        text: "The castle sits across the meadow; the lantern wards the creeping dusk. A traveling troupe passes and offers news of other lands.",
        image: "assets/forest-exit.jpg",
        choices: [
          { id: "visit_troupe", label: "Speak with the troupe" },
          { id: "castle_gate", label: "Proceed to the castle" }
        ]
      },

      "visit_troupe": {
        title: "Troupe of Stories",
        text: "They speak of a SHRINE far east where lanterns were born. They offer to guide you for a favor.",
        image: "assets/troupe.jpg",
        choices: [
          { id: "guide_shrine", label: "Go to the shrine with them (side quest)" },
          { id: "castle_gate", label: "Politely decline and go to the castle" }
        ]
      },

      "guide_shrine": {
        title: "Journey to the Shrine",
        text: "You travel many days, learn songs, and grow in empathy. The shrine accepts your lantern, revealing a hidden ending.",
        image: "assets/shrine.jpg",
        choices: [
          { id: "ending_shrine_keeper", label: "Become Shrine Keeper (Ending)" }
        ]
      },

      "ending_shrine_keeper": {
        title: "Shrine Keeper (Ending)",
        text: "You tend the shrine, preserving light for generations. The world is kinder for it.",
        image: "assets/shrine.jpg",
        choices: []
      },

      "castle_gate": {
        title: "Castle Gate",
        text: "Massive iron gates. Gargoyles leer. The lantern thrums with energy as you pass below the banners.",
        image: "assets/castle.jpg",
        choices: [
          { id: "throne_room", label: "Enter the throne room" },
          { id: "dungeons", label: "Explore the dungeons" }
        ]
      },

      "throne_room": {
        title: "Throne of Ash",
        text: "A ghost king sits in tatters of once fine robes. He asks why you carry light when darkness is profitable.",
        image: "assets/throne.jpg",
        choices: [
          { id: "speak_king", label: "Speak honestly" },
          { id: "offer_light", label: "Offer the lantern" },
          { id: "challenge_king", label: "Challenge him for the throne" }
        ]
      },

      "speak_king": {
        title: "Honesty's Path",
        text: "You speak of healing and duty. The king scoffs but reveals a secret: the HEART of the castle is a living shadow.",
        image: "assets/king.jpg",
        choices: [
          { id: "descend_heart", label: "Descend and face the heart" },
          { id: "leave_castle", label: "Leave to seek other help" }
        ]
      },

      "offer_light": {
        title: "Light Given",
        text: "The king accepts, draws power, and in return shows you forbidden knowledge. The lantern dims forever.",
        image: "assets/offer.jpg",
        choices: [
          { id: "ending_knowledge", label: "Leave with knowledge (Ending)" }
        ]
      },

      "challenge_king": {
        title: "Clash of Wills",
        text: "Light flares. The fight shakes souls. You break the king’s crown and uncover stairs beneath the throne.",
        image: "assets/battle.jpg",
        choices: [
          { id: "descend_heart", label: "Descend the stairs" }
        ]
      },

      "dungeons": {
        title: "Castle Dungeons",
        text: "Maddened prisoners whisper of a shadow tied to a well. They plead to be freed.",
        image: "assets/dungeon.jpg",
        choices: [
          { id: "free_prisoners", label: "Free them" },
          { id: "investigate_well", label: "Investigate the deep well" }
        ]
      },

      "free_prisoners": {
        title: "Freedom's Cost",
        text: "Freed souls fade and bless you. A hidden key drops at your feet leading to a secret passage.",
        image: "assets/freed.jpg",
        choices: [
          { id: "descend_heart", label: "Use the secret passage" }
        ]
      },

      "investigate_well": {
        title: "The Well of Shadow",
        text: "A bottomless well yawns. The lantern resists the pull. A voice offers a bargain: power for blood.",
        image: "assets/well.jpg",
        choices: [
          { id: "refuse_bargain", label: "Refuse the bargain" },
          { id: "accept_bargain", label: "Accept for power (dark path)" }
        ]
      },

      "refuse_bargain": {
        title: "Refusal",
        text: "You refuse. Light steadies. The well's voice disappears, impressed by your restraint.",
        image: "assets/well.jpg",
        choices: [
          { id: "descend_heart", label: "Descend deeper to the heart" }
        ]
      },

      "accept_bargain": {
        title: "Power Taken",
        text: "You accept and feel shadows crawl into your bones. The lantern's light becomes a blade — and you become feared.",
        image: "assets/dark-power.jpg",
        choices: [
          { id: "ending_dark_lord", label: "Rule as Dark Lord (Ending)" }
        ]
      },

      "descend_heart": {
        title: "Heart of the Castle",
        text: "An enormous husk of darkness coils. The lantern and crystal hum together. You face a choice: heal or burn.",
        image: "assets/heart.jpg",
        choices: [
          { id: "heal_heart", label: "Heal the heart with light (Good Ending)" },
          { id: "burn_heart", label: "Burn it with flame (Ambiguous Ending)" }
        ]
      },

      "heal_heart": {
        title: "Dawn Restored",
        text: "Light floods veins of the land. Villages wake. You are heralded as a gentle savior.",
        image: "assets/dawn.jpg",
        choices: []
      },

      "burn_heart": {
        title: "Scorched Balance",
        text: "You burn the shadow. The cost is severe: the land is freed, but a part of you remains charred.",
        image: "assets/scorched.jpg",
        choices: [
          { id: "ending_burned", label: "Wander as the Burned (Ending)" }
        ]
      },

      "ending_knowledge": {
        title: "Forbidden Knowledge",
        text: "You return wiser but fractured. Knowledge always costs something. The world shifts quietly.",
        image: "assets/knowledge.jpg",
        choices: []
      },

      "ending_dark_lord": {
        title: "Dark Lord",
        text: "You become the lantern of fear. Your reign is long and cold.",
        image: "assets/dark-lord.jpg",
        choices: []
      },

      "ending_burned": {
        title: "Wanderer of Ash",
        text: "You wander the world with a lantern that never quite warms your hands.",
        image: "assets/ash-wander.jpg",
        choices: []
      },

      "lost_end": {
        title: "Lost in the Green",
        text: "The forest swallows you whole. Few find you. Your story ends in quiet green.",
        image: "assets/forest-lost.jpg",
        choices: []
      }
    }
  },

  scifi: {
    id: "scifi",
    title: "Echoes of Orion",
    subtitle: "A short sci-fi escape and choice-driven tale",
    start: "crash",
    nodes: {
      "crash": {
        title: "Crash Site",
        text: "Your ship burns in the dark ring around Orion’s moon. The emergency beacon pulses. You must act quickly.",
        image: "assets/space-crash.jpg",
        choices: [
          { id: "salvage", label: "Salvage parts and repair the beacon" },
          { id: "signal", label: "Send an SOS and hide" }
        ]
      },

      "salvage": {
        title: "Shipwork",
        text: "You wrestle with twisted alloy while something moves in the dust.",
        image: "assets/shipwork.jpg",
        choices: [
          { id: "finish_repair", label: "Finish repair" },
          { id: "investigate_noise", label: "Investigate the movement" }
        ]
      },

      "signal": {
        title: "SOS Sent",
        text: "A response: a corporate salvage crew will arrive, but their prices are steep.",
        image: "assets/sos.jpg",
        choices: [
          { id: "wait", label: "Wait for the crew" },
          { id: "hide", label: "Hide and risk pirates" }
        ]
      },

      "finish_repair": {
        title: "Beacon Online",
        text: "Beacon lit. Rescue comes. You live to tell the tale.",
        image: "assets/beacon.jpg",
        choices: []
      },

      "investigate_noise": {
        title: "Alien Echo",
        text: "You find a small, curious lifeform. It helps you — or it lures you into a trap. You decide to trust it.",
        image: "assets/alien.jpg",
        choices: [
          { id: "trust_alien", label: "Trust it" },
          { id: "kill_alien", label: "Kill it" }
        ]
      },

      "trust_alien": {
        title: "Unexpected Ally",
        text: "The creature leads you to power cells. You survive and build a friendship.",
        image: "assets/alien-friend.jpg",
        choices: []
      },

      "kill_alien": {
        title: "Cold Survival",
        text: "You survive but lose a chance at friendship. The crew later finds your wrecked beacon.",
        image: "assets/kill.jpg",
        choices: []
      },

      "wait": {
        title: "Corporate Arrival",
        text: "The crew salvages everything and leaves you a bill. You survive, indebted to a corporation.",
        image: "assets/corporate.jpg",
        choices: []
      },

      "hide": {
        title: "Pirate Night",
        text: "Pirates find you. You barter and escape with scars and loot.",
        image: "assets/pirates.jpg",
        choices: []
      }
    }
  },

  mystery: {
    id: "mystery",
    title: "The Hollow Manor",
    subtitle: "A mansion mystery filled with clues and secrets",
    start: "arrival",
    nodes: {
      "arrival": {
        title: "Hollow Manor Arrival",
        text: "You step into a manor where portraits stare and the fire refuses to light. A note reads: 'Find the truth.'",
        image: "assets/manor.jpg",
        choices: [
          { id: "foyer", label: "Enter the foyer" },
          { id: "garden", label: "Walk the overgrown garden" }
        ]
      },

      "foyer": {
        title: "Foyer",
        text: "Dusty keys and a letter. The letter mentions a hidden study behind the library.",
        image: "assets/foyer.jpg",
        choices: [
          { id: "library", label: "Search the library" },
          { id: "upstairs", label: "Go upstairs" }
        ]
      },

      "garden": {
        title: "Garden",
        text: "A statue points toward the hedge maze. You notice fresh footprints.",
        image: "assets/garden.jpg",
        choices: [
          { id: "maze", label: "Follow the maze trail" },
          { id: "greenhouse", label: "Enter the greenhouse" }
        ]
      },

      "library": {
        title: "Library",
        text: "A book falls open, revealing a map. A secret door creaks open.",
        image: "assets/library.jpg",
        choices: [
          { id: "study", label: "Enter the hidden study" },
          { id: "confront", label: "Confront the butler" }
        ]
      },

      "study": {
        title: "Hidden Study",
        text: "You find evidence of a forgery and a photograph that changes the whole case.",
        image: "assets/study.jpg",
        choices: [
          { id: "reveal_truth", label: "Reveal the truth (Ending)" },
          { id: "cover_up", label: "Hide the evidence (Ambiguous Ending)" }
        ]
      },

      "reveal_truth": {
        title: "Truth Revealed",
        text: "You expose the crime. Justice is messy but done.",
        image: "assets/reveal.jpg",
        choices: []
      },

      "cover_up": {
        title: "Complicit",
        text: "You decide some truths are too painful. You hide the evidence and live with the choice.",
        image: "assets/cover.jpg",
        choices: []
      },

      "maze": {
        title: "Hedge Maze",
        text: "In the maze you encounter the missing heir, terrified and hiding.",
        image: "assets/maze.jpg",
        choices: [
          { id: "comfort", label: "Comfort and return them" },
          { id: "leave_heir", label: "Leave them and go investigate" }
        ]
      },

      "comfort": {
        title: "Return",
        text: "You return the heir; the family thanks you and the house heals.",
        image: "assets/comfort.jpg",
        choices: []
      },

      "leave_heir": {
        title: "Regret",
        text: "You leave the heir. Later you learn your choice cost them dearly.",
        image: "assets/regret.jpg",
        choices: []
      }
    }
  }
};

/* ---------------- Engine state ---------------- */
let CURRENT_STORY = null;   // pointer to chosen story object
let currentNodeId = null;
let historyStack = [];      // history of node ids for Back
const FEEDBACK_TIMEOUT = 2200;

/* DOM refs */
const selector = document.getElementById('selector');
const mainUI = document.getElementById('main-ui');
const footer = document.getElementById('footer');
const titleEl = document.getElementById('title');
const subtitleEl = document.getElementById('subtitle');
const contentEl = document.getElementById('content');
const choicesEl = document.getElementById('choices');
const imageWrap = document.getElementById('image-wrap');
const backBtn = document.getElementById('backBtn');
const restartBtn = document.getElementById('restartBtn');
const saveBtn = document.getElementById('saveBtn');
const loadBtn = document.getElementById('loadBtn');
const chooseBtn = document.getElementById('chooseBtn');
const breadcrumbsEl = document.getElementById('breadcrumbs');
const feedbackEl = document.getElementById('feedback');
const endNote = document.getElementById('end-note');



/* ---------------- Utility ---------------- */
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function announce(msg){
  feedbackEl.textContent = msg;
  clearTimeout(announce._t);
  announce._t = setTimeout(()=> feedbackEl.textContent = '', FEEDBACK_TIMEOUT);
}
function storageKeyForStory(id){ return `story_progress_${id}_v1`; }

/* ---------------- Story selector handlers ---------------- */
document.querySelectorAll('.story-btn').forEach(btn=>{
  btn.addEventListener('click', ()=> {
    const id = btn.dataset.story;
    startStory(id);
  });
});

chooseBtn.addEventListener('click', ()=> {
  // go back to selector
  showSelector();
});

/* ---------------- Start / Show functions ---------------- */
function showSelector(){
  selector.classList.remove('hidden');
  mainUI.classList.add('hidden');
  footer.classList.add('hidden');
  // reset UI
  titleEl.textContent = 'Title';
  subtitleEl.textContent = '';
  contentEl.innerHTML = '';
  choicesEl.innerHTML = '';
  imageWrap.style.backgroundImage = '';
  breadcrumbsEl.innerHTML = '';
}

function startStory(storyId){
  const story = STORIES[storyId];
 if(!story) { showToast('Story not found'); return; }
  CURRENT_STORY = story;
  selector.classList.add('hidden');
  mainUI.classList.remove('hidden');
  footer.classList.remove('hidden');

  // set header
  titleEl.textContent = story.title || 'Story';
  subtitleEl.textContent = story.subtitle || '';
  historyStack = [];

  // try load saved progress for this story (ask user)
  const saved = loadProgressImmediate(story.id);
if(saved){
  historyStack = saved.historyStack || [];
  currentNodeId = saved.currentNodeId || story.start;
  renderNode(currentNodeId, {pushHistory:false});
  showToast('Resumed saved progress.');
} else {
  currentNodeId = story.start;
  renderNode(currentNodeId, {pushHistory:false});
}

}

/* ---------------- Rendering ---------------- */
function renderNode(nodeId, opts={pushHistory:true,setFocus:true}){
  if(!CURRENT_STORY) return;
  const node = CURRENT_STORY.nodes[nodeId];
  if(!node){
    contentEl.innerHTML = `<p>Unknown node: ${escapeHtml(nodeId)}</p>`;
    choicesEl.innerHTML = '';
    return;
  }

  // title/subtitle update
  titleEl.textContent = CURRENT_STORY.title;
  subtitleEl.textContent = CURRENT_STORY.subtitle;

  // background image
  if(node.image){
    imageWrap.style.backgroundImage = `url(${node.image})`;
    imageWrap.style.opacity = '1';
    imageWrap.style.transform = 'scale(1.02)';
    setTimeout(()=> imageWrap.style.transform = 'scale(1)', 700);
  } else {
    imageWrap.style.backgroundImage = '';
    imageWrap.style.opacity = '0';
  }

  // content with simple enter animation
  contentEl.classList.remove('enter','show');
  void contentEl.offsetWidth;
  contentEl.classList.add('enter');
  contentEl.innerHTML = `<h2>${escapeHtml(node.title || '')}</h2><p>${escapeHtml(node.text || '')}</p>`;
  setTimeout(()=> contentEl.classList.add('show'), 10);

  // choices
  choicesEl.innerHTML = '';
  if(Array.isArray(node.choices) && node.choices.length){
    node.choices.forEach(choice=>{
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-btn';
      btn.innerHTML = escapeHtml(choice.label);
      btn.addEventListener('click', ()=> handleChoice(choice.id));
      choicesEl.appendChild(btn);
    });
    endNote.classList.add('hidden');
  } else {
    // ending node
    endNote.classList.remove('hidden');
  }

  // history handling
  if(opts.pushHistory){
    if(currentNodeId !== null) historyStack.push(currentNodeId);
    currentNodeId = nodeId;
  } else {
    currentNodeId = nodeId;
  }

  updateBreadcrumbs();
  if(opts.setFocus) contentEl.focus();
  announce(`Loaded: ${node.title}`);
}

/* ---------------- Choice handling ---------------- */
function handleChoice(nextId){
  if(!CURRENT_STORY.nodes[nextId]) { announce('This path is unavailable'); return; }
  renderNode(nextId, {pushHistory:true});
}

/* ---------------- Back / Restart / Save / Load ---------------- */
backBtn.addEventListener('click', ()=> {
  if(!historyStack.length){ announce('No previous step'); return; }
  const prev = historyStack.pop();
  renderNode(prev, {pushHistory:false});
});

restartBtn.addEventListener('click', ()=> {
  if(!CURRENT_STORY) return;
  if(!confirm('Restart story? This will clear saved progress for this story.')) return;
  clearSaved(CURRENT_STORY.id);
  historyStack = [];
  currentNodeId = CURRENT_STORY.start;
  renderNode(currentNodeId, {pushHistory:false});
  announce('Story restarted.');
});

saveBtn.addEventListener('click', ()=> {
  if(!CURRENT_STORY) return;
  saveProgress();
  announce('Progress saved.');
});

loadBtn.addEventListener('click', ()=> {
  if(!CURRENT_STORY) return;
  const s = loadProgressImmediate(CURRENT_STORY.id);
  if(s){
    historyStack = s.historyStack || [];
    currentNodeId = s.currentNodeId || CURRENT_STORY.start;
    renderNode(currentNodeId, {pushHistory:false});
    announce('Progress loaded.');
  } else announce('No saved progress found.');
});

/* Save to localStorage */
function saveProgress(){
  if(!CURRENT_STORY) return;
  const key = storageKeyForStory(CURRENT_STORY.id);
  const payload = { timestamp: Date.now(), currentNodeId, historyStack };
  try { localStorage.setItem(key, JSON.stringify(payload)); } catch(e){ console.error(e); announce('Save failed'); }
}

/* load helper (returns parsed) */
function loadProgressImmediate(storyId){
  const key = storageKeyForStory(storyId);
  try {
    const raw = localStorage.getItem(key);
    if(!raw) return null;
    return JSON.parse(raw);
  } catch(e){ return null; }
}

function clearSaved(storyId){ try { localStorage.removeItem(storageKeyForStory(storyId)); } catch(e){} }

/* ---------------- Breadcrumbs ---------------- */
function updateBreadcrumbs(){
  breadcrumbsEl.innerHTML = '';
  const path = [...historyStack, currentNodeId].filter(Boolean);
  path.forEach((nid, idx)=>{
    const li = document.createElement('li');
    const node = CURRENT_STORY.nodes[nid];
    li.textContent = node && node.title ? node.title : nid;
    li.title = `Jump to: ${nid}`;
    li.addEventListener('click', ()=> {
      historyStack = path.slice(0, idx);
      renderNode(nid, {pushHistory:false});
    });
    breadcrumbsEl.appendChild(li);
  });
}

/* ---------------- Keyboard shortcuts ---------------- */
document.addEventListener('keydown', (e)=>{
  if(e.key === 'ArrowLeft') backBtn.click();
  if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's'){ e.preventDefault(); saveBtn.click(); }
  if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r'){ e.preventDefault(); restartBtn.click(); }
});

/* ---------------- Initialize UI ---------------- */
showSelector(); // show story selector on page load

function showToast(message, duration=2500) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

const bgm = document.getElementById("bgm");
const toggleBgm = document.getElementById("toggleBgm");
let isPlaying = false;

toggleBgm.addEventListener("click", () => {
  if(isPlaying){
    bgm.pause();
    showToast("Music paused 🎶");
  } else {
    bgm.play();
    showToast("Music playing 🎶");
  }
  isPlaying = !isPlaying;
});
