// Public content only. Provenance and missing assets are recorded in docs/ASSETS.md.
export const profile = {
  name: 'Annam Poshak', email: 'annamposhak@gmail.com', phone: '+918919198584',
  phoneLabel: '+91 89191 98584', github: 'https://github.com/Poshak-07',
  linkedin: 'https://www.linkedin.com/in/poshakannam',
  resume: '/assets/annam-poshak-resume.pdf',
  // Set the final public origin to emit absolute canonical, sitemap and OG URLs.
  siteUrl: '',
  title: 'Annam Poshak — Data, engineering & digital experiences',
  description: 'Data Analyst, Data Engineering & Web Developer. Explore Annam Poshak’s cricket analytics, business intelligence, research analytics and web development work.'
};
export const mailto = (kind = 'general') => {
  const drafts = {
    general: ['Let’s build something useful', 'Hi Poshak,\n\nI’d like to talk about '],
    project: ['Freelance project inquiry', 'Hi Poshak,\n\nI’m looking for help with a project.\nThe problem: \nScope and timeline: \n\nLet’s discuss.'],
    hiring: ['Job opportunity for Annam Poshak', 'Hi Poshak,\n\nI’d like to discuss an opportunity.\nRole: \nCompany: \n\nLooking forward to connecting.']
  };
  const [subject, body] = drafts[kind] || drafts.general;
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
export const projects = [
  {
    id: 'cricket-intelligence', number: '01', short: 'Cricket intelligence', category: 'engineering',
    title: 'Every delivery.\nA deeper story.', name: 'Cricket Analytics & Intelligence Platform',
    type: 'Independent project · Sports analytics', period: 'Jul 2026 — Present', role: 'Data engineering & analytics',
    status: 'In development', stack: ['Python', 'Pandas', 'SQL', 'Automated testing', 'Graph modeling'],
    description: 'Turning millions of ball-by-ball records into a traceable foundation for cricket analysis. Because useful insights start with data you can trust.',
    metrics: [['17,980', 'matches in source archive'], ['10M+', 'delivery-level records']],
    visual: 'cricket', visualLabel: 'Conceptual data universe · not match analytics',
    note: 'Source-archive scale. Supported analytical gates are tested; the full platform and historical-rule certification remain in progress.',
    sections: [
      ['Problem', 'Cricket produces enormous amounts of data. Raw ball-by-ball records need a consistent foundation before they can support meaningful player comparisons or match insights.'],
      ['Challenge', 'Source labels, unusual dismissals and format-specific rules do not always fit a simple scorecard. Preserving lineage and uncertainty matters as much as computing a total.'],
      ['My approach', 'Keep source facts separate from Law interpretation and downstream metrics. Make every transformation traceable, retain unknown values, and validate supported behavior before expanding coverage.'],
      ['Implementation', 'Python and SQL workflows organize source, match, innings and delivery records. Automated data-quality tests and reconciliation checks support reproducible metrics. Saved aggregates and indexed history reduce unnecessary delivery-level replay.'],
      ['Outcome', 'A substantial analytics foundation for a 17,980-match source archive and more than 10 million delivery records. Player-performance and history work is developing; historical/competition authority and broader product acceptance gates remain open.'],
      ['Lessons learned', 'A correct result includes its eligibility rules, source lineage and known limits. Handling a historical dismissal does not by itself certify the historical playing conditions.']
    ],
    evidence: 'Resume and local engineering checkpoint reviewed on 16 Oct 2026. The checkpoint records passing scoped history checks; no cricket pipeline or tests were rerun for this portfolio.',
    gallery: [
      { src: '/assets/cricket-prototype.webp', alt: 'Actual Cricket Command Center prototype interface with synthetic sample data', caption: 'Cricket Command Center — actual prototype capture. All players, matches and figures shown are synthetic; backend-dependent features are simulated.' },
      { kind: 'pipeline', caption: 'Simplified architecture diagram based on the documented separation of source facts, canonical records, Law interpretation and aggregates.' },
      { src: '/assets/cricket-comparison.webp', alt: 'Player comparison screen from the supplied Cricket Command Center synthetic prototype', caption: 'Player-comparison prototype — synthetic demonstration, not verified real-match analysis.' }
    ]
  },
  {
    id: 'retail-share-of-wallet', number: '02', short: 'Where spending moves', category: 'analytics',
    title: 'The spend didn’t stop.\nIt moved.', name: 'Retail Customer Spending & Share-of-Wallet Analysis',
    type: 'Independent business analytics case study', period: 'Date not supplied', role: 'Business & customer analytics',
    status: 'Case study', stack: ['Customer segmentation', 'KPI analysis', 'Payment behavior', 'Reporting'],
    description: 'Looking beyond a declining card-spend metric to understand payment choices, changing customer behavior and opportunities for retention.',
    metrics: [['9.43 pp', 'decline in card share'], ['7,950', 'silent-attrition customers']],
    visual: 'retail', visualLabel: 'Reported endpoints · no intermediate observations inferred',
    note: '₹39.95M is a modeled gross-baseline share gap, not realized revenue or guaranteed recovery.',
    sections: [
      ['Problem', 'Card share of wallet fell from 28.91% to 19.48%. The question was where spending moved and which customer groups warranted closer attention.'],
      ['Challenge', 'Payment switching, spending contraction and changes in retail categories can look similar in an aggregate metric. A useful analysis needs to separate those behaviors.'],
      ['My approach', 'Investigate transaction quality, construct share-of-wallet KPIs, and compare customer segments and payment choices instead of relying on a single headline trend.'],
      ['Implementation', 'The case study covered 45,000 customers and 444,118 transactions across 10 retail categories and five payment methods. Segmentation examined silent attrition, payment switching and spend contraction.'],
      ['Outcome', 'Identified a 9.43 percentage-point decline and 7,950 silent-attrition customers. The estimated ₹39.95 million gross-baseline share gap framed targeted retention opportunities; it was not an observed revenue gain.'],
      ['Lessons learned', 'A lost share of spending is not automatically lost customer spending. Recommendations need segment-specific evidence, and modeled opportunity must remain distinct from realized impact.']
    ],
    evidence: 'Scope and share endpoints are supported by the supplied resume. Silent-attrition count and modeled gap are owner-supplied brief figures. Raw analysis and time-series observations were not supplied.',
    gallery: [{ kind: 'retail', caption: 'Accurate display of the two supplied share-of-wallet endpoints. The period dates and intervening observations were not supplied.' }, { kind: 'segments', caption: 'Analytical segmentation framework; group sizes are shown only where supplied. No payment migration volumes or category rankings are invented.' }]
  },
  {
    id: 'netzeroaqua', number: '03', short: 'Research, made usable', category: 'analytics',
    title: 'Less spreadsheet.\nMore discovery.', name: 'NetZeroAqua Research Data Analytics',
    type: 'Research experience · Environmental & aquaculture data', period: 'Feb — Jul 2026', role: 'Research Data Analyst',
    status: 'Completed role', stack: ['Python', 'Pandas', 'Excel', 'Plotly', 'Power BI'],
    description: 'Bringing structure to complex environmental research data, so reporting takes less effort and the findings are easier to explore.',
    metrics: [['50+', 'multi-sheet Excel datasets'], ['≈60%', 'less manual reporting effort']],
    visual: 'research', visualLabel: 'Illustrative workflow · no confidential research data',
    note: 'Approximate effort reduction reported in the resume; no independent time-study benchmark is available.',
    sections: [
      ['Problem', 'Research data spread across multi-sheet Excel files made consistent analysis and recurring reporting difficult.'],
      ['Challenge', 'More than 50 datasets and 900 variables needed cleaning, transformation and validation while retaining their research context.'],
      ['My approach', 'Structure the preparation workflow, explore the data, and use research context to make the reports useful to the people reading them.'],
      ['Implementation', 'Used Python, Pandas and Excel for preparation and exploratory analysis; Power BI and Plotly for interactive reporting. Insights from more than 20 research papers informed the work; these papers were not authored by me.'],
      ['Outcome', 'Developed analytical reports, visualizations and structured workflows. The resume reports an approximately 60% reduction in manual reporting effort.'],
      ['Lessons learned', 'A repeatable preparation process makes research easier to revisit. Clear context and consistent variables matter as much as the final visualization.']
    ],
    evidence: 'Role, dates, scale and reported effort reduction are supported by the supplied resume. Confidential data and original internal dashboards are not reproduced.',
    gallery: [{ kind: 'research', caption: 'Conceptual spreadsheet-to-analysis workflow, reconstructed from the described work. It is not a screenshot of an internal research system.' }, { kind: 'effort60', caption: 'Illustrative normalization of the resume-reported ≈60% reduction: baseline effort 100 → approximately 40. Not measured hours.' }]
  },
  {
    id: 'seaweedz-energy', number: '04', short: 'Clarity in complexity', category: 'analytics',
    title: '2,500 columns.\nOne clearer picture.', name: 'Seaweedz Energy Data Analytics',
    type: 'Internship · Aquaculture analytics', period: 'Nov 2025 — Jan 2026', role: 'Data Analyst Intern',
    status: 'Completed internship', stack: ['Python', 'Pandas', 'Excel', 'EDA', 'Data validation'],
    description: 'Cleaning and validating wide aquaculture datasets to make patterns easier to investigate and analytical preparation more repeatable.',
    metrics: [['2,500+', 'columns in aquaculture datasets'], ['≈20%', 'less preprocessing effort']],
    visual: 'seaweed', visualLabel: 'Illustrative structure · not observed research values',
    note: 'Approximate preprocessing improvement reported in the resume; no underlying timing benchmark is supplied.',
    sections: [
      ['Problem', 'Very wide aquaculture datasets were difficult to understand and prepare for exploratory analysis.'],
      ['Challenge', 'Working across more than 2,500 columns required careful cleaning and validation before patterns could be interpreted.'],
      ['My approach', 'Prepare consistent analytical inputs, investigate unusual and inconsistent records, and use descriptive summaries to communicate findings.'],
      ['Implementation', 'Used Python, Pandas and Excel to clean, transform and validate pond datasets. Produced statistical summaries and visual reports to support aquaculture research.'],
      ['Outcome', 'The resume reports an approximately 20% reduction in preprocessing effort. The work provided cleaner inputs for investigating patterns and trends.'],
      ['Lessons learned', 'On a wide dataset, preparation is analytical work. Validate the structure and context before treating an apparent pattern as a finding.']
    ],
    evidence: 'The supplied resume supports the internship, dataset width and approximate reported outcome. Visuals use abstract structures, not private aquaculture measurements.',
    gallery: [{ kind: 'seaweed', caption: 'Illustrative wide-data structure and validation workflow. Cell colors are a visual metaphor, not a data-quality score or measured missingness.' }, { kind: 'effort20', caption: 'Illustrative normalization of the reported ≈20% reduction: baseline effort 100 → approximately 80. Not a timing benchmark.' }]
  },
  {
    id: 'svln-engineering', number: '05', short: 'Engineering a presence', category: 'web',
    title: 'Built for a business.\nDesigned for people.', name: 'SVLN Engineering Official Website',
    type: 'Real-world web development', period: 'Jul 2025', role: 'Web development',
    status: 'Live website', stack: ['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Node.js', 'REST APIs'],
    description: 'A responsive company website, built with reusable interface components and integrated APIs to bring the business online.',
    metrics: [['Desktop + mobile', 'responsive interface'], ['≈25%', 'reported responsiveness improvement']],
    visual: 'svln', visualLabel: 'Actual public website · captured 16 Oct 2026',
    note: '25% is a resume-reported improvement. No before-and-after performance benchmark was supplied.',
    live: 'https://svlnengineering.in/',
    sections: [
      ['Problem', 'SVLN Engineering needed an official website that could communicate the business clearly across screen sizes.'],
      ['Challenge', 'Build an interface that works on desktop and mobile while keeping the code maintainable and connecting the required services.'],
      ['My approach', 'Use reusable React components, responsive layouts and REST API integration to turn the requirements into a working website.'],
      ['Implementation', 'Developed and deployed the company website using React.js, HTML5, CSS3, JavaScript and Node.js. Improved component structure and responsiveness.'],
      ['Outcome', 'Delivered the official company website. The resume reports an approximately 25% improvement in page responsiveness; the underlying benchmark was not supplied. The public address was checked on 16 October 2026.'],
      ['Lessons learned', 'A website has to communicate clearly and work across devices. Reusable components make visual refinement and ongoing maintenance easier.']
    ],
    evidence: 'Project contribution and reported improvement are supported by the supplied resume. The owner supplied the live URL; its public page was verified on 16 Oct 2026. Current screenshots are not before-and-after benchmarks.',
    gallery: [{ src: '/assets/svln-desktop.webp', alt: 'Actual SVLN Engineering public website at desktop width', caption: 'Actual public website at desktop width, captured 16 Oct 2026.' }, { src: '/assets/svln-mobile.webp', alt: 'Actual SVLN Engineering website at mobile width', caption: 'Actual mobile website capture. This demonstrates the current interface, not a historical performance comparison.', portrait: true }]
  }
];
export const services = [
  ['01', 'Find the signal.', 'Data analytics & business intelligence', 'Turn scattered business data into useful findings, clear KPIs and reporting people can act on.', 'Python / SQL / Excel / Power BI / Plotly'],
  ['02', 'Make it reliable.', 'Data engineering & automation', 'Clean, validate and organize data. Build repeatable pipelines that reduce manual work and preserve traceability.', 'Pandas / ETL / SQL / Quality checks'],
  ['03', 'Bring it to life.', 'Website & application development', 'Translate practical requirements into responsive interfaces and connected digital experiences.', 'React / JavaScript / Node.js / REST APIs'],
  ['04', 'Read the game.', 'Sports analytics', 'Work from delivery-level cricket data toward performance comparisons, with explicit context and analytical limits.', 'Cricket data / Metrics / Reconciliation']
];
