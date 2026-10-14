import dashboard from "./images/hackcity-dashboard.webp";
import decisionMap from "./images/hackcity-map.webp";
import fieldApp from "./images/hackcity-field.webp";
import sonarMap from "./images/captain-sonar.webp";
import systemsContext from "./images/systems-context.svg";
import afterdarkDesktop from "./images/afterdark-desktop.webp";
import afterdarkMobile from "./images/afterdark-mobile.webp";
import afterdarkVip from "./images/afterdark-vip-summary.webp";

/** Links use HTTPS; recorded demos may use local /projects/ media. demoExternalUrl is a share link. */
export type Project = {
  name: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  detail: string;
  highlights?: string[];
  images?: { src: string; alt: string; caption?: string }[];
  demoUrl?: string;
  demoType?: "video" | "website" | "recording";
  demoExternalUrl?: string;
  websiteUrl?: string;
  sourceUrl?: string;
};

const github = "https://github.com/davidfgcorreia";

/** Descriptions and media checked against the linked public repositories, October 2026. */
export const projects: Project[] = [
  {
    name: "First Floor Afterdark",
    category: "Web app",
    year: "2026",
    description:
      "A bilingual nightlife website concept with event discovery and an interactive VIP booking flow.",
    tags: ["Next.js", "React", "TypeScript", "GSAP", "Tailwind CSS"],
    detail:
      "A portfolio concept inspired by First Floor Club in Faro. The site brings together animated navigation, event sections, Portuguese and English content, and a VIP booking summary. It is a demonstration with sample events and prices, rather than an official club website.",
    highlights: [
      "Explore responsive desktop and phone layouts with animated navigation.",
      "Switch between Portuguese and English content.",
      "Follow the VIP booking flow in a recorded walkthrough using synthetic visitor details.",
    ],
    images: [
      {
        src: afterdarkDesktop,
        alt: "First Floor Afterdark desktop homepage",
        caption: "Desktop homepage · nightlife concept",
      },
      {
        src: afterdarkMobile,
        alt: "First Floor Afterdark mobile homepage",
        caption: "Phone layout · responsive navigation",
      },
      {
        src: afterdarkVip,
        alt: "First Floor Afterdark VIP booking summary with demonstration visitor details",
        caption: "VIP booking summary · demonstration details",
      },
    ],
    demoUrl: "/projects/first-floor-afterdark/demo.mp4",
    demoType: "recording",
    sourceUrl: `${github}/first-floor-afterdark`,
  },
  {
    name: "Cascais Micromobility",
    category: "Web app",
    year: "2026",
    description:
      "Detect abandoned shared bikes, plan their collection, and help Cascais make better mobility decisions.",
    tags: ["React", "TypeScript", "FastAPI", "PostGIS", "Maps"],
    detail:
      "Built for Hack the City 2026, Challenge #9, with Gonçalo Martins and Diogo Sousa. The prototype combines live bike detection, collection routes on real roads, a mobile field app, and a decision map for station planning.",
    highlights: [
      "Live GBFS data feeds an abandonment detector with a case timeline.",
      "Collection teams follow turn-by-turn routes and record photos and descriptions at each pickup.",
      "The decision map brings together station demand, operator performance, and candidate locations ranked by Laya.",
    ],
    images: [
      {
        src: dashboard,
        alt: "Cascais Micromobility operations dashboard showing live bike status and a pickup mission",
        caption: "Operations dashboard · live status, pickup mission, and services",
      },
      {
        src: decisionMap,
        alt: "Cascais decision map with a station candidate and the Laya evaluation panel",
        caption: "Decision map · station candidate evaluation and supporting evidence",
      },
      {
        src: fieldApp,
        alt: "Mobile field app with turn-by-turn navigation to the next bike",
        caption: "Field app · turn-by-turn navigation for the collection team",
      },
    ],
    demoUrl: "https://www.youtube-nocookie.com/embed/xIjXYXA3tug",
    demoType: "video",
    demoExternalUrl: "https://youtu.be/xIjXYXA3tug",
    sourceUrl: `${github}/hackcity`,
  },
  {
    name: "QuantumTrace",
    category: "Security",
    year: "2026",
    description:
      "A cryptographic inventory scanner that helps teams assess their readiness for post-quantum migration.",
    tags: ["Python", "React", "FastAPI", "CycloneDX", "Post-quantum"],
    detail:
      "A team project hosted in Inês Alves’s Bedrock_QTrace repository, with David Correia credited as a contributor. QuantumTrace scans source code, cloud configuration exports, and network captures to identify cryptographic assets, classify their exposure to quantum attacks, and present the results in a React dashboard.",
    highlights: [
      "Inventory cryptographic assets from Python, Java, Go, cloud exports, and network captures.",
      "Review risk classifications, a 0–100 score, and an A–F grade in the dashboard.",
      "Export a validated CycloneDX cryptographic bill of materials, a JSON report, and a Markdown summary.",
      "Scan a folder, upload a repository ZIP, or provide a public GitHub repository link.",
    ],
    demoUrl: "https://www.youtube-nocookie.com/embed/I7jaZpRFHjM",
    demoType: "video",
    demoExternalUrl: "https://www.youtube.com/watch?v=I7jaZpRFHjM",
    sourceUrl: `${github}/Bedrock_QTrace`,
  },
  {
    name: "DepChain",
    category: "Security",
    year: "2026",
    description:
      "A Byzantine fault tolerant consensus prototype with HotStuff, BLS signatures, and an EVM-backed runtime.",
    tags: ["Java", "HotStuff", "BLS", "Distributed systems"],
    detail:
      "A team coursework project developed with Gonçalo Oliveira and the group 27 contributors. The public showcase retains team attribution and combines layered communication channels, consensus, signed transactions, and smart-contract execution.",
    highlights: [
      "Explore consensus and Byzantine behaviour through the HotStuff test suites.",
      "Run replicas and clients with the documented Java setup.",
      "Review the layered communication channels and EVM-backed runtime.",
    ],
    sourceUrl: `${github}/DepChain`,
  },
  {
    name: "TupleSpaces",
    category: "Coursework",
    year: "2025",
    description:
      "A distributed tuple-space service with clients, a front end, and replicated servers communicating over gRPC.",
    tags: ["Java", "gRPC", "Replication", "Distributed systems"],
    detail:
      "Developed by David Correia and Tiago Proença for Distributed Systems, group A23. The public showcase preserves the original source attribution and GPL-3.0 license, with service contracts, Java clients, replicated servers, and test scripts.",
    sourceUrl: `${github}/TupleSpaces`,
  },
  {
    name: "Networked Mastermind",
    category: "Game",
    year: "2024 / 2025",
    description:
      "A C++ Mastermind client/server game using UDP for game commands and TCP for reports and scores.",
    tags: ["C++", "UDP", "TCP", "Networking"],
    detail:
      "A Computer Networks team project by David Correia and Miguel Rego. Players start games, submit colour guesses, review trials, and request scores through a network client. The public showcase includes source code and build instructions.",
    sourceUrl: `${github}/RC_Mastermind-public`,
  },
  {
    name: "Captain Sonar",
    category: "Game",
    year: "2026",
    description:
      "A Python prototype of Captain Sonar with queued submarine actions and replay support.",
    tags: ["Python", "Game simulation", "Replay"],
    detail:
      "The prototype provides keyboard and mouse controls for movement, silence, torpedoes, sonar, drones, mines, surfacing, and repairs. A separate replay runner reads saved game logs.",
    highlights: [
      "Queue, confirm, undo, or clear actions before playing a turn.",
      "Select system gauges to charge while moving.",
      "Replay a session from its JSONL game log.",
    ],
    images: [
      {
        src: sonarMap,
        alt: "Map asset from the Captain Sonar prototype repository",
        caption: "Game map asset from the repository",
      },
    ],
    sourceUrl: `${github}/AASMA-2026-Project`,
  },
  {
    name: "ChainOfProduct",
    category: "Security",
    year: "2025 / 2026",
    description:
      "A Java security project with client, server, database, and cryptographic file-protection utilities.",
    tags: ["Java", "AES-GCM", "Certificates", "Maven"],
    detail:
      "The SIRS project combines client, server, database, and shared security modules. Its CryptoUtils command line uses AES-GCM to protect files, authenticate their contents, and verify freshness and replay information.",
    highlights: [
      "Generate AES keys from the interactive CLI.",
      "Protect and unprotect files with dedicated commands.",
      "Check integrity, authenticity, and freshness before accepting protected data.",
    ],
    sourceUrl: `${github}/SIRS`,
  },
  {
    name: "Weather Log",
    category: "Automation",
    year: "2026",
    description:
      "A GitHub Action that records Lisbon’s temperature every six hours and keeps its history in Git.",
    tags: ["TypeScript", "GitHub Actions", "Open-Meteo"],
    detail:
      "Weather readings are appended to a JSONL history, while a Markdown page shows the last 48 readings. Location settings live in one configuration file, and the update can also be run by hand.",
    highlights: [
      "Fetch observations from Open-Meteo without an API key.",
      "Keep an append-only data history and a readable recent-weather page.",
      "Validate observations before recording them.",
    ],
    sourceUrl: `${github}/weather-log`,
  },
  {
    name: "Intelligent Retail Ecosystem",
    category: "Web app",
    year: "2026",
    description:
      "An ambient-intelligence prototype that locates shoppers indoors and guides them to products.",
    tags: ["React", "FastAPI", "Kotlin", "BLE", "IoT"],
    detail:
      "An Ambient Intelligence team project by David Correia, Gonçalo Oliveira, and Pedro Duarte. ESP32 gateways provide BLE observations, phone IMU data supports position tracking, and a floor-map interface guides shoppers through the store.",
    highlights: [
      "Combine BLE trilateration and IMU data with Kalman filtering.",
      "Plan obstacle-aware paths and routes through shopping lists.",
      "Use voice search, spoken directions, and a hardware-free simulator.",
    ],
    sourceUrl: `${github}/AmI_project`,
  },
  {
    name: "ProjecRS",
    category: "Web app",
    year: "2025",
    description:
      "A full-stack prototype for extracting, reviewing, and exporting table data from PDFs.",
    tags: ["Vue", "FastAPI", "Python", "PDF processing"],
    detail:
      "A PDF processing application with a FastAPI backend and Vue interface. The workflow covers document upload, table-data review, editing, and export. The repository documents its development setup and remaining integration work.",
    sourceUrl: `${github}/ProjecRS`,
  },
  {
    name: "Game Time XO",
    category: "Game",
    year: "2026",
    description: "A two-player tic-tac-toe game with turn indicators and a session scoreboard.",
    tags: ["React", "TypeScript", "TanStack Start", "Tailwind"],
    detail:
      "Play alternating X and O turns on a shared board. The game detects wins and draws, tracks the session’s scores, and lets players reset the round. Scores remain in page state for the current session.",
    sourceUrl: `${github}/game-time-xo`,
  },
  {
    name: "My Little Corner",
    category: "Web app",
    year: "2026",
    description:
      "This interactive portfolio: a miniature cabin whose objects open different parts of my story.",
    tags: ["React", "Three.js", "React Three Fiber", "TanStack Start"],
    detail:
      "An interactive cabin built around accessible navigation and readable content placed on physical objects. A shared scene director coordinates camera movement and object animation, then mounts the selected content once the motion settles.",
    highlights: [
      "Browse projects on the computer, with scrolling, galleries, and embedded demos.",
      "Explore school history, achievements, hobbies, experience, and the résumé through room objects.",
      "Use responsive framing and reduced-motion support across desktop and phone layouts.",
    ],
    sourceUrl: `${github}/mycorner`,
  },
  {
    name: "Apache Airflow Contributions",
    category: "Open source",
    year: "2025",
    description:
      "Two merged interface fixes that make Airflow’s dropdown filters and task-log controls fully visible.",
    tags: ["TypeScript", "React", "Open source", "UI"],
    detail:
      "Contributed pull requests #48185 and #48392 to Apache Airflow, both merged in March 2025. The changes address issue #47708: dropdown labels and selections could be obscured in the interface. This entry highlights David’s contributions to the existing Apache project.",
    highlights: [
      "Improve the visibility of dropdown selections in DAG-run and task-instance filters.",
      "Correct dropdown positioning in the task-log header so labels remain visible.",
    ],
    sourceUrl: "https://github.com/apache/airflow/pull/48392",
  },
  {
    name: "Distributed Meetings",
    category: "Coursework",
    year: "2025 / 2026",
    description:
      "A Java distributed systems project with replicated servers, transaction clients, and a configuration console.",
    tags: ["Java", "gRPC", "Protocol Buffers", "Maven"],
    detail:
      "The DAD project is organised into server, client, console, contract, core, and configuration modules. Its documented setup runs multiple server processes and provides a console for ballots and configuration changes.",
    sourceUrl: `${github}/DAD-Project-25-26`,
  },
  {
    name: "Natural Language Project",
    category: "Coursework",
    year: "2025",
    description:
      "Natural language processing coursework with a feature engineering notebook and an accompanying report.",
    tags: ["Python", "Jupyter", "NLP"],
    detail:
      "The repository contains the P5 feature engineering notebook, training and test CSV files, the project description, and a submitted PDF report. The notebook and report are available from the source repository.",
    sourceUrl: `${github}/Natural-Language-Project`,
  },
  {
    name: "Systems Modelling",
    category: "Coursework",
    year: "2024 / 2025",
    description:
      "A systems modelling case study covering BioBox access control, business processes, and enterprise architecture.",
    tags: ["ArchiMate", "BPMN", "Systems modelling"],
    detail:
      "A team coursework repository hosted by Guilherme Rocha, with David Correia credited as a contributor. The case study models the BIOGateBox organisation and its BioBox access-control service, including portal components, operating modes, and the request execution process.",
    highlights: [
      "Describe the organisation, its divisions, and their responsibilities.",
      "Model the client request process from proposal through installation and handover.",
      "Explore the repository’s ArchiMate, BPMN, and Enterprise Architect model files.",
    ],
    images: [
      {
        src: systemsContext,
        alt: "Simplified BIOGateBox context diagram from the team's Archi model",
        caption:
          "Context model preview · stored labels and layout, with simplified relationship notation",
      },
    ],
    sourceUrl: `${github}/Systems_Modelling`,
  },
  {
    name: "Human–Computer Interaction",
    category: "Design",
    year: "2024",
    description:
      "Human–computer interaction coursework exploring a quiz-app prototype and selection times in dense interfaces.",
    tags: ["Figma", "JavaScript", "Interaction design"],
    detail:
      "The IPM repository contains a Quizzes Tutor prototype and a dense-interface selection experiment. David’s showcase fork preserves the original implementation credit to jlucas and Mariana Santana. The browser demo uses anonymous participant numbers and disables result recording; the original Figma prototype still requires sign-in.",
    highlights: [
      "Try the target-selection experiment in the browser demo.",
      "Review the selection-time experiment and its target-selection interface.",
    ],
    demoUrl: "https://davidfgcorreia.github.io/IPM/",
    demoType: "website",
    demoExternalUrl: "https://davidfgcorreia.github.io/IPM/",
    websiteUrl: "https://davidfgcorreia.github.io/IPM/",
    sourceUrl: `${github}/IPM`,
  },
  {
    name: "Pipe Puzzle",
    category: "Coursework",
    year: "2024 / 2025",
    description:
      "A Python artificial intelligence project exploring pipe rotations and board connections.",
    tags: ["Python", "Search", "Puzzles"],
    detail:
      "The repository includes several versions of the pipe solver, search utilities, and test inputs. Its board logic checks neighbouring connections and rotates pieces to explore puzzle states.",
    sourceUrl: `${github}/projeto_de_Ia`,
  },
];
