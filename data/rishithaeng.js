window.SUBJECTS = window.SUBJECTS || [];
window.SUBJECTS.push({
  id: "rishithaeng", name: "Rishitha-English", icon: "📚", color: "#7c3aed",
  labels: { notes: "Syllabus & Lessons", quick: "Practice Games", papers: "Practice Tests", tips: "Tips for Parents" },
  overview: "Welcome to Cambridge Primary Stage 3 English! 📖 Each short lesson helps you read, spell and write a little better, and the practice games make it fun. Parents can sit nearby, read along, and cheer you on as you try a practice test at the weekend. ⭐",
  examFormat: [
    "Cambridge Primary Stage 3 English follows the Cambridge Primary English curriculum framework.",
    "Schools may use Cambridge Primary Progression Tests at the end of Stage 3 to check reading and writing; they are not public exams.",
    "How to use this tab: one lesson a day (10–15 minutes), a practice game, then a weekend test.",
    "Move on to the next test when you score 80% or more."
  ],
  tips: [
    "<b>For you:</b> Read something every day. A story, a comic, a recipe or a sign in the street all count! 📖",
    "<b>For you:</b> Stuck on a long word? Break it into small parts and sound out each part: <i>fan-tas-tic</i>. Then put the parts back together.",
    "<b>For you:</b> When you finish writing, read it out loud. Your ears will often spot a mistake that your eyes missed. 👂",
    "<b>For you:</b> Use the magic check for every sentence: ‘Capital letter? Full stop? Does it make sense?’ ✅",
    "<b>For you:</b> If you don't know a word, read the whole sentence again. The other words often give you a clue to what it means. 🔍",
    "<b>For you:</b> Mistakes help your brain grow. Fix it, try again, and give yourself a ⭐ for trying.",
    "<b>For parents:</b> Read together for about 15 minutes every day. Take turns reading pages, and let your child hear you read with expression and funny voices.",
    "<b>For parents:</b> Ask questions while you read: ‘What do you think will happen next?’, ‘How is she feeling?’, ‘How do you know?’ This builds understanding, not just word reading.",
    "<b>For parents:</b> Keep a ‘new words’ notebook. When you meet an interesting word, write it down, talk about what it means, and try to use it that week. ✏️",
    "<b>For parents:</b> Praise effort and good thinking: ‘I love the word you chose there!’ or ‘You sounded that out really well.’",
    "<b>For parents:</b> Make writing real. Write shopping lists, birthday cards, thank-you letters, notes to family and labels for toy boxes together. 🛒",
    "<b>For parents:</b> Play word games: I spy, rhyming tennis, ‘think of an adjective for…’, word searches and simple board games with spelling.",
    "<b>For parents:</b> Don't correct every mistake at once. Pick one or two things to work on, such as full stops or one spelling pattern, and celebrate the rest.",
    "<b>For parents:</b> The tests here are for practice only. If a score is below 80%, go back to the lessons that were tricky and try the test again in a few days."
  ],
  topics: [
    // ---------- 1 · Reading ----------
    { strand: "1 · Reading", title: "Reading longer words and tricky words",
      notes: [
        "Long words are just short parts stuck together. Each part is called a <b>syllable</b>. Clap them: <i>but-ter-fly</i> has 3 claps.",
        "Read a long word one syllable at a time, then blend: <i>hos-pi-tal</i> → hospital. 👏",
        "Look for little words you already know inside big words: <i>sun</i> + <i>flower</i> = sunflower.",
        "Some words do not follow the rules. We call them <b>tricky words</b> (common exception words): <i>said, was, they, could, would, people, because, friend, does</i>.",
        "Learn tricky words by looking, saying, covering, writing and checking. Practise a few each week."
      ],
      keyTerms: ["syllable", "blend", "tricky word", "compound word"],
      commonMistakes: [
        "Guessing a long word from its first letter. Slow down and read every part.",
        "Spelling ‘said’ as ‘sed’. It is a tricky word, so it has to be learned by heart."
      ],
      example: { q: "How many syllables are in <b>remember</b>?", a: "Clap it out: re-mem-ber. That is 3 claps, so <b>remember</b> has 3 syllables. 👏👏👏" } },

    { strand: "1 · Reading", title: "Characters, setting and plot",
      notes: [
        "<b>Characters</b> are the people or animals in a story.",
        "The <b>setting</b> is where and when the story happens: a forest at night, a busy market, a spaceship. 🌲",
        "The <b>plot</b> is what happens. Most stories have a <b>beginning</b> (meet the characters), a <b>middle</b> (a problem happens) and an <b>end</b> (the problem is solved).",
        "Look at what characters say and do. It tells you what they are like: kind, brave, grumpy or silly.",
        "Ask yourself: Who? Where? What went wrong? How was it fixed?"
      ],
      keyTerms: ["character", "setting", "plot", "beginning", "middle", "end"],
      commonMistakes: [
        "Thinking the setting is only a place. It can be a time too, like ‘a snowy winter morning’.",
        "Retelling every tiny detail. For the plot, pick the most important things that happen."
      ],
      example: { q: "Zara lost her cat in the busy city market. She searched every stall, and at last she found it asleep in a basket of oranges.<br>What is the setting? What is the problem?", a: "The setting is <b>a busy city market</b>. The problem is that <b>Zara has lost her cat</b>. It is solved at the end when she finds the cat asleep in the basket. 🐱" } },

    { strand: "1 · Reading", title: "Predicting and characters' feelings",
      notes: [
        "To <b>predict</b> means to make a clever guess about what will happen next. 🔮",
        "Use clues: the title, the pictures, and what has already happened.",
        "Good readers say: ‘I think… because…’. For example, ‘I think the boat will sink because it has a hole.’",
        "Characters have <b>feelings</b>. Look for clues: ‘She stamped her feet’ shows she is cross. ‘His hands shook’ shows he is scared.",
        "It is fine if your prediction is wrong! Check as you read and change your idea."
      ],
      keyTerms: ["predict", "clue", "feelings"],
      commonMistakes: [
        "Making a guess with no reason. Always add ‘because…’ and a clue from the story.",
        "Only naming feelings like ‘happy’ and ‘sad’. Try ‘nervous’, ‘proud’, ‘excited’ or ‘lonely’ too."
      ],
      example: { q: "Omar's knees were wobbling as he walked onto the stage. How is Omar feeling? How do you know?", a: "Omar is feeling <b>nervous</b>. I know because his <b>knees were wobbling</b>, and that happens when people are worried or scared." } },

    { strand: "1 · Reading", title: "Non-fiction: finding your way around a book",
      notes: [
        "<b>Non-fiction</b> books give true facts and information. Fiction books tell made-up stories.",
        "<b>Headings</b> are titles for each part. They tell you what that part is about.",
        "A <b>caption</b> is a few words under a picture that explain it. 🖼️",
        "The <b>contents</b> page is at the front. It lists the chapters in order with page numbers.",
        "The <b>index</b> is at the back. It lists topics in alphabetical order with page numbers.",
        "The <b>glossary</b> explains special words, like a mini dictionary at the back of the book."
      ],
      keyTerms: ["non-fiction", "heading", "caption", "contents", "index", "glossary"],
      commonMistakes: [
        "Mixing up contents and index. Contents = front, in page order. Index = back, in ABC order.",
        "Reading the whole book to find one fact. Use the headings or index to jump straight there."
      ],
      example: { q: "You want to find out what <b>hibernate</b> means in a book about bears. Where should you look?", a: "Look in the <b>glossary</b> at the back. It explains special words. (Hibernate means to sleep through the winter. 🐻)" } },

    { strand: "1 · Reading", title: "Fact and opinion",
      notes: [
        "A <b>fact</b> is true and can be checked: ‘A spider has eight legs.’",
        "An <b>opinion</b> is what someone thinks or feels. Other people might not agree: ‘Spiders are scary.’",
        "Opinion clue words: <i>I think, I believe, best, worst, beautiful, boring, should</i>.",
        "Information books are mostly facts. Adverts and reviews have lots of opinions.",
        "Ask: ‘Could I prove this?’ If yes, it is a fact. ⭐"
      ],
      keyTerms: ["fact", "opinion"],
      commonMistakes: [
        "Thinking an opinion is a fact because you agree with it. ‘Chocolate is the best food’ is still an opinion!"
      ],
      example: { q: "Which is a fact and which is an opinion?<br>A: The Moon goes around the Earth.<br>B: The Moon is the prettiest thing in the sky.", a: "<b>A is a fact</b>, because scientists can check it. <b>B is an opinion</b>, because ‘prettiest’ is what someone thinks, and not everyone would agree." } },

    { strand: "1 · Reading", title: "Poetry: rhyme, rhythm, repetition and alliteration",
      notes: [
        "<b>Rhyme</b>: words that end with the same sound, like <i>cat</i> and <i>hat</i>, or <i>night</i> and <i>bright</i>. 🎵",
        "<b>Rhythm</b>: the beat of a poem. Clap along as you read it aloud.",
        "<b>Repetition</b>: words or lines that are said again, to make them stand out.",
        "<b>Alliteration</b>: words close together that start with the same sound: <i>slippery silver snake</i>.",
        "Poems are often split into groups of lines called <b>verses</b>. Read poems aloud to enjoy their sound."
      ],
      keyTerms: ["rhyme", "rhythm", "repetition", "alliteration", "verse"],
      commonMistakes: [
        "Thinking words must look the same to rhyme. <i>Blue</i> and <i>shoe</i> rhyme even though they are spelled differently.",
        "Calling any repeated letter alliteration. It is about the starting sounds of words that are close together."
      ],
      example: { q: "Find the alliteration and the rhyme:<br><i>Busy bees buzz all day,<br>Flying, floating far away.</i>", a: "Alliteration: <b>busy bees buzz</b> (all start with b) and <b>flying, floating far</b> (all start with f). Rhyme: <b>day</b> and <b>away</b>. 🐝" } },

    { strand: "1 · Reading", title: "Finding information, inference and word meanings",
      notes: [
        "Question words tell you what to look for: <b>who</b> (a person), <b>what</b> (a thing), <b>where</b> (a place), <b>when</b> (a time), <b>why</b> (a reason), <b>how</b> (the way).",
        "Find the answer: look back at the text and find the key word from the question. 🔍",
        "<b>Inference</b> means working out something the writer does not say straight out. You use clues like a detective. 🕵️",
        "If a question asks ‘How do you know?’, use words from the text to prove your answer.",
        "Meet a new word? Read the sentence around it. The other words are clues to the meaning."
      ],
      keyTerms: ["inference", "clue", "evidence", "context"],
      commonMistakes: [
        "Answering from memory instead of looking back at the text. Always check!",
        "Answering a ‘why’ question with a place or a time. A ‘why’ answer needs a reason, often with ‘because’."
      ],
      example: { q: "Ben came in, dripping wet, and shook his umbrella.<br>What was the weather like? How do you know?", a: "It was <b>raining</b>. The text does not say ‘rain’, but I know because Ben was <b>dripping wet</b> and he had an <b>umbrella</b>. ☔" } },

    { strand: "1 · Reading", title: "Speaking, listening and reading aloud",
      notes: [
        "<b>Listen carefully</b>: look at the person speaking and think about what they say. 👂",
        "<b>Take turns</b>: wait until the other person has finished before you speak.",
        "Speak clearly, not too fast, and loud enough for everyone to hear.",
        "<b>Read aloud with expression</b>: make your voice go up for a question, sound excited for an exclamation, and use voices for characters. 🎭",
        "Pause a little at commas and full stops. They are little resting places."
      ],
      keyTerms: ["listen", "take turns", "expression"],
      commonMistakes: [
        "Reading so fast that nobody can follow. Slow down and pause at full stops."
      ],
      example: { q: "How should you read this sentence aloud? <i>“Watch out for the puddle!” shouted Mia.</i>", a: "Read the words in speech marks in a <b>loud, worried</b> voice, because of the exclamation mark and the word ‘shouted’. Then read ‘shouted Mia’ in your normal voice." } },

    // ---------- 2 · Grammar and Punctuation ----------
    { strand: "2 · Grammar and Punctuation", title: "Sentences and the four sentence types",
      notes: [
        "A sentence starts with a <b>capital letter</b> and ends with a full stop (.), question mark (?) or exclamation mark (!). It must make sense on its own.",
        "<b>Statement</b>: tells you something. <i>The bus is late.</i>",
        "<b>Question</b>: asks something. <i>Is the bus late?</i>",
        "<b>Exclamation</b>: shows strong feeling, like surprise. <i>What a long wait!</i> 😮",
        "<b>Command</b>: tells someone to do something. It often starts with a bossy verb. <i>Wait at the bus stop.</i>"
      ],
      keyTerms: ["sentence", "statement", "question", "exclamation", "command"],
      commonMistakes: [
        "Forgetting the capital letter at the start of each new sentence.",
        "Joining lots of ideas with commas in one long sentence. Use a full stop and start again."
      ],
      example: { q: "What type of sentence is: <i>Put your shoes on.</i>", a: "It tells someone to do something, and it starts with the bossy verb ‘put’. So it is a <b>command</b>. ✏️" } },

    { strand: "2 · Grammar and Punctuation", title: "Question marks, exclamation marks and commas in lists",
      notes: [
        "Use a <b>question mark ?</b> at the end of a question. Questions often start with <i>who, what, where, when, why, how, can, do, is</i>.",
        "Use an <b>exclamation mark !</b> for strong feelings or loud sounds: <i>Ouch! That hurts!</i>",
        "Don't use too many exclamation marks. One is enough! ⭐",
        "In a list, put a <b>comma</b> between the items. Before the last item, use <b>and</b> or <b>or</b> instead of a comma.",
        "<i>I packed a hat, a towel, sun cream and a drink.</i>"
      ],
      keyTerms: ["question mark", "exclamation mark", "comma", "list"],
      commonMistakes: [
        "Putting a comma before ‘and’ in a simple list. In Stage 3 we write: <i>red, blue and green</i>.",
        "Using a full stop after a question. Check: is it asking something?"
      ],
      example: { q: "Add the commas: <i>We saw lions tigers zebras and monkeys at the zoo.</i>", a: "Put a comma between each item, but not before ‘and’:<br><i>We saw lions<b>,</b> tigers<b>,</b> zebras and monkeys at the zoo.</i>" } },

    { strand: "2 · Grammar and Punctuation", title: "Apostrophes: short forms and belonging",
      notes: [
        "An <b>apostrophe</b> looks like a little flying comma: <b>'</b>",
        "<b>Contractions</b> (short forms): two words squash together and the apostrophe goes where letters are missing. <i>do not → don't</i>, <i>can not → can't</i>, <i>I am → I'm</i>, <i>it is → it's</i>, <i>we will → we'll</i>.",
        "<b>Possession</b> (belonging): add <b>'s</b> to show something belongs to one person or thing. <i>the dog's bone</i>, <i>Grandma's glasses</i>. 🦴",
        "Plurals do not need an apostrophe: <i>I have two dogs</i> (no apostrophe!)."
      ],
      keyTerms: ["apostrophe", "contraction", "possession"],
      commonMistakes: [
        "Putting the apostrophe in the wrong place: <i>do'nt</i>. It goes where the missing letter was: <i>don't</i> (the o of ‘not’ is missing).",
        "Adding an apostrophe to every word ending in s, like <i>apple's for sale</i>. Only use it for belonging or missing letters."
      ],
      example: { q: "Write <b>the ball belonging to Raj</b> in a shorter way. Then shorten <b>did not</b>.", a: "Belonging: <b>Raj's ball</b> (add apostrophe + s).<br>Short form: <b>didn't</b>. The ‘o’ in ‘not’ is missing, so the apostrophe goes there." } },

    { strand: "2 · Grammar and Punctuation", title: "Speech marks",
      notes: [
        "<b>Speech marks</b> “ ” go around the exact words someone says. They are like a speech bubble in a comic. 💬",
        "Start the spoken words with a capital letter: <i>“<b>W</b>here are you going?” asked Dad.</i>",
        "The punctuation at the end of the spoken words (, ? or !) goes <b>inside</b> the closing speech marks.",
        "<i>“I'm hungry,” said Lena.</i> &nbsp; <i>Lena said, “I'm hungry.”</i>",
        "Use interesting words instead of ‘said’: <i>shouted, whispered, asked, laughed, cried, replied</i>."
      ],
      keyTerms: ["speech marks", "inverted commas", "dialogue"],
      commonMistakes: [
        "Putting speech marks around words nobody says, like ‘said Lena’.",
        "Leaving the comma or question mark outside the speech marks."
      ],
      example: { q: "Add speech marks: <i>Can I play too? asked Hiro.</i>", a: "Find the exact words Hiro says: <i>Can I play too?</i> Put speech marks around them, with the question mark inside:<br><b>“Can I play too?” asked Hiro.</b>" } },

    { strand: "2 · Grammar and Punctuation", title: "Nouns, proper nouns and pronouns",
      notes: [
        "A <b>noun</b> is a naming word for a person, place, animal or thing: <i>teacher, park, horse, pencil</i>.",
        "A <b>proper noun</b> is the special name of one person, place or thing. It always has a capital letter: <i>Aisha, Paris, Monday, July, the River Nile</i>. 🗺️",
        "A <b>pronoun</b> takes the place of a noun so we don't repeat it: <i>I, you, he, she, it, we, they, me, him, her, us, them</i>.",
        "<i>Pedro has a dog. <b>He</b> walks <b>it</b> every day.</i> (He = Pedro, it = the dog)"
      ],
      keyTerms: ["noun", "proper noun", "pronoun", "capital letter"],
      commonMistakes: [
        "Forgetting capital letters for days and months: <i>monday</i> should be <i>Monday</i>.",
        "Using so many pronouns that the reader gets lost. Use the name sometimes too."
      ],
      example: { q: "Find the proper noun and the pronoun: <i>On Friday, Chen baked a cake and she shared it.</i>", a: "Proper nouns have capital letters in the middle of a sentence: <b>Friday</b> and <b>Chen</b>. The pronouns are <b>she</b> (instead of Chen) and <b>it</b> (instead of the cake)." } },

    { strand: "2 · Grammar and Punctuation", title: "Verbs, adjectives and adverbs",
      notes: [
        "A <b>verb</b> is a doing or being word: <i>run, eat, think, is, was</i>. Every sentence needs one! 🏃",
        "An <b>adjective</b> describes a noun: <i>a <b>huge</b>, <b>hairy</b> spider</i>.",
        "An <b>adverb</b> tells you how a verb is done. Many adverbs end in <b>-ly</b>: <i>She whispered <b>quietly</b>. He ran <b>quickly</b>.</i>",
        "Use adjectives and adverbs to make your writing more exciting.",
        "Try swapping boring words: <i>nice</i> → <i>delicious, friendly, sparkly</i>."
      ],
      keyTerms: ["verb", "adjective", "adverb"],
      commonMistakes: [
        "Using the adjective when you need the adverb: <i>He ran quick</i> should be <i>He ran quickly</i>."
      ],
      example: { q: "Find the verb, the adjective and the adverb: <i>The sleepy owl hooted softly.</i>", a: "Verb (doing word): <b>hooted</b>.<br>Adjective (describes the owl): <b>sleepy</b>.<br>Adverb (how it hooted, ends in -ly): <b>softly</b>. 🦉" } },

    { strand: "2 · Grammar and Punctuation", title: "Joining words (conjunctions)",
      notes: [
        "A <b>conjunction</b> joins two ideas to make a longer sentence.",
        "<b>and</b> adds more: <i>I ate lunch and I drank juice.</i>",
        "<b>but</b> shows a change: <i>I like apples but I don't like pears.</i>",
        "<b>so</b> shows what happened next as a result: <i>It was cold so I wore a coat.</i>",
        "<b>because</b> gives a reason: <i>I wore a coat because it was cold.</i> 🧥",
        "<b>when</b> tells the time, <b>if</b> tells a condition, and <b>or</b> gives a choice: <i>Do you want rice or pasta?</i>"
      ],
      keyTerms: ["conjunction", "joining word"],
      commonMistakes: [
        "Using ‘and’ again and again. Try ‘because’, ‘so’ or ‘but’ to make your writing more interesting.",
        "Mixing up ‘so’ and ‘because’. ‘Because’ gives the reason; ‘so’ gives the result."
      ],
      example: { q: "Choose the best conjunction: <i>The children went inside ___ it started to rain.</i> (but / because / or)", a: "We need a <b>reason</b> why they went inside, so the answer is <b>because</b>: <i>The children went inside because it started to rain.</i>" } },

    { strand: "2 · Grammar and Punctuation", title: "Past and present tense",
      notes: [
        "<b>Present tense</b> tells what is happening now: <i>I play. She plays. We are playing.</i>",
        "<b>Past tense</b> tells what has already happened: <i>I played yesterday.</i> ⏰",
        "Many verbs add <b>-ed</b> for the past: <i>jump → jumped, walk → walked</i>.",
        "Some verbs are <b>irregular</b> and change in a special way: <i>go → went, see → saw, run → ran, eat → ate, come → came, make → made, write → wrote</i>.",
        "Stay in the same tense when you write a story or a recount."
      ],
      keyTerms: ["tense", "present", "past", "irregular verb"],
      commonMistakes: [
        "Adding -ed to irregular verbs: <i>goed, runned, eated</i>. Learn the special ones.",
        "Switching tense in the middle: <i>I went to the park and I play</i>. Keep it past: <i>I played</i>."
      ],
      example: { q: "Change to the past tense: <i>Today I see a rainbow and I run outside.</i>", a: "Change ‘Today’ to ‘Yesterday’. ‘see’ is irregular → <b>saw</b>. ‘run’ is irregular → <b>ran</b>.<br><i>Yesterday I saw a rainbow and I ran outside.</i> 🌈" } },

    // ---------- 3 · Spelling and Vocabulary ----------
    { strand: "3 · Spelling and Vocabulary", title: "Long vowel sounds: a and e",
      notes: [
        "The long <b>a</b> sound (as in <i>rain</i>) can be spelled <b>ai</b> (rain, train), <b>ay</b> (day, play) or <b>a-e</b> (cake, name).",
        "Tip: <b>ay</b> usually comes at the <b>end</b> of a word. <b>ai</b> is usually in the <b>middle</b>.",
        "The long <b>e</b> sound (as in <i>tree</i>) can be spelled <b>ee</b> (feet, sheep), <b>ea</b> (beach, read) or <b>e-e</b> (these, Pete).",
        "In <b>a-e</b> and <b>e-e</b>, the e at the end is a ‘magic e’. It is silent but makes the vowel say its name: <i>cap → cape</i>. ✨",
        "If you're not sure, write the word two ways and see which looks right."
      ],
      keyTerms: ["vowel", "long vowel sound", "magic e"],
      commonMistakes: [
        "Spelling ‘play’ as ‘plai’. Remember: ay at the end.",
        "Forgetting the magic e: <i>mak</i> instead of <i>make</i>."
      ],
      example: { q: "Fill the gap with <b>ai</b> or <b>ay</b>: <i>Let's pl__ in the r__n.</i>", a: "‘pl__’ — the sound is at the end, so use <b>ay</b>: <b>play</b>.<br>‘r__n’ — the sound is in the middle, so use <b>ai</b>: <b>rain</b>." } },

    { strand: "3 · Spelling and Vocabulary", title: "Long vowel sounds: i, o and u",
      notes: [
        "The long <b>i</b> sound (as in <i>night</i>) can be spelled <b>igh</b> (light, high), <b>ie</b> (pie, tie) or <b>i-e</b> (bike, smile).",
        "The long <b>o</b> sound (as in <i>boat</i>) can be spelled <b>oa</b> (coat, road), <b>ow</b> (snow, grow) or <b>o-e</b> (home, bone).",
        "The long <b>oo</b> sound (as in <i>moon</i>) can be spelled <b>oo</b> (spoon, food), <b>ue</b> (blue, glue) or <b>u-e</b> (flute, June). 🌙",
        "<b>ow</b> and <b>ue</b> often come at the end of a word: <i>snow, blue</i>.",
        "Make word families: <i>light, night, fight, bright, sight</i>."
      ],
      keyTerms: ["long vowel sound", "word family"],
      commonMistakes: [
        "Spelling ‘night’ as ‘nite’. The igh spelling is the most common in the middle of words like this.",
        "Mixing up ‘ow’ in snow (long o) and ‘ow’ in cow. Say the word aloud to check."
      ],
      example: { q: "Which spelling is right: <b>boat</b>, <b>bote</b> or <b>bowt</b>?", a: "The long o sound in the middle of a word is often <b>oa</b>. The right spelling is <b>boat</b>. ⛵" } },

    { strand: "3 · Spelling and Vocabulary", title: "Soft c, soft g and silent letters",
      notes: [
        "Usually <b>c</b> sounds like k (<i>cat</i>), but before <b>e, i</b> or <b>y</b> it often says <b>s</b>: <i>city, ice, face, cycle</i>. This is a <b>soft c</b>.",
        "Usually <b>g</b> sounds like in <i>goat</i>, but before <b>e, i</b> or <b>y</b> it often says <b>j</b>: <i>giant, gem, page, gym</i>. This is a <b>soft g</b>.",
        "Some letters are <b>silent</b>: you write them but don't say them. 🤫",
        "<b>kn</b>: knee, knock, knife. <b>wr</b>: write, wrong, wrap. <b>mb</b>: lamb, thumb, climb.",
        "Say the word in a funny ‘spelling voice’ to remember: ‘k-nife’, ‘w-rite’, ‘lam-b’."
      ],
      keyTerms: ["soft c", "soft g", "silent letter"],
      commonMistakes: [
        "Spelling ‘knee’ as ‘nee’, or ‘write’ as ‘rite’. Remember the silent letters.",
        "Thinking every g before i is soft. ‘girl’ and ‘give’ have a hard g. Learn these as tricky words."
      ],
      example: { q: "Which letter is silent in <b>climb</b>? Which sound does the c make in <b>circle</b> at the start?", a: "In <b>climb</b>, the <b>b</b> is silent (you say ‘clime’). In <b>circle</b>, the first c comes before i, so it is a soft c and says <b>s</b>." } },

    { strand: "3 · Spelling and Vocabulary", title: "Singular and plural",
      notes: [
        "<b>Singular</b> means one. <b>Plural</b> means more than one.",
        "Most words just add <b>-s</b>: <i>cat → cats, book → books</i>.",
        "Words ending in <b>s, x, z, ch, sh</b> add <b>-es</b>: <i>bus → buses, box → boxes, watch → watches, dish → dishes</i>. (Say it: you can hear an extra ‘iz’!)",
        "Words ending in a consonant + <b>y</b>: change y to i and add <b>-es</b>: <i>baby → babies, party → parties</i>.",
        "But a vowel + y just adds -s: <i>day → days, toy → toys</i>. 🧸",
        "Some plurals are irregular: <i>child → children, mouse → mice, foot → feet</i>."
      ],
      keyTerms: ["singular", "plural"],
      commonMistakes: [
        "Writing ‘babys’ or ‘boxs’. Check the last letters of the word first.",
        "Writing ‘toies’. Toy has a vowel before the y, so it is just ‘toys’."
      ],
      example: { q: "Write the plural of <b>fox</b>, <b>pony</b> and <b>key</b>.", a: "fox ends in x → <b>foxes</b>.<br>pony ends in consonant + y → change y to i, add es → <b>ponies</b>.<br>key ends in vowel + y → just add s → <b>keys</b>. 🔑" } },

    { strand: "3 · Spelling and Vocabulary", title: "Prefixes and suffixes",
      notes: [
        "A <b>prefix</b> goes at the <b>start</b> of a word and changes its meaning.",
        "<b>un-</b> and <b>dis-</b> mean ‘not’ or the opposite: <i>unhappy, unlock, disagree, dislike</i>. <b>re-</b> means ‘again’: <i>redo, replay, rebuild</i>.",
        "A <b>suffix</b> goes at the <b>end</b> of a word: <b>-ful</b> (full of: <i>helpful</i>), <b>-less</b> (without: <i>helpless</i>), <b>-ly</b> (how: <i>slowly</i>).",
        "<b>-er</b> and <b>-est</b> compare things: <i>tall, taller, tallest</i>. <b>-ing</b> and <b>-ed</b> go on verbs: <i>jumping, jumped</i>.",
        "Watch out! Drop the magic e before -ing: <i>make → making</i>. Double a short-vowel ending: <i>big → bigger, hop → hopping</i>. Change y to i: <i>happy → happily</i>. ✏️",
        "<b>-ful</b> only has <b>one l</b>: <i>careful</i>, not <i>carefull</i>."
      ],
      keyTerms: ["prefix", "suffix", "root word"],
      commonMistakes: [
        "Spelling ‘hopeful’ as ‘hopefull’. The suffix -ful has only one l.",
        "Writing ‘makeing’. Drop the e first: making."
      ],
      example: { q: "Add a prefix to make the opposite of <b>tidy</b>. Then add a suffix to <b>care</b> to mean ‘without care’.", a: "un + tidy = <b>untidy</b>.<br>care + less = <b>careless</b>. ⭐" } },

    { strand: "3 · Spelling and Vocabulary", title: "Synonyms, antonyms and alphabetical order",
      notes: [
        "<b>Synonyms</b> are words that mean the same or nearly the same: <i>big, large, huge, enormous</i>.",
        "<b>Antonyms</b> are opposites: <i>hot ↔ cold, up ↔ down, always ↔ never</i>.",
        "Use synonyms to stop repeating the same word in your writing. A thesaurus helps you find them. 📘",
        "<b>Alphabetical order</b> means ABC order. Look at the first letter: <i>apple, banana, cherry</i>.",
        "If the first letters are the same, look at the second letter: <i>sand, sea, sun</i>.",
        "Dictionaries, glossaries and indexes all use alphabetical order."
      ],
      keyTerms: ["synonym", "antonym", "alphabetical order", "dictionary", "thesaurus"],
      commonMistakes: [
        "Mixing up synonym and antonym. Antonym = anti = against = opposite!",
        "Stopping at the first letter when two words start the same way."
      ],
      example: { q: "Put these words in alphabetical order: <b>tree, rock, tent, apple</b>.", a: "First letters: t, r, t, a. So <b>apple</b> comes first, then <b>rock</b>. Two words start with t, so look at the second letter: <i>tent</i> (e) comes before <i>tree</i> (r).<br>Answer: <b>apple, rock, tent, tree</b>." } },

    // ---------- 4 · Writing ----------
    { strand: "4 · Writing", title: "Plan, write, check: paragraphs and editing",
      notes: [
        "<b>Plan first</b>: jot down your ideas in a list, a story map or a quick drawing. ✏️",
        "<b>Paragraphs</b> are groups of sentences about one idea. Start a new paragraph for a new time, place, person or idea.",
        "Start each new paragraph on a new line.",
        "<b>Check</b> your writing: Capital letters? Full stops? Does it make sense? Are tricky words spelled right?",
        "<b>Edit</b> to make it better: add an adjective, change ‘and then’ to a better joining word, or swap ‘nice’ for a more exciting word.",
        "Read it aloud to yourself or to a grown-up. ⭐"
      ],
      keyTerms: ["plan", "paragraph", "check", "edit"],
      commonMistakes: [
        "Writing everything in one big block. Use paragraphs for a beginning, middle and end.",
        "Skipping the checking step. Even great writers fix their work!"
      ],
      example: { q: "Make this sentence better: <i>the dog was nice and it ran.</i>", a: "Step 1: Capital letter at the start: <i>The</i>.<br>Step 2: Swap ‘nice’ for a better adjective and add an adverb.<br><b>The friendly dog wagged its tail and ran happily across the field.</b>" } },

    { strand: "4 · Writing", title: "Instructions and time connectives",
      notes: [
        "<b>Instructions</b> tell someone how to do or make something. 🥪",
        "Start with a title (<i>How to make a sandwich</i>) and a list of what you need.",
        "Write the steps in order, often numbered.",
        "Start each step with a bossy verb (a command): <i>Spread, Cut, Put, Mix</i>.",
        "Use <b>time connectives</b> to show the order: <b>first, next, then, after that, finally</b>.",
        "Time connectives also help in stories and recounts."
      ],
      keyTerms: ["instructions", "time connective", "bossy verb", "command"],
      commonMistakes: [
        "Missing out a step because it seems obvious. Imagine someone who has never done it before.",
        "Using ‘then’ for every step. Mix them up: first, next, after that, finally."
      ],
      example: { q: "Put the time connectives in order: <i>finally, first, after that, next</i>.", a: "<b>First</b> → <b>Next</b> → <b>After that</b> → <b>Finally</b>.<br><i>First, get two slices of bread. Next, spread the butter. After that, add cheese. Finally, put the slices together.</i>" } },

    { strand: "4 · Writing", title: "Writing stories and descriptions",
      notes: [
        "A story needs <b>characters</b>, a <b>setting</b>, a <b>problem</b> and an <b>ending</b>. 📖",
        "Beginning: introduce who and where. Middle: something goes wrong. End: how it gets fixed.",
        "Hook the reader with a great first line: <i>Nobody knew the little red door was magic.</i>",
        "<b>Descriptions</b> help the reader picture things. Use your senses: what can you see, hear, smell, touch and taste?",
        "Use adjectives and adverbs, and a little speech with speech marks to bring characters to life."
      ],
      keyTerms: ["story", "description", "senses", "problem", "ending"],
      commonMistakes: [
        "Ending with ‘and then I woke up, it was all a dream’. Try to solve the problem in a clever way.",
        "Telling the reader everything is ‘nice’. Show it with describing words instead."
      ],
      example: { q: "Write one describing sentence about a beach using two senses.", a: "<b>I could hear the waves crashing on the rocks, and the warm, soft sand tickled my toes.</b><br>Hear = sound sense. Warm, soft sand and tickled = touch sense. 🏖️" } },

    { strand: "4 · Writing", title: "Recounts, letters and simple poems",
      notes: [
        "A <b>recount</b> tells about something that really happened, in time order, in the <b>past tense</b>. A diary is a recount.",
        "Answer who, what, where and when, and say how you felt at the end.",
        "A <b>letter</b> has your address and the date at the top, a greeting (<i>Dear Sam,</i>), the message in paragraphs, and an ending (<i>Love from</i> or <i>Best wishes</i>) with your name. ✉️",
        "A <b>simple poem</b> can use rhyme, repetition and alliteration. It is written in short lines.",
        "Try a list poem: <i>Snow is… soft as a pillow, cold as ice, quiet as a mouse.</i>"
      ],
      keyTerms: ["recount", "diary", "letter", "greeting", "poem"],
      commonMistakes: [
        "Writing a recount in the present tense. It already happened, so use the past tense.",
        "Forgetting the greeting or the ending in a letter."
      ],
      example: { q: "Write the first sentence of a recount about a school trip.", a: "Say who, where and when, in the past tense:<br><b>Last Tuesday, my class went on a trip to the science museum.</b>" } }
  ],
  papers: [
    { id: "p1", title: "Practice Test 1 ⭐", duration: 20,
      intro: "Read the story carefully, then answer the questions. Take your time, and look back at the story whenever you need to. 📖",
      passage: "<h4>The Red Kite</h4><p>On Saturday morning, Amara and her grandad went to the park on the hill. Amara carried her new red kite. It had a long tail with yellow bows.</p><p>The wind was strong. Grandad held the kite up high, and Amara ran as fast as she could. Up, up, up went the kite! It danced and swooped in the sky.</p><p>Suddenly, a big gust of wind pulled the string out of Amara's hands. The kite flew over the pond and landed at the top of an old oak tree. Amara's eyes filled with tears.</p><p>A boy called Leo was walking his dog nearby. “I can help,” he said. He had a long stick for throwing balls to his dog. Carefully, Leo reached up and gently pushed the kite free. It floated down into Amara's arms.</p><p>Amara smiled from ear to ear. “Thank you!” she said. Then she and Leo took turns flying the kite until it was time to go home for lunch.</p>",
      questions: [
        { type: "mcq", topic: "Reading for information", marks: 1, q: "Who did Amara go to the park with?", options: ["her grandad", "her mum", "Leo", "her sister"], answer: 0, solution: "The first sentence says ‘Amara and her grandad went to the park’. Leo only arrived later." },
        { type: "short", topic: "Reading for information", marks: 1, q: "What colour was Amara's kite?", answer: "red", accept: ["red"], solution: "The story says ‘her new red kite’. The bows on the tail were yellow, but the kite was red." },
        { type: "mcq", topic: "Reading for information", marks: 1, q: "Where did the kite land?", options: ["in the pond", "on the grass", "at the top of an oak tree", "on a roof"], answer: 2, solution: "It flew over the pond and landed at the top of an old oak tree." },
        { type: "mcq", topic: "Setting", marks: 1, q: "What is the setting of the story?", options: ["a beach", "a park on a hill", "a school playground", "a busy shop"], answer: 1, solution: "The setting is where the story happens. Amara and Grandad went to the park on the hill." },
        { type: "mcq", topic: "Sequencing", marks: 1, q: "Which of these happened <b>first</b>?", options: ["The kite got stuck in the tree.", "Leo pushed the kite free.", "Amara and Leo took turns flying the kite.", "Grandad held the kite up high."], answer: 3, solution: "Grandad held the kite up at the start. Then it got stuck, then Leo freed it, and at the end they took turns." },
        { type: "mcq", topic: "Characters' feelings", marks: 1, q: "‘Amara's eyes filled with tears.’ How did Amara feel?", options: ["happy", "sleepy", "bored", "upset"], answer: 3, solution: "Tears in your eyes usually mean you are sad or upset. Her kite was stuck in a tree." },
        { type: "mcq", topic: "Word meanings", marks: 1, q: "‘A big <b>gust</b> of wind pulled the string.’ What does <b>gust</b> mean?", options: ["a sudden strong rush of wind", "a little drop of rain", "a kind of bird", "a quiet sound"], answer: 0, solution: "The gust was strong enough to pull the string out of Amara's hands, so it means a sudden strong rush of wind." },
        { type: "mcq", topic: "Inference", marks: 1, q: "How do you know Amara was happy at the end?", options: ["She ran as fast as she could.", "The wind was strong.", "She smiled from ear to ear.", "She carried her kite."], answer: 2, solution: "‘Smiled from ear to ear’ means a very big smile. That is the clue that she was happy." },
        { type: "short", topic: "Plurals", marks: 1, q: "Write the plural of <b>baby</b>.", answer: "babies", accept: ["babies"], solution: "Baby ends in a consonant + y, so change the y to i and add es: babies." },
        { type: "mcq", topic: "Verbs", marks: 1, q: "Which word is the <b>verb</b> (doing word)?<br><i>Leo pushed the kite.</i>", options: ["Leo", "pushed", "the", "kite"], answer: 1, solution: "Pushed is the action, so it is the verb. Leo is a proper noun and kite is a noun." },
        { type: "mcq", topic: "Sentences", marks: 1, q: "Which sentence is written correctly?", options: ["on saturday we went to the park.", "On saturday we went to the park", "on Saturday we went to the park.", "On Saturday we went to the park."], answer: 3, solution: "A sentence needs a capital letter at the start and a full stop at the end. Days of the week are proper nouns, so Saturday needs a capital S too." },
        { type: "short", topic: "Apostrophes", marks: 1, q: "Write <b>can not</b> as one short word with an apostrophe.", answer: "can't", accept: ["can't", "cant", "can’t"], solution: "The letters ‘no’ are taken out and an apostrophe goes in their place: can't." },
        { type: "mcq", topic: "Rhyme", marks: 1, q: "Which word rhymes with <b>kite</b>?", options: ["kit", "bite", "cat", "kind"], answer: 1, solution: "Kite and bite both end with the same ‘ite’ sound. Kit has a short i sound, so it does not rhyme." },
        { type: "mcq", topic: "Punctuation", marks: 1, q: "Which punctuation mark should end this sentence?<br><i>Where is my kite</i>", options: [".", "?", "!", ","], answer: 1, solution: "It starts with ‘Where’ and asks something, so it is a question. It needs a question mark." },
        { type: "long", topic: "Writing", marks: 3, q: "Write 3–4 sentences about a time you played outside. Use at least one joining word such as <b>and</b>, <b>but</b> or <b>because</b>. ✏️", answer: "Last weekend I went to the park with my cousin. We played on the swings and we raced to the big tree. I fell over on the grass, but I wasn't hurt. It was a great day because the sun was shining.", solution: "Marking guide for parents (3 marks):<br>1 mark – most sentences start with a capital letter and end with a full stop.<br>1 mark – uses at least one conjunction correctly (and, but, so, because, when).<br>1 mark – 3 or more sentences that make sense and tell about playing outside.<br>Spelling is not marked here; praise good word choices!" }
      ] },

    { id: "p2", title: "Practice Test 2 ⭐⭐", duration: 25,
      intro: "This time you will read an information text with true facts. Look at the headings to help you find answers quickly. 🐝",
      passage: "<h4>Busy Honeybees</h4><p><b>What is a honeybee?</b><br>A honeybee is a small insect. Like all insects, it has six legs. It also has four thin wings and fuzzy hair on its body.</p><p><b>Where do honeybees live?</b><br>Honeybees live together in a home called a hive. One hive can hold thousands of bees! There is one queen bee. Her job is to lay eggs. Most of the other bees are worker bees.</p><p><b>What do worker bees do?</b><br>Worker bees fly from flower to flower. They drink a sweet juice called nectar. Back at the hive, they turn the nectar into honey. When a bee finds good flowers, it does a special dance to show the other bees where to go.</p><p><b>Why are bees important?</b><br>When bees visit flowers, yellow dust called pollen sticks to their hairy bodies. They carry the pollen to other flowers. This helps plants make fruit and seeds. Without bees, we would have fewer apples and strawberries. I think bees are the most wonderful insects in the world!</p><p><b>Glossary</b><br><b>hive</b> – a home for bees<br><b>nectar</b> – a sweet juice inside flowers<br><b>pollen</b> – a yellow powder made by flowers</p>",
      questions: [
        { type: "short", topic: "Reading for information", marks: 1, q: "How many legs does a honeybee have?", answer: "6", accept: ["6", "six", "6 legs", "six legs"], solution: "The first part says ‘Like all insects, it has six legs.’" },
        { type: "mcq", topic: "Reading for information", marks: 1, q: "What is the home of honeybees called?", options: ["a nest", "a den", "a hive", "a web"], answer: 2, solution: "The text says ‘a home called a hive’. You can also check the glossary." },
        { type: "mcq", topic: "Reading for information", marks: 1, q: "What is the queen bee's job?", options: ["to make honey", "to lay eggs", "to fly to flowers", "to dance"], answer: 1, solution: "The text says ‘There is one queen bee. Her job is to lay eggs.’ The worker bees do the other jobs." },
        { type: "mcq", topic: "Glossary", marks: 1, q: "What is <b>nectar</b>?", options: ["a yellow powder", "a kind of bee", "a bee's egg", "a sweet juice inside flowers"], answer: 3, solution: "The glossary says nectar is ‘a sweet juice inside flowers’. The yellow powder is pollen." },
        { type: "mcq", topic: "Non-fiction features", marks: 1, q: "The bold lines such as <b>Where do honeybees live?</b> tell you what each part is about. What are they called?", options: ["captions", "headings", "an index", "rhymes"], answer: 1, solution: "Headings are titles for each part of a non-fiction text. They help you find information fast." },
        { type: "mcq", topic: "Non-fiction features", marks: 1, q: "Where in this text can you find what <b>pollen</b> means?", options: ["the glossary", "the title", "the first heading", "the contents page"], answer: 0, solution: "The glossary explains special words. Pollen is listed there: ‘a yellow powder made by flowers’." },
        { type: "mcq", topic: "Fact and opinion", marks: 1, q: "Which sentence is an <b>opinion</b>?", options: ["A honeybee has six legs.", "Honeybees live in a hive.", "I think bees are the most wonderful insects in the world!", "Bees carry pollen to other flowers."], answer: 2, solution: "‘I think’ and ‘most wonderful’ show what the writer feels. Other people might not agree, so it is an opinion. The others can be checked, so they are facts." },
        { type: "mcq", topic: "Reading for information", marks: 1, q: "Why does a worker bee do a special dance?", options: ["to show other bees where good flowers are", "to keep warm", "to scare away birds", "to wake up the queen"], answer: 0, solution: "The text says it does a special dance ‘to show the other bees where to go’ when it finds good flowers." },
        { type: "mcq", topic: "Inference", marks: 1, q: "Why would we have fewer apples without bees?", options: ["Bees eat all the apples.", "Bees help plants make fruit by carrying pollen.", "Apples are made from honey.", "Bees grow apple trees in the hive."], answer: 1, solution: "The last part explains that carrying pollen to other flowers helps plants make fruit and seeds. No bees means less pollen carried, so less fruit." },
        { type: "short", topic: "Plurals", marks: 1, q: "Write the plural of <b>fly</b>.", answer: "flies", accept: ["flies"], solution: "Fly ends in a consonant + y, so change y to i and add es: flies." },
        { type: "mcq", topic: "Adjectives", marks: 1, q: "Which word is an <b>adjective</b>?<br><i>The fuzzy bee sat on a flower.</i>", options: ["bee", "sat", "fuzzy", "on"], answer: 2, solution: "Fuzzy describes the bee, so it is an adjective. Bee is a noun and sat is a verb." },
        { type: "mcq", topic: "Commas in lists", marks: 1, q: "Which sentence uses commas correctly?", options: ["Bees visit roses daisies, and, tulips.", "Bees, visit roses daisies and tulips.", "Bees visit, roses, daisies, tulips.", "Bees visit roses, daisies and tulips."], answer: 3, solution: "Put a comma between list items, and use ‘and’ (with no comma) before the last item." },
        { type: "short", topic: "Prefixes", marks: 1, q: "Add the prefix <b>dis</b> to make the opposite of <b>like</b>.", answer: "dislike", accept: ["dislike"], solution: "dis + like = dislike. It means ‘not like’." },
        { type: "mcq", topic: "Alphabetical order", marks: 1, q: "Which list is in <b>alphabetical order</b>?", options: ["hive, bee, pollen, nectar", "bee, hive, nectar, pollen", "pollen, nectar, hive, bee", "bee, nectar, hive, pollen"], answer: 1, solution: "Look at the first letters: b, h, n, p. That is ABC order: bee, hive, nectar, pollen." },
        { type: "long", topic: "Writing", marks: 3, q: "Write 3 sentences giving <b>facts</b> about an animal you know. Use at least one joining word such as <b>and</b> or <b>because</b>. ✏️", answer: "A cat is a mammal with soft fur and sharp claws. Cats sleep for a lot of the day. They have whiskers because these help them feel their way in the dark.", solution: "Marking guide for parents (3 marks):<br>1 mark – capital letters at the start and full stops at the end of sentences.<br>1 mark – at least two sentences are facts, not opinions (no ‘I think’ or ‘the best’).<br>1 mark – uses a conjunction correctly (and, because, but, so).<br>Facts do not have to be perfect science; reward clear, true-sounding information." }
      ] },

    { id: "p3", title: "Practice Test 3 ⭐⭐⭐", duration: 25,
      intro: "Now read a poem! Try reading it aloud first and enjoy the sounds of the words. Then answer the questions. 🌧️",
      passage: "<h4>The Rainy Day Parade</h4><p>Pitter, patter, on the pane,<br>Here comes rain, here comes rain!<br>Puddles popping in the street,<br>Splashing, sploshing under feet.</p><p>Umbrellas pop up, red and blue,<br>Yellow, green and purple too.<br>Boots go stamping, one, two, three,<br>Muddy, muddy, look at me!</p><p>Snails come sliding, slow and shy,<br>Silver trails as they go by.<br>Ducks go dipping in the pond,<br>Quack and paddle, far beyond.</p><p>Drip and drizzle, drop and drum,<br>Rumble, rumble, thunder's come!<br>Windows rattle, branches sway,<br>What a wild and windy day!</p><p>Then at last the clouds all part,<br>Sunshine warms my soggy heart.<br>Look up high, oh what a sight,<br>A rainbow shining, big and bright!</p><p>Pitter, patter, on the pane,<br>Please come back again, dear rain!</p>",
      questions: [
        { type: "mcq", topic: "Understanding poetry", marks: 1, q: "What is the poem mostly about?", options: ["a sunny day at the beach", "a rainy day", "a birthday party", "a snowy night"], answer: 1, solution: "The poem talks about rain, puddles, umbrellas and thunder, so it is about a rainy day." },
        { type: "mcq", topic: "Rhyme", marks: 1, q: "In the first verse, which word rhymes with <b>street</b>?", options: ["rain", "pane", "feet", "popping"], answer: 2, solution: "Street and feet both end with the ‘eet’ sound. Rain and pane rhyme with each other." },
        { type: "mcq", topic: "Alliteration", marks: 1, q: "Which line uses <b>alliteration</b> (words starting with the same sound)?", options: ["Drip and drizzle, drop and drum,", "Then at last the clouds all part,", "Look up high, oh what a sight,", "Yellow, green and purple too."], answer: 0, solution: "Drip, drizzle, drop and drum all start with the ‘d’ sound. That is alliteration." },
        { type: "mcq", topic: "Repetition", marks: 1, q: "Which line is <b>repeated</b> at the start and the end of the poem?", options: ["Muddy, muddy, look at me!", "What a wild and windy day!", "Rumble, rumble, thunder's come!", "Pitter, patter, on the pane,"], answer: 3, solution: "Look at the first line and the second-to-last line: both are ‘Pitter, patter, on the pane,’." },
        { type: "short", topic: "Reading for information", marks: 1, q: "How many colours of umbrella are named in verse 2? Write the number.", answer: "5", accept: ["5", "five"], solution: "Red, blue, yellow, green and purple. That is 5 colours." },
        { type: "mcq", topic: "Reading for information", marks: 1, q: "Which animals are in the poem?", options: ["cats and dogs", "frogs and fish", "birds and bees", "snails and ducks"], answer: 3, solution: "Verse 3 says ‘Snails come sliding’ and ‘Ducks go dipping in the pond’." },
        { type: "mcq", topic: "Word meanings", marks: 1, q: "‘Sunshine warms my <b>soggy</b> heart.’ What does <b>soggy</b> mean?", options: ["very hot", "very happy", "very wet", "very big"], answer: 2, solution: "The person has been out in the rain, so soggy means very wet. The sunshine warms them up." },
        { type: "mcq", topic: "Sequencing", marks: 1, q: "What happens <b>after</b> the thunder?", options: ["The snails come out.", "The umbrellas open.", "The clouds part and a rainbow appears.", "The rain starts."], answer: 2, solution: "The thunder is in verse 4. In verse 5, ‘the clouds all part’ and there is a rainbow." },
        { type: "mcq", topic: "Inference", marks: 1, q: "How does the poet feel about the rain at the end? How do you know?", options: ["They hate it, because they say ‘go away’.", "They like it, because they say ‘Please come back again’.", "They are scared, because of the thunder.", "They are bored, because nothing happens."], answer: 1, solution: "The last line is ‘Please come back again, dear rain!’ You only ask something to come back if you like it." },
        { type: "mcq", topic: "Verbs", marks: 1, q: "Which word is the <b>verb</b>?<br><i>The ducks dipped in the pond.</i>", options: ["ducks", "dipped", "pond", "the"], answer: 1, solution: "Dipped is what the ducks did, so it is the verb (doing word)." },
        { type: "short", topic: "Past tense", marks: 1, q: "Write the past tense of <b>run</b>.<br><i>Yesterday I ___ in the rain.</i>", answer: "ran", accept: ["ran"], solution: "Run is an irregular verb. We don't say ‘runned’. The past tense is ran." },
        { type: "short", topic: "Adverbs", marks: 1, q: "Add <b>-ly</b> to <b>slow</b> to make an adverb.", answer: "slowly", accept: ["slowly"], solution: "slow + ly = slowly. It tells you how something is done: The snail moved slowly." },
        { type: "mcq", topic: "Phonics", marks: 1, q: "Which word has the same long <b>a</b> sound as <b>rain</b>?", options: ["cat", "said", "play", "pan"], answer: 2, solution: "Play has the long a sound, spelled ‘ay’. ‘Said’ looks like it should, but it is a tricky word that sounds like ‘sed’." },
        { type: "mcq", topic: "Silent letters", marks: 1, q: "Which word has a <b>silent letter</b>?", options: ["jump", "thumb", "drum", "plum"], answer: 1, solution: "In thumb, the b is silent. You say ‘thum’. The other words have no silent letters." },
        { type: "long", topic: "Writing a poem", marks: 3, q: "Write a short poem of 4 lines about the <b>wind</b> or the <b>sun</b>. Try to use one pair of rhyming words and some alliteration. ✏️", answer: "The wind is wild and whooshing loud,<br>It pushes every puffy cloud.<br>It spins the leaves around the tree,<br>And blows my hat away from me!", solution: "Marking guide for parents (3 marks):<br>1 mark – 4 lines about the wind or the sun.<br>1 mark – at least one pair of rhyming words (e.g. loud/cloud, tree/me).<br>1 mark – uses alliteration (e.g. wild and whooshing) or repetition.<br>Each line may start with a capital letter. Enjoy reading it aloud together!" }
      ] },

    { id: "p4", title: "Practice Test 4 🏅", duration: 30,
      intro: "Read this letter. Notice how it is set out, with an address, a greeting and an ending. Then answer the questions. ✉️",
      passage: "<h4>A Letter from the Seaside</h4><p>12 Harbour Road<br>Seabridge<br>14th July</p><p>Dear Nana Rosa,</p><p>I'm writing to you from our holiday cottage by the sea! We arrived on Monday after a long car journey. My little brother, Tomás, slept the whole way.</p><p>On Tuesday, we went rock pooling. First, we put on our wellies. Next, we climbed over the slippery rocks. Then we peered into the pools. I found a tiny green crab hiding under some seaweed. It didn't like being looked at, so it scuttled away sideways!</p><p>Yesterday it rained all day, so we stayed inside. Dad taught us a new card game, and I won three times. Tomás wasn't very pleased.</p><p>Today we're going to build the biggest sandcastle on the beach. Mum's bucket and spade are ready. After that, we will have fish and chips for tea.</p><p>I wish you were here. I can't wait to show you the shells I collected.</p><p>Lots of love,<br>Isla</p>",
      questions: [
        { type: "mcq", topic: "Reading for information", marks: 1, q: "Who is the letter written <b>to</b>?", options: ["Isla", "Tomás", "Nana Rosa", "Mum"], answer: 2, solution: "The greeting says ‘Dear Nana Rosa,’ so the letter is to Nana Rosa." },
        { type: "short", topic: "Reading for information", marks: 1, q: "Who <b>wrote</b> the letter?", answer: "Isla", accept: ["Isla"], solution: "The name at the very end of a letter tells you who wrote it: ‘Lots of love, Isla’." },
        { type: "mcq", topic: "Reading for information", marks: 1, q: "Where is the family staying?", options: ["a hotel in the city", "a tent in the forest", "at Nana Rosa's house", "a holiday cottage by the sea"], answer: 3, solution: "Isla writes ‘from our holiday cottage by the sea’." },
        { type: "mcq", topic: "Sequencing", marks: 1, q: "What did they do <b>first</b> when they went rock pooling?", options: ["They climbed over the rocks.", "They peered into the pools.", "They put on their wellies.", "They found a crab."], answer: 2, solution: "The letter says ‘First, we put on our wellies.’ The word ‘First’ is the clue." },
        { type: "mcq", topic: "Word meanings", marks: 1, q: "‘It <b>scuttled</b> away sideways.’ What does <b>scuttled</b> mean?", options: ["moved quickly with short steps", "swam slowly", "jumped very high", "fell asleep"], answer: 0, solution: "The crab did not like being looked at, so it hurried away. Scuttled means moved quickly with short steps, like a crab does." },
        { type: "mcq", topic: "Reading for information", marks: 1, q: "Why did the family stay inside yesterday?", options: ["It was too hot.", "It rained all day.", "Tomás was ill.", "They were tired."], answer: 1, solution: "The letter says ‘Yesterday it rained all day, so we stayed inside.’" },
        { type: "mcq", topic: "Inference", marks: 1, q: "How do you know Tomás was not happy about the card game?", options: ["He won three times.", "He slept the whole way.", "He went rock pooling.", "Isla says he ‘wasn't very pleased’."], answer: 3, solution: "Isla won three times and writes that Tomás ‘wasn't very pleased’. That is the clue from the text." },
        { type: "mcq", topic: "Inference", marks: 1, q: "How does Isla feel about Nana Rosa?", options: ["She is cross with her.", "She doesn't know her.", "She misses her and loves her.", "She is scared of her."], answer: 2, solution: "Isla writes ‘I wish you were here’ and ends with ‘Lots of love’. This shows she misses and loves Nana Rosa." },
        { type: "mcq", topic: "Time connectives", marks: 1, q: "Which word from the letter is a <b>time connective</b>?", options: ["slippery", "crab", "Next", "tiny"], answer: 2, solution: "Next tells you the order things happened, so it is a time connective. Slippery and tiny are adjectives; crab is a noun." },
        { type: "short", topic: "Apostrophes", marks: 1, q: "Write <b>did not</b> as one short word with an apostrophe.", answer: "didn't", accept: ["didn't", "didnt", "didn’t"], solution: "Take out the ‘o’ in not and put an apostrophe in its place: didn't." },
        { type: "mcq", topic: "Apostrophes", marks: 1, q: "How do you write <b>the bucket belonging to Mum</b>?", options: ["Mums bucket", "Mum's bucket", "Mums' bucket", "Mum,s bucket"], answer: 1, solution: "Add an apostrophe and s to show the bucket belongs to Mum: Mum's bucket." },
        { type: "mcq", topic: "Letters", marks: 1, q: "In a letter, what do we call <i>Dear Nana Rosa,</i>?", options: ["the greeting", "the ending", "the address", "the date"], answer: 0, solution: "The greeting is how you say hello at the start of a letter. ‘Lots of love’ is the ending." },
        { type: "short", topic: "Past tense", marks: 1, q: "Write the past tense of <b>go</b>.<br><i>Last week we ___ to the beach.</i>", answer: "went", accept: ["went"], solution: "Go is an irregular verb. The past tense is went (not ‘goed’)." },
        { type: "short", topic: "Suffixes", marks: 1, q: "Finish the pattern: <b>big, bigger, ___</b>", answer: "biggest", accept: ["biggest"], solution: "Add -est to mean ‘the most big’. Double the g first: big → biggest. It is in the letter: ‘the biggest sandcastle’." },
        { type: "mcq", topic: "Conjunctions", marks: 1, q: "Choose the best joining word:<br><i>I wanted to swim, ___ the water was too cold.</i>", options: ["so", "because", "but", "or"], answer: 2, solution: "The second part is a change or a problem, so we use ‘but’: I wanted to swim, but the water was too cold." },
        { type: "long", topic: "Writing a letter", marks: 4, q: "Write a short letter (3–4 sentences) to a friend about a fun day you had. Start with <b>Dear…</b> and finish with an ending and your name. Use a time connective such as <b>first</b> or <b>then</b>. ✏️", answer: "Dear Maya,<br>Yesterday I went to the zoo with my family. First, we saw the giraffes eating leaves. Then we watched the penguins swim, and they were very fast. I hope you can come with us next time.<br>Love from Sam", solution: "Marking guide for parents (4 marks):<br>1 mark – starts with a greeting (Dear…) and finishes with an ending (Love from…, Best wishes…) and a name.<br>1 mark – capital letters and full stops used in most sentences.<br>1 mark – uses a time connective (first, next, then, after that, finally).<br>1 mark – uses a conjunction (and, but, so, because) and the letter is in the past tense." }
      ] },

    { id: "p5", title: "Practice Test 5 — End of Stage 3 🏆", duration: 30,
      intro: "This is the last test! Read the story carefully. Look out for the speech marks that show who is talking. You can do it! 🏆",
      passage: "<h4>The Mystery of the Missing Book</h4><p>Kofi loved his library book about space. It had shiny pictures of planets and a big poster of the Moon. But on Friday morning, the book was gone!</p><p>“Mum, have you seen my space book?” Kofi called. “It has to go back to the library today.”</p><p>“Have you looked under your bed?” Mum asked.</p><p>Kofi looked under his bed. He found an odd sock, a toy car and a lot of dust, but no book. He searched the kitchen and the bathroom. He even looked inside the fridge!</p><p>His little sister Ana was sitting quietly on the sofa. She was holding a cushion very tightly, and her cheeks were pink.</p><p>“Ana,” said Kofi slowly, “what is behind that cushion?”</p><p>Ana sighed and held up the space book. “I'm sorry,” she whispered. “I wanted to look at the planets too. I was going to give it back.”</p><p>Kofi wasn't cross for long. “Next time, just ask me,” he said with a grin. “We can read it together.”</p><p>So they sat side by side and read about Saturn's rings before school. Then Kofi put the book safely in his bag.</p>",
      questions: [
        { type: "short", topic: "Reading for information", marks: 1, q: "What was Kofi's library book about?", answer: "space", accept: ["space", "planets", "space and planets", "the planets", "the moon"], solution: "The first line says ‘his library book about space’. It had pictures of planets and the Moon." },
        { type: "mcq", topic: "Reading for information", marks: 1, q: "<b>When</b> did Kofi find out the book was missing?", options: ["on Monday evening", "on Friday morning", "on Saturday", "at school"], answer: 1, solution: "The text says ‘on Friday morning, the book was gone!’ A ‘when’ question needs a time." },
        { type: "mcq", topic: "Reading for information", marks: 1, q: "Which place did Kofi <b>not</b> look in?", options: ["under his bed", "the kitchen", "the fridge", "the garden"], answer: 3, solution: "He looked under his bed, in the kitchen, the bathroom and even the fridge. The garden is not mentioned." },
        { type: "mcq", topic: "Inference", marks: 1, q: "Ana was holding a cushion tightly and her cheeks were pink. What does this tell us?", options: ["She was cold.", "She was asleep.", "She was hiding something and felt guilty.", "She was hungry."], answer: 2, solution: "Holding the cushion tightly and having pink cheeks are clues that Ana was hiding the book and felt embarrassed or guilty." },
        { type: "mcq", topic: "Word meanings", marks: 1, q: "‘He <b>searched</b> the kitchen.’ What does <b>searched</b> mean?", options: ["looked carefully for something", "ran very fast", "shouted loudly", "cleaned"], answer: 0, solution: "Kofi was trying to find his book, so searched means looked carefully for something." },
        { type: "mcq", topic: "Reading for information", marks: 1, q: "<b>Why</b> had Ana taken the book?", options: ["She wanted to keep it forever.", "She wanted to look at the planets too.", "She needed it for her homework.", "She wanted to hide it from Mum."], answer: 1, solution: "Ana says, ‘I wanted to look at the planets too.’ A ‘why’ question needs a reason." },
        { type: "mcq", topic: "Characters' feelings", marks: 1, q: "How did Kofi feel at the end? How do you know?", options: ["Happy, because he spoke ‘with a grin’.", "Angry, because he shouted at Ana.", "Sad, because he cried.", "Scared, because he hid."], answer: 0, solution: "Kofi ‘wasn't cross for long’ and spoke ‘with a grin’. A grin is a big smile, so he felt happy." },
        { type: "mcq", topic: "Sequencing", marks: 1, q: "Which of these happened <b>last</b>?", options: ["Kofi looked under his bed.", "Ana held up the space book.", "Kofi put the book safely in his bag.", "Kofi asked Mum about the book."], answer: 2, solution: "The very last sentence says ‘Then Kofi put the book safely in his bag.’" },
        { type: "mcq", topic: "Speech", marks: 1, q: "Who says, “Have you looked under your bed?”", options: ["Kofi", "Ana", "Mum", "the librarian"], answer: 2, solution: "After the speech marks, the story says ‘Mum asked’. That tells you Mum said it." },
        { type: "mcq", topic: "Speech marks", marks: 1, q: "Which sentence uses speech marks correctly?", options: ["“Where is my hat? asked Ravi.”", "Where is my “hat?” asked Ravi.", "“Where” is my hat? asked Ravi.", "“Where is my hat?” asked Ravi."], answer: 3, solution: "Speech marks go around only the words Ravi says, and the question mark goes inside: “Where is my hat?” asked Ravi." },
        { type: "mcq", topic: "Apostrophes", marks: 1, q: "In <b>Saturn's rings</b>, what does the apostrophe show?", options: ["There are lots of Saturns.", "The rings belong to Saturn.", "A letter is missing.", "It is a question."], answer: 1, solution: "Apostrophe + s shows belonging. The rings belong to the planet Saturn." },
        { type: "short", topic: "Pronouns", marks: 1, q: "Which word is the <b>pronoun</b>?<br><i>She held up the book.</i>", answer: "She", accept: ["she"], solution: "‘She’ takes the place of the name Ana, so it is a pronoun." },
        { type: "short", topic: "Suffixes", marks: 1, q: "Add <b>-ful</b> to <b>care</b> to make a new word.", answer: "careful", accept: ["careful"], solution: "care + ful = careful. Remember: -ful has only one l." },
        { type: "mcq", topic: "Antonyms", marks: 1, q: "Which word is the <b>opposite</b> (antonym) of <b>quietly</b>?", options: ["softly", "loudly", "slowly", "sadly"], answer: 1, solution: "Quietly means making little noise. The opposite is loudly. Softly means nearly the same as quietly." },
        { type: "mcq", topic: "Sentence types", marks: 1, q: "What type of sentence is this?<br><i>Put the book in your bag.</i>", options: ["a statement", "a question", "a command", "an exclamation"], answer: 2, solution: "It tells someone what to do and starts with the bossy verb ‘Put’, so it is a command." },
        { type: "long", topic: "Writing a story", marks: 4, q: "What happens when Kofi takes the book back to the library? Write 4 sentences. Include one thing a character <b>says</b>, using speech marks. ✏️", answer: "After school, Kofi and Ana walked to the library with Mum. Kofi gave the space book to the librarian. “Did you enjoy it?” she asked with a smile. “Yes, and my sister loved it too,” said Kofi, so they borrowed a new book about dinosaurs.", solution: "Marking guide for parents (4 marks):<br>1 mark – capital letters and full stops used in most sentences.<br>1 mark – speech marks used around the spoken words (punctuation inside is a bonus).<br>1 mark – uses a conjunction (and, but, so, because, when) or a time connective (after, then, next).<br>1 mark – the sentences make sense and follow on from the story." }
      ] }
  ],
  quickTests: [
    { id: "q1", title: "Phonics & Spelling Sounds",
      questions: [
        { type: "mcq", topic: "Long e", marks: 1, q: "Which word has the same long <b>e</b> sound as <b>tree</b>?", options: ["bed", "beach", "bread", "bent"], answer: 1, solution: "Beach has the long e sound, spelled ‘ea’. Bread also has ‘ea’, but it makes a short e sound." },
        { type: "mcq", topic: "Magic e", marks: 1, q: "Which spelling is correct?", options: ["tyme", "tiem", "time", "tim"], answer: 2, solution: "Time uses the i-e pattern. The magic e at the end makes the i say its name." },
        { type: "mcq", topic: "Long i", marks: 1, q: "Which word has the <b>igh</b> spelling?", options: ["night", "nit", "net", "knot"], answer: 0, solution: "Night is spelled n-igh-t. The igh makes the long i sound." },
        { type: "mcq", topic: "Long o", marks: 1, q: "Which word has the long <b>o</b> sound, like in <b>boat</b>?", options: ["hot", "coat", "cot", "cut"], answer: 1, solution: "Coat has the long o sound, spelled ‘oa’. Hot and cot have a short o." },
        { type: "mcq", topic: "Soft c", marks: 1, q: "In which word does the <b>c</b> sound like <b>s</b>?", options: ["cat", "cup", "city", "cot"], answer: 2, solution: "When c comes before e, i or y it often says s. In city, c comes before i." },
        { type: "mcq", topic: "Soft g", marks: 1, q: "In which word does the <b>g</b> sound like <b>j</b>?", options: ["goat", "gate", "gold", "giant"], answer: 3, solution: "Giant starts with a soft g that says j, because the g comes before i." },
        { type: "mcq", topic: "Silent letters", marks: 1, q: "Which letter is silent in <b>knee</b>?", options: ["k", "n", "e", "none of them"], answer: 0, solution: "You say ‘nee’. The k is silent, just like in knock and knife." },
        { type: "mcq", topic: "Silent letters", marks: 1, q: "Which letter is silent in <b>write</b>?", options: ["r", "w", "t", "i"], answer: 1, solution: "You say ‘rite’. The w is silent, like in wrong and wrap." },
        { type: "mcq", topic: "Long oo", marks: 1, q: "Which word has the same sound as the <b>oo</b> in <b>moon</b>?", options: ["cub", "blue", "bus", "cup"], answer: 1, solution: "Blue has the long oo sound, spelled ‘ue’. Cub, bus and cup have a short u sound." },
        { type: "mcq", topic: "Syllables", marks: 1, q: "How many syllables are in <b>elephant</b>?", options: ["1", "2", "3", "4"], answer: 2, solution: "Clap it: el-e-phant. That is 3 claps, so 3 syllables. 🐘" }
      ] },

    { id: "q2", title: "Nouns, Verbs & Adjectives",
      questions: [
        { type: "mcq", topic: "Nouns", marks: 1, q: "Which word is a <b>noun</b>?", options: ["jump", "happy", "table", "quickly"], answer: 2, solution: "A table is a thing, so it is a noun (naming word)." },
        { type: "mcq", topic: "Proper nouns", marks: 1, q: "Which word is a <b>proper noun</b>?", options: ["city", "river", "London", "mountain"], answer: 2, solution: "London is the special name of one city, so it is a proper noun and has a capital letter." },
        { type: "mcq", topic: "Verbs", marks: 1, q: "Which word is a <b>verb</b>?", options: ["swim", "blue", "chair", "soft"], answer: 0, solution: "Swim is something you can do, so it is a verb." },
        { type: "mcq", topic: "Adjectives", marks: 1, q: "Which word is the <b>adjective</b>?<br><i>The fluffy cat slept.</i>", options: ["The", "fluffy", "cat", "slept"], answer: 1, solution: "Fluffy describes the cat, so it is an adjective." },
        { type: "mcq", topic: "Pronouns", marks: 1, q: "Which pronoun can replace <b>Sam and Ali</b>?<br><i>Sam and Ali went to the shop.</i>", options: ["he", "she", "they", "it"], answer: 2, solution: "Sam and Ali are two people, so we use ‘they’: They went to the shop." },
        { type: "mcq", topic: "Verbs", marks: 1, q: "Which word is the <b>verb</b>?<br><i>The children laughed at the clown.</i>", options: ["children", "clown", "the", "laughed"], answer: 3, solution: "Laughed is what the children did, so it is the verb." },
        { type: "mcq", topic: "Adverbs", marks: 1, q: "Which word is the <b>adverb</b>?<br><i>The tortoise moved slowly.</i>", options: ["The", "tortoise", "slowly", "moved"], answer: 2, solution: "Slowly tells you how the tortoise moved, and it ends in -ly. It is an adverb." },
        { type: "mcq", topic: "Adjectives", marks: 1, q: "Which group has <b>only adjectives</b>?", options: ["run, hop, skip", "dog, cat, hen", "he, she, it", "red, tall, shiny"], answer: 3, solution: "Red, tall and shiny all describe things, so they are adjectives. Run, hop, skip are verbs; dog, cat, hen are nouns; he, she, it are pronouns." },
        { type: "mcq", topic: "Proper nouns", marks: 1, q: "Which word is a proper noun that needs a capital letter?<br><i>My aunt lives in paris.</i>", options: ["aunt", "lives", "paris", "in"], answer: 2, solution: "Paris is the name of a city, so it needs a capital P." },
        { type: "mcq", topic: "Adjectives", marks: 1, q: "Choose the best word to fill the gap:<br><i>The ___ elephant stomped through the jungle.</i>", options: ["enormous", "ran", "quickly", "under"], answer: 0, solution: "We need an adjective to describe the elephant. Enormous means very big. 🐘" }
      ] },

    { id: "q3", title: "Punctuation Power",
      questions: [
        { type: "mcq", topic: "Sentences", marks: 1, q: "Which sentence is written correctly?", options: ["the sun is hot.", "The sun is hot.", "The sun is hot", "the sun is hot"], answer: 1, solution: "A sentence needs a capital letter at the start and a full stop at the end." },
        { type: "mcq", topic: "Question marks", marks: 1, q: "Which mark should end this sentence?<br><i>What time is it</i>", options: [".", "!", "?", ","], answer: 2, solution: "It is asking something, so it needs a question mark." },
        { type: "mcq", topic: "Exclamation marks", marks: 1, q: "Which mark should end this sentence?<br><i>What a huge wave</i>", options: ["?", "!", ",", "'"], answer: 1, solution: "It shows surprise and strong feeling, so it is an exclamation. It needs an exclamation mark. 🌊" },
        { type: "mcq", topic: "Commas in lists", marks: 1, q: "Which sentence uses commas correctly?", options: ["I need, eggs milk and bread.", "I need eggs milk, and, bread.", "I need, eggs, milk, bread.", "I need eggs, milk and bread."], answer: 3, solution: "Put a comma between the items and use ‘and’ before the last one." },
        { type: "mcq", topic: "Contractions", marks: 1, q: "What is the short form of <b>do not</b>?", options: ["dont", "do'nt", "don't", "dont'"], answer: 2, solution: "The ‘o’ in not is missing, so the apostrophe goes where it was: don't." },
        { type: "mcq", topic: "Possession", marks: 1, q: "How do you write <b>the tail of the dog</b>?", options: ["the dogs tail", "the dogs' tail", "the do'gs tail", "the dog's tail"], answer: 3, solution: "Add apostrophe + s to show it belongs to one dog: the dog's tail." },
        { type: "mcq", topic: "Speech marks", marks: 1, q: "Which sentence uses speech marks correctly?", options: ["“I love pizza,” said Nia.", "“I love pizza, said Nia.”", "I love “pizza,” said Nia.", "“I love pizza,” “said Nia.”"], answer: 0, solution: "Only the words Nia says go inside the speech marks, with the comma inside too." },
        { type: "mcq", topic: "Contractions", marks: 1, q: "<b>I'm</b> is a short way of writing…", options: ["I will", "I have", "I am", "I was"], answer: 2, solution: "I'm = I am. The apostrophe takes the place of the missing ‘a’." },
        { type: "mcq", topic: "Sentence types", marks: 1, q: "What type of sentence is this?<br><i>Shut the door, please.</i>", options: ["a question", "a command", "an exclamation", "a statement"], answer: 1, solution: "It tells someone to do something and starts with the bossy verb ‘Shut’. It is a command." },
        { type: "mcq", topic: "Capital letters", marks: 1, q: "Which words need capital letters?<br><i>on friday we went swimming.</i>", options: ["only ‘on’", "‘on’ and ‘friday’", "only ‘friday’", "‘we’ and ‘swimming’"], answer: 1, solution: "‘On’ starts the sentence, and Friday is a day of the week (a proper noun). Both need capitals: On Friday we went swimming." }
      ] },

    { id: "q4", title: "Past & Present Tense",
      questions: [
        { type: "mcq", topic: "Past tense", marks: 1, q: "What is the past tense of <b>jump</b>?", options: ["jumpt", "jumped", "jumping", "jumps"], answer: 1, solution: "Jump is a regular verb, so just add -ed: jumped." },
        { type: "mcq", topic: "Irregular past tense", marks: 1, q: "What is the past tense of <b>see</b>?<br><i>Yesterday I ___ a fox.</i>", options: ["seed", "sawed", "saw", "seen"], answer: 2, solution: "See is irregular. Yesterday I saw a fox. (We say ‘I have seen’, but not ‘I seen’.)" },
        { type: "mcq", topic: "Irregular past tense", marks: 1, q: "What is the past tense of <b>go</b>?<br><i>Last week we ___ to the zoo.</i>", options: ["went", "goed", "gone", "goes"], answer: 0, solution: "Go is irregular. The past tense is went." },
        { type: "mcq", topic: "Past tense", marks: 1, q: "Which sentence is in the <b>past tense</b>?", options: ["I play football.", "I am playing football.", "I played football yesterday.", "I will play football."], answer: 2, solution: "Played (with -ed) and ‘yesterday’ show it has already happened." },
        { type: "mcq", topic: "Present tense", marks: 1, q: "Choose the <b>present tense</b> word:<br><i>Every day I ___ to school.</i>", options: ["ran", "run", "runned", "running"], answer: 1, solution: "‘Every day’ means it happens now, again and again. Every day I run to school." },
        { type: "mcq", topic: "Irregular past tense", marks: 1, q: "What is the past tense of <b>eat</b>?<br><i>At lunch I ___ an apple.</i>", options: ["eated", "eaten", "eats", "ate"], answer: 3, solution: "Eat is irregular. At lunch I ate an apple." },
        { type: "mcq", topic: "Past tense", marks: 1, q: "What is the past tense of <b>hop</b>?", options: ["hoped", "hopped", "hopt", "hoping"], answer: 1, solution: "Hop has a short vowel, so double the p before adding -ed: hopped. (Hoped is the past of hope!) 🐸" },
        { type: "mcq", topic: "Irregular past tense", marks: 1, q: "Choose the right word:<br><i>Yesterday we ___ a cake.</i> (make)", options: ["make", "maked", "made", "making"], answer: 2, solution: "Make is irregular. Yesterday we made a cake. 🎂" },
        { type: "mcq", topic: "Present tense", marks: 1, q: "Which word is in the <b>present tense</b>?", options: ["sang", "sings", "sanged", "sung"], answer: 1, solution: "Sings is happening now: She sings every morning. Sang is the past tense." },
        { type: "mcq", topic: "Irregular past tense", marks: 1, q: "What is the past tense of <b>write</b>?", options: ["writed", "writing", "wrote", "writes"], answer: 2, solution: "Write is irregular. Yesterday I wrote a letter." }
      ] },

    { id: "q5", title: "Prefixes, Suffixes & Plurals",
      questions: [
        { type: "mcq", topic: "Plurals", marks: 1, q: "What is the plural of <b>box</b>?", options: ["boxs", "boxes", "boxies", "box's"], answer: 1, solution: "Words ending in x add -es: boxes." },
        { type: "mcq", topic: "Plurals", marks: 1, q: "What is the plural of <b>baby</b>?", options: ["babys", "babyes", "babies", "babeys"], answer: 2, solution: "Baby ends in consonant + y, so change y to i and add es: babies." },
        { type: "mcq", topic: "Plurals", marks: 1, q: "What is the plural of <b>cat</b>?", options: ["cats", "cates", "caties", "cat's"], answer: 0, solution: "Most words just add -s: cats. No apostrophe is needed for a plural." },
        { type: "mcq", topic: "Prefixes", marks: 1, q: "Which word means <b>not happy</b>?", options: ["dishappy", "unhappy", "rehappy", "happyless"], answer: 1, solution: "The prefix un- means ‘not’. un + happy = unhappy." },
        { type: "mcq", topic: "Prefixes", marks: 1, q: "What does <b>disagree</b> mean?", options: ["agree again", "agree a lot", "not agree", "agree first"], answer: 2, solution: "The prefix dis- means ‘not’ or the opposite, so disagree means not agree." },
        { type: "mcq", topic: "Prefixes", marks: 1, q: "What does <b>redo</b> mean?", options: ["do again", "not do", "do badly", "do quickly"], answer: 0, solution: "The prefix re- means ‘again’, so redo means do again." },
        { type: "mcq", topic: "Suffixes", marks: 1, q: "Which word means <b>full of hope</b>?", options: ["hopeless", "hopeful", "hopefull", "hoping"], answer: 1, solution: "The suffix -ful means ‘full of’, and it has only one l: hopeful." },
        { type: "mcq", topic: "Suffixes", marks: 1, q: "Which word means <b>without fear</b>?", options: ["fearful", "fearing", "fearly", "fearless"], answer: 3, solution: "The suffix -less means ‘without’. fear + less = fearless." },
        { type: "mcq", topic: "Suffixes", marks: 1, q: "Add <b>-ing</b> to <b>make</b>.", options: ["makeing", "making", "makking", "maked"], answer: 1, solution: "Drop the e before adding -ing: make → making." },
        { type: "mcq", topic: "Suffixes", marks: 1, q: "Which word means <b>the most big</b>?", options: ["bigger", "bigest", "biggest", "bigst"], answer: 2, solution: "Add -est for ‘the most’, and double the g first: biggest. Bigger means ‘more big’." }
      ] },

    { id: "q6", title: "Word Meanings (Synonyms & Antonyms)",
      questions: [
        { type: "mcq", topic: "Synonyms", marks: 1, q: "Which word is a <b>synonym</b> (same meaning) for <b>big</b>?", options: ["tiny", "large", "short", "thin"], answer: 1, solution: "Large means nearly the same as big. Tiny is the opposite." },
        { type: "mcq", topic: "Antonyms", marks: 1, q: "Which word is an <b>antonym</b> (opposite) of <b>hot</b>?", options: ["warm", "sunny", "boiling", "cold"], answer: 3, solution: "Cold is the opposite of hot. Warm and boiling are about heat too." },
        { type: "mcq", topic: "Synonyms", marks: 1, q: "Which word means nearly the same as <b>happy</b>?", options: ["glad", "sad", "cross", "tired"], answer: 0, solution: "Glad means happy. Sad is the opposite." },
        { type: "mcq", topic: "Antonyms", marks: 1, q: "What is the opposite of <b>open</b>?", options: ["wide", "shut", "door", "push"], answer: 1, solution: "Shut is the opposite of open." },
        { type: "mcq", topic: "Synonyms", marks: 1, q: "Which word could you use instead of <b>said</b> for someone speaking very loudly?", options: ["whispered", "mumbled", "sighed", "yelled"], answer: 3, solution: "Yelled means said very loudly. Whispered and mumbled are quiet." },
        { type: "mcq", topic: "Antonyms", marks: 1, q: "What is the opposite of <b>early</b>?", options: ["soon", "first", "late", "quick"], answer: 2, solution: "Late is the opposite of early." },
        { type: "mcq", topic: "Word meanings", marks: 1, q: "‘The puppy was so <b>tiny</b> it could fit in a teacup.’ What does <b>tiny</b> mean?", options: ["very small", "very loud", "very old", "very fast"], answer: 0, solution: "If it can fit in a teacup, it must be very small. The sentence gives you the clue. 🐶" },
        { type: "mcq", topic: "Antonyms", marks: 1, q: "What is the opposite of <b>always</b>?", options: ["often", "never", "sometimes", "every day"], answer: 1, solution: "Always means every time. Never means not at any time. They are opposites." },
        { type: "mcq", topic: "Synonyms", marks: 1, q: "Which word is a synonym for <b>quick</b>?", options: ["slow", "lazy", "fast", "calm"], answer: 2, solution: "Fast means the same as quick. Slow is the opposite." },
        { type: "mcq", topic: "Alphabetical order", marks: 1, q: "Which word comes <b>first</b> in alphabetical order?", options: ["moon", "apple", "kite", "zebra"], answer: 1, solution: "Look at the first letters: m, a, k, z. A comes first in the alphabet, so apple is first." }
      ] }
  ]
});
