import type { Batyr } from "@/lib/types";

export const batyrs: Batyr[] = [
  {
    id: "qobylandy",
    name: "Турсынбай Батыр",
    title: "Желдей жүйрік жорық иесі",
    description:
      "Турсынбай Батыр ойын ішінде ел намысын қорғайтын, тез шешім қабылдайтын және серпінді қимылмен ерекшеленетін кейіпкер ретінде танылады.",
    type: "Жылдам шабуылшы",
    weapon: "Найза, қылыш",
    style: "Жылдам қимыл, серпінді соққы",
    specialAbility: "Дауыл серпіні",
    era: "Эпостық дәуір",
    quote: "Елдің күші батыл жүректе ғана емес, бірлікте де жатыр.",
    biography:
      "Турсынбай Батыр бейнесі батылдықты, сергек қимылды және жолдасқа адал болуды алға шығарады. Ойын барысында ол жылдам шабуыл жасап, шешуші сәтте батыл әрекет ететін батыр ретінде көрінеді.",
    legacy:
      "Бұл батыр образы оқушыларға ерлікпен бірге шапшаң ойлау, сертке беріктік және елге қызмет ету идеясын жеткізеді.",
    strengths: ["Шапшаң", "Икемді", "Батыл", "Серпінді"],
    colors: {
      accent: "#f6c86c",
      secondary: "#0f5b73",
      glow: "#ffd98a",
      sand: "#cf9b5e",
      sky: "#0a1930",
    },
    stats: {
      attack: 78,
      defense: 62,
      speed: 92,
      wisdom: 70,
    },
    gameplay: {
      maxHp: 114,
      speed: 252,
      jumpPower: 505,
      attackDamage: 24,
      specialDamage: 36,
      attackRange: 92,
      specialCost: 38,
      specialCooldown: 4800,
    },
    facts: [
      {
        id: "qobylandy-fact-1",
        title: "Серпінді рух",
        description:
          "Турсынбай Батырдың бейнесі батыл қадам жасап, ел намысын қорғауға дайын тұратын қайсар мінезді танытады.",
        rewardLabel: "+120 ұпай және рух қуаты",
      },
      {
        id: "qobylandy-fact-2",
        title: "Жорық серпіні",
        description:
          "Турсынбай Батыр жылдам шешім қабылдап, тосын жағдайда жол таба білетін батыр ретінде сипатталады.",
        rewardLabel: "Энергия толықтыруы",
      },
      {
        id: "qobylandy-fact-3",
        title: "Ерлік үлгісі",
        description:
          "Турсынбай Батыр үшін күшпен қатар серікке адалдық пен ел намысын бірінші орынға қою маңызды.",
        rewardLabel: "Қорғанысқа шағын демеу",
      },
    ],
    quiz: [
      {
        id: "qobylandy-quiz-1",
        question: "Турсынбай Батырдың ойын стилі қандай?",
        options: ["Жылдам қимыл, серпінді соққы", "Тек баяу қорғаныс", "Тек сауда жүргізу"],
        answerIndex: 0,
        explanation:
          "Турсынбай Батыр жылдам қимыл мен серпінді соққыға сүйенетін шабуылшы ретінде берілген.",
        reward: {
          score: 120,
          hp: 10,
          energy: 12,
        },
      },
      {
        id: "qobylandy-quiz-2",
        question: "Турсынбай Батыр қандай қарумен ойнайды?",
        options: ["Найза, қылыш", "Айбалта ғана", "Домбыра мен қалам"],
        answerIndex: 0,
        explanation:
          "Кейіпкер карточкасында Турсынбай Батырдың қаруы найза мен қылыш деп көрсетілген.",
        reward: {
          score: 140,
          hp: 8,
          energy: 12,
        },
      },
      {
        id: "qobylandy-quiz-3",
        question: "Турсынбай Батыр бейнесі оқушыға қандай құндылықты ұқтырады?",
        options: ["Елге адал қызмет ету", "Өзімшілдік", "Білімнен бас тарту"],
        answerIndex: 0,
        explanation:
          "Турсынбай Батырдың образы елге адал қызмет ету, батылдық және жауапкершілік құндылықтарын көрсетеді.",
        reward: {
          score: 170,
          hp: 12,
          energy: 16,
        },
      },
    ],
    finalReflection:
      "Турсынбай Батырдың тұлғасы жас ұрпаққа шапшаңдық пен ерік-жігердің елдік мақсатпен ұштасқанда үлкен күшке айналатынын көрсетеді.",
    translations: {
      en: {
        name: "Tursynbai Batyr",
        title: "Master of Wind-Swift Campaigns",
        description:
          "In the game, Tursynbai Batyr is known as a character who defends the honor of his people, makes quick decisions, and stands out with dynamic movement.",
        type: "Swift Attacker",
        weapon: "Spear, sword",
        style: "Fast movement, dynamic strikes",
        specialAbility: "Storm Surge",
        era: "Epic Age",
        quote: "A nation's strength lies not only in a brave heart, but in unity.",
        biography:
          "The image of Tursynbai Batyr embodies courage, alert movement, and loyalty to one's comrades. Throughout the game, he appears as a batyr who strikes quickly and acts boldly at decisive moments.",
        legacy:
          "This batyr's image conveys to students the idea that heroism goes hand in hand with quick thinking, keeping one's word, and serving the nation.",
        strengths: ["Swift", "Agile", "Bold", "Dynamic"],
        facts: [
          {
            title: "Dynamic Spirit",
            description:
              "Tursynbai Batyr's image reveals a courageous character, always ready to take a bold step and defend the honor of his people.",
            rewardLabel: "+120 points and spirit power",
          },
          {
            title: "Campaign Momentum",
            description:
              "Tursynbai Batyr is described as a batyr who makes quick decisions and finds a way out of unexpected situations.",
            rewardLabel: "Energy refill",
          },
          {
            title: "Model of Heroism",
            description:
              "For Tursynbai Batyr, it is important to place loyalty to comrades and the honor of the people above strength alone.",
            rewardLabel: "Small defense boost",
          },
        ],
        quiz: [
          {
            question: "What is Tursynbai Batyr's playstyle?",
            options: ["Fast movement, dynamic strikes", "Only slow defense", "Only trading"],
            explanation:
              "Tursynbai Batyr is presented as an attacker who relies on fast movement and dynamic strikes.",
          },
          {
            question: "What weapon does Tursynbai Batyr use?",
            options: ["Spear, sword", "Axe only", "Dombra and pen"],
            explanation:
              "The character card shows that Tursynbai Batyr's weapons are the spear and sword.",
          },
          {
            question: "What value does Tursynbai Batyr's image teach the student?",
            options: ["Serving the nation faithfully", "Selfishness", "Rejecting knowledge"],
            explanation:
              "Tursynbai Batyr's image reflects the values of faithful service to the nation, courage, and responsibility.",
          },
        ],
        finalReflection:
          "Tursynbai Batyr's character shows the younger generation that speed and willpower become a great force when united with a national purpose.",
      },
    },
  },
  {
    id: "bogenbay",
    name: "Баян Батыр",
    title: "Қуатты қолбасшы, ел қорғаны",
    description:
      "Баян Батыр XVIII ғасырдағы ел қорғау кезеңімен байланыстырылып, берік қорғаныс пен қуатты соққыға сүйенетін қайсар кейіпкер ретінде танылады.",
    type: "Ауыр соққы шебері",
    weapon: "Айбалта, найза",
    style: "Қуатты соққы, берік қорғаныс",
    specialAbility: "Найзағай жарқылы",
    era: "XVIII ғасыр",
    quote: "Қуатты қол елдің бірлігімен күшейеді.",
    biography:
      "Баян Батыр бейнесі елді қорғау, тәртіп, батыл шешім және жауынгерлерді жігерлендіру идеяларымен байланысты. Ойын ішінде ол ауыр соққы беріп, қорғанысты берік ұстайтын батыр ретінде көрінеді.",
    legacy:
      "Бұл кейіпкер арқылы оқушылар тарихи кезеңдегі қолбасшылық, тәртіп және ортақ мақсат үшін күресу идеясын көреді.",
    strengths: ["Қуатты", "Төзімді", "Ұйымдастырушы", "Қайсар"],
    colors: {
      accent: "#f0b75a",
      secondary: "#194a65",
      glow: "#ffd086",
      sand: "#a86b3b",
      sky: "#091421",
    },
    stats: {
      attack: 90,
      defense: 84,
      speed: 58,
      wisdom: 76,
    },
    gameplay: {
      maxHp: 132,
      speed: 214,
      jumpPower: 470,
      attackDamage: 30,
      specialDamage: 44,
      attackRange: 104,
      specialCost: 46,
      specialCooldown: 5200,
    },
    facts: [
      {
        id: "bogenbay-fact-1",
        title: "Тарихи қолбасшы",
        description:
          "Баян Батыр жоңғар шапқыншылығы кезеңіндегі ел қорғау рухын, тәртіп пен бірліктің маңызын танытатын бейне ретінде берілген.",
        rewardLabel: "+120 ұпай және тарихи белгі",
      },
      {
        id: "bogenbay-fact-2",
        title: "Қайсар мінез",
        description:
          "Баян Батырдың бейнесі тек күшпен емес, ұрыс алдындағы тәртіп пен табандылықпен де ерекшеленеді.",
        rewardLabel: "HP қалпына келтіру",
      },
      {
        id: "bogenbay-fact-3",
        title: "Ел қорғау миссиясы",
        description:
          "Баян Батырдың ерлік жолы халықты қорғау мен азаттық жолындағы табандылықтың үлгісі ретінде көрсетіледі.",
        rewardLabel: "Қосымша энергия",
      },
    ],
    quiz: [
      {
        id: "bogenbay-quiz-1",
        question: "Баян Батыр қай кезеңмен байланыстырылады?",
        options: ["XVIII ғасыр", "Тек XXI ғасыр", "Орта ғасырдағы теңіз жорығы"],
        answerIndex: 0,
        explanation:
          "Карточкада Баян Батыр XVIII ғасыр кезеңімен байланыстырылған.",
        reward: {
          score: 120,
          hp: 12,
          energy: 10,
        },
      },
      {
        id: "bogenbay-quiz-2",
        question: "Баян Батырдың ойын стилі қандай?",
        options: ["Қуатты соққы, берік қорғаныс", "Тек жылдам секіру", "Тек сауда жасау"],
        answerIndex: 0,
        explanation:
          "Баян Батыр ауыр соққы шебері ретінде берілген, оның стилі қуатты соққы мен берік қорғанысқа сүйенеді.",
        reward: {
          score: 150,
          hp: 10,
          energy: 12,
        },
      },
      {
        id: "bogenbay-quiz-3",
        question: "Баян Батыр бейнесі қай қасиетті айқындайды?",
        options: ["Қайсарлық пен тәртіп", "Жеңілтектік", "Ұмытшақтық"],
        answerIndex: 0,
        explanation:
          "Баян Батыр бейнесінде ерлікпен қатар тәртіп, жауапкершілік және табандылық маңызды орын алады.",
        reward: {
          score: 180,
          hp: 14,
          energy: 16,
        },
      },
    ],
    finalReflection:
      "Баян Батырдың жолы оқушыларға елді қорғауда күш қана емес, тәртіп пен ұйымшылдық та шешуші рөл атқаратынын түсіндіреді.",
    translations: {
      en: {
        name: "Bayan Batyr",
        title: "Powerful Commander, Shield of the Nation",
        description:
          "Bayan Batyr is associated with the 18th-century period of defending the nation, known as a courageous character who relies on solid defense and powerful strikes.",
        type: "Master of Heavy Strikes",
        weapon: "Battle-axe, spear",
        style: "Powerful strikes, solid defense",
        specialAbility: "Lightning Flash",
        era: "18th century",
        quote: "A powerful hand grows stronger through the unity of the nation.",
        biography:
          "The image of Bayan Batyr is tied to the ideas of defending the nation, discipline, bold decision-making, and inspiring fellow warriors. In the game, he appears as a batyr who delivers heavy strikes and holds a solid defense.",
        legacy:
          "Through this character, students see the ideas of leadership, discipline, and fighting for a common cause during a historical period.",
        strengths: ["Powerful", "Resilient", "Organizer", "Courageous"],
        facts: [
          {
            title: "Historic Commander",
            description:
              "Bayan Batyr is presented as a figure embodying the spirit of national defense during the Dzungar invasions, and the importance of discipline and unity.",
            rewardLabel: "+120 points and a historic badge",
          },
          {
            title: "Courageous Character",
            description:
              "Bayan Batyr's image stands out not only for strength, but also for discipline and perseverance before battle.",
            rewardLabel: "HP restoration",
          },
          {
            title: "Mission to Defend the Nation",
            description:
              "Bayan Batyr's heroic path is shown as an example of perseverance in defending the people and the path to freedom.",
            rewardLabel: "Extra energy",
          },
        ],
        quiz: [
          {
            question: "Which period is Bayan Batyr associated with?",
            options: ["18th century", "Only the 21st century", "A medieval sea voyage"],
            explanation: "The card links Bayan Batyr to the 18th century.",
          },
          {
            question: "What is Bayan Batyr's playstyle?",
            options: ["Powerful strikes, solid defense", "Only fast jumping", "Only trading"],
            explanation:
              "Bayan Batyr is presented as a master of heavy strikes, whose style relies on powerful blows and solid defense.",
          },
          {
            question: "Which quality does Bayan Batyr's image highlight?",
            options: ["Courage and discipline", "Frivolity", "Forgetfulness"],
            explanation:
              "In Bayan Batyr's image, discipline, responsibility, and perseverance hold an important place alongside heroism.",
          },
        ],
        finalReflection:
          "Bayan Batyr's path teaches students that in defending the nation, not only strength but also discipline and organization play a decisive role.",
      },
    },
  },
  {
    id: "qabanbay",
    name: "Қабанбай батыр",
    title: "Дарабоз рухтың теңгерімді күші",
    description:
      "Қабанбай батыр қазақ тарихында қолбасшылық, батылдық және шабуыл мен қорғанысты тең ұстаған ерлігімен танылады.",
    type: "Теңгерімді қорғаушы",
    weapon: "Қылыш, қалқан, найза",
    style: "Теңгерімді шабуыл мен қорғаныс",
    specialAbility: "Дарабоз серті",
    era: "XVIII ғасыр",
    quote: "Жеңіс жолы сабыр мен ерлікті қатар талап етеді.",
    biography:
      "Қабанбай батыр жоңғарға қарсы шайқастарда ерекше танылып, халық жадында Дарабоз атанған қолбасшылардың бірі. Оның бейнесі күрделі кезеңде елді қорғаған теңгерімді күштің үлгісіне айналды.",
    legacy:
      "Қабанбай тұлғасы арқылы оқушылар батылдықпен бірге ұстамдылық, жауапкершілік және стратегиялық ойлаудың маңызын сезінеді.",
    strengths: ["Теңгерімді", "Сабырлы", "Шабуылшы", "Қорғаушы"],
    colors: {
      accent: "#f4c15e",
      secondary: "#14606a",
      glow: "#ffdd93",
      sand: "#b48148",
      sky: "#081a2e",
    },
    stats: {
      attack: 84,
      defense: 80,
      speed: 74,
      wisdom: 84,
    },
    gameplay: {
      maxHp: 124,
      speed: 232,
      jumpPower: 486,
      attackDamage: 27,
      specialDamage: 39,
      attackRange: 98,
      specialCost: 42,
      specialCooldown: 5000,
    },
    facts: [
      {
        id: "qabanbay-fact-1",
        title: "Дарабоз есімі",
        description:
          "Қабанбай батыр тарихи жадта Дарабоз атауымен сақталып, айрықша қолбасшылық пен ерліктің белгісіне айналды.",
        rewardLabel: "+120 ұпай және даңқ белгісі",
      },
      {
        id: "qabanbay-fact-2",
        title: "Теңгерімді шешім",
        description:
          "Қабанбай бейнесінде батылдық пен сабыр қатар жүреді: ол шабуыл сәтін де, қорғаныс қажеттігін де дәл бағалайды.",
        rewardLabel: "Қорғаныс қуаты артады",
      },
      {
        id: "qabanbay-fact-3",
        title: "Елдік символы",
        description:
          "Қабанбай батырдың аты халықтың бірлігін, туған жерді қорғау идеясын және табанды күресті еске салады.",
        rewardLabel: "Энергияны қалпына келтіру",
      },
    ],
    quiz: [
      {
        id: "qabanbay-quiz-1",
        question: "Қабанбай батыр қандай атаумен де белгілі?",
        options: ["Дарабоз", "Жырау", "Тек елші"],
        answerIndex: 0,
        explanation:
          "Қабанбай батырдың есімі тарихи жадта Дарабоз атауымен қатар аталады.",
        reward: {
          score: 120,
          hp: 10,
          energy: 12,
        },
      },
      {
        id: "qabanbay-quiz-2",
        question: "Қабанбай бейнесі қай қасиетті көрсетеді?",
        options: ["Шабуыл мен қорғанысты тең ұстау", "Тек тыныштықта отыру", "Тек ойын-сауық"],
        answerIndex: 0,
        explanation:
          "Қабанбай тұлғасында батылдықпен бірге есеп пен сақтық та ерекше орын алады.",
        reward: {
          score: 150,
          hp: 10,
          energy: 12,
        },
      },
      {
        id: "qabanbay-quiz-3",
        question: "Оқушы Қабанбайдан қандай сабақ ала алады?",
        options: ["Жауапкершілік пен ұстамдылық", "Асығыстық", "Сенімсіздік"],
        answerIndex: 0,
        explanation:
          "Қабанбай батырдың тұлғасы ерлікпен қатар жауапкершілік пен салмақты шешім қабылдауды үйретеді.",
        reward: {
          score: 180,
          hp: 12,
          energy: 16,
        },
      },
    ],
    finalReflection:
      "Қабанбай батыр жас ұрпаққа жеңіс тек күшпен емес, сабыр, тәртіп және жауапкершілікпен келетінін еске салады.",
    translations: {
      en: {
        name: "Qabanbai Batyr",
        title: "The Balanced Power of the Daraboz Spirit",
        description:
          "Qabanbai Batyr is known in Kazakh history for his leadership, courage, and heroism in balancing attack and defense equally.",
        type: "Balanced Guardian",
        weapon: "Sword, shield, spear",
        style: "Balanced attack and defense",
        specialAbility: "Daraboz's Oath",
        era: "18th century",
        quote: "The road to victory demands patience and heroism in equal measure.",
        biography:
          "Qabanbai Batyr distinguished himself in battles against the Dzungars and became one of the commanders remembered by the people as 'Daraboz'. His image became a model of the balanced strength that defended the nation in a difficult period.",
        legacy:
          "Through the figure of Qabanbai, students grasp the importance of self-control, responsibility, and strategic thinking alongside courage.",
        strengths: ["Balanced", "Composed", "Attacker", "Guardian"],
        facts: [
          {
            title: "The Name Daraboz",
            description:
              "Qabanbai Batyr is remembered in historical memory under the name Daraboz, becoming a symbol of exceptional leadership and heroism.",
            rewardLabel: "+120 points and a badge of fame",
          },
          {
            title: "Balanced Decision",
            description:
              "In Qabanbai's image, courage and composure go hand in hand: he accurately judges both the moment to attack and the need to defend.",
            rewardLabel: "Defense power increases",
          },
          {
            title: "A Symbol of the Nation",
            description:
              "Qabanbai Batyr's name recalls the unity of the people, the idea of defending the homeland, and a persistent struggle.",
            rewardLabel: "Energy restoration",
          },
        ],
        quiz: [
          {
            question: "By what other name is Qabanbai Batyr also known?",
            options: ["Daraboz", "Zhyrau (bard)", "Only an envoy"],
            explanation:
              "Qabanbai Batyr's name is remembered in historical memory alongside the name Daraboz.",
          },
          {
            question: "What quality does Qabanbai's image show?",
            options: [
              "Balancing attack and defense equally",
              "Only staying still",
              "Only entertainment",
            ],
            explanation:
              "In Qabanbai's character, calculation and caution hold a special place alongside courage.",
          },
          {
            question: "What lesson can a student learn from Qabanbai?",
            options: ["Responsibility and self-control", "Rashness", "Distrust"],
            explanation:
              "Qabanbai Batyr's character teaches responsibility and weighing decisions carefully, alongside heroism.",
          },
        ],
        finalReflection:
          "Qabanbai Batyr reminds the younger generation that victory comes not through strength alone, but through composure, discipline, and responsibility.",
      },
    },
  },
  {
    id: "raiymbek",
    name: "Райымбек батыр",
    title: "Жетісу рухының епті қаһарманы",
    description:
      "Райымбек батыр халық жадында епті, сергек және туған жер үшін тайсалмай күрескен тарихи батыр ретінде сақталған.",
    type: "Епті соққы шебері",
    weapon: "Қылыш, жеңіл найза",
    style: "Жеңіл қимыл, жиі шабуыл",
    specialAbility: "Тұлпар қарқыны",
    era: "XVIII ғасыр",
    quote: "Ер жүрек адам елдің үмітін өзімен бірге алып жүреді.",
    biography:
      "Райымбек батыр Жетісу өңіріндегі ерлік дәстүрімен, туған жерді қорғаудағы табандылығымен есте қалады. Оның бейнесі жас, серпінді және қайратты батыр ретінде көп айтылады.",
    legacy:
      "Бұл тұлға оқушыларға жастық жігерді, туған жерге сүйіспеншілікті және қиындық алдында тайсалмауды танытады.",
    strengths: ["Епті", "Сергек", "Жігерлі", "Жауапты"],
    colors: {
      accent: "#f2c36f",
      secondary: "#0d6773",
      glow: "#ffe1a2",
      sand: "#c38649",
      sky: "#091828",
    },
    stats: {
      attack: 72,
      defense: 60,
      speed: 94,
      wisdom: 74,
    },
    gameplay: {
      maxHp: 110,
      speed: 248,
      jumpPower: 512,
      attackDamage: 23,
      specialDamage: 37,
      attackRange: 90,
      specialCost: 36,
      specialCooldown: 4500,
    },
    facts: [
      {
        id: "raiymbek-fact-1",
        title: "Жетісу қаһарманы",
        description:
          "Райымбек батырдың аты Жетісу өңірінің ерлік дәстүрімен және туған жерді қорғау идеясымен тығыз байланысты.",
        rewardLabel: "+120 ұпай және рухани белгі",
      },
      {
        id: "raiymbek-fact-2",
        title: "Жастық жігер",
        description:
          "Райымбек бейнесі сергектік пен табандылықтың, батыл қадам мен елге деген адалдықтың үлгісін береді.",
        rewardLabel: "Жылдамдық қуаты",
      },
      {
        id: "raiymbek-fact-3",
        title: "Туған жерге адалдық",
        description:
          "Оның ерлігі туған өлкені қорғау, халық сенімін ақтау және қиындықта да рухты жоғалтпау ойымен ұштасады.",
        rewardLabel: "HP мен энергия күшеюі",
      },
    ],
    quiz: [
      {
        id: "raiymbek-quiz-1",
        question: "Райымбек батырдың бейнесі қай аймақпен жиі байланысады?",
        options: ["Жетісу", "Тек теңіз жағалауы", "Арктика"],
        answerIndex: 0,
        explanation:
          "Райымбек батыр халық жадында Жетісу өңірінің ерлік дәстүрімен қатар айтылады.",
        reward: {
          score: 120,
          hp: 10,
          energy: 12,
        },
      },
      {
        id: "raiymbek-quiz-2",
        question: "Оның тұлғасы қандай қасиетті дәріптейді?",
        options: ["Жігер мен ептілік", "Әлсіздік", "Селқостық"],
        answerIndex: 0,
        explanation:
          "Райымбек бейнесінде сергектік, жігер және іске тез кірісу айқын көрінеді.",
        reward: {
          score: 150,
          hp: 8,
          energy: 14,
        },
      },
      {
        id: "raiymbek-quiz-3",
        question: "Райымбек жайлы ең маңызды ойдың бірі қандай?",
        options: ["Туған жерді қорғау", "Жауапкершіліктен қашу", "Білімді қажет етпеу"],
        answerIndex: 0,
        explanation:
          "Райымбек батырдың ерлік жолы туған жерге адалдық пен ел сенімін ақтауға үндейді.",
        reward: {
          score: 180,
          hp: 12,
          energy: 16,
        },
      },
    ],
    finalReflection:
      "Райымбек батырдың образы оқушыларға жас жігердің елге сүйіспеншілікпен біріккенде нағыз ерлікке айналатынын жеткізеді.",
    translations: {
      en: {
        name: "Raiymbek Batyr",
        title: "The Agile Hero of the Zhetisu Spirit",
        description:
          "Raiymbek Batyr is remembered by the people as an agile, alert historical batyr who fought fearlessly for his homeland.",
        type: "Master of Agile Strikes",
        weapon: "Sword, light spear",
        style: "Light movement, frequent strikes",
        specialAbility: "Steed's Momentum",
        era: "18th century",
        quote: "A brave-hearted person carries the nation's hope within them.",
        biography:
          "Raiymbek Batyr is remembered for the tradition of heroism in the Zhetisu region and his perseverance in defending his homeland. His image is often spoken of as a young, dynamic, and spirited batyr.",
        legacy:
          "This figure shows students youthful energy, love for the homeland, and fearlessness in the face of hardship.",
        strengths: ["Agile", "Alert", "Energetic", "Responsible"],
        facts: [
          {
            title: "Hero of Zhetisu",
            description:
              "Raiymbek Batyr's name is closely tied to the heroic tradition of the Zhetisu region and the idea of defending the homeland.",
            rewardLabel: "+120 points and a spiritual badge",
          },
          {
            title: "Youthful Energy",
            description:
              "Raiymbek's image offers a model of alertness and perseverance, bold action, and loyalty to the nation.",
            rewardLabel: "Speed power",
          },
          {
            title: "Loyalty to the Homeland",
            description:
              "His heroism is bound to defending his native land, justifying the people's trust, and not losing spirit even in hardship.",
            rewardLabel: "HP and energy boost",
          },
        ],
        quiz: [
          {
            question: "Which region is Raiymbek Batyr's image often associated with?",
            options: ["Zhetisu", "Only a seacoast", "The Arctic"],
            explanation:
              "Raiymbek Batyr is remembered by the people alongside the heroic tradition of the Zhetisu region.",
          },
          {
            question: "What quality does his character embody?",
            options: ["Energy and agility", "Weakness", "Indifference"],
            explanation:
              "Raiymbek's image clearly shows alertness, energy, and readiness to act quickly.",
          },
          {
            question: "What is one of the most important ideas about Raiymbek?",
            options: ["Defending the homeland", "Avoiding responsibility", "Not needing knowledge"],
            explanation:
              "Raiymbek Batyr's heroic path calls for loyalty to the homeland and living up to the people's trust.",
          },
        ],
        finalReflection:
          "Raiymbek Batyr's image conveys to students that youthful energy, when united with love for the nation, becomes true heroism.",
      },
    },
  },
];

export const batyrMap = Object.fromEntries(batyrs.map((batyr) => [batyr.id, batyr]));
