// Expansion bank authored 2026-05-13, targeting weak-area evidence from
// pbq-scores-2026-05-09.json. Authoring priorities:
//   - Core 1 Domains 2/3/4/5: barely-drilled vs 36% on D1.
//   - 3.8 Laser Printer Maintenance: byTopic miss=4, hit=0 (worst topic).
//   - d3-ord-001 / variants: 4 attempts, 0 corrects (worst single item).
//   - 4.3 Cloud Characteristics — Elasticity: byTopic miss=2.5, hit=0.5.
//   - 2.6 IP Addressing, 2.7 Internet/Network Types, 2.8 Network Tools.
//   - 3.5 The BIOS, 3.5 CPU Features, 3.6 Computer Power.
//   - 5.5 Troubleshooting Networks (connectivity, gateway-no-internet).
//   - Core 2: zero sessions across all four domains — broad seed.
//
// All IDs carry an `-exp-` marker so they do not collide with existing
// d{N}-{type}-{NNN} or c2-d{N}-{type}-{NNN} IDs (453 questions verified).
// Topic strings copied verbatim from existing files so byTopic weighting
// transfers.
//
// Schema match: identify/troubleshoot/order/match types use the same
// fields as Core 1 (no `core` key — index.js auto-tags Core 1) and
// Core 2 (explicit `core: '2'`).

export const expansion20260513 = [

  // ════════════════════════════════════════════════════════════════════════
  // CORE 1 — DOMAIN 2: NETWORKING (18 questions)
  // ════════════════════════════════════════════════════════════════════════

  {
    id: 'd2-id-exp-001',
    type: 'identify',
    domain: '2',
    topic: '2.6 IP Addressing',
    difficulty: 'easy',
    question: 'A workstation on a /24 subnet has been assigned the address 192.168.1.0. The user reports no connectivity. What is the most likely cause?',
    options: [
      'The DHCP server is offline and the workstation fell back to APIPA',
      '192.168.1.0 is the network address of a /24, not a usable host address',
      'The workstation needs a static gateway entry',
      'The /24 subnet is too small for the host',
    ],
    correct: 1,
    explanation: 'In a /24 subnet, the first address (.0) is the network identifier and the last (.255) is the broadcast. Neither can be assigned to a host. Many techs forget this when reading a misconfigured static IP. The fix is to assign a valid host address inside the range (.1 through .254).',
  },

  {
    id: 'd2-id-exp-002',
    type: 'identify',
    domain: '2',
    topic: '2.6 IP Addressing',
    difficulty: 'medium',
    question: 'A laptop pulls the address 169.254.12.45 from its NIC and reports no internet. ipconfig shows no default gateway. What does this address tell you?',
    options: [
      'The laptop has a valid static IP in a private range',
      'The laptop received a DHCP lease from an internal-only server',
      'APIPA assigned a self-link address because no DHCP server responded',
      'The ISP blocked the laptop and routed it to a captive portal',
    ],
    correct: 2,
    explanation: 'The 169.254.0.0/16 block is reserved for APIPA (Automatic Private IP Addressing). A device assigns itself an address from this range when it asks for DHCP and gets no reply. APIPA only enables link-local traffic. The fix is to find why DHCP failed (cable, switch port, DHCP server, scope exhaustion).',
  },

  {
    id: 'd2-id-exp-003',
    type: 'identify',
    domain: '2',
    topic: '2.6 IP Addressing',
    difficulty: 'medium',
    question: 'A SOHO router hands out addresses in the 10.0.0.0/24 range. A tech configures a server with the static IP 10.0.1.5/24. The server can talk to other 10.0.1.x machines but not to anything on 10.0.0.x. Why?',
    options: [
      'The router is filtering 10.0.1.x traffic',
      '10.0.1.5/24 is on the 10.0.1.0/24 network, a different subnet from 10.0.0.0/24',
      'The server lacks an IPv6 stack',
      'A /24 mask is too narrow for class A addresses',
    ],
    correct: 1,
    explanation: 'A /24 mask means the third octet defines the network. 10.0.0.0/24 and 10.0.1.0/24 are two different networks, and traffic between them must be routed. The fix is to put the server in the correct subnet or configure a route on the SOHO router (which most consumer units do not support natively).',
  },

  {
    id: 'd2-id-exp-004',
    type: 'identify',
    domain: '2',
    topic: '2.6 IP Addressing',
    difficulty: 'medium',
    question: 'A network engineer is asked which private IPv4 ranges are reserved by RFC 1918. Which set is correct?',
    options: [
      '10.0.0.0/8, 169.254.0.0/16, 192.168.0.0/16',
      '10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16',
      '10.0.0.0/16, 172.0.0.0/8, 192.0.0.0/16',
      '127.0.0.0/8, 172.16.0.0/12, 224.0.0.0/4',
    ],
    correct: 1,
    explanation: 'RFC 1918 reserves three private ranges: 10.0.0.0/8, 172.16.0.0/12 (172.16.0.0 through 172.31.255.255), and 192.168.0.0/16. 169.254.0.0/16 is APIPA, 127.0.0.0/8 is loopback, 224.0.0.0/4 is multicast — distinct reservations not part of RFC 1918.',
  },

  {
    id: 'd2-id-exp-005',
    type: 'identify',
    domain: '2',
    topic: '2.6 IP Addressing',
    difficulty: 'hard',
    question: 'A workstation is assigned 192.168.50.130 with a subnet mask of 255.255.255.192. Which of the following is the broadcast address for its subnet?',
    options: [
      '192.168.50.127',
      '192.168.50.191',
      '192.168.50.255',
      '192.168.50.192',
    ],
    correct: 1,
    explanation: 'A /26 mask (255.255.255.192) splits each /24 into four 64-address subnets: .0-.63, .64-.127, .128-.191, .192-.255. 192.168.50.130 lives in the .128-.191 block, so the broadcast is .191. Reading mask = 192 in the last octet means block size 256-192 = 64.',
  },

  {
    id: 'd2-id-exp-006',
    type: 'identify',
    domain: '2',
    topic: '2.7 Internet Connection Types',
    difficulty: 'easy',
    question: 'A rural customer cannot get cable or fiber service. The closest commercially available wired option is a connection that uses the existing copper phone line and delivers asymmetric speeds. Which connection type is this?',
    options: [
      'Cable',
      'DSL',
      'Fiber-to-the-home',
      'Satellite',
    ],
    correct: 1,
    explanation: 'DSL (Digital Subscriber Line) reuses copper telephone wiring and typically delivers faster download than upload (asymmetric). Cable runs over coax. FTTH is fiber and not available in this rural scenario. Satellite is wireless, not wired. DSL remains common where cable and fiber have not been built out.',
  },

  {
    id: 'd2-id-exp-007',
    type: 'identify',
    domain: '2',
    topic: '2.7 Internet Connection Types',
    difficulty: 'medium',
    question: 'A field office on an offshore rig needs internet. There is no terrestrial wired option, and a low-earth-orbit constellation service is available. What is the primary drawback the tech should warn the office about, compared to terrestrial fiber?',
    options: [
      'Lower maximum download speeds in all conditions',
      'Higher latency and weather-sensitive availability vs fiber',
      'Inability to handle TCP traffic',
      'A hard 50 GB/month data cap',
    ],
    correct: 1,
    explanation: 'Satellite links (including LEO services like Starlink) add propagation latency the signal must reach the satellite and return and rain/snow can attenuate the link. LEO constellations cut latency dramatically vs geostationary satellite but still exceed fiber. Speed alone is not the main drawback in current LEO offerings.',
  },

  {
    id: 'd2-id-exp-008',
    type: 'identify',
    domain: '2',
    topic: '2.7 Internet Connection Types',
    difficulty: 'easy',
    question: 'Which physical medium provides the highest sustained throughput and the lowest signal attenuation over long runs for last-mile internet service?',
    options: [
      'Cat 5e copper twisted pair',
      'RG-6 coaxial cable',
      'Single-mode optical fiber',
      'Cat 6a copper twisted pair',
    ],
    correct: 2,
    explanation: 'Single-mode fiber carries signal as light over a glass core with extremely low attenuation, supports multi-gigabit/terabit rates, and runs kilometers without a repeater. Coax and Cat 5e/6a are copper and lose signal much faster over distance and offer lower ceilings. Last-mile fiber (FTTH) is the gold standard.',
  },

  {
    id: 'd2-id-exp-009',
    type: 'identify',
    domain: '2',
    topic: '2.7 Network Types',
    difficulty: 'easy',
    question: 'A user pairs wireless earbuds to their phone. The connection covers only a few meters and is intended for one-to-one peripheral linking. Which network type does this describe?',
    options: [
      'LAN',
      'WAN',
      'PAN',
      'MAN',
    ],
    correct: 2,
    explanation: 'PAN (Personal Area Network) covers the immediate area around a person and is the standard for Bluetooth peripherals. LAN covers a building or floor. MAN covers a city. WAN covers larger geographies (think internet backbones). Bluetooth, NFC, and similar short-range pairings live in the PAN category.',
  },

  {
    id: 'd2-id-exp-010',
    type: 'identify',
    domain: '2',
    topic: '2.7 Network Types',
    difficulty: 'easy',
    question: 'A regional bank links its 12 branch offices across one city using leased fiber owned by the city government. Each branch site is itself a separate LAN. Which network type best describes the inter-branch network?',
    options: [
      'LAN',
      'WAN',
      'MAN',
      'PAN',
    ],
    correct: 2,
    explanation: 'A MAN (Metropolitan Area Network) connects multiple LANs within a city or metropolitan area, often over leased municipal fiber. WAN spans larger geography (cross-country, cross-continent). LAN covers a single site. PAN is personal-scale.',
  },

  {
    id: 'd2-id-exp-011',
    type: 'identify',
    domain: '2',
    topic: '2.8 Network Tools',
    difficulty: 'easy',
    question: 'A tech needs to verify that a freshly terminated Cat 6 patch cable has all 8 wires paired correctly to the right pins on each end, with no shorts, opens, or split pairs. Which tool is the right choice?',
    options: [
      'Tone generator and probe',
      'Cable tester',
      'Loopback plug',
      'Multimeter',
    ],
    correct: 1,
    explanation: 'A cable tester (often a wiring-pinout tester) walks each conductor end-to-end and reports continuity per pin, miswires, opens, and shorts. A toner+probe traces which cable goes where in a bundle (not pinout). A loopback plug tests a NIC by looping send to receive. A multimeter can check single-wire continuity but is impractical for an 8-conductor pinout audit.',
  },

  {
    id: 'd2-id-exp-012',
    type: 'identify',
    domain: '2',
    topic: '2.8 Network Tools',
    difficulty: 'medium',
    question: 'A bundle of 30 unlabeled patch cables comes out of a wall plate in a closet. The tech needs to identify which cable corresponds to a specific office jack. What is the correct tool combination?',
    options: [
      'Cable tester at both ends',
      'Tone generator clipped to the jack, probe wand at the closet to find the cable that hums',
      'A multimeter on continuity mode',
      'A loopback plug at the office and a NIC at the closet',
    ],
    correct: 1,
    explanation: 'A tone generator (fox) injects a signal at one end. A probe (hound) sweeps the bundle and beeps loudest on the matching wire. This is the classic "fox and hound" workflow for tracing cables in messy patch panels. Cable testers verify pinout but do not identify which cable in a bundle is which.',
  },

  {
    id: 'd2-id-exp-013',
    type: 'identify',
    domain: '2',
    topic: '2.8 Network Tools',
    difficulty: 'medium',
    question: 'A new keystone jack has been terminated with the punch-down tool and the 568B pattern. The jack does not link when connected. Which tool will most quickly reveal which pair was punched into the wrong slot?',
    options: [
      'Loopback plug',
      'Wiremap/cable tester',
      'Multimeter',
      'Punch-down tool',
    ],
    correct: 1,
    explanation: 'A wiremap tester (a cable tester with a remote terminator) lights one LED per pin and shows the pinout end-to-end. A miswire (pair 2 swapped with pair 3, for example) lights wrong-numbered LEDs and is immediately visible. A multimeter would require 8 individual probes. Loopback tests a NIC, not a cable pinout.',
  },

  {
    id: 'd2-id-exp-014',
    type: 'identify',
    domain: '2',
    topic: '2.8 Network Tools',
    difficulty: 'medium',
    question: 'Which tool punches insulated copper into an IDC (insulation displacement contact) terminal on a 110-block or keystone jack and trims the excess wire in the same motion?',
    options: [
      'Crimper',
      'Punch-down tool',
      'Cable stripper',
      'Pry tool',
    ],
    correct: 1,
    explanation: 'The punch-down tool drives the conductor into the IDC blade (which slices the insulation and grips the copper) and a spring-loaded blade snips the overhanging wire. Crimpers attach RJ45 connectors to stranded cable. Strippers remove jacket. Pry tools are for plastics. Always confirm 110 vs 66 blade type.',
  },

  {
    id: 'd2-ts-exp-001',
    type: 'troubleshoot',
    domain: '2',
    topic: '5.5 Troubleshooting Networks — Can Ping Gateway, Not Internet',
    difficulty: 'medium',
    scenario: 'A user reports no internet. From their PC, ping to the default gateway 192.168.1.1 succeeds. Ping to 8.8.8.8 succeeds. Ping to www.google.com fails with "Could not find host."',
    steps: [
      {
        question: 'What is the most likely cause given that IP-level pings succeed but the hostname lookup fails?',
        options: [
          'The default gateway is offline',
          'The DNS resolver is misconfigured or unreachable',
          'The NIC driver is corrupt',
          'The ISP is blocking ICMP',
        ],
        correct: 1,
        feedback: 'Ping to 8.8.8.8 (IP) works, ping to a hostname does not. That is the canonical DNS failure signature: routing and gateway are healthy, but name resolution is broken. Check the DNS server configured on the NIC, try nslookup against a known-good server (8.8.8.8 or 1.1.1.1), and verify the local DNS cache isn\'t poisoned.',
      },
      {
        question: 'Which command will most directly confirm the DNS server the workstation is using?',
        options: [
          'ping 8.8.8.8',
          'ipconfig /all',
          'tracert google.com',
          'arp -a',
        ],
        correct: 1,
        feedback: 'ipconfig /all on Windows lists the DNS servers per adapter. Once you see the configured DNS, you can verify reachability (ping/telnet 53) and accuracy (nslookup). tracert needs DNS to translate the hostname first. arp shows the local L2 neighbor table.',
      },
    ],
  },

  {
    id: 'd2-ts-exp-002',
    type: 'troubleshoot',
    domain: '2',
    topic: '5.5 Troubleshooting Networks — Connectivity',
    difficulty: 'medium',
    scenario: 'A small office has 8 wired workstations. One workstation cannot reach the gateway and shows a 169.254.x.x address. Other workstations on the same switch work fine. The user has not changed any settings.',
    steps: [
      {
        question: 'Given the 169.254 address, what does the symptom isolate?',
        options: [
          'The DHCP server is offline office-wide',
          'This one workstation is not receiving a DHCP response (cable, switch port, or NIC fault)',
          'The internet gateway has crashed',
          'The DNS service has timed out',
        ],
        correct: 1,
        feedback: 'Other workstations got DHCP, so the server is fine. APIPA on one machine means the DHCP request never reached the server or the reply never came back. Isolate per-machine: cable, switch port, NIC driver, NIC link status.',
      },
      {
        question: 'You swap the patch cable end-to-end with a known-good one and the workstation immediately leases 192.168.1.42. What was the root cause?',
        options: [
          'The DHCP scope was exhausted',
          'The original patch cable had a fault (broken pair, bad connector, kinked run)',
          'The NIC driver was corrupt',
          'The switch port was administratively disabled',
        ],
        correct: 1,
        feedback: 'A known-good cable swap that resolves DHCP confirms a Layer-1 issue with the original cable. Cable testers usually show this as an "open" on one or more pairs. Replace the cable, label it as failed, and verify the wallplate termination if the cable run was recent.',
      },
    ],
  },

  {
    id: 'd2-id-exp-015',
    type: 'identify',
    domain: '2',
    topic: '2.7 Internet Connection Types',
    difficulty: 'medium',
    question: 'A homeowner wants always-on internet that uses the same coaxial cable carrying their cable TV service. Which last-mile technology is in use?',
    options: [
      'DSL',
      'DOCSIS over cable',
      'Fiber-to-the-home',
      'WISP fixed wireless',
    ],
    correct: 1,
    explanation: 'DOCSIS (Data Over Cable Service Interface Specification) is the standard that moves IP traffic over the same coax that delivers cable TV. DSL uses copper phone lines. FTTH is fiber. WISP fixed wireless is line-of-sight microwave. Knowing the underlying physical medium is exam-standard.',
  },

  {
    id: 'd2-mat-exp-001',
    type: 'match',
    domain: '2',
    topic: '2.8 Network Tools',
    difficulty: 'easy',
    question: 'Match each diagnostic tool to the failure it most directly detects.',
    pairs: [
      { left: 'Cable tester (wiremap)', right: 'Miswired, open, shorted, or split-pair conductors end-to-end' },
      { left: 'Tone generator + probe', right: 'Which cable in a bundle terminates at a specific jack' },
      { left: 'Loopback plug', right: 'Confirms a NIC can transmit and receive on itself' },
      { left: 'Punch-down tool', right: 'Seats and trims a conductor into an IDC terminal' },
    ],
    explanation: 'Each tool maps to a distinct task in the cabling workflow. Mixing them up wastes time the wiremap tells you the pinout is wrong, the toner tells you which cable goes where, the loopback tells you the NIC is good, and the punch-down is for termination not diagnosis.',
  },

  // ════════════════════════════════════════════════════════════════════════
  // CORE 1 — DOMAIN 3: HARDWARE (22 questions)
  // Heavy focus: 3.8 Laser Printer Maintenance, 3.5 The BIOS, 3.5 CPU Features,
  // 3.6 Computer Power, 3.8 Impact Printers.
  // ════════════════════════════════════════════════════════════════════════

  {
    id: 'd3-id-exp-001',
    type: 'identify',
    domain: '3',
    topic: '3.8 Laser Printer Maintenance',
    difficulty: 'medium',
    question: 'A laser printer is producing pages that have toner on them, but the toner smudges easily when the page is touched. Other print quality (alignment, color, density) is fine. Which laser-imaging step is failing?',
    options: [
      'Charging',
      'Developing',
      'Transferring',
      'Fusing',
    ],
    correct: 3,
    explanation: 'Toner reaches the page (so Processing, Charging, Exposing, Developing, and Transferring all worked) but does not bond to it. That isolates the failure to the Fusing step. The fuser unit applies heat and pressure to melt toner into the paper fibers. Common fuser failures: dead lamp, worn pressure roller, damaged Teflon sleeve.',
  },

  {
    id: 'd3-id-exp-002',
    type: 'identify',
    domain: '3',
    topic: '3.8 Laser Printer Maintenance',
    difficulty: 'medium',
    question: 'A user opens a laser printer\'s output tray and a freshly printed sheet has a faint ghost image of the page that printed before it. What is the most likely root cause?',
    options: [
      'A failing drum that is not fully cleaning between revolutions',
      'A failing fuser that cannot bond toner',
      'A weak transfer corona/roller',
      'A misaligned paper tray',
    ],
    correct: 0,
    explanation: 'Ghost images repeating at the drum-circumference interval mean toner from the previous rotation was not removed in the Cleaning step. The drum or its cleaning blade is worn. Fuser issues produce smudging, not ghosting. Transfer issues produce faded pages, not ghosts. Tray misalignment skews pages, not ghosts.',
  },

  {
    id: 'd3-id-exp-003',
    type: 'identify',
    domain: '3',
    topic: '3.8 Laser Printer Maintenance',
    difficulty: 'easy',
    question: 'Which consumable laser-printer part typically has the shortest service life and is the most common scheduled replacement?',
    options: [
      'Fuser assembly',
      'Toner cartridge',
      'Transfer belt',
      'Pickup rollers',
    ],
    correct: 1,
    explanation: 'Toner cartridges run out fastest and are designed to be user-replaceable on a per-job-volume basis (often a few thousand pages). Fusers, transfer belts, and pickup rollers are scheduled maintenance items at much higher page counts (often tens of thousands).',
  },

  {
    id: 'd3-id-exp-004',
    type: 'identify',
    domain: '3',
    topic: '3.8 Laser Printer Maintenance',
    difficulty: 'medium',
    question: 'A tech is performing routine maintenance on an enterprise laser printer with 80,000 pages on it. The maintenance kit ships with new rollers and a new fuser. Which compound is appropriate to use for cleaning toner residue from the inside of the chassis?',
    options: [
      'Compressed air with a tray to catch residue, plus a HEPA-filter vacuum rated for toner',
      'Isopropyl alcohol on a paper towel',
      'A damp microfiber cloth with mild soap',
      'A regular shop vac and feather duster',
    ],
    correct: 0,
    explanation: 'Loose toner is conductive, abrasive, and a respiratory hazard. The correct method is a HEPA-filter "toner vac" plus compressed air with containment. A regular shop vac vents the toner straight back into the air. Liquids (alcohol, water) clump toner and damage the drum. Dusters spread it.',
  },

  {
    id: 'd3-ord-exp-001',
    type: 'order',
    domain: '3',
    topic: '3.8 Laser Printer Maintenance',
    difficulty: 'medium',
    question: 'Place the 7 steps of the laser printing process in the correct order (first to last). This is the V15 (current exam) sequence.',
    items: ['Transferring', 'Charging', 'Cleaning', 'Exposing', 'Processing', 'Developing', 'Fusing'],
    correct: ['Processing', 'Charging', 'Exposing', 'Developing', 'Transferring', 'Fusing', 'Cleaning'],
    explanation: 'P-C-E-D-T-F-C. Processing (rasterize the page), Charging (uniform negative charge on drum), Exposing (laser writes the image by discharging selected spots), Developing (toner sticks to discharged areas), Transferring (toner moves from drum to paper), Fusing (heat + pressure bond toner), Cleaning (remove residual toner before the next page). Mnemonic: "Please Carefully Eat Donuts To Feel Calm."',
  },

  {
    id: 'd3-ord-exp-002',
    type: 'order',
    domain: '3',
    topic: '3.8 Laser Printer Maintenance',
    difficulty: 'medium',
    question: 'A user reports faded prints. The tech wants to walk the imaging steps in order to know which step to investigate. Place the 7 laser-imaging steps in correct order.',
    items: ['Cleaning', 'Fusing', 'Transferring', 'Developing', 'Exposing', 'Charging', 'Processing'],
    correct: ['Processing', 'Charging', 'Exposing', 'Developing', 'Transferring', 'Fusing', 'Cleaning'],
    explanation: 'The fixed order is Processing → Charging → Exposing → Developing → Transferring → Fusing → Cleaning. Faded prints typically point to insufficient charge on the drum (Charging) or weak transfer (Transferring); walking the sequence locates which physical stage is underperforming.',
  },

  {
    id: 'd3-id-exp-005',
    type: 'identify',
    domain: '3',
    topic: '3.8 Impact Printers',
    difficulty: 'easy',
    question: 'A warehouse uses an impact printer to print multi-part carbonless forms. Why is an impact printer the right choice for this use case?',
    options: [
      'Impact printers are faster than laser printers',
      'Impact printers physically strike the ribbon and paper, transferring through all carbon copies in one pass',
      'Impact printers produce higher resolution output than inkjet',
      'Impact printers require no consumables',
    ],
    correct: 1,
    explanation: 'Impact printers use a print head that physically hammers pins through an inked ribbon onto the paper. The mechanical impact transfers the image through multiple carbon or carbonless layers in a single pass. Laser and inkjet cannot duplicate this because they do not strike the page; they only mark the top sheet.',
  },

  {
    id: 'd3-id-exp-006',
    type: 'identify',
    domain: '3',
    topic: '3.8 Impact Printers',
    difficulty: 'medium',
    question: 'An impact printer is producing characters with a fading horizontal band missing from each character. Which maintenance item should be replaced first?',
    options: [
      'Print head',
      'Ribbon',
      'Tractor feed gears',
      'Paper sensor',
    ],
    correct: 1,
    explanation: 'A faded section that affects every character at the same position usually means the ribbon has run dry in a band. Replace the ribbon first (cheap, fast, common). If the symptom persists after a fresh ribbon, the print head pins or solenoids are likely sticking and the head needs service.',
  },

  {
    id: 'd3-id-exp-007',
    type: 'identify',
    domain: '3',
    topic: '3.8 Impact Printers',
    difficulty: 'medium',
    question: 'A continuous-feed impact printer is shifting the print position downward on each successive page, so eventually text overlaps the perforation. Which mechanism is most likely misadjusted?',
    options: [
      'Print head alignment',
      'Tractor feed sprocket alignment to the paper holes',
      'Ribbon advance',
      'Platen pressure',
    ],
    correct: 1,
    explanation: 'Continuous-feed paper has sprocket holes that ride on the tractor feed teeth. If the tractor feed slips or is misaligned to the perforation, each page drifts further from the correct top-of-form. Fixing this is "set top of form" calibration plus a check that the tractor wheels are tight against the paper.',
  },

  {
    id: 'd3-id-exp-008',
    type: 'identify',
    domain: '3',
    topic: '3.5 The BIOS',
    difficulty: 'easy',
    question: 'On a modern UEFI motherboard, which feature verifies that the bootloader is signed by a trusted authority before the OS is allowed to load?',
    options: [
      'Hyper-Threading',
      'Secure Boot',
      'Wake-on-LAN',
      'CSM (Compatibility Support Module)',
    ],
    correct: 1,
    explanation: 'Secure Boot checks the bootloader\'s digital signature against keys stored in firmware. A mismatched or unsigned bootloader is blocked. CSM is the opposite: it lets legacy MBR/BIOS bootloaders run on UEFI systems by skipping Secure Boot. WoL wakes the system over the network. Hyper-Threading is a CPU feature.',
  },

  {
    id: 'd3-id-exp-009',
    type: 'identify',
    domain: '3',
    topic: '3.5 The BIOS',
    difficulty: 'medium',
    question: 'A workstation clock keeps resetting to a date in the year 2000 every time the system is unplugged overnight. What is the most likely cause?',
    options: [
      'NTP service crashed',
      'CMOS coin battery has discharged',
      'BIOS firmware is corrupt',
      'Time zone setting is wrong',
    ],
    correct: 1,
    explanation: 'The CMOS coin battery (CR2032) holds the real-time clock and a small block of BIOS settings while the PSU is fully unpowered. When it dies, the RTC defaults to a manufacturer epoch (often 2000-01-01) every cold boot. Replace the battery; it lasts roughly 5 to 10 years.',
  },

  {
    id: 'd3-id-exp-010',
    type: 'identify',
    domain: '3',
    topic: '3.5 The BIOS',
    difficulty: 'medium',
    question: 'A user installs a fresh OS but cannot enable hardware-accelerated virtualization in their hypervisor. The CPU supports it but it appears greyed out. Where is the most likely fix?',
    options: [
      'Reinstall the OS in UEFI mode',
      'Enable VT-x/AMD-V in BIOS/UEFI',
      'Update the hypervisor',
      'Disable Secure Boot',
    ],
    correct: 1,
    explanation: 'CPU virtualization extensions (Intel VT-x, AMD-V) are toggled in firmware. Many OEMs ship with them disabled by default. The hypervisor cannot enable them at the OS level the toggle lives in BIOS/UEFI under CPU or Advanced settings. Reboot after toggling.',
  },

  {
    id: 'd3-id-exp-011',
    type: 'identify',
    domain: '3',
    topic: '3.5 The BIOS / POST',
    difficulty: 'medium',
    question: 'A workstation powers on, fans spin, but produces a series of beeps and never reaches video. The motherboard manual indicates the beep pattern means "no RAM detected." What does this tell you about the POST sequence?',
    options: [
      'POST completed successfully',
      'POST detected a fault before the video subsystem was initialized and is reporting it via beep codes',
      'The hard drive is failing',
      'The OS bootloader is missing',
    ],
    correct: 1,
    explanation: 'POST (Power-On Self-Test) runs before video initialization, so early failures cannot be shown on screen. Beep codes are the fallback signaling channel. A "no RAM" pattern means the firmware tried to enumerate memory and got nothing reseat DIMMs, try one stick at a time, swap slots.',
  },

  {
    id: 'd3-id-exp-012',
    type: 'identify',
    domain: '3',
    topic: '3.5 CPU Features',
    difficulty: 'medium',
    question: 'A CPU specification lists "8 cores, 16 threads." What does this configuration tell you?',
    options: [
      'The CPU has 8 physical cores and Hyper-Threading/SMT enabled, exposing 2 threads per core',
      'The CPU has 16 physical cores running at half-speed',
      'The CPU has 8 cores and 16 separate L2 caches',
      'The CPU runs at 16 GHz across 8 cores',
    ],
    correct: 0,
    explanation: 'Hyper-Threading (Intel) and SMT (AMD) let one physical core present as two logical threads to the OS, sharing execution units. 8 physical cores × 2 threads = 16 logical threads. This is not a doubling of compute; it improves utilization when one thread stalls. Disabling HT/SMT in BIOS shows the OS only 8 threads.',
  },

  {
    id: 'd3-id-exp-013',
    type: 'identify',
    domain: '3',
    topic: '3.5 CPU Features',
    difficulty: 'easy',
    question: 'A laptop CPU is rated at "2.4 GHz base, 4.8 GHz boost." Which best describes the role of the boost clock?',
    options: [
      'The clock the CPU sustains under continuous full load',
      'A higher short-burst clock the CPU may hit when thermal and power budgets allow',
      'The minimum idle clock when the system is asleep',
      'The clock used only during BIOS POST',
    ],
    correct: 1,
    explanation: 'Boost (Turbo Boost / Precision Boost) is an opportunistic short-duration overclock that the CPU enters when one or few cores are active and thermals/power are below limits. Sustained all-core load typically settles closer to the base clock. The OS does not control this; the CPU firmware does.',
  },

  {
    id: 'd3-id-exp-014',
    type: 'identify',
    domain: '3',
    topic: '3.5 CPU Features',
    difficulty: 'medium',
    question: 'A tech is choosing a CPU socket for a new x86 build. Which statement is correct about socket compatibility?',
    options: [
      'All Intel and AMD x86 CPUs use the same socket',
      'The CPU socket must match the motherboard\'s socket exactly (e.g., LGA 1700, AM5); a 1700 CPU does not fit an AM5 board',
      'CPU sockets are universal and only the BIOS limits compatibility',
      'PGA and LGA sockets are interchangeable',
    ],
    correct: 1,
    explanation: 'Sockets are mechanical and electrical specifications. LGA (Land Grid Array, pins on the socket, used by Intel) and PGA (Pin Grid Array, pins on the CPU, traditional AMD) are not interchangeable. Intel LGA 1700, AMD AM4, AMD AM5 are distinct sockets. Verify CPU socket = board socket = BIOS-supported CPU list before purchasing.',
  },

  {
    id: 'd3-id-exp-015',
    type: 'identify',
    domain: '3',
    topic: '3.6 Computer Power',
    difficulty: 'medium',
    question: 'A workstation occasionally locks up when the user starts a heavy 3D render. Voltages in BIOS look correct at idle. Which power-related cause is most consistent with a load-triggered lockup?',
    options: [
      'A failed CMOS battery',
      'A PSU undersized or aging, sagging under transient load',
      'A bad power button',
      'Wake-on-LAN is enabled',
    ],
    correct: 1,
    explanation: 'A failing or undersized PSU may hold rated voltage at idle but drop under load (the +12V rail dipping below spec causes GPUs and CPUs to brown out). Symptoms: lockups and shutdowns correlated with heavy workload. Confirm with a PSU tester or by swapping a known-good unit; compare wattage to the build\'s peak draw.',
  },

  {
    id: 'd3-id-exp-016',
    type: 'identify',
    domain: '3',
    topic: '3.6 Computer Power',
    difficulty: 'easy',
    question: 'Which PSU connector supplies 12V to the CPU through a dedicated cable (typically 4+4 pins)?',
    options: [
      '24-pin main ATX',
      'EPS 8-pin CPU power',
      '6+2 PCIe',
      'SATA power',
    ],
    correct: 1,
    explanation: 'The EPS (sometimes called CPU 8-pin) connector delivers high-current 12V directly to the CPU voltage regulator near the socket. The 24-pin ATX powers the board overall. PCIe 6+2 powers add-in cards (GPUs). SATA power runs drives. Forgetting the EPS is a very common no-POST mistake.',
  },

  {
    id: 'd3-id-exp-017',
    type: 'identify',
    domain: '3',
    topic: '3.6 Computer Power',
    difficulty: 'medium',
    question: 'A datacenter PSU is rated "80 Plus Platinum." What does that rating describe?',
    options: [
      'Maximum sustained wattage',
      'Conversion efficiency from AC wall power to DC at 20%/50%/100% load',
      'Number of modular connectors',
      'PSU fan noise level',
    ],
    correct: 1,
    explanation: '80 Plus tiers (Bronze, Silver, Gold, Platinum, Titanium) certify how efficiently the PSU converts wall AC into the DC rails the components use. Higher tiers waste less power as heat. Wattage and modularity are separate specs. A 1000W Platinum unit costs more but runs cooler and saves power over its life.',
  },

  {
    id: 'd3-id-exp-018',
    type: 'identify',
    domain: '3',
    topic: '3.2 Video Cables (V15 — USB-C Video)',
    difficulty: 'medium',
    question: 'A user plugs a USB-C cable from their laptop into an external monitor and gets no picture. The same cable charges their phone fine. The laptop\'s USB-C port does not have a lightning bolt or DP icon next to it. What is the most likely cause?',
    options: [
      'The cable is not USB-C compatible',
      'The laptop\'s USB-C port does not support DisplayPort Alt Mode (data/power only)',
      'The monitor needs a firmware update',
      'The laptop\'s GPU is failing',
    ],
    correct: 1,
    explanation: 'USB-C is just a connector shape. The features it carries (data, power, video via DP Alt Mode, Thunderbolt) depend on the port wiring. A port without a DP or lightning bolt icon often supports only data + power. Video over USB-C requires DisplayPort Alt Mode (or Thunderbolt). Check the manufacturer\'s port spec.',
  },

  {
    id: 'd3-id-exp-019',
    type: 'identify',
    domain: '3',
    topic: '3.2 Video Cables (V15 — USB-C Video)',
    difficulty: 'medium',
    question: 'A user wants to drive two 4K monitors at 60 Hz from a single port on their laptop. Which port standard guarantees this is possible?',
    options: [
      'USB 3.2 Gen 1',
      'Thunderbolt 4 (USB-C connector with lightning bolt icon)',
      'HDMI 1.4',
      'VGA',
    ],
    correct: 1,
    explanation: 'Thunderbolt 4 mandates the ability to drive two 4K displays at 60 Hz (or one 8K) over a single port, in addition to 40 Gbps data and up to 100W power. USB 3.2 Gen 1 does not guarantee video. HDMI 1.4 lacks bandwidth for dual 4K60. VGA is analog and maxes out well below 4K.',
  },

  {
    id: 'd3-mat-exp-001',
    type: 'match',
    domain: '3',
    topic: '3.8 Laser Printer Maintenance',
    difficulty: 'medium',
    question: 'Match each laser-printer symptom to the imaging step where the failure most likely lives.',
    pairs: [
      { left: 'Toner smudges off the page when touched', right: 'Fusing' },
      { left: 'Repeating ghost image at the drum-circumference interval', right: 'Cleaning' },
      { left: 'Pages are blank (no toner reaches paper)', right: 'Transferring (or Charging, if drum holds no charge)' },
      { left: 'Vertical line down every page in the same column', right: 'Drum scratch (physical damage to the imaging drum)' },
    ],
    explanation: 'Mapping symptom to step is the whole point of memorizing the imaging order. Smudging = fuser. Ghosting = cleaning failure. Blank = something earlier in the chain. A persistent vertical line means the drum surface itself is damaged, so every revolution carries the defect forward.',
  },

  // ════════════════════════════════════════════════════════════════════════
  // CORE 1 — DOMAIN 4: VIRTUALIZATION & CLOUD (14 questions)
  // Heavy focus: NIST 5 essential characteristics, IaaS/PaaS/SaaS, Elasticity.
  // ════════════════════════════════════════════════════════════════════════

  {
    id: 'd4-id-exp-001',
    type: 'identify',
    domain: '4',
    topic: '4.3 Cloud Characteristics — Elasticity',
    difficulty: 'medium',
    question: 'A workload runs steady on 4 cloud instances most of the year. During a 90-minute live event, demand briefly demands 60 instances; afterward it returns to 4. The provider scales up and back automatically. Which NIST essential cloud characteristic does this describe?',
    options: [
      'Resource pooling',
      'Rapid elasticity',
      'Measured service',
      'On-demand self-service',
    ],
    correct: 1,
    explanation: 'Rapid elasticity is automatic scale-out and scale-in matched to demand. Resource pooling is multi-tenant infrastructure sharing. Measured service is the metering/billing model. On-demand self-service is provisioning without human intervention. All four (plus Broad network access) are NIST\'s "essential characteristics" of cloud.',
  },

  {
    id: 'd4-id-exp-002',
    type: 'identify',
    domain: '4',
    topic: '4.3 Cloud Characteristics — Elasticity',
    difficulty: 'medium',
    question: 'A startup CFO says: "We only pay for what we use, and the dashboard shows us exact GB-hours and CPU-seconds consumed." Which NIST cloud characteristic is this describing?',
    options: [
      'Resource pooling',
      'Rapid elasticity',
      'Measured service',
      'Broad network access',
    ],
    correct: 2,
    explanation: 'Measured service = metered, monitored, and reported usage, with billing tied to actual consumption. Elasticity is the scaling capability that makes measured service economically meaningful. Resource pooling is the multi-tenant infrastructure underneath. Broad network access is reach from many devices.',
  },

  {
    id: 'd4-id-exp-003',
    type: 'identify',
    domain: '4',
    topic: '4.3 Cloud Characteristics — Elasticity',
    difficulty: 'easy',
    question: 'A user provisions a new virtual machine in 90 seconds through a web console with no phone call, ticket, or human approval involved. Which NIST cloud characteristic does this match?',
    options: [
      'On-demand self-service',
      'Resource pooling',
      'Measured service',
      'Rapid elasticity',
    ],
    correct: 0,
    explanation: 'On-demand self-service = the consumer can provision resources unilaterally without requiring human interaction from the provider. Elasticity is about scale; this is about who initiates and how fast. Resource pooling and measured service describe what is underneath and how billing works.',
  },

  {
    id: 'd4-id-exp-004',
    type: 'identify',
    domain: '4',
    topic: '4.3 Cloud Characteristics — Elasticity',
    difficulty: 'medium',
    question: 'A cloud service is reachable from any internet-connected device worldwide laptops, phones, tablets, kiosks all using standard HTTPS. Which NIST characteristic does this exemplify?',
    options: [
      'Resource pooling',
      'Broad network access',
      'Rapid elasticity',
      'Measured service',
    ],
    correct: 1,
    explanation: 'Broad network access = capabilities available over the network and accessed through standard mechanisms that work across heterogeneous clients. The other four NIST characteristics describe other aspects: multi-tenancy (pooling), scaling (elasticity), self-provisioning (self-service), and metered billing (measured service).',
  },

  {
    id: 'd4-id-exp-005',
    type: 'identify',
    domain: '4',
    topic: '4.1 Cloud Service Models',
    difficulty: 'easy',
    question: 'A company subscribes to a hosted CRM where they only log in and use the product the vendor manages everything underneath. Which service model is this?',
    options: [
      'IaaS',
      'PaaS',
      'SaaS',
      'FaaS',
    ],
    correct: 2,
    explanation: 'SaaS (Software as a Service): the customer consumes a finished application. The provider manages OS, runtime, scaling, and the app itself. PaaS gives the customer a runtime to deploy code. IaaS gives raw VMs. FaaS runs short-lived functions. CRM, email, and Office 365 are canonical SaaS.',
  },

  {
    id: 'd4-id-exp-006',
    type: 'identify',
    domain: '4',
    topic: '4.1 Cloud Service Models',
    difficulty: 'medium',
    question: 'A dev team writes a Python web app and deploys it to a cloud platform that handles OS patching, runtime version, scaling, and load balancing. The team only manages their code and data. Which service model is this?',
    options: [
      'IaaS',
      'PaaS',
      'SaaS',
      'On-prem',
    ],
    correct: 1,
    explanation: 'PaaS (Platform as a Service): the provider manages everything up to the runtime; the customer only ships application code and data. App Engine, Heroku, and Azure App Service are textbook PaaS. IaaS would require the team to also manage the OS, runtime, and scaling.',
  },

  {
    id: 'd4-id-exp-007',
    type: 'identify',
    domain: '4',
    topic: '4.1 Cloud Service Models',
    difficulty: 'medium',
    question: 'A sysadmin provisions Linux VMs, installs MySQL by hand, configures kernel parameters, and runs OS patches monthly. The cloud provider only delivers the bare VM with networking and storage. Which service model is this?',
    options: [
      'SaaS',
      'PaaS',
      'IaaS',
      'DaaS',
    ],
    correct: 2,
    explanation: 'IaaS (Infrastructure as a Service): the customer manages the OS, runtime, middleware, and app; the provider supplies compute, network, and storage. EC2, GCE, and Azure VMs are classic IaaS. The provider doing OS patching would move this toward PaaS.',
  },

  {
    id: 'd4-id-exp-008',
    type: 'identify',
    domain: '4',
    topic: '4.1 Cloud Computing',
    difficulty: 'medium',
    question: 'A bank uses a cloud deployment where the infrastructure is dedicated to them alone, hosted in a private datacenter, with cloud-style provisioning and scaling APIs. Which deployment model is this?',
    options: [
      'Public cloud',
      'Private cloud',
      'Community cloud',
      'Hybrid cloud',
    ],
    correct: 1,
    explanation: 'Private cloud = cloud-style infrastructure dedicated to one organization, often for regulatory or sovereignty reasons. Public cloud is shared across many tenants (AWS, Azure, GCP general regions). Community cloud is shared among a small group with common concerns (e.g., GovCloud). Hybrid mixes public and private with orchestration between.',
  },

  {
    id: 'd4-id-exp-009',
    type: 'identify',
    domain: '4',
    topic: '4.1 Cloud Computing',
    difficulty: 'medium',
    question: 'A retailer keeps customer PII in their on-prem datacenter for compliance reasons but runs their public-facing web tier in a public cloud with traffic flowing securely between the two. Which deployment model is this?',
    options: [
      'Public',
      'Private',
      'Hybrid',
      'Community',
    ],
    correct: 2,
    explanation: 'Hybrid cloud = a composition of two or more distinct cloud infrastructures (public + private here) that remain unique entities but are bound together. Customer PII stays in private. Web tier and elastic scale-out live in public. This is the most common enterprise pattern.',
  },

  {
    id: 'd4-id-exp-010',
    type: 'identify',
    domain: '4',
    topic: '4.2 Hypervisor Types',
    difficulty: 'easy',
    question: 'A server runs ESXi installed directly on the hardware with no host OS underneath. What type of hypervisor is this?',
    options: [
      'Type 1 (bare-metal)',
      'Type 2 (hosted)',
      'Container engine',
      'Emulator',
    ],
    correct: 0,
    explanation: 'Type 1 (bare-metal) hypervisors run directly on the hardware. ESXi, Hyper-V (when deployed as Server Core), and KVM are Type 1. Type 2 hypervisors (VirtualBox, VMware Workstation, Parallels) run as an application on top of a host OS. Type 1 is the choice for production datacenters.',
  },

  {
    id: 'd4-id-exp-011',
    type: 'identify',
    domain: '4',
    topic: '4.2 Hypervisor Types',
    difficulty: 'easy',
    question: 'A user installs VirtualBox on their Windows laptop to run a Linux VM for development. What type of hypervisor is VirtualBox in this scenario?',
    options: [
      'Type 1',
      'Type 2',
      'Type 3',
      'Containerized',
    ],
    correct: 1,
    explanation: 'Type 2 (hosted): runs as an application inside a host OS. VirtualBox on Windows is Type 2. The host OS sits between the hypervisor and hardware, which adds overhead but makes setup easy for desktop and dev use. Type 1 talks to hardware directly.',
  },

  {
    id: 'd4-id-exp-012',
    type: 'identify',
    domain: '4',
    topic: '4.1 Cloud Concepts (V15 — Containers)',
    difficulty: 'medium',
    question: 'A developer ships an application packaged with all its OS libraries, dependencies, and runtime, but it shares the host kernel rather than running a full guest OS. What is this packaging called?',
    options: [
      'Virtual machine',
      'Container',
      'Type 1 hypervisor',
      'Bare-metal install',
    ],
    correct: 1,
    explanation: 'A container packages user-space dependencies (libraries, binaries, configuration) but uses the host\'s kernel. This makes containers much lighter than VMs (which carry a full guest OS). Docker and containerd are typical runtimes. The tradeoff: weaker isolation than a VM, but faster startup and higher density.',
  },

  {
    id: 'd4-id-exp-013',
    type: 'identify',
    domain: '4',
    topic: '4.2 Client-Side Virtualization',
    difficulty: 'medium',
    question: 'A user wants to run a Type 2 hypervisor on their laptop to test malware in an isolated VM. Which CPU feature must be enabled in BIOS for this to work well?',
    options: [
      'PXE boot',
      'Hardware virtualization (VT-x / AMD-V)',
      'Secure Boot',
      'Hyper-Threading only',
    ],
    correct: 1,
    explanation: 'Hardware virtualization extensions (Intel VT-x, AMD-V) allow the hypervisor to run guest code at near-native speed and isolate guests from the host. Most laptops ship with this disabled; enable it in BIOS. Hyper-Threading helps performance but is not required for virtualization. Secure Boot and PXE are unrelated to this feature.',
  },

  {
    id: 'd4-mat-exp-001',
    type: 'match',
    domain: '4',
    topic: '4.3 Cloud Characteristics — Elasticity',
    difficulty: 'medium',
    question: 'Match each scenario to the NIST essential cloud characteristic it best demonstrates.',
    pairs: [
      { left: 'Customer provisions a VM in 60 seconds through a web console', right: 'On-demand self-service' },
      { left: 'A workload scales from 4 to 60 instances during a live event and back', right: 'Rapid elasticity' },
      { left: 'Many tenants share the same physical servers with isolation by hypervisor', right: 'Resource pooling' },
      { left: 'Billing dashboard shows exact GB-hours and CPU-seconds consumed', right: 'Measured service' },
    ],
    explanation: 'The NIST five characteristics: On-demand self-service, Broad network access, Resource pooling, Rapid elasticity, Measured service. The exam loves variants of these scenarios. Notice High Availability is NOT one of the five it is a service-level property, not an essential cloud characteristic.',
  },

  // ════════════════════════════════════════════════════════════════════════
  // CORE 1 — DOMAIN 5: TROUBLESHOOTING (16 questions)
  // Focus: 5.5 Network connectivity, 5.3 Display No Video, 5.4 Mobile Battery.
  // ════════════════════════════════════════════════════════════════════════

  {
    id: 'd5-id-exp-001',
    type: 'identify',
    domain: '5',
    topic: '5.5 Troubleshooting Networks — Connectivity',
    difficulty: 'easy',
    question: 'A user reports "the internet is down." They are the only one in the office affected. The link light on the back of their PC is off. What is the most efficient first step?',
    options: [
      'Reboot the router',
      'Check the patch cable from the PC to the wall and verify it is fully seated at both ends',
      'Reinstall the NIC driver',
      'Replace the PC',
    ],
    correct: 1,
    explanation: 'No link light = Layer 1 (physical) failure. Before touching software, verify the cable. Most "internet down" tickets isolated to one user are an unseated patch cable, a kicked-out wall plug, or a damaged jacket. Confirm both ends and try a known-good cable before escalating.',
  },

  {
    id: 'd5-id-exp-002',
    type: 'identify',
    domain: '5',
    topic: '5.5 Troubleshooting Networks — Connectivity',
    difficulty: 'medium',
    question: 'A user has a link light, a valid DHCP lease, and can ping their default gateway. They cannot ping 8.8.8.8. Other users on the same subnet can reach the internet. What is the most likely cause isolated to this user?',
    options: [
      'A faulty NIC',
      'A firewall rule, route, or proxy applied to this specific machine or user',
      'The ISP is down',
      'DNS is misconfigured',
    ],
    correct: 1,
    explanation: 'Other users on the same subnet work, so the gateway, ISP, and subnet are fine. The user has L2/L3 connectivity (link, lease, gateway reachable). Something is blocking traffic specifically for this user typically a host firewall, a Group Policy proxy setting, or a route added to the routing table. Check host firewall logs and the user\'s proxy configuration.',
  },

  {
    id: 'd5-id-exp-003',
    type: 'identify',
    domain: '5',
    topic: '5.5 Troubleshooting Networks — Wireless',
    difficulty: 'medium',
    question: 'A user reports that their Wi-Fi connection is slow only in the back conference room. Other rooms in the office work fine, and other devices in the same conference room are also slow. What is the most likely cause?',
    options: [
      'The user\'s device has a virus',
      'Weak signal or interference in the conference room (distance from AP, building materials, RF interference)',
      'The ISP is throttling the conference room',
      'DNS is failing only in that room',
    ],
    correct: 1,
    explanation: 'The symptom is room-localized and affects multiple devices, which rules out single-device or per-user causes. Wi-Fi degrades with distance, walls, metal, microwave/2.4 GHz interference, and channel overlap. Survey signal strength with a Wi-Fi analyzer, consider adding an AP, or move to 5 GHz.',
  },

  {
    id: 'd5-id-exp-004',
    type: 'identify',
    domain: '5',
    topic: '5.5 Troubleshooting Networks — Connectivity',
    difficulty: 'medium',
    question: 'A workstation gets a DHCP lease but the assigned address is 169.254.42.7. Which interpretation is correct?',
    options: [
      'DHCP succeeded; this is a normal private address',
      'DHCP failed; the OS auto-assigned an APIPA address as a fallback',
      'The IT admin manually configured this address',
      'The workstation is on a guest network',
    ],
    correct: 1,
    explanation: '169.254.0.0/16 is APIPA. When DHCP receives no reply (server unreachable, cable fault, port down, scope exhausted), the OS gives itself a 169.254 address so link-local traffic works. The user will be unable to reach the gateway or internet. Isolate at L1 first (cable), then check DHCP scope health.',
  },

  {
    id: 'd5-ts-exp-001',
    type: 'troubleshoot',
    domain: '5',
    topic: '5.5 Troubleshooting Networks — Systematic Diagnosis',
    difficulty: 'medium',
    scenario: 'A user reports "I can\'t get to the internal file share at \\\\fileserver." Their machine has internet, can browse external websites, and has a valid IP on the company subnet.',
    steps: [
      {
        question: 'What is the most useful first command to run on the workstation?',
        options: [
          'tracert google.com',
          'ping fileserver (and ping fileserver.corp.local)',
          'ipconfig /release',
          'shutdown /r /t 0',
        ],
        correct: 1,
        feedback: 'Ping by short name and FQDN tells you (a) if the name resolves at all, (b) if it resolves to the correct IP, and (c) if the host is reachable. If the short name fails and the FQDN succeeds, DNS suffix search order is the issue. If both fail to resolve, DNS is broken. If they resolve but ping fails, routing or firewall is blocking SMB.',
      },
      {
        question: 'Ping fileserver.corp.local resolves and returns successful replies, but \\\\fileserver still fails to open in Explorer. What should you check next?',
        options: [
          'The user\'s Active Directory credentials and permissions on the share',
          'The user\'s default gateway',
          'The user\'s DNS server',
          'The user\'s subnet mask',
        ],
        correct: 0,
        feedback: 'Reachability is confirmed (ping replies). The remaining gates are SMB-specific: credentials, share/NTFS permissions, SMB port (445) on the host firewall, and the SMB protocol version. Start with credentials and permissions, then verify firewall.',
      },
    ],
  },

  {
    id: 'd5-id-exp-005',
    type: 'identify',
    domain: '5',
    topic: '5.3 Troubleshooting Display — No Video',
    difficulty: 'easy',
    question: 'A user powers on their workstation. The fans spin and the front LED is on, but the monitor stays black and reports "No Signal." The monitor works on another PC. What is the first thing to verify on the suspect workstation?',
    options: [
      'OS reinstall',
      'That the video cable is fully seated at both ends and connected to the correct port (discrete GPU vs onboard)',
      'Replace the motherboard',
      'Reseat the CPU',
    ],
    correct: 1,
    explanation: 'When a discrete GPU is installed, plugging the monitor into the motherboard\'s onboard video port produces "No Signal." Always verify the cable is connected to the GPU\'s ports, seated at both ends, and the right input is selected on the monitor. Cheap fixes first before considering hardware swaps.',
  },

  {
    id: 'd5-id-exp-006',
    type: 'identify',
    domain: '5',
    topic: '5.3 Troubleshooting Display — No Video',
    difficulty: 'medium',
    question: 'A workstation boots and the monitor shows the firmware/BIOS splash, but the screen goes black as soon as Windows starts. Safe Mode displays fine. What is the most likely cause?',
    options: [
      'The monitor is failing',
      'A corrupt or incompatible GPU driver',
      'A failed PSU',
      'A loose video cable',
    ],
    correct: 1,
    explanation: 'BIOS-level video uses generic firmware drivers and works. The screen failing exactly when Windows loads its display driver isolates the issue to that driver. Safe Mode confirms this Windows boots with a fallback display driver. The fix: boot Safe Mode, roll back or reinstall the GPU driver, then reboot normally.',
  },

  {
    id: 'd5-id-exp-007',
    type: 'identify',
    domain: '5',
    topic: '5.3 Troubleshooting Display — Laptop Screen',
    difficulty: 'medium',
    question: 'A laptop\'s internal display is dim and barely legible. The external monitor on the dock works perfectly. Function-key brightness adjustment makes no visible difference. Which component is most likely failed?',
    options: [
      'The GPU',
      'The backlight or its driver/inverter circuit',
      'The LCD panel itself',
      'The HDMI cable to the external monitor',
    ],
    correct: 1,
    explanation: 'External monitor working confirms the GPU and signal chain are fine. A dim internal panel where brightness control does nothing means the backlight is failing or its driver/inverter is faulty. Shining a flashlight at the screen and seeing the desktop confirms the LCD is producing the image but the backlight is dead.',
  },

  {
    id: 'd5-id-exp-008',
    type: 'identify',
    domain: '5',
    topic: '5.4 Troubleshooting Mobile — Battery',
    difficulty: 'easy',
    question: 'A 3-year-old smartphone now lasts only 2 hours of light use vs the 12 hours it used to last new. It charges fully, but discharges quickly. What is the most likely cause?',
    options: [
      'A virus',
      'Battery capacity degradation from charge-cycle wear',
      'A faulty charger',
      'OS update bug',
    ],
    correct: 1,
    explanation: 'Lithium-ion batteries lose usable capacity with each charge cycle, typically degrading noticeably after 2 to 4 years. The phone reports 100% but the absolute energy stored is much lower. iOS and Android both expose "battery health" or "maximum capacity" readings. Battery replacement is the standard fix.',
  },

  {
    id: 'd5-id-exp-009',
    type: 'identify',
    domain: '5',
    topic: '5.4 Troubleshooting Mobile — Battery',
    difficulty: 'medium',
    question: 'A user reports their phone\'s back cover has bulged outward and the screen is starting to lift from the frame. The phone is 4 years old. What is happening and what is the safety risk?',
    options: [
      'The case is warped from heat; cosmetic only',
      'The lithium-ion battery is swelling from internal cell damage; this is a fire/explosion hazard and the device should be powered off and taken to a service center for safe disposal',
      'The user dropped the phone and bent the frame',
      'A failed speaker is pushing on the back cover',
    ],
    correct: 1,
    explanation: 'A swollen lithium-ion battery is the visible result of internal electrolyte breakdown or a short. The gases generated cannot escape the sealed pack, so the cell physically expands. Swollen batteries can rupture or ignite. Do not puncture or attempt to discharge; route to a hazardous-waste-capable service center.',
  },

  {
    id: 'd5-id-exp-010',
    type: 'identify',
    domain: '5',
    topic: '5.4 Display Symptoms — Image Persistence',
    difficulty: 'medium',
    question: 'An OLED monitor that has displayed the same news ticker at the bottom of the screen for 6 months now shows a faint outline of that ticker even on a blank desktop. Which display phenomenon is this?',
    options: [
      'Dead pixel cluster',
      'Burn-in (permanent image retention from uneven pixel wear on OLED)',
      'Backlight bleeding',
      'Refresh rate mismatch',
    ],
    correct: 1,
    explanation: 'OLED pixels self-emit light. Pixels that have been "on" continuously for long periods age faster than rarely-used pixels. The result is uneven brightness that ghosts persistent content (status bars, channel logos, tickers). This is permanent. Mitigation: pixel-shift, screensavers, varied content. LCDs do not burn in the same way they show temporary image persistence that fades.',
  },

  {
    id: 'd5-id-exp-011',
    type: 'identify',
    domain: '5',
    topic: '5.1 Troubleshooting Hardware — Overheating',
    difficulty: 'medium',
    question: 'A gaming PC throttles to 2.0 GHz under load after 5 minutes of play, even though the CPU is rated 5.0 GHz boost. Idle temps are normal. Under load, CPU temps spike to 95°C+. What is the most likely cause?',
    options: [
      'The PSU is undersized',
      'CPU cooling is inadequate (dried thermal paste, dust-clogged cooler, failed fan, or insufficient cooler)',
      'The motherboard is failing',
      'The OS is misconfigured',
    ],
    correct: 1,
    explanation: 'Idle normal + load spike to 95°C+ = thermal limit triggering throttle. Walk the cooling chain: thermal paste age (replace every 3 to 5 years), heatsink fan health, dust in fins, case airflow, ambient. After 3+ years a dried thermal paste reapplication often reclaims 15 to 20°C.',
  },

  {
    id: 'd5-id-exp-012',
    type: 'identify',
    domain: '5',
    topic: '5.1 Troubleshooting Hardware — No POST',
    difficulty: 'medium',
    question: 'A workstation powers on (fans spin, lights come on) but produces no video, no beeps, and never reaches BIOS. The fans run at full speed. What does the no-beep/no-video pattern most often indicate?',
    options: [
      'A failed CPU or memory subsystem before POST can signal',
      'An OS misconfiguration',
      'A failed monitor',
      'A network issue',
    ],
    correct: 0,
    explanation: 'Fans full speed and no POST signaling typically means the firmware never started executing. CPU and memory are the two earliest dependencies. Reseat RAM (one stick at a time, alternate slots), check CPU socket pins, try a known-good PSU. No beeps may also mean the board has no speaker connected; verify the chassis beep speaker is present.',
  },

  {
    id: 'd5-id-exp-013',
    type: 'identify',
    domain: '5',
    topic: '5.6 Troubleshooting Printers — Laser',
    difficulty: 'medium',
    question: 'A laser printer is producing pages with a single faded vertical streak in the same column on every page. Other columns print normally. Where is the failure?',
    options: [
      'A faulty fuser',
      'A scratch or contamination on the imaging drum at that column',
      'A dirty paper sensor',
      'A misaligned paper tray',
    ],
    correct: 1,
    explanation: 'A defect that repeats in the same column on every page comes from a circumferential point on the imaging drum that is damaged or contaminated. Drum scratches do not heal; replace the drum (or, in cartridge-integrated designs, the cartridge). Fuser issues affect bond, not column-specific clarity.',
  },

  {
    id: 'd5-mat-exp-001',
    type: 'match',
    domain: '5',
    topic: '5.5 Troubleshooting Networks — Systematic Diagnosis',
    difficulty: 'medium',
    question: 'Match each symptom to the most efficient first diagnostic step.',
    pairs: [
      { left: 'No link light on the NIC', right: 'Check and swap the patch cable (Layer 1 first)' },
      { left: '169.254.x.x IP address assigned', right: 'Investigate why DHCP did not respond (cable, port, server)' },
      { left: 'Ping by IP works, ping by hostname fails', right: 'Verify and test DNS resolver settings' },
      { left: 'One user has no internet; others on same subnet do', right: 'Check host firewall, proxy, and per-user policies' },
    ],
    explanation: 'Systematic diagnosis walks the OSI/TCP stack from L1 upward. Every symptom has a "most informative first test" that quickly narrows the search space. Memorizing these symptom-to-first-test pairs is exam-standard and field-standard.',
  },

  {
    id: 'd5-ts-exp-002',
    type: 'troubleshoot',
    domain: '5',
    topic: '5.3 Troubleshooting Display — No Video',
    difficulty: 'medium',
    scenario: 'A workstation with a discrete GPU shows "No Signal" on the monitor at boot. The monitor cable is plugged into the motherboard\'s HDMI port, and the user just installed the GPU last night.',
    steps: [
      {
        question: 'What is the most likely cause?',
        options: [
          'The new GPU is dead on arrival',
          'The monitor cable is plugged into the motherboard\'s onboard video port instead of the discrete GPU\'s ports',
          'The PSU is undersized',
          'The OS is corrupted',
        ],
        correct: 1,
        feedback: 'When a discrete GPU is installed, most boards disable or deprioritize the onboard video output. The monitor must connect to the GPU\'s ports (visible on the back of the card, not on the motherboard I/O shield). This is the single most common new-build "no video" cause.',
      },
      {
        question: 'After moving the cable to the GPU, video appears. What additional check should the tech run to confirm the GPU is being used correctly under Windows?',
        options: [
          'Open Device Manager and confirm the GPU appears under Display adapters with the proper driver installed',
          'Reinstall Windows',
          'Update the BIOS',
          'Replace the monitor cable with a different brand',
        ],
        correct: 0,
        feedback: 'Device Manager shows whether Windows detected the GPU and loaded a driver. If it appears with a yellow warning, install the vendor\'s driver from NVIDIA/AMD/Intel. Once installed, the GPU will be used for 3D and game workloads.',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════
  // CORE 2 — DOMAIN 1: OPERATING SYSTEMS (10 questions)
  // ════════════════════════════════════════════════════════════════════════

  {
    id: 'c2-d1-id-exp-001',
    type: 'identify',
    core: '2',
    domain: '1',
    topic: '1.2 CLI — Network Tools',
    difficulty: 'easy',
    question: 'A Windows user wants to renew their DHCP lease from the command line without rebooting. Which sequence of commands does this?',
    options: [
      'ipconfig /flushdns then ipconfig /registerdns',
      'ipconfig /release then ipconfig /renew',
      'netsh winsock reset',
      'ping localhost',
    ],
    correct: 1,
    explanation: 'ipconfig /release tells the DHCP client to give up the current lease, and /renew asks the server for a new lease. /flushdns clears the resolver cache (DNS-only, not DHCP). /registerdns triggers dynamic DNS registration. winsock reset is a Layer 3/4 driver-stack fix, not a DHCP renewal.',
  },

  {
    id: 'c2-d1-id-exp-002',
    type: 'identify',
    core: '2',
    domain: '1',
    topic: '1.2 CLI — Network Tools',
    difficulty: 'medium',
    question: 'A user reports a website is loading the wrong page. The tech suspects a stale DNS cache on the workstation. Which command will clear the local DNS resolver cache on Windows?',
    options: [
      'nslookup /reset',
      'ipconfig /flushdns',
      'netsh dns reload',
      'systeminfo',
    ],
    correct: 1,
    explanation: 'ipconfig /flushdns clears the local Windows DNS resolver cache. After flushing, the next lookup hits the configured DNS server fresh. nslookup queries DNS but does not clear the cache. systeminfo prints OS metadata. netsh dns reload is not a real command.',
  },

  {
    id: 'c2-d1-id-exp-003',
    type: 'identify',
    core: '2',
    domain: '1',
    topic: '1.2 CLI — File and Disk',
    difficulty: 'easy',
    question: 'A Windows tech needs to check a drive for filesystem errors and repair what it finds, scheduling the run on next reboot if the drive is in use. Which command does this?',
    options: [
      'sfc /scannow',
      'chkdsk C: /f',
      'diskpart',
      'format C:',
    ],
    correct: 1,
    explanation: 'chkdsk /f finds and fixes filesystem errors. If the volume is locked (in use), Windows schedules the check on next reboot. sfc /scannow repairs Windows system files (not filesystem metadata). diskpart manages partitions. format C: would erase the drive.',
  },

  {
    id: 'c2-d1-id-exp-004',
    type: 'identify',
    core: '2',
    domain: '1',
    topic: '1.1 Windows Editions',
    difficulty: 'medium',
    question: 'A small business uses Windows 11 Home on their kiosk PCs and wants to enable BitLocker drive encryption. What must they do first?',
    options: [
      'Install BitLocker from the Microsoft Store',
      'Upgrade to Windows 11 Pro or higher Home does not support BitLocker',
      'Enable Secure Boot in BIOS',
      'Disable TPM',
    ],
    correct: 1,
    explanation: 'BitLocker requires Windows Pro, Pro for Workstations, Enterprise, or Education. Home does not include the BitLocker management features (though it does have "device encryption" on supported hardware, which is a more limited variant). Pro is the minimum for full BitLocker.',
  },

  {
    id: 'c2-d1-id-exp-005',
    type: 'identify',
    core: '2',
    domain: '1',
    topic: '1.8 OS Install — File Systems',
    difficulty: 'easy',
    question: 'A user wants to format an external drive to be readable on both Windows and macOS for files up to 8 GB each. Which filesystem is the most universally compatible choice?',
    options: [
      'NTFS',
      'exFAT',
      'APFS',
      'ext4',
    ],
    correct: 1,
    explanation: 'exFAT is read/write on both Windows and macOS natively, supports files larger than 4 GB (FAT32\'s limit), and works on most consumer devices. NTFS is Windows-native and read-only on macOS without third-party drivers. APFS is macOS-native. ext4 is Linux-native.',
  },

  {
    id: 'c2-d1-id-exp-006',
    type: 'identify',
    core: '2',
    domain: '1',
    topic: '1.8 OS Install — File Systems',
    difficulty: 'medium',
    question: 'A new Windows install will host a database with 8 TB of files, full Windows ACL support, and BitLocker. Which filesystem should the installer choose for the data volume?',
    options: [
      'FAT32',
      'exFAT',
      'NTFS',
      'ext4',
    ],
    correct: 2,
    explanation: 'NTFS is the Windows filesystem with ACLs, large-volume support, journaling, encryption (EFS), compression, and full BitLocker integration. FAT32 caps at 4 GB per file and 2 TB volumes. exFAT has no ACLs and limited journaling. ext4 is not natively supported by Windows.',
  },

  {
    id: 'c2-d1-id-exp-007',
    type: 'identify',
    core: '2',
    domain: '1',
    topic: '1.3 Windows Tools — Task Manager',
    difficulty: 'easy',
    question: 'A user reports their Windows machine is sluggish. The tech wants to see which process is consuming the most CPU and memory in real time. Which tool is the right starting point?',
    options: [
      'Event Viewer',
      'Task Manager',
      'Resource Monitor only',
      'Reliability Monitor',
    ],
    correct: 1,
    explanation: 'Task Manager (Ctrl+Shift+Esc) shows per-process CPU, memory, disk, and network usage with a live sort. Resource Monitor gives more detail but Task Manager is the faster first look. Event Viewer logs events. Reliability Monitor charts long-term stability.',
  },

  {
    id: 'c2-d1-id-exp-008',
    type: 'identify',
    core: '2',
    domain: '1',
    topic: '1.5 Windows Networking — DNS',
    difficulty: 'medium',
    question: 'A Windows machine resolves www.google.com correctly but fails to resolve internal hostname "fileserver" without the FQDN. ipconfig shows the correct DNS suffix. Which setting most likely needs adjustment?',
    options: [
      'DNS suffix search list (so the resolver appends corp.local automatically)',
      'IPv6 stack',
      'Subnet mask',
      'Default gateway',
    ],
    correct: 0,
    explanation: 'Without a DNS suffix search list, Windows does not know to append "corp.local" to short names. Configuring "corp.local" in the suffix search list (or via DHCP option 119) lets users type "fileserver" and have the resolver query "fileserver.corp.local" automatically.',
  },

  {
    id: 'c2-d1-id-exp-009',
    type: 'identify',
    core: '2',
    domain: '1',
    topic: '1.6 macOS / Linux',
    difficulty: 'easy',
    question: 'A Linux user wants to elevate to root briefly to run a single privileged command, then return to their regular user. Which command is the standard approach?',
    options: [
      'sudo <command>',
      'su - and stay as root',
      'chmod 777 <command>',
      'passwd root',
    ],
    correct: 0,
    explanation: 'sudo runs a single command with elevated privileges (subject to /etc/sudoers rules) and returns the user to their normal shell when complete. su - switches to a full root shell, which is more dangerous because everything that follows runs as root. chmod 777 weakens permissions globally. passwd root changes the root password.',
  },

  {
    id: 'c2-d1-id-exp-010',
    type: 'identify',
    core: '2',
    domain: '1',
    topic: '1.7 Mobile OS',
    difficulty: 'medium',
    question: 'A user wants to install a development tool on their iPhone that is not in the App Store. Which Apple-specific term describes installing apps outside the official App Store, and what is the prerequisite?',
    options: [
      'Jailbreaking; requires bypassing iOS security to install unsigned apps',
      'Sideloading; supported via TestFlight or, in regions where Apple allows it, alternative app marketplaces',
      'Rooting; only available on iPad',
      'Tethering; uses Bluetooth',
    ],
    correct: 1,
    explanation: 'Sideloading = installing apps outside the official store. On iOS this is more constrained than Android; the supported paths are TestFlight (limited to beta apps) and, in regions like the EU, alternative marketplaces under the Digital Markets Act. Jailbreaking is a security bypass that voids warranty and is a separate concept.',
  },

  // ════════════════════════════════════════════════════════════════════════
  // CORE 2 — DOMAIN 2: SECURITY (10 questions)
  // ════════════════════════════════════════════════════════════════════════

  {
    id: 'c2-d2-id-exp-001',
    type: 'identify',
    core: '2',
    domain: '2',
    topic: '2.1 Logical Security — MFA',
    difficulty: 'easy',
    question: 'A login flow requires a password and a one-time code from an authenticator app. Which two factors of authentication are being used?',
    options: [
      'Something you know + something you are',
      'Something you know + something you have',
      'Something you have + somewhere you are',
      'Something you know + something you do',
    ],
    correct: 1,
    explanation: 'Password = something you know. Authenticator app on a registered device = something you have. Biometric (fingerprint, face) = something you are. Location = somewhere you are. Two distinct categories make this 2FA; a password + a security question is single-factor (both "know") and does not count.',
  },

  {
    id: 'c2-d2-id-exp-002',
    type: 'identify',
    core: '2',
    domain: '2',
    topic: '2.1 Logical Security — Zero Trust',
    difficulty: 'medium',
    question: 'A company adopts a security model where every access request from any user or device must be authenticated, authorized, and encrypted, regardless of whether the request originates inside or outside the corporate network. What is this model called?',
    options: [
      'Perimeter defense',
      'Zero Trust',
      'Implicit allow',
      'Open network',
    ],
    correct: 1,
    explanation: 'Zero Trust = "never trust, always verify." The model removes the assumption that traffic inside the corporate network is safe. Every session is authenticated and authorized at the resource itself. Perimeter defense (the old "castle and moat") trusted insiders by default and was broken by lateral movement.',
  },

  {
    id: 'c2-d2-id-exp-003',
    type: 'identify',
    core: '2',
    domain: '2',
    topic: '2.4 Malware — Types',
    difficulty: 'easy',
    question: 'A user opens an email attachment. Immediately afterward, all their documents have a .encrypted extension and a popup demands payment in cryptocurrency to recover them. Which malware type is this?',
    options: [
      'Worm',
      'Trojan',
      'Ransomware',
      'Spyware',
    ],
    correct: 2,
    explanation: 'Ransomware encrypts user files and demands payment for the decryption key. Worms spread autonomously across networks. Trojans masquerade as legitimate software and deliver some other payload. Spyware silently exfiltrates data. Ransomware\'s defining feature is the file-encryption + ransom demand.',
  },

  {
    id: 'c2-d2-id-exp-004',
    type: 'identify',
    core: '2',
    domain: '2',
    topic: '2.4 Malware — Types',
    difficulty: 'medium',
    question: 'A program presents itself as a free PDF reader, but once installed it also opens a hidden remote-access backdoor for the attacker. What malware category does this best fit?',
    options: [
      'Worm',
      'Trojan',
      'Ransomware',
      'Adware',
    ],
    correct: 1,
    explanation: 'Trojan = malware disguised as something legitimate. The user installs it willingly, believing the cover story; the hidden payload (here, a backdoor) runs alongside. Worms spread without user action. Ransomware demands payment. Adware shows unwanted ads. The "legitimate disguise + hidden payload" is the trojan signature.',
  },

  {
    id: 'c2-d2-id-exp-005',
    type: 'identify',
    core: '2',
    domain: '2',
    topic: '2.5 Social Engineering — Variants',
    difficulty: 'easy',
    question: 'An attacker calls the help desk pretending to be the CFO and demands an immediate password reset for the CFO\'s account, citing an urgent board meeting. Which social engineering technique is this?',
    options: [
      'Phishing',
      'Vishing (voice phishing)',
      'Tailgating',
      'Shoulder surfing',
    ],
    correct: 1,
    explanation: 'Vishing = voice phishing, conducted over a phone call. Phishing typically refers to email. Smishing is SMS phishing. Tailgating is physically following someone through a secure door. Shoulder surfing is observing credentials being typed. The voice channel makes this vishing.',
  },

  {
    id: 'c2-d2-id-exp-006',
    type: 'identify',
    core: '2',
    domain: '2',
    topic: '2.5 Threats — Phishing Variants',
    difficulty: 'medium',
    question: 'An employee receives an extremely targeted email naming their manager, project, and a recent deal, asking them to wire money "for the deal." What is this attack called?',
    options: [
      'Generic phishing',
      'Spear phishing',
      'Whaling',
      'Pharming',
    ],
    correct: 1,
    explanation: 'Spear phishing = phishing tailored to a specific person using research on the target. Generic phishing is mass-mailed with no personalization. Whaling targets specifically high-value executives ("big fish"). Pharming redirects DNS to fake sites. The detailed personalization is the spear-phishing tell.',
  },

  {
    id: 'c2-d2-id-exp-007',
    type: 'identify',
    core: '2',
    domain: '2',
    topic: '2.2 Windows Security — BitLocker',
    difficulty: 'medium',
    question: 'A company wants full-disk encryption on Windows laptops, with the encryption key sealed to the device hardware so a stolen drive cannot be moved to another machine to decrypt. Which combination provides this?',
    options: [
      'BitLocker + TPM',
      'EFS + smart card',
      'NTFS permissions',
      'BitLocker without TPM',
    ],
    correct: 0,
    explanation: 'BitLocker can use the TPM (Trusted Platform Module) to seal the volume master key to the machine. The drive can only decrypt when booted in the original machine\'s TPM-attested state. Removing the drive defeats decryption. EFS encrypts files per-user but does not protect a booting OS. BitLocker without TPM is possible but loses the hardware-binding protection.',
  },

  {
    id: 'c2-d2-id-exp-008',
    type: 'identify',
    core: '2',
    domain: '2',
    topic: '2.3 Wireless Security — Protocols',
    difficulty: 'medium',
    question: 'A SOHO router supports WEP, WPA, WPA2, and WPA3. Which should the tech choose for the highest practical security on a new install?',
    options: [
      'WEP',
      'WPA',
      'WPA2-Personal',
      'WPA3-Personal (with WPA2 fallback only if required for legacy clients)',
    ],
    correct: 3,
    explanation: 'WPA3 is the current standard; it adds SAE (a stronger handshake resistant to offline dictionary attacks) and forward secrecy. WEP and WPA are both broken (offline attacks recover keys quickly). WPA2 is acceptable when WPA3 is not supported by all clients. Always prefer WPA3 where available.',
  },

  {
    id: 'c2-d2-id-exp-009',
    type: 'identify',
    core: '2',
    domain: '2',
    topic: '2.7 Workstation Hardening — Passwords',
    difficulty: 'easy',
    question: 'A workstation password policy is being tightened. Which combination is the strongest practical baseline for endpoints today?',
    options: [
      'Length 6, change every 30 days, no special chars',
      'Length 14+, no forced rotation unless compromise is suspected, MFA where possible, allow long passphrases',
      'Length 8, must include uppercase, lowercase, digit, special; change every 90 days',
      'Length 4, simple PIN',
    ],
    correct: 1,
    explanation: 'Modern guidance (NIST SP 800-63B and CIS) prefers length over complexity, removes forced periodic rotation (which causes weaker reused passwords), and adds MFA. Long passphrases are easier for humans to remember and harder for attackers to brute-force. Forced 30/90-day rotation is no longer recommended absent indication of compromise.',
  },

  {
    id: 'c2-d2-id-exp-010',
    type: 'identify',
    core: '2',
    domain: '2',
    topic: '2.9 Data Destruction — Wiping vs Format',
    difficulty: 'medium',
    question: 'A company is decommissioning a stack of HDDs and wants to ensure no data can be recovered. A standard quick format is judged insufficient. Which option is appropriate for HDDs that may have held sensitive data?',
    options: [
      'Quick format then donate',
      'Delete all files and empty the recycle bin',
      'Multi-pass overwrite with a certified wiping utility, or physical destruction (shred/degauss)',
      'Reinstall the OS',
    ],
    correct: 2,
    explanation: 'Quick format only resets file metadata; the data remains and is trivially recoverable. Multi-pass overwrite with a certified utility (e.g., DBAN-style) makes recovery infeasible. For the highest assurance or non-functional drives, physical destruction or degaussing (HDDs only; SSDs require crypto-erase or shredding) is the standard. Reinstalling the OS does not zero user data.',
  },

  // ════════════════════════════════════════════════════════════════════════
  // CORE 2 — DOMAIN 3: SOFTWARE TROUBLESHOOTING (5 questions)
  // ════════════════════════════════════════════════════════════════════════

  {
    id: 'c2-d3-id-exp-001',
    type: 'identify',
    core: '2',
    domain: '3',
    topic: '3.1 Windows — BSOD',
    difficulty: 'medium',
    question: 'A Windows machine bluescreens with stop code DRIVER_IRQL_NOT_LESS_OR_EQUAL referencing a network driver file. The crash happens after the user installed a new VPN client. What is the most efficient first action?',
    options: [
      'Reinstall Windows',
      'Boot Safe Mode and uninstall or roll back the newly installed VPN/network driver',
      'Replace the NIC',
      'Update BIOS',
    ],
    correct: 1,
    explanation: 'Stop codes that name a driver point at that driver. The crash starting right after the install is the smoking gun. Boot Safe Mode (drivers load minimally), uninstall the new VPN client, reboot, and reinstall a known-good version. Reinstalling Windows is overkill before the cheaper fix.',
  },

  {
    id: 'c2-d3-id-exp-002',
    type: 'identify',
    core: '2',
    domain: '3',
    topic: '3.1 Windows — System File Repair',
    difficulty: 'medium',
    question: 'A Windows machine throws random "missing DLL" errors across multiple apps after a power outage during an update. Which command is the right first repair pass for corrupt OS files?',
    options: [
      'chkdsk C: /f',
      'sfc /scannow',
      'diskpart',
      'format C:',
    ],
    correct: 1,
    explanation: 'sfc /scannow (System File Checker) verifies Windows system files against the Component Store and replaces corrupted ones. If sfc fails or reports unrecoverable corruption, follow with DISM /Online /Cleanup-Image /RestoreHealth. chkdsk handles filesystem-level corruption (good as a second pass).',
  },

  {
    id: 'c2-d3-id-exp-003',
    type: 'identify',
    core: '2',
    domain: '3',
    topic: '3.4 PC Security — Ransomware Symptoms',
    difficulty: 'easy',
    question: 'A user reports a popup demanding cryptocurrency payment and their files now have a .lock extension and will not open. What is the correct immediate action?',
    options: [
      'Pay the ransom',
      'Disconnect the machine from the network, isolate it, and engage the incident response process; do not pay the ransom',
      'Run sfc /scannow',
      'Reinstall the user\'s favorite apps',
    ],
    correct: 1,
    explanation: 'Disconnect first to stop encryption spread to network shares and other machines. Then engage the documented incident response process: preserve evidence, identify scope, restore from backups if available. Paying funds criminal operations, has no guarantee of decryption, and marks the org as a future target.',
  },

  {
    id: 'c2-d3-id-exp-004',
    type: 'identify',
    core: '2',
    domain: '3',
    topic: '3.2 Mobile — Battery Drain',
    difficulty: 'medium',
    question: 'A user complains their phone battery now drains in 4 hours after they installed a free flashlight app last week. What is the most efficient first step?',
    options: [
      'Replace the battery',
      'Open Settings → Battery and review which app(s) are consuming the most energy in the background; uninstall the suspect app',
      'Reset the phone to factory defaults',
      'Reinstall the OS',
    ],
    correct: 1,
    explanation: 'Both iOS and Android report per-app battery consumption. A new app correlating with new drain is the obvious suspect. Uninstall first, observe overnight, then escalate if the drain continues. Battery replacement only makes sense if the per-app data shows no abnormal consumer and the battery health reading is poor.',
  },

  {
    id: 'c2-d3-id-exp-005',
    type: 'identify',
    core: '2',
    domain: '3',
    topic: '3.4 PC Security — Browser Redirection',
    difficulty: 'medium',
    question: 'Every search in the user\'s browser is being redirected to an unfamiliar search engine, even after they reset the homepage. The address bar shows the malicious search engine\'s URL on every query. What is the most likely cause?',
    options: [
      'A failing router',
      'A malicious browser extension or hijacker installed and persisting through reset',
      'A bad SSD',
      'The browser is outdated',
    ],
    correct: 1,
    explanation: 'Browser-resident hijackers install as an extension or change registry/profile settings. Resetting the homepage doesn\'t remove the extension. Open the browser\'s extension manager, remove unknown entries, then run a reputable anti-malware scan. Consider a full browser profile reset if the hijacker reinstalls itself.',
  },

  // ════════════════════════════════════════════════════════════════════════
  // CORE 2 — DOMAIN 4: OPERATIONAL PROCEDURES (5 questions)
  // ════════════════════════════════════════════════════════════════════════

  {
    id: 'c2-d4-id-exp-001',
    type: 'identify',
    core: '2',
    domain: '4',
    topic: '4.3 Backup — 3-2-1 Rule',
    difficulty: 'easy',
    question: 'A junior tech is asked to summarize the 3-2-1 backup rule. Which statement correctly describes it?',
    options: [
      '3 backups, 2 of them online, 1 cloud only',
      '3 copies of the data, on 2 different media, with 1 copy off-site',
      '3 weeks of retention, 2 backup software vendors, 1 admin',
      '3 servers, 2 networks, 1 firewall',
    ],
    correct: 1,
    explanation: '3 copies of the data (production + 2 backups), on 2 different storage media (e.g., disk + tape, or local disk + cloud), with at least 1 copy stored off-site (protects against site loss: fire, flood, theft, ransomware that reaches local backups). The rule is medium- and vendor-agnostic.',
  },

  {
    id: 'c2-d4-id-exp-002',
    type: 'identify',
    core: '2',
    domain: '4',
    topic: '4.3 Backup — Differential vs Incremental',
    difficulty: 'medium',
    question: 'A backup runs a full on Sunday. Each weekday it backs up only the data that has changed since the previous backup (Monday backs up Sunday\'s changes, Tuesday backs up Monday\'s changes, etc.). What type of backup is this?',
    options: [
      'Full',
      'Differential',
      'Incremental',
      'Synthetic full',
    ],
    correct: 2,
    explanation: 'Incremental = each backup captures only the changes since the previous backup (whether that previous backup was full or incremental). Differential = each backup captures all changes since the last full. Incremental restores require the full + every incremental in sequence. Differential restores require only the full + the latest differential.',
  },

  {
    id: 'c2-d4-id-exp-003',
    type: 'identify',
    core: '2',
    domain: '4',
    topic: '4.2 Change Management — First Step',
    difficulty: 'easy',
    question: 'A technician is about to roll out a change to a production firewall affecting all users. According to formal change management, what is the correct first step?',
    options: [
      'Open the firewall console and apply the change',
      'Submit a change request through the formal change management process, document the scope/risk/rollback, and obtain approval',
      'Notify affected users by email afterward',
      'Update documentation only after the change is live',
    ],
    correct: 1,
    explanation: 'Formal change management requires a documented request with scope, risk assessment, rollback plan, test results, and approval before any production change is applied. Unannounced production changes are a top cause of outages and security incidents. Notification and documentation are part of the workflow, not substitutes for approval.',
  },

  {
    id: 'c2-d4-id-exp-004',
    type: 'identify',
    core: '2',
    domain: '4',
    topic: '4.4 Safety — ESD',
    difficulty: 'easy',
    question: 'A tech is preparing to install an add-in card in a desktop. Which combination of practices best reduces ESD risk to the components?',
    options: [
      'Wear leather-soled shoes and work on a carpeted floor',
      'Use an anti-static wrist strap clipped to a grounded point, work on an anti-static mat, and keep components in anti-static bags until needed',
      'Touch the chassis once and trust that\'s enough for a full session',
      'Run a humidifier off',
    ],
    correct: 1,
    explanation: 'ESD damage often goes unnoticed at the moment of discharge but causes early component failure later. The full set of mitigations is: wrist strap to ground, anti-static work mat, anti-static packaging for components until installed, and reasonable humidity. A single chassis touch is not equivalent protection across an hour of work.',
  },

  {
    id: 'c2-d4-id-exp-005',
    type: 'identify',
    core: '2',
    domain: '4',
    topic: '4.6 Incident Response — Order of Volatility',
    difficulty: 'medium',
    question: 'During an incident response, the team needs to collect digital evidence in the correct order of volatility (most volatile first). Which sequence reflects the standard order?',
    options: [
      'Hard disk → RAM → CPU cache → archived backups',
      'CPU cache and registers → RAM → swap/page file → disk → archived/offline backups',
      'Backups → disk → RAM → CPU registers',
      'It does not matter as long as everything is collected',
    ],
    correct: 1,
    explanation: 'Order of volatility runs from data that disappears fastest to data that persists longest: CPU registers and cache (microseconds), RAM (seconds to minutes after power loss), swap/page file and running network state, disk (persistent), archived/offline backups (most stable). Collecting in this order preserves evidence that would otherwise be lost first.',
  },

]
