// ─────────────────────────────────────────────────────────────────────────
// MANUALLY-MANAGED PLAYER ROSTER
//
// Paste player lists here in the same "TAG | Player Name" format, one per
// line, blank lines allowed between groups. The tag/label on the left is
// matched automatically against the team names in `teamNames.ts` — it can
// be the team's full name, its short tag (e.g. "TVA"), or, for compound
// names like "RZ7 X ARABI", either half on its own ("RZ7" or "ARABI").
//
// If a label can't be matched to exactly one team, that line is skipped
// (see `getUnmatchedRosterLabels()` — used only for developer diagnostics).
// Teams with no matched players fall back to a small generated placeholder
// roster so the site never shows an empty team page.
// ─────────────────────────────────────────────────────────────────────────

export const ROSTER_TEXT = `
14K | ALBERT
14K | AMZ
14K | BELLIE JUDEN
14K | CURSE
14K | DAVID KURISHINGAL
14K | DEVIL
14K | JOVAH VEX
14K | JUAN PABLO
14K | LUCHO KAI
14K | RAMU

4TG | ESCINDIR
4TG | GWADX
4TG | JUICE LAGO
4TG | KAPZ REY
4TG | KRISH
4TG | LUKAS
4TG | NEVIN OSTIN
4TG | RAAVU
4TG | RABADA
4TG | SMOKED BABZ

AB3 | BOJAN KRKIC
AB3 | CHEMBAN
AB3 | RECK
AB3 | SAGA
AB3 | SCOTT
AB3 | SREE KRISHNAN
AB3 | TORRENT

ACT | BIBIN ZACHARIAH
ACT | CHADIYAN CHANDU
ACT | JACKY DELUCCA
ACT | MURALI DUDE
ACT | NIGHTMARE SUTTU
ACT | PUNYALAN
ACT | ZAAL

AGA | BILAL SEEN
AGA | CRESPO XBITO
AGA | INDUCHOODAN DAMU
AGA | LOGAN REX
AGA | MONTER LEE
AGA | NAZCO MARAAR
AGA | PAUL ANDERSON
AGA | SUKUMARAKURUP
AGA | SULAIMAN KADAVANTHRA
AGA | SULAIMAN SAHA

ATU | AADUTHOMA
ATU | KATTALAN SULAIMAN
ATU | RELLIK DIABLO

BB | AADHI VELU
BB | BHARATHAN
BB | EVAN
BB | FADE X
BB | KATTIPALLI PAPPAN
BB | KEVIN MITNICK
BB | KUDUKKA RATHEESH
BB | PANCHAVAN PARIVENTHAN
BB | SPARZO KUTTAN
BB | WAYN

BS | CUBAN
BS | H7DRA
BS | KARUPPU
BS | LEXY FTW
BS | MJ
BS | RYUZAKI
BS | SATAN
BS | SHEIKH MUHAMMED
BS | SPIDEEE
BS | THE KOYA

BCZ | ARAKKAL RAMAN
BCZ | AXE MORGAN
BCZ | CHEMBOTH
BCZ | KAZHUKAN DAS
BCZ | NAPOLEON
BCZ | OLIGARCH RETRO
BCZ | PING999
BCZ | THARIKIDA
BCZ | RINUZ W

BVQ | BINU SINCLAIR
BVQ | DARK STRIKE
BVQ | FLOKI QUIP
BVQ | ISAGI
BVQ | KANGA
BVQ | KEN BROOKLYN
BVQ | KURUP SURA
BVQ | ROLEX
BVQ | SILVER
BVQ | STALINX

BM | ALIBABA OXE
BM | BEBOH
BM | KAZHUGHAN SURA
BM | KENNY
BM | MICHU POPZZ
BM | NIX
BM | POOCHAA
BM | UNNI COSTA
BM | VARKKI MON
BM | VYPIN SHASHI

CSK | ETHAN WINTERS
CSK | FAZE MADRASI
CSK | IAM BATMAN
CSK | LAMINE YAMAL
CSK | LEZZY
CSK | POOKANNAN
CSK | RAMBUTTAN
CSK | RYZETH
CSK | TONY W
CSK | ZYTRO

CID | ASH LOGAN
CID | BLADE THOMA
CID | DAWOOD OP
CID | DIO SLASH

CM | ARRASCAETA
CM | BLASZCZYKOWSKI
CM | CALHANOGLU
CM | GHOOCHANNEJHAD

DW | CRAZYBOY
DW | JUNE
DW | KAEMI
DW | KAZERKTKAN

DNA | AIMLESS
DNA | ALEX KARLENKO
DNA | DIGAMBARAN
DNA | FINN

DRS | AG SIR
DRS | ALAN WALKER
DRS | BATU MON
DRS | ELIJAH MIKHAELSON

ESB | 20FPS LEO
ESB | EDRO NEELAN
ESB | EDRO NEELAN🍒
ESB | LUMI

EC | BABA
EC | D4RKIE BTW
EC | DHEEPAN
EC | ELAN

ESP | ASURAN W
ESP | CROWN JOD
ESP | DRAKEN TOMAN
ESP | KURIAKOSE

ES | AJI
ES | BANE
ES | HOMOSAP
ES | ISSACDEEZNUTS

FTH | AKASH JOD
FTH | OBITO
FTH | SPIDEY
FTH | ABHI

GBZ | BatMan ZANI
GBZ | GINGER PELE
GBZ | KING MARCO
GBZ | LEWIS GREY

IGZ | ABU JOD
IGZ | AJ
IGZ | ASSASSIN GHOST
IGZ | MADHAVAN

ITALIA | GHOOCHANNEJHAD
ITALIA | H1TZLSPERGER
ITALIA | SCHWEINSTEIGER
ITALIA | SZCZESNY

JDA | ADOLAF HITLER
JDA | ARTHUR
JDA | BRUZE
JDA | FELIX BTW

KAIYUAN | BARRETTO JOSE
KAI | AYOKI
KAI | BARRETTO JOSE
KAI | BENZ

KATTADI | FLOKI QUIP
KATTADI | ISAGI
KATTADI | KANGA
KATTADI | SILVER

KVA | MJ
KVA | RYUZAKI
KVA | SHEIKH MUHAMMED
KVA | VITO

KVP | ABD
KVP | AZRO REMOTADA
KVP | BROVSKY
KVP | DRAVUS

KSD | AIZEN SOSUKE
KSD | DRAKE
KSD | DUKE
KSD | JINJA

LM | JOKK MON
LM | NICO PAZ
LM | POOKIE BATMAN
LM | PULSER SUNI

LZ | ADONI
LZ | BENNY JOHNSON
LZ | DUBAI JOSE
LZ | KUTTU

MAFIA | A R Y A N
MAFIA | CLOWNXD
MAFIA | JEEVAN
MAFIA | JOY 777

MIA | BEN SEBASTIN
MIA | CUBIXZZ
MIA | EDDIE KNOX
MIA | ERIC

MX13 | ACIDO HUH
MX13 | DOM
MX13 | GREG HuH
MX13 | GTX VAG

MasZ | GROSSKREUTZ
MasZ | SCHWEINSTEIGER
MasZ | SZCZESNY
MasZ | BEEF

NXT | ADAM JOHN
NXT | HITLER MADHAVAN
NXT | JAMES MARTINEZ
NXT | Kaizen Berg

NTX | 2SHORT FOR 69
NTX | AXEL
NTX | Crazyan
NTX | DOMINIC DUVOR

ESP | CROWN JOD
ESP | DRAKEN TOMAN
ESP | NIKKU JOISON
OG | ABHIMANYU W

RMD X TPA | ANGOTHI REJI
RMD X TPA | SGA VICKY
RMD X TPA | SHUPPU
RMD X TPA | TITAN

R3X | BILLA
R3X | Dhamodar Singh
R3X | DRACULA
R3X | HENNRY FX

RZ7 | DEFAULT
RZ7 | FL1CK
RZ7 | JIN SAKAI
RZ7 | MADHAVANUNNI

RB7 | ESSENZA
RB7 | AIDEN ACE
RB7 | ARKAM DAVID
RB7 | CHRISTI

RDR | IM JERRY🛸
RDR | ARUMUKAN
RDR | AIR INDIA
RDR | AKC17

RC | DONLEE SEOK
RC | KRONUS
RC | KYE
RC | MACHO

RMD X TPA | POTTAZ MON
RMD X TPA | ANGOTHI REJI
RMD x TPA | ASTA W
RMD X TPA | AZREAL EZRAA

ARABI | BILAL
ARABI | BLAKE
ARABI | CHARLIE
ARABI | FAGIANO

ARABI | JJ
DLX | BURN
DLX | CHARAN
DLX | GRIEZMANN

RAN | ARKAM JAYAN
RAN | AYYAPPA DAS
RAN | DEVOOTTAN
RAN | LUKMAN

ATPD | TUF | NIKLAUS DHAMODHAR
SMB | KANNAN BHAI
SMB | MR TOMZ
SMB | NIKLAUS DHAMODHAR

SBB | LAFREE
SBB | ADNAN
SBB | CARLO
SBB | HENZO

SR | AL PACINO
SR | COOL
SR | Ethos
SR | EVE ILL

NXT | ADAM JOHN
NXT | HITLER MADHAVAN
NXT | JAMES MARTINEZ
NXT | Kaizen Berg

ARABI | LOKI W
S7 | DOCKY
S7 | Flexy
S7 | GAWD NEO

TBS | SAVIO SALVATORE
TBS | AJITH KUMAR
TBS | ALONE WALKER
TBS | DHRUV VOSS

4TG | ESCINDIR
4TG | JUICE LAGO
4TG | KAPZ REY
4TG | LUKAS

MasZ | RAGE
RMD X TPA | POTTAZ MON
RMD X TPA | ANGOTHI REJI
RMD x TPA | ASTA W

TUF | APOLLO JOD
TUF | DILLI ANNAN
TUF | GON FREECSS
TUF | HEGAL DAVIS

TVA X CSK | ABEL
TVA X CSK | ALEX
TVA X CSK | ASH
TVA x CSK | Balan K Nair

TVA | NEELAKANDAN
TVA | SNIPE
TVA | DESTROO
TVA | DORKKY

ESB | THEKKINTE THEVAR
ESB | YORIICHI
TOKYO | DANTE SILVANO
TOKYO | DIESEL

UK | AKAZA WOLFYYY
UK | AKSHAY RIQUIII
UK | B3AZTY X3
UK | EMO GWAD

UMM | CREEPY
UMM | CURTIS KNOX
UMM | DERICK ABRAHAM
UMM | DK GOD

VNV | ALEXANDER DIOS
VNV | ANTRO
VNV | ATREUS LOKI
VNV | AZEEZ W

MasZ | BULL OP
NTX | JASI
VH | BUZZKILL
VH | CK MAARI

VKS | BATHAKA
VKS | GODSON
VKS | KARIM LALA
VKS | MOON

XT | BLUFF NEXUS
XT | EZAKI
XT | MADOX ONYX
XT | MIKEY SANO

ZIN | ABHI
ZIN | ATHUL
ZIN | COSMOY
ZIN | KRISHNA BOSS

ZM | ALONE WALKER
ZM | ANAKATTIL CHACKOCHI
ZM | DAVE STEEL
ZM | DHRUV VOSS

KFC | KAIDO
KFC | PAKKI
KFC | SHADOW
KSD | AIZEN SOSUKE

BL | A G R
BL | DYGO
BL | FALCON
BL | FTA

DX | Goat Leo
DX | HERMUS CALDER

KP | AADU THOMA
KP | ALESSANDRO HEXAA
KP | ALEXANDER ARNOLD
KP | ARC

KBZ | ACHAAR
KBZ | CHRIS MELLOW
KBZ | LOVE
KBZ | MAXWELL

KFC | ASH BTW
KFC | ASHIII
KFC | KAIDO
KFC | MARTHANDAN

TVA X VT | MAAMAN
TVA X VT | AMBATHURSINGAM
TVA x VT | Appukuttan
TVA X VT | BOBOY

ANB | KUTTU ZENN
ANK | BUCKY CRUZ
ANK | DOMINIC TORETTO
ANK | FAHISH NEXUS

ANB | ACE MILLER
ANB | ARTHUR MORGAN
ANB | BULLET SHEZIN
ANB | CHEKKUTHAN LAZAR

KBFC | MESSI
KBFC | RONALDO
KBFC | NEYMAR
KBFC | MBAPPE
KBFC | KANTE 
KBFC | DE BRUYNE
KBFC | VAN DIJK
KBFC | HAZARD
KBFC | SUAREZ
KBFC | MODRIC
KBFC | KLOPP

SVA | ALEXANDER ARNOLD
SVA | TONI KROSS
SVA | LUKA 
SVA | VINI JR
SVA | GAVI
SVA | PEDRI
SVA | BENZEEMA
SVA | ASENCIO
SVA | ZIDAAN
SVA | KAN
SVA | RODRYGO

ACM | PAULO MALDINI
ACM | FRANCO BARESI
ACM | GIUSEPPE BERGOMI
ACM | ANDREA PIRLO
ACM | KAKA
ACM | RONALDINHO
ACM | ZLATAN IBRAHIMOVIC
ACM | FRANCK RIBERY
ACM | ROBINHO
ACM | ALESSANDRO DEL PIERO
ACM | PAOLO ROSSI

IM | IBRAHIMOVIC
IM | JAVIER ZANETTI
IM | DIEGO MILITO
IM | ANDREA BARZAGLI
IM | GIANLUIGI BUFFON
IM | SAMIR HANDANOVIC
IM | MARIO BALOTELLI
IM | ANTONIO CASSANO
IM | ALESSANDRO NESTA
IM | ROBERTO BAGGIO
IM | FRANCESCO TOTTI

FARX | TEXTURE
FARX | TENZ
FARX | ASPAS
FARX | ZMJJKK
FARX | KAAJAK
FARX | ZEKKAN
FARX | SOMETHING
FARX | FORSAKEN
FARX | CHRONICLE
FARX | ETHAN
FARX |ALFAJER

SRRA | TGLTN
SRRA | AIXLEFT
SRRA | BATULINS
SRRA | KICKSTART
SRRA | XMPL
SRRA | SEOUL
SRRA | TOP
SRRA | DOK
SRRA | CARRILHO
SRRA | HIMASS
SRRA | XWUDD

YOYO | MONSEY
YOYO | ZYWOO
YOYO | DONK
YOYO | NIKO
YOYO | ROPZ
YOYO | S1MPLE
YOYO | DEV1CE
YOYO | KARRIGAN
YOYO | GET RIGHT
YOYO | SH1RO
YOYO | MOLODOY

ELD | JONATHAN
ELD | HUNTERZ
ELD | LEGIT
ELD | GOBLIN
ELD | AKOP
ELD | DEVOTTE
ELD | MANYA
ELD | SAUMRAJ
ELD | DESTRO
ELD | SCOUTOP
ELD | MORTAL

DC | ETTORTO
DC | GUIFERA
DC | RIZKY FAIDAN
DC | ELGA CAHYA
DC | OSTRYBUCH
DC | MINBAPPE
DC | JXMKT
DC | JUNHOPES
DC | MEROMEN
DC | LUCASSS
DC | JIMENES

MRZ | UNI
MRZ | GREMLIN
MRZ | LASAGNA
MRZ | ELYX
MRZ | ROMAS
MRZ | NTMR
MRZ | ENVY
MRZ | FIVE FEARS
MRZ | OJI
MRZ | KINGZERO
MRZ | SPACESTATION

D67 | CONNOR
D67 | NATHAN
D67 | CALE MAKAR
D67 | NIKITA 
D67 | LEON 
D67 | HELLEBUYCK
D67 | TOM BOON
D67 | XAN DE WAARD
D67 | TOMAS
D67 | HARMANPREET
D67 | YIBBI JANSEN

ATPD | SIMONE GIANNELI
ATPD | PAULA EGONU
ATPD | ANTOINE BRIZARD
ATPD | GABI GUIMARAES
ATPD | ALESSANDRO 
ATPD | MELISSA VARGAS
ATPD | WILFREDO LEON
ATPD | MONICA DE GENNARO
ATPD | YUJI NISHIDA
ATPD | TIJANA 

HF | SHOHEI 
HF | AARON
HF | BOBBY WITT
HF | JUAN SATO
HF | TARIK SKUBAL
HF | PAUL SKENES
HF | JOSE RAMIREZ
HF | FRANCISCO LINDOR
HF | YORDAN ALVAREZ
HF | RONALD ACUNA JR

R34 | BRUNO 
R34 | CUNHA
R34 | KOBBIE
R34 | RASHFORD
R34 | LISANDRO MARTINEZ
R34 | MATTHIJS DE LIGHT
R34 | MANUEL UGARTE
R34 | AMAD DIALLO
R34 | DIOGO DALOT
R34 | LENY YORO

ATX | HAALAND
ATX | PHIL FOODEN
ATX | RUBEN DIAS
ATX | GVARDIOL
ATX | JEREMY DOKU
ATX | MATEO
ATX | GREALISH
ATX | RAYAN AIT NOURI
ATX | RICO LEWIS
ATX | DONNARUMMA

ADR | DEMBELE
ADR | VITINHA
ADR | HAKIMI
ADR | MARQUINHOS
ADR | JOAO NEVES
ADR | WARREN 
ADR | BARCOLO
ADR | DOUE
ADR | NUNO MENDES
ADR | LUCAS CHEVALIER

BLR | PAULO DYBALA
BLR | DONYELL MALEN
BLR | LORENZO PELLEGRINI
BLR | BRYAN CRISTANTE
BLR | MANU KONE
BLR | GIANLUCA MANCINI
BLR | EVAN NDICKA
BLR | NAHUEL MOLINA
BLR | MILE SVILAR
BLR | MATIAS SOULE

SEN | KANG IN LEE
SEN | KIM MIN JAE
SEN | KIM YOUNG GYU
SEN | KIM JIN SU
SEN | KIN JONG
SEN | KANG LEE
SEN | GYU LEE
SEN | MIN JOE YU
SEN | JIN SU KIM
SEN | JIN SU LEE

T47 | JULIAN ALVAREZ
T47 | JAN OBLAK
T47 | KOKE
T47 | CRISTAN ROMERO
T47 | ALEX BAENA
T47 | LOOKMAN
T47 | LIORENTE
T47 | PABLO BARRIOS
T47 | ROBIN LE NORMAND
T47 | ALEXANDER SORLOTH

CVA | JORDAN PICKFORD
CVA | MASON MOUNT
CVA | BEN CHILWELL
CVA | JAMES WARD-PROWSE
CVA | RICE
CVA | FODEN
CVA | FORD
CVA | GREAL
CVA | MUSIALA
CVA | NEUER
`
// ── Parsing & matching ──────────────────────────────────────────────────

function normalizeLabel(raw: string): string {
  return raw
    .trim()
    .toUpperCase()
    .replace(/\s+X\s+/g, ' X ')
    .replace(/\s+/g, ' ')
    .trim()
}

function cleanAlnum(s: string): string {
  return s.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

interface ParsedLine {
  labels: string[] // candidate labels to try, in order, e.g. ["ATPD", "TUF"]
  name: string
}

function parseRosterText(text: string): ParsedLine[] {
  const lines: ParsedLine[] = []
  for (const raw of text.split('\n')) {
    const trimmed = raw.trim()
    if (!trimmed) continue
    const parts = trimmed.split('|').map((p) => p.trim()).filter(Boolean)
    if (parts.length < 2) continue
    const name = parts[parts.length - 1]
    const labels = parts.slice(0, -1)
    lines.push({ labels, name })
  }
  return lines
}

/**
 * Builds a lookup from every normalized label a team could be referred to
 * by (its full name, its short tag, and — for compound "A X B" names —
 * each half on its own, but ONLY when that half is unambiguous across all
 * teams) to that team's id.
 */
function buildLabelIndex(teamRows: { id: string; name: string; tag: string }[]): Map<string, string> {
  const index = new Map<string, string>()
  const componentOwners = new Map<string, Set<string>>()

  for (const t of teamRows) {
    index.set(normalizeLabel(t.name), t.id)
    index.set(normalizeLabel(t.tag), t.id)

    const compoundMatch = normalizeLabel(t.name).match(/^(.+?) X (.+)$/)
    if (compoundMatch) {
      for (const part of [compoundMatch[1], compoundMatch[2]]) {
        const key = normalizeLabel(part)
        if (!componentOwners.has(key)) componentOwners.set(key, new Set())
        componentOwners.get(key)!.add(t.id)
      }
    }
  }

  for (const [key, owners] of componentOwners) {
    if (owners.size === 1 && !index.has(key)) {
      index.set(key, [...owners][0])
    }
  }

  return index
}

/** Unambiguous prefix fallback: label matches the start of exactly one team's cleaned name/tag. */
function buildPrefixMatcher(teamRows: { id: string; name: string; tag: string }[]) {
  const cleaned = teamRows.map((t) => ({ id: t.id, name: cleanAlnum(t.name), tag: cleanAlnum(t.tag) }))
  return (label: string): string | null => {
    const cleanedLabel = cleanAlnum(label)
    if (cleanedLabel.length < 2) return null
    const matches = cleaned.filter((t) => t.name.startsWith(cleanedLabel) || t.tag.startsWith(cleanedLabel))
    return matches.length === 1 ? matches[0].id : null
  }
}

export interface RosterBuildResult {
  rosterByTeamId: Map<string, string[]>
  unmatchedLabels: string[]
}

export function buildRosterFromText(
  text: string,
  teamRows: { id: string; name: string; tag: string }[],
): RosterBuildResult {
  const labelIndex = buildLabelIndex(teamRows)
  const prefixMatch = buildPrefixMatcher(teamRows)
  const parsedLines = parseRosterText(text)

  const rosterByTeamId = new Map<string, string[]>()
  const seenPerTeam = new Map<string, Set<string>>()
  const unmatched = new Set<string>()

  for (const line of parsedLines) {
    let teamId: string | null = null
    for (const label of line.labels) {
      const key = normalizeLabel(label)
      teamId = labelIndex.get(key) ?? prefixMatch(label)
      if (teamId) break
    }

    if (!teamId) {
      unmatched.add(line.labels.join(' | '))
      continue
    }

    if (!rosterByTeamId.has(teamId)) rosterByTeamId.set(teamId, [])
    if (!seenPerTeam.has(teamId)) seenPerTeam.set(teamId, new Set())
    const seen = seenPerTeam.get(teamId)!
    const dedupeKey = line.name.trim().toUpperCase()
    if (!seen.has(dedupeKey)) {
      seen.add(dedupeKey)
      rosterByTeamId.get(teamId)!.push(line.name.trim())
    }
  }

  return { rosterByTeamId, unmatchedLabels: [...unmatched] }
}

let cachedUnmatched: string[] | null = null
export function getUnmatchedRosterLabels(): string[] {
  return cachedUnmatched ?? []
}
export function setUnmatchedRosterLabels(labels: string[]) {
  cachedUnmatched = labels
}
