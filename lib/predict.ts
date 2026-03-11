// Local astrological prediction generator — zero external dependencies.
// Used when ANTHROPIC_API_KEY is absent; provides rich template-based readings
// drawn from classical Western astrology.

import type { AstroData } from "@/lib/astrology";

// ─── Sign interpretations ─────────────────────────────────────────────────────

const SIGN_PERSONALITY: Record<string, string> = {
  Bélier:      "une énergie pionnière et une volonté de fer qui propulse vers l'avant",
  Taureau:     "une détermination tranquille et un attachement profond à la sécurité et aux plaisirs sensoriels",
  Gémeaux:     "une curiosité insatiable et une capacité à jongler avec plusieurs réalités simultanément",
  Cancer:      "une sensibilité émotionnelle profonde et un instinct protecteur naturel",
  Lion:        "une créativité solaire et un besoin d'expression authentique de soi",
  Vierge:      "un sens de l'analyse aiguisé et une quête constante de perfectionnement",
  Balance:     "un talent naturel pour l'harmonie et une recherche perpétuelle de beauté et d'équité",
  Scorpion:    "une intensité transformatrice et une capacité à plonger dans les profondeurs de l'existence",
  Sagittaire:  "un élan philosophique vers l'expansion et une soif de liberté et de vérité",
  Capricorne:  "une ambition disciplinée et une patience stratégique qui mène au sommet",
  Verseau:     "une vision avant-gardiste et un idéalisme qui transcende les conventions",
  Poissons:    "une empathie cosmique et une connexion mystique avec les dimensions invisibles",
};

const SIGN_EMOTION: Record<string, string> = {
  Bélier:      "réagissez avec spontanéité et passion — vos émotions jaillissent comme des étincelles vives",
  Taureau:     "ressentez avec profondeur et constance — vos émotions sont stables mais peuvent être tenaces",
  Gémeaux:     "vivez les émotions dans l'intellect, les traitant à travers le langage et l'échange",
  Cancer:      "absorbez les atmosphères et les humeurs avec une intensité lunaire profonde",
  Lion:        "exprimez les émotions avec générosité, cherchant reconnaissance et chaleur",
  Vierge:      "analysez les émotions avant de les exprimer, cherchant à les comprendre",
  Balance:     "ressentez l'harmonie ou la dissonance des relations, cherchant l'équilibre émotionnel",
  Scorpion:    "plongez dans les émotions avec intensité, capable d'une loyauté absolue et d'une transformation radicale",
  Sagittaire:  "vivez les émotions comme des aventures, cherchant le sens derrière chaque ressenti",
  Capricorne:  "maîtrisez les émotions avec discipline, les intégrant graduellement dans une sagesse pratique",
  Verseau:     "détachez les émotions pour les observer objectivement, privilégiant l'idéal au ressenti immédiat",
  Poissons:    "vous fondez dans les émotions comme l'eau dans l'océan, avec une compassion infinie",
};

const SIGN_IMAGE: Record<string, string> = {
  Bélier:      "projetez une présence dynamique et directe qui impose le respect",
  Taureau:     "dégagez une aura de stabilité et de fiabilité qui inspire confiance",
  Gémeaux:     "présentez une versatilité charmante et une vivacité intellectuelle immédiatement perceptible",
  Cancer:      "rayonnez une chaleur protectrice et une douceur qui invitent à la confiance",
  Lion:        "attirez naturellement les regards avec une présence royale et une dignité lumineuse",
  Vierge:      "transmettez une précision soignée et une compétence discrète qui inspire confiance",
  Balance:     "dégagez un charme naturel et une élégance qui harmonisent les environnements",
  Scorpion:    "projetez un magnétisme intense et une profondeur mystérieuse qui fascine",
  Sagittaire:  "rayonnez un optimisme contagieux et une ouverture d'esprit qui élargit les horizons",
  Capricorne:  "transmettez une autorité naturelle et un sérieux professionnel qui ouvre les portes",
  Verseau:     "dégagez une originalité distinctive et une indépendance d'esprit qui intrigue",
  Poissons:    "projetez une sensibilité artistique et une douceur rêveuse qui touche les cœurs",
};

const ELEMENT_QUALITY: Record<string, string> = {
  Feu:   "l'ardeur créatrice et l'initiative",
  Terre: "la stabilité matérielle et la persévérance",
  Air:   "la communication et la pensée abstraite",
  Eau:   "l'intuition émotionnelle et la profondeur",
};

// ─── Planet interpretations ───────────────────────────────────────────────────

const PLANET_MEANING: Record<string, Record<string, string>> = {
  Mercure: {
    Bélier:     "une pensée rapide et directe, des communications percutantes et décisives",
    Taureau:    "une réflexion méthodique et des décisions mûrement pesées avant d'être exprimées",
    Gémeaux:    "une intelligence vive et polyvalente, des connexions multiples et stimulantes",
    Cancer:     "une intuition mémorielle et une communication nourrie par l'empathie",
    Lion:       "une éloquence naturelle et une capacité de persuasion charismatique",
    Vierge:     "une précision analytique et un souci du détail remarquable dans les échanges",
    Balance:    "une diplomatie fine et un talent naturel pour la médiation et le dialogue",
    Scorpion:   "une perspicacité psychologique profonde et une parole qui transforme",
    Sagittaire: "une vision globale et une communication inspirante, portée par l'idéal",
    Capricorne: "une rigueur pragmatique et des communications ciblées et efficaces",
    Verseau:    "une pensée innovante et des idées révolutionnaires qui bousculent les conventions",
    Poissons:   "une imagination créatrice et une communication intuitive, symbolique et poétique",
  },
  Vénus: {
    Bélier:     "une passion fougueuse et des désirs amoureux directs et courageux",
    Taureau:    "un sens du plaisir raffiné et une fidélité sensuelle profonde",
    Gémeaux:    "une séduction intellectuelle et des relations nourries par la stimulation mentale",
    Cancer:     "une tendresse protectrice et un attachement profond aux êtres aimés",
    Lion:       "un amour généreux et romanesque, une attirance pour le beau et le théâtral",
    Vierge:     "une affection discrète exprimée par des soins attentionnés et du dévouement",
    Balance:    "un charme naturel et une quête d'harmonie et de réciprocité dans les relations",
    Scorpion:   "une intensité magnétique et des liaisons transformatrices qui marquent à jamais",
    Sagittaire: "une liberté amoureuse et des aventures sentimentales expansives et sincères",
    Capricorne: "une loyauté durable et des relations fondées sur la confiance et l'engagement",
    Verseau:    "une originalité relationnelle et une amitié profonde au cœur de l'amour",
    Poissons:   "un romantisme idéaliste et une compassion sans limites pour l'être aimé",
  },
  Mars: {
    Bélier:     "une énergie explosive et une capacité d'action immédiate et décisive",
    Taureau:    "une endurance tenace et une force silencieuse mais remarquablement déterminée",
    Gémeaux:    "une énergie dispersée intelligemment sur plusieurs fronts, l'action par le verbe",
    Cancer:     "une défense protectrice des proches et une action motivée par les émotions",
    Lion:       "une volonté flamboyante et un leadership naturel qui mobilise les autres",
    Vierge:     "une efficacité méticuleuse et une action précise au service du perfectionnement",
    Balance:    "une diplomatie dans l'action et un sens aigu de la justice et de l'équité",
    Scorpion:   "une puissance transformatrice et une détermination sans compromis ni recul",
    Sagittaire: "un enthousiasme expansif et une action guidée par la vision et l'idéal",
    Capricorne: "une ambition stratégique et une discipline dans l'effort qui garantit le résultat",
    Verseau:    "une action collective et des initiatives avant-gardistes au service du groupe",
    Poissons:   "une action intuitive et une énergie canalisée au service de l'idéal et de la compassion",
  },
  Jupiter: {
    Bélier:     "des opportunités d'expansion par l'initiative et le courage",
    Taureau:    "une croissance matérielle et une abondance par la patience et la constance",
    Gémeaux:    "une expansion intellectuelle et des opportunités par la communication",
    Cancer:     "une protection émotionnelle et une croissance par la famille et l'intuition",
    Lion:       "une chance par la créativité, le leadership et l'expression authentique",
    Vierge:     "une expansion par le service, l'analyse et l'amélioration continue",
    Balance:    "des opportunités par les partenariats, la diplomatie et l'harmonie",
    Scorpion:   "une transformation profonde et une croissance par les épreuves et l'intensité",
    Sagittaire: "une expansion naturelle par la philosophie, les voyages et la sagesse",
    Capricorne: "une réussite par la discipline, la structure et les efforts à long terme",
    Verseau:    "une expansion par l'innovation, la collectivité et les idées révolutionnaires",
    Poissons:   "une grâce spirituelle et une croissance par l'intuition, l'art et la compassion",
  },
  Saturne: {
    Bélier:     "un apprentissage de la patience et de la stratégie pour soutenir l'élan naturel",
    Taureau:    "une construction solide à travers la persévérance et la discipline matérielle",
    Gémeaux:    "une structuration de la pensée et des communications devenant plus profondes",
    Cancer:     "une maturité émotionnelle acquise par les épreuves et la responsabilité familiale",
    Lion:       "un perfectionnement de l'expression créative par la rigueur et la discipline",
    Vierge:     "un raffinement du sens de l'ordre et une maîtrise professionnelle progressive",
    Balance:    "une responsabilité dans les relations et une justice acquise par l'expérience",
    Scorpion:   "une transformation profonde des peurs en forces à travers les épreuves",
    Sagittaire: "une sagesse philosophique gagnée par la rigueur intellectuelle et l'honnêteté",
    Capricorne: "une autorité naturelle et une maîtrise du temps qui porte les fruits à long terme",
    Verseau:    "une responsabilité collective et une innovation structurée qui dure",
    Poissons:   "une dissolution des illusions menant à une spiritualité authentique et éprouvée",
  },
  // Outer planets — slow-moving, define generational context
  Uranus: {
    Bélier:     "une révolution de l'identité et un éveil à une liberté radicale et authentique",
    Taureau:    "une transformation des valeurs matérielles et une révolution dans la relation à l'abondance",
    Gémeaux:    "une révolution dans la communication et des idées qui brisent les paradigmes établis",
    Cancer:     "une transformation des structures familiales et une libération des conditionnements du passé",
    Lion:       "une créativité révolutionnaire et une expression de soi qui défie les conventions",
    Vierge:     "une transformation des méthodes de travail et une révolution dans les soins et la santé",
    Balance:    "une révolution dans les relations et une redéfinition des équilibres sociaux",
    Scorpion:   "une transformation profonde des tabous et une révolution dans le rapport au pouvoir",
    Sagittaire: "une révolution philosophique et une libération des dogmes religieux ou idéologiques",
    Capricorne: "une transformation des structures d'autorité et une révolution dans l'ordre social",
    Verseau:    "une force révolutionnaire dans son élément natal, amplifiant l'innovation et la liberté collective",
    Poissons:   "une dissolution des frontières entre le réel et l'idéal, une révolution spirituelle subtile",
  },
  Neptune: {
    Bélier:     "une dissolution des frontières de l'ego et une quête spirituelle ardente et pionnière",
    Taureau:    "une idéalisation de la beauté matérielle et une sensibilité artistique profondément ancrée",
    Gémeaux:    "une pensée intuitive et poétique qui transcende la logique ordinaire",
    Cancer:     "une sensibilité familiale mystique et une compassion universelle enracinée dans l'enfance",
    Lion:       "une créativité transcendante et un besoin d'expression artistique et spirituelle",
    Vierge:     "une dévotion au service idéal et une sensibilité aux souffrances du monde",
    Balance:    "une quête d'harmonie universelle et un idéal romantique et esthétique élevé",
    Scorpion:   "une plongée dans les mystères de l'âme et une transformation spirituelle profonde",
    Sagittaire: "une quête philosophique transcendante et une foi expansive en quelque chose de plus grand",
    Capricorne: "une spiritualisation des ambitions et une dissolution graduelle des structures rigides",
    Verseau:    "un idéalisme humaniste collectif et une vision d'une humanité unie et éveillée",
    Poissons:   "une immersion totale dans le mystique, une compassion cosmique et un don artistique profond",
  },
};

// ─── Aspect interpretations ───────────────────────────────────────────────────

const ASPECT_INTERP: Record<string, Record<string, string>> = {
  harmonieux: {
    Conjonction: "fusionne ces énergies en une force unifiée qui amplifie votre pouvoir d'expression",
    Trigone:     "crée un flux naturel et gracieux entre ces deux dimensions de votre être",
    Sextile:     "ouvre des opportunités subtiles qui récompensent votre initiative consciente",
    default:     "soutient harmonieusement votre développement et facilite vos talents naturels",
  },
  tendu: {
    Carré:       "génère une friction dynamique qui, bien canalisée, devient un puissant moteur de réalisation",
    Opposition:  "révèle une polarité à intégrer — deux forces cherchant l'équilibre et la complémentarité",
    default:     "crée une tension créatrice qui stimule votre dépassement et votre croissance",
  },
  neutre: {
    Quinconce: "invite à un ajustement permanent qui développe votre adaptabilité et votre souplesse",
    default:   "ajoute une nuance complexe à votre carte, enrichissant votre palette intérieure",
  },
};

// ─── Theme content ────────────────────────────────────────────────────────────

const OPENING_COSMIC: Record<string, string> = {
  global:       "Les sphères célestes tracent en ce moment une configuration unique dans le grand livre du cosmos, révélant un moment charnière de votre voyage terrestre.",
  amour:        "Vénus orchestre en ce moment une symphonie délicate dans les jardins de votre âme, invitant le cœur à s'ouvrir aux vibrations de l'amour véritable.",
  travail:      "Saturne et Jupiter forment en ce moment un duo de sagesse dans la voûte céleste, éclairant les voies de votre destinée professionnelle et de vos ambitions.",
  sante:        "L'harmonie entre votre corps et l'univers est au cœur de la lecture céleste du moment, vous invitant à écouter les murmures profonds de votre vitalité.",
  finances:     "Mercure et Jupiter alignent leurs influences pour révéler les courants d'abondance qui traversent votre carte du ciel, porteurs d'opportunités matérielles.",
  spiritualite: "Neptune et Pluton tissent en ce moment un voile lumineux entre le visible et l'invisible, ouvrant un portail vers les profondeurs de votre âme immortelle.",
};

const THEME_ADVICE: Record<string, Record<string, string[]>> = {
  global: {
    Feu:   ["Canalisez votre élan naturel vers un projet qui vous tient à cœur — le moment est propice à l'initiative et à l'audace.", "Prenez le temps de célébrer vos victoires passées avant de vous lancer dans la prochaine aventure.", "Votre authenticité est votre plus grand atout : restez fidèle à vos convictions profondes."],
    Terre: ["Consolidez les fondations de vos projets — ce que vous bâtissez maintenant avec soin durera.", "Un examen attentif de vos ressources actuelles révélera des opportunités insoupçonnées.", "La persévérance tranquille vous mènera plus loin que l'agitation — faites confiance au processus."],
    Air:   ["Partagez vos idées : une conversation ouverte peut débloquer des portes insoupçonnées.", "L'apprentissage continu est votre voie d'épanouissement — suivez votre curiosité naturelle.", "Vos connexions sociales sont une ressource précieuse à cultiver avec intention et authenticité."],
    Eau:   ["Faites confiance à votre intuition — elle vous guide plus sûrement que la seule logique.", "Accordez-vous des moments de silence pour entendre la voix de votre sagesse intérieure.", "Vos émotions sont des informations précieuses, pas des obstacles — apprenez à les lire."],
  },
  amour: {
    Feu:   ["Exprimez votre affection avec la spontanéité qui vous caractérise — votre flamme est irrésistible.", "Une vulnérabilité courageuse renforcera les liens qui comptent vraiment pour vous.", "Laissez l'autre briller également — l'amour s'épanouit dans le don mutuel et généreux."],
    Terre: ["Un geste concret d'amour — un repas partagé, un soutien pratique — compte plus que mille promesses.", "La sécurité que vous offrez est un don rare : appréciez-la et partagez-la ouvertement.", "Apprenez à exprimer verbalement ce que vous ressentez — vos proches en ont réellement besoin."],
    Air:   ["La qualité de vos échanges est le cœur de vos relations — cultivez la conversation profonde.", "Restez ouvert aux nouvelles rencontres : l'amour peut surgir là où vous ne l'attendiez pas.", "Un acte de communication sincère peut dénouer les malentendus qui s'accumulent silencieusement."],
    Eau:   ["Établissez des limites émotionnelles saines tout en restant profondément ouvert à l'amour.", "Votre empathie profonde est un cadeau — veillez à ne pas vous perdre dans l'autre.", "La guérison émotionnelle est un prérequis à l'amour plein — prenez le temps qu'il faut."],
  },
  travail: {
    Feu:   ["Prenez l'initiative sur un projet qui stagnait — votre énergie peut débloquer la situation.", "Votre leadership est reconnu dans votre entourage : assumez-le avec confiance et générosité.", "N'hésitez pas à proposer des idées audacieuses — l'innovation est votre force distinctive."],
    Terre: ["Votre fiabilité est votre meilleur argument professionnel — continuez à tenir vos engagements.", "Un plan détaillé sur les 6 prochains mois vous donnera la clarté nécessaire pour avancer.", "Valorisez vos compétences pratiques : elles sont plus rares et précieuses qu'il n'y paraît."],
    Air:   ["Votre réseau professionnel est votre plus grande ressource — investissez-y temps et authenticité.", "Une formation ou un nouvel apprentissage pourrait ouvrir des perspectives inattendues.", "Vos idées créatives méritent d'être exprimées — trouvez le canal approprié pour les partager."],
    Eau:   ["Votre intelligence émotionnelle est un atout rare dans le monde professionnel — cultivez-le.", "Suivez votre intuition sur les opportunités professionnelles — votre flair est fiable.", "Créez un environnement de travail qui nourrit votre sensibilité plutôt que de la combattre."],
  },
  sante: {
    Feu:   ["Canalisez votre énergie dans une pratique physique régulière — votre corps a besoin de mouvement.", "Surveillez les signes d'épuisement : votre intensité naturelle peut brûler les réserves trop vite.", "La pleine conscience entre les actions recharge vos batteries plus efficacement que le repos total."],
    Terre: ["L'alimentation consciente et les routines corporelles régulières sont vos meilleurs alliés.", "Des promenades dans la nature vous ancrent et régénèrent profondément votre énergie vitale.", "Écoutez les signaux subtils de votre corps — il communique avant que la maladie ne s'installe."],
    Air:   ["La respiration consciente est votre premier médicament — pratiquez-la quotidiennement.", "Alternez les périodes d'activité intense avec des pauses complètes pour équilibrer votre système nerveux.", "Un sommeil de qualité est crucial pour votre cerveau actif — créez un rituel du soir apaisant."],
    Eau:   ["La gestion du stress émotionnel est votre priorité santé — trouvez votre pratique de libération.", "L'eau est votre élément guérisseur : bains, natation, ou simplement boire abondamment chaque jour.", "Votre système immunitaire est intimement lié à votre état émotionnel — chérissez votre paix intérieure."],
  },
  finances: {
    Feu:   ["L'audace calculée est votre force financière — identifiez l'opportunité et agissez rapidement.", "Évitez les dépenses impulsives nées de l'enthousiasme du moment — dormez dessus avant d'agir.", "Votre énergie entrepreneuriale peut être monétisée : réfléchissez à ce que vous pourriez créer."],
    Terre: ["La construction patiente d'une épargne régulière est votre stratégie gagnante sur le long terme.", "Investissez dans le tangible et l'éprouvé — votre sens de la valeur réelle est un guide sûr.", "Vérifiez vos contrats et engagements financiers avec soin — les détails comptent aujourd'hui."],
    Air:   ["Une information ou une conversation peut changer votre paysage financier — restez à l'écoute.", "Diversifiez vos sources de revenus en exploitant vos compétences de communication et de réseau.", "La négociation est votre atout — n'acceptez jamais la première offre sans explorer les alternatives."],
    Eau:   ["Votre intuition financière est plus fiable que vous ne le croyez — faites-lui confiance.", "Protégez-vous des investissements émotionnels — distinguez le désir du besoin réel.", "L'abondance commence dans la conscience — visualisez la prospérité avant de la manifester."],
  },
  spiritualite: {
    Feu:   ["Votre quête spirituelle est ardente et directe — honorez cette flamme sacrée en vous.", "Les pratiques actives comme le yoga, la danse sacrée ou le qi gong sont vos voies d'éveil.", "Votre âme cherche à se manifester pleinement dans le monde — donnez-lui l'espace pour briller."],
    Terre: ["La spiritualité dans les gestes quotidiens est votre chemin — chaque acte peut devenir sacré.", "La connexion avec la nature est votre temple : les arbres, la terre, les pierres vous parlent.", "Ancrez vos insights spirituels dans des pratiques concrètes et régulières qui transforment le quotidien."],
    Air:   ["La méditation et l'étude des textes sacrés nourrissent votre éveil intellectuel et spirituel.", "Votre âme évolue à travers les échanges et les enseignements — enseignez ce que vous avez appris.", "Les synchronicités sont vos messages du cosmos — restez attentif aux coïncidences signifiantes."],
    Eau:   ["Votre connexion spirituelle est naturelle et profonde — faites confiance à vos visions intérieures.", "La méditation silencieuse, le rêve éveillé et la contemplation sont vos portes vers le divin.", "Votre âme ancienne porte des souvenirs précieux — explorez-les avec respect et bienveillance."],
  },
};

const ELEMENT_NOTE: Record<string, string> = {
  Feu:   "La dominance du Feu dans votre thème invite à tempérer parfois l'impulsivité par la réflexion.",
  Terre: "La prédominance de la Terre invite à oser l'action spontanée et à briser la routine.",
  Air:   "L'abondance d'Air dans votre carte appelle à ancrer vos idées brillantes dans le concret.",
  Eau:   "La dominance de l'Eau demande une protection consciente contre l'absorption émotionnelle excessive.",
};

const CLOSING_AFFIRMATIONS = [
  "Les étoiles ne vous imposent rien — elles illuminent vos possibilités. Vous êtes le co-créateur de votre destin, armé de la connaissance de vos forces célestes.",
  "Chaque configuration astrale est une invitation, non une sentence. Votre libre arbitre reste la plus puissante des forces cosmiques.",
  "La sagesse des astres est gravée en vous depuis votre premier souffle. Faites confiance au voyage unique et irremplaçable qui est le vôtre.",
  "L'univers vous a doté d'un thème natal unique dans l'histoire du cosmos. Aucune autre âme ne portera jamais exactement votre carte du ciel.",
];

// ─── Main generator ───────────────────────────────────────────────────────────

export function generatePrediction(astroData: AstroData, theme: string): string {
  const { sunSign, moonSign, ascendant, planetPositions, aspects } = astroData;

  // Dominant element by planet count
  const elementCount: Record<string, number> = {};
  for (const pp of planetPositions) {
    elementCount[pp.sign.element] = (elementCount[pp.sign.element] ?? 0) + 1;
  }
  const dominant = Object.entries(elementCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? sunSign.element;

  // Closing — deterministic pick based on chart signature
  const closingIdx = Math.abs(sunSign.name.length + moonSign.name.length + ascendant.name.length) % CLOSING_AFFIRMATIONS.length;

  // ── Section 1 : Opening ───────────────────────────────────────────────────
  const opening = OPENING_COSMIC[theme] ?? OPENING_COSMIC.global;
  const sunPP    = planetPositions.find((p) => p.planet.name === "Soleil");
  const birthCtx = astroData.birthPlace
    ? ` Né${astroData.birthTime ? ` le ${new Date(astroData.birthDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}` : ""} à ${astroData.birthPlace}, votre thème natal porte l'empreinte de ce lieu et de cet instant.`
    : "";

  // ── Section 2 : Trinity ───────────────────────────────────────────────────
  const trinityLines = [
    `Votre **Soleil en ${sunSign.name}**${sunPP ? ` (${sunPP.degree}°)` : ""} vous confère ${SIGN_PERSONALITY[sunSign.name] ?? "une essence unique et précieuse"}.`,
    `La **Lune en ${moonSign.name}** colore votre monde intérieur : vous ${SIGN_EMOTION[moonSign.name] ?? "ressentez avec une profondeur particulière"}.`,
    `Votre **Ascendant en ${ascendant.name}** est l'image que le monde perçoit : vous ${SIGN_IMAGE[ascendant.name] ?? "projetez une présence distincte"}.`,
    `Cette trinité ${sunSign.element}/${moonSign.element}/${ascendant.element} tisse une personnalité qui conjugue ${ELEMENT_QUALITY[sunSign.element] ?? "une force singulière"}, ${ELEMENT_QUALITY[moonSign.element] ?? "une profondeur intérieure"} et ${ELEMENT_QUALITY[ascendant.element] ?? "une présence remarquable"}.`,
  ].join(" ");

  // ── Section 3 : Planets ───────────────────────────────────────────────────
  const priorityPlanets = ["Mercure", "Vénus", "Mars", "Jupiter", "Saturne", "Uranus", "Neptune"];
  const planetLines: string[] = [];
  for (const name of priorityPlanets) {
    const pp = planetPositions.find((p) => p.planet.name === name);
    if (!pp) continue;
    const interp = PLANET_MEANING[name]?.[pp.sign.name];
    if (!interp) continue;
    const retro = pp.retrograde ? ` *(rétrograde — invitant à l'introspection)*` : "";
    planetLines.push(`**${name}** en ${pp.sign.name}${retro} apporte ${interp}.`);
  }

  // ── Section 4 : Aspects ───────────────────────────────────────────────────
  const aspectLines: string[] = [];
  for (const asp of aspects.slice(0, 5)) {
    const interp =
      ASPECT_INTERP[asp.nature]?.[asp.type] ??
      ASPECT_INTERP[asp.nature]?.default ??
      "ajoute une nuance distinctive à votre expression";
    aspectLines.push(
      `L'aspect **${asp.type}** entre ${asp.planet1} et ${asp.planet2} (orbe ${asp.orb}°) ${interp}.`
    );
  }
  if (aspectLines.length === 0) {
    aspectLines.push(
      "Votre ciel natal présente peu d'aspects majeurs en ce moment, vous offrant une liberté d'expression non contrainte par des tensions planétaires fortes."
    );
  }

  // ── Section 5 : Advice ────────────────────────────────────────────────────
  const adviceList =
    THEME_ADVICE[theme]?.[dominant] ??
    THEME_ADVICE.global[dominant] ??
    THEME_ADVICE.global.Feu;
  const elementNote = ELEMENT_NOTE[dominant] ?? "";

  // ── Assemble ──────────────────────────────────────────────────────────────
  const sections: string[] = [
    `✦ **Ouverture cosmique**\n\n${opening}${birthCtx} En cette période, les astres forment pour vous une configuration particulièrement révélatrice de votre potentiel.`,

    `✦ **Votre trinité natale : Soleil · Lune · Ascendant**\n\n${trinityLines}`,

    planetLines.length > 0
      ? `✦ **Les messagers planétaires**\n\n${planetLines.join(" ")}`
      : "",

    `✦ **La danse des aspects**\n\n${aspectLines.join(" ")}`,

    `✦ **Conseils des astres**\n\n${adviceList.map((a, i) => `${i + 1}. ${a}`).join("\n")}${elementNote ? `\n\n*Note élémentaire :* ${elementNote}` : ""}`,

    `✦ **Affirmation cosmique**\n\n${CLOSING_AFFIRMATIONS[closingIdx]}`,
  ].filter(Boolean);

  return sections.join("\n\n---\n\n");
}
