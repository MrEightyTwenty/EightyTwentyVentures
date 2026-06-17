/**
 * EightyTwentyVentures — Glossary Panel System
 * Click a .gl term to open the slide-in definition panel.
 * Click again (or the backdrop / close button) to close.
 */

const GLOSSARY = {

  // ── AUCTION MARKET THEORY ──────────────────────────────────────────────
  "auction-market-theory": {
    term: "Auction Market Theory",
    category: "Core Framework",
    body: `
      <p>Auction Market Theory (AMT) is the foundational idea that financial markets exist for one purpose: to facilitate trade. They do this by continuously testing prices, moving higher until sellers overwhelm buyers, moving lower until buyers overwhelm sellers, until a level is found where both sides are willing to transact. That level is called <em>fair value</em>, and the market gravitates toward it.</p>
      <p>Two structural states describe every market at every moment. In <strong>balance</strong>, the auction is comfortable: buyers and sellers are in rough equilibrium, volume distributes evenly across a price range, and neither side has the conviction to force a sustained move. In <strong>imbalance</strong>, one side has gained a decisive advantage, and price moves directionally until a new level of agreement is found.</p>
      <p>AMT is not a trading system on its own. It is a conceptual lens that eliminates unnecessary complexity. Once you accept that price moves because of inventory imbalances between buyers and sellers, not because of algorithms, manipulation, or any single actor, every other concept in this framework follows logically.</p>`,
    related: ["balance-imbalance", "fair-value", "market-generated-information"]
  },

  "balance-imbalance": {
    term: "Balance vs. Imbalance",
    category: "Core Framework",
    body: `
      <p><strong>Balance</strong> is the market's default state. Supply and demand are in rough equilibrium. The market rotates between the edges of an accepted price range, building a D-shaped volume distribution. Prices below the range are too cheap for sellers to sustain; prices above are too expensive for buyers to sustain. Neither side can force a sustained break.</p>
      <p><strong>Imbalance</strong> is what happens when one side gains a decisive advantage. Price moves directionally, often with minimal two-way trade, until the market finds a new level where both sides are willing to do business again. Imbalance is always temporary. Balance is always the destination.</p>
      <p>The practical importance: balance calls for responsive, mean-reversion strategies. Imbalance calls for trend-aligned, directional strategies. Using the wrong approach in the wrong state is one of the most consistent sources of losses in active trading.</p>`,
    related: ["auction-market-theory", "day-type", "value-area"]
  },

  // ── COMMERCIAL PARTICIPANTS ────────────────────────────────────────────
  "commercial-participants": {
    term: "Commercial Participants",
    category: "Market Participants",
    body: `
      <p>Commercial participants — also called "commercials" — are the most important group reported in the weekly Commitment of Traders (COT) report. They are the hedgers: the producers, manufacturers, financial institutions, and large corporations that use futures markets primarily to <em>offset risk</em> from their real-world business exposure, not to speculate on price direction.</p>
      <p>An oil company that produces crude oil might sell oil futures to lock in a price for future production. An agricultural business might hedge its wheat inventory. A large financial institution might hedge its equity portfolio. Because their futures positions are the mirror image of their real-world holdings, commercials often appear to be "wrong" directionally in the short term while being deeply right about underlying value.</p>
      <p>What makes commercials significant as a signal: they are the most informed participants in their markets. They have visibility into supply and demand conditions, pricing dynamics, and business fundamentals that no external observer has. When commercials behave in ways that deviate from their typical hedging patterns — for instance, buying aggressively into a declining market when their usual behavior would call for selling — it indicates they believe prices have moved away from fundamental value in a way that creates an exceptional opportunity.</p>
      <p>In the equity futures context specifically, commercial buying into weakness is interpreted as informed conviction that the market is undervalued relative to future economic conditions. It is the signal this system watches most closely as a precondition for deploying capital.</p>`,
    related: ["speculative-participants", "cot-report", "commitment-of-traders"]
  },

  "speculative-participants": {
    term: "Speculative Participants (Non-Commercials)",
    category: "Market Participants",
    body: `
      <p>Non-commercial participants — speculators — are the other side of the COT report. They include hedge funds, commodity trading advisors, large traders, and institutional trend-followers who use futures markets primarily for <em>directional profit</em> rather than hedging.</p>
      <p>Speculators are typically trend-following by nature. They buy when markets are rising and sell when markets are falling. This makes them reliable indicators of where sentiment has reached an extreme: when speculative net positioning reaches multi-year highs or lows, it often signals that the trend has been over-extended and a reversal is near.</p>
      <p>The most powerful signal combination in COT analysis is when commercial participants are heavily accumulating at the same time speculators are heavily short. The speculative shorts represent compressed buying pressure: when the reversal comes, their forced covering amplifies the move initiated by commercial re-engagement. Think of it as loading both sides of the spring simultaneously.</p>`,
    related: ["commercial-participants", "cot-report", "short-squeeze"]
  },

  "cot-report": {
    term: "Commitment of Traders (COT) Report",
    category: "Market Data",
    body: `
      <p>The Commitment of Traders report is published weekly by the Commodity Futures Trading Commission (CFTC). It shows the aggregate net positions held by different categories of participants across futures markets, including equity index futures, commodity futures, currency futures, and more.</p>
      <p>The report categorizes participants into commercials (hedgers), non-commercials (large speculators), and non-reportable positions (smaller traders). For each category, it shows total long contracts, total short contracts, and net position.</p>
      <p>The report is published each Friday and reflects positions held as of the prior Tuesday. This three-day lag means it is not a real-time tool, but a higher-timeframe context indicator. It is most useful when trends in positioning are sustained across multiple weeks — when commercials have been consistently building net long exposure over a period of months, for instance, that is structurally more significant than a single week's reading.</p>
      <p>The EightyTwentyVentures framework uses a proprietary oscillator built on COT data to identify periods of elevated commercial accumulation and translate them into actionable environmental signals for position entry.</p>`,
    related: ["commercial-participants", "speculative-participants", "risk-on-environment"]
  },

  "cot-proxy": {
    term: "COT Proxy",
    category: "Market Data",
    body: `
      <p>The COT Proxy is a proprietary lookback-based tool built to surface the commercial buying signal before it becomes obvious in the standard Commitment of Traders data. It was inspired by the systematic COT readings developed by Larry Williams for various futures instruments, but it is built with a different methodology and calibrated specifically to the instruments used in this system.</p>
      <p>Its function is to simulate the timing of commercial accumulation: flagging when the informed bid is likely present even in periods where the price action alone gives little indication of it. Where the raw COT report tells you how participants are positioned as of the prior Tuesday, the proxy adds a timing dimension, surfacing when the accumulation signal is emerging rather than waiting for it to become unambiguous in the published data.</p>`,
    related: ["cot-report", "commercial-participants", "risk-on-environment"]
  },

  // ── VOLUME / PROFILE ─────────────────────────────────────────────────
  "volume-profile": {
    term: "Volume Profile",
    category: "Technical Analysis",
    body: `
      <p>A volume profile displays how much volume traded at each price level over a specified period, shown as a horizontal histogram alongside a chart. Unlike standard volume (which is shown at the bottom of a chart and tells you how much traded in each <em>time period</em>), volume profile tells you how much traded at each <em>price level</em>.</p>
      <p>The result is a picture of where the market was comfortable doing business and where it wasn't. Prices with heavy volume (high-volume nodes, or HVNs) represent areas of price acceptance: participants on both sides were willing to transact there. Prices with light volume (low-volume nodes, or LVNs) represent areas of price rejection or fast-moving transitions.</p>
      <p>The <strong>Point of Control (POC)</strong> is the single price level with the most volume traded in the profile — the price where the most business occurred. The <strong>Value Area</strong> is the range containing approximately 70% of all volume, representing where the market spent the majority of its time.</p>
      <p>Practically, HVNs tend to act as support or resistance on revisits because participants from prior transactions are still present and motivated to defend their entries. LVNs tend to see price move through quickly because the structural disinterest that created them tends to persist.</p>`,
    related: ["point-of-control", "value-area", "hvn-lvn", "market-generated-information"]
  },

  "value-area": {
    term: "Value Area (VAH / VAL)",
    category: "Technical Analysis",
    body: `
      <p>The Value Area is the price range containing approximately 70% of all volume traded in a given session or timeframe. It represents the zone where the market conducted the majority of its business and found the greatest degree of consensus between buyers and sellers.</p>
      <p><strong>Value Area High (VAH)</strong> is the upper boundary of this zone. <strong>Value Area Low (VAL)</strong> is the lower boundary. Price trading inside the value area indicates the market is in a comfortable equilibrium. Price trading outside it is making a statement: buyers or sellers are attempting to establish new value at higher or lower prices.</p>
      <p>When price breaks out of the value area and accepts above it (trades above VAH with volume and time), the prior VAH becomes the new floor. When price probes outside and fails to sustain there, it tends to return to the value area — a concept called "value area rotation."</p>
      <p>This is why the value area functions as the day's primary reference: it tells you what the market considered fair during that period, and whether subsequent price action is seeking new value or returning to an established consensus.</p>`,
    related: ["volume-profile", "point-of-control", "balance-imbalance"]
  },

  "hvn-lvn": {
    term: "HVN and LVN (High/Low Volume Nodes)",
    category: "Technical Analysis",
    body: `
      <p><strong>High-Volume Nodes (HVNs)</strong> are price levels where a disproportionate amount of volume transacted. They indicate strong price acceptance: both buyers and sellers were comfortable transacting there across extended periods. On a chart, they appear as wide bars on the volume profile histogram.</p>
      <p>HVNs tend to act as magnets in trending markets (price is drawn back to them on pullbacks) and as support/resistance zones in ranging markets (the market finds equilibrium there repeatedly).</p>
      <p><strong>Low-Volume Nodes (LVNs)</strong> are the opposite: price levels where very little volume transacted. They represent areas of rejection or rapid transition — the market moved through quickly because one side had no meaningful opposition. On the volume profile, they appear as narrow or empty bars.</p>
      <p>LVNs are structurally important as potential trade targets: when price is approaching an LVN from below, there is limited resistance, and price can move quickly through to the next HVN. When price is trading within an HVN, expect slower, choppier movement as both sides have equal representation.</p>`,
    related: ["volume-profile", "value-area", "inflection-zones"]
  },

  "point-of-control": {
    term: "Point of Control (POC)",
    category: "Technical Analysis",
    body: `
      <p>The Point of Control is the single price level at which the most volume traded within a given profile period. It is the market's strongest statement about fair value: more participants chose to transact at this price than any other.</p>
      <p>The POC functions as a gravitational center for price action. In a balanced market, price tends to rotate around the POC. In a trending market, the POC of each successive session builds progressively higher (uptrend) or lower (downtrend), providing a trail of institutional conviction.</p>
      <p>When the Globex (overnight) POC is referenced in this system, it identifies where the most overnight volume transacted — useful as a first pivot reference after the regular session open.</p>`,
    related: ["volume-profile", "value-area", "globex"]
  },

  // ── ORDER FLOW ────────────────────────────────────────────────────────
  "order-flow": {
    term: "Order Flow",
    category: "Execution",
    body: `
      <p>Order flow is the real-time stream of buy and sell orders being executed in the market. It reveals what participants are <em>doing</em>, not just where price has moved. While a price chart shows outcomes, order flow shows the effort and conviction behind them.</p>
      <p>Order flow analysis typically uses a footprint chart, which displays the volume transacted at each price level within each candle, split between buy-side (aggressive buyers lifting the offer) and sell-side (aggressive sellers hitting the bid). This allows traders to see whether bulls or bears were more active at specific price levels within each time period.</p>
      <p>The key question order flow answers: is the aggressive side (whoever is initiating trades by crossing the spread) being rewarded with forward price movement, or are they running into a wall of resting liquidity that is absorbing their orders without price advancing? That distinction — effort versus outcome — is where the trade signal lives.</p>`,
    related: ["delta", "absorption", "exhaustion", "dom", "footprint"]
  },

  "delta": {
    term: "Delta",
    category: "Execution",
    body: `
      <p>Delta is the difference between buying volume and selling volume within a candle or at a price level. A positive delta means more aggressive buying (orders crossing to buy at the ask) than selling. A negative delta means more aggressive selling (orders crossing to sell at the bid).</p>
      <p>Delta alone is not a directional indicator — it is a measure of who is being aggressive. Its analytical value comes from the relationship between delta and price movement. When delta and price agree (positive delta with rising price, negative delta with falling price), nothing unusual is happening. When they diverge, something interesting is occurring.</p>
      <p>The most actionable divergences: <strong>bearish divergence</strong> occurs when price is making new highs but delta is declining, indicating buyers are running out of conviction at elevated prices. <strong>Bullish divergence</strong> occurs when price is making new lows but sellers are losing steam. Both conditions often precede reversals.</p>`,
    related: ["order-flow", "exhaustion", "absorption", "footprint"]
  },

  "absorption": {
    term: "Absorption",
    category: "Execution",
    body: `
      <p>Absorption occurs when a large passive participant repeatedly takes the other side of aggressive orders at a specific price level, preventing price from advancing despite continued aggression. The aggressive side is hitting the market, but the price is not moving — because someone is absorbing every sell order with a buy, or every buy order with a sell.</p>
      <p>Absorption is distinct from exhaustion: exhaustion is the attacker running out of fuel, whereas absorption is an informed defender actively defending a level. In practice, both often occur together at the same moment, which is when reversal probability is highest.</p>
      <p>Visible absorption signatures in footprint charts: large sell volume at a price level with price holding flat or rising (buy-side absorption), or large buy volume at a price level with price holding flat or declining (sell-side absorption). The defending side is making a statement with size.</p>`,
    related: ["exhaustion", "order-flow", "delta", "dom"]
  },

  "exhaustion": {
    term: "Exhaustion",
    category: "Execution",
    body: `
      <p>Exhaustion occurs when aggressive participants generate a spike in volume and delta at a price level but fail to produce meaningful forward price movement. The dominant side has pushed into territory where willing counterparties no longer exist at those prices — they have run out of fuel.</p>
      <p>Exhaustion is a diagnostic indicator, not a standalone trading signal. It shifts the probability distribution toward reversal, but it requires location (is price at a structurally significant level?) and confluence (are other layers confirming?) to become an actionable setup.</p>
      <p>Common signature: a large candle with high volume and strong delta in one direction, followed by a candle that is notably smaller, lower volume, and diminishing delta in the same direction. The market pushed hard and got little in return. That asymmetry between effort and outcome is the signal.</p>`,
    related: ["absorption", "order-flow", "delta", "reversal-anatomy"]
  },

  "dom": {
    term: "Depth of Market (DOM)",
    category: "Execution",
    body: `
      <p>The Depth of Market (DOM), also called the order book or the ladder, shows all resting limit orders at each price level above and below the current market price. It displays bids (limit orders to buy at a specific price) stacked below the market and asks/offers (limit orders to sell) stacked above.</p>
      <p>The DOM reveals <em>intention</em> before it becomes a transaction. A large resting bid at a specific price signals that a participant intends to buy aggressively there — that level has structural support. When that bid holds against incoming sell pressure, it is absorbing. When it pulls (disappears), the structural support has shifted.</p>
      <p>The DOM is a confirmation layer in this framework, not a leading indicator. It validates what price structure and order flow are already communicating. "Pulling" behavior (large bids or offers being pulled just before price arrives) can indicate that the apparent support or resistance was not genuine. "Stacking" behavior (bids or offers being refreshed repeatedly) indicates committed defense of a level.</p>`,
    related: ["order-flow", "absorption", "market-orders-limit-orders"]
  },

  "footprint": {
    term: "Footprint Chart",
    category: "Execution",
    body: `
      <p>A footprint chart is a specialized candlestick chart that shows, within each candle, the volume that traded at each individual price level split between buying and selling activity. Where a standard candle shows only the open, high, low, and close, a footprint shows the internal structure of every transaction that occurred at every price within that candle.</p>
      <p>The most common display format shows each price level as a row, with selling volume on the left and buying volume on the right. High-volume cells are visually emphasized. "Imbalances" (where buying dramatically exceeds selling, or vice versa, at a specific price) are often highlighted, as they indicate one-sided institutional activity at that level.</p>
      <p>In this system, footprint charts are used on the five-minute timeframe as the executional trigger layer. The specific signatures being looked for are exhaustion patterns, absorption behavior, and re-engagement sequences that are invisible on a standard price chart.</p>`,
    related: ["order-flow", "delta", "volume-profile"]
  },

  // ── TRADING FRAMEWORK ────────────────────────────────────────────────
  "market-generated-information": {
    term: "Market Generated Information (MGI)",
    category: "Core Framework",
    body: `
      <p>Market Generated Information (MGI) refers to price and volume data produced by the market itself as participants transact — as opposed to external data like earnings reports, analyst opinions, or news events. MGI includes the highs, lows, value areas, points of control, and structural levels established by prior sessions' actual transactions.</p>
      <p>The term emphasizes objectivity: MGI is what actually happened in the market, not what someone thinks about the market. Prior day high and low, prior week range, overnight high and low — these are facts about where participants were willing to transact. They carry analytical weight precisely because they reflect collective behavior rather than individual opinion.</p>
      <p>In this framework, MGI levels function as the primary structural reference points for both pre-market analysis and intraday navigation. They are the decisions the market has already made.</p>`,
    related: ["volume-profile", "value-area", "inflection-zones"]
  },

  "initial-balance": {
    term: "Initial Balance (IB)",
    category: "Session Structure",
    body: `
      <p>The Initial Balance (IB) is the price range established during the first hour of regular trading hours (RTH). It represents the market's first meaningful negotiation after the open — the range where buyers and sellers reach initial equilibrium after overnight positioning and the opening drive are absorbed.</p>
      <p>The IB high and low become reference points for the rest of the session. A break above the IB high with volume and sustained acceptance suggests buyers have established directional control. A break below the IB low with similar conviction suggests sellers have. A session that stays inside the IB suggests a balanced, range-bound day.</p>
      <p>The 30-minute Opening Range (OR) referenced in this framework is a related concept — the high and low of the first 30 minutes rather than the full hour. Both serve as structural reference points for the session's directional narrative.</p>`,
    related: ["session-structure", "opening-range", "day-type"]
  },

  "opening-range": {
    term: "Opening Range (30-Minute OR)",
    category: "Session Structure",
    body: `
      <p>The Opening Range is the high and low established during the first 30 minutes of regular trading hours. It captures the initial price discovery process as the day session participants react to overnight positioning, pre-market news, and the opening drive.</p>
      <p>The Opening Range High (ORH) and Opening Range Low (ORL) function as key reference levels for the remainder of the session. Acceptance above ORH indicates that buyers have successfully expanded value above the morning range. Acceptance below ORL indicates sellers have done the same to the downside.</p>
      <p>Breakouts from the Opening Range with volume and time-based acceptance tend to be directionally informative. False breakouts from the OR that quickly fail back inside are also highly informative — they indicate that the attempt to expand value was rejected, which often leads to a move toward the opposite extreme.</p>`,
    related: ["initial-balance", "session-structure", "vwap"]
  },

  "vwap": {
    term: "VWAP (Volume-Weighted Average Price)",
    category: "Technical Analysis",
    body: `
      <p>VWAP is the average price at which all transactions have occurred during a period, weighted by volume. It is calculated by taking the sum of (price × volume for each transaction) divided by total volume. The result is not a simple average of prices — it reflects the <em>true average execution price</em> that all participants have received.</p>
      <p>VWAP is the primary intraday benchmark for institutional traders. Many institutional algorithms are evaluated against VWAP: did they buy below VWAP (good) or above it (suboptimal)? This creates real structural significance: institutions tend to buy below VWAP and reduce buying above it, creating a self-reinforcing dynamic.</p>
      <p>When price trades above the session VWAP with sustained acceptance and volume, it signals that the market is in a favorable institutional environment for continued buying. When price trades below VWAP with sustained acceptance, the reverse applies. VWAP is not a reversal trigger but a directional lean — a context indicator that tells you which side of the institutional average the market is operating on.</p>`,
    related: ["session-structure", "market-generated-information", "globex"]
  },

  "globex": {
    term: "Globex / Overnight Session",
    category: "Session Structure",
    body: `
      <p>Globex is CME Group's electronic trading platform, which allows futures markets to trade nearly 24 hours a day. In context, "Globex" or "the overnight session" typically refers to the trading activity that occurs outside regular trading hours (RTH) — approximately from 6 PM to 9:30 AM Eastern Time for US equity index futures.</p>
      <p>The overnight session reflects global capital flows, risk sentiment from Asian and European markets, reactions to overnight news, and early institutional positioning ahead of the regular session. It often establishes an overnight high (ONH) and overnight low (ONL) that become key reference points for the day session.</p>
      <p>Sustained overnight acceptance above prior day value suggests buyers are comfortable at elevated prices — a bullish lean heading into RTH. Large overnight imbalances with thin volume structure create "vulnerable" price levels that frequently unwind after the higher-volume RTH session opens and more participants arrive to evaluate whether the overnight move was justified.</p>`,
    related: ["session-structure", "opening-range", "market-generated-information"]
  },

  "day-type": {
    term: "Day Type Classification",
    category: "Session Structure",
    body: `
      <p>Day type classification is the process of identifying what kind of session the market is having before selecting specific trade strategies. The core principle: the correct strategy applied to the wrong day type produces consistent losses regardless of how sound the underlying analysis is.</p>
      <p><strong>Rotational / Balance days</strong> feature an equilibrium between buyers and sellers, a D-shaped volume profile, and repeated tests of range boundaries that hold. The correct approach is to trade responsively from the edges, not seek breakouts.</p>
      <p><strong>Trend / Controlled days</strong> (Slow Grind) feature one side maintaining consistent structural control. Volume nodes build progressively in one direction without any being surrendered. The correct approach is to trade exclusively in the direction of control on retracements.</p>
      <p><strong>Directional Liquidation days</strong> feature sequential structural breaks in one direction, with every recovery becoming a reload opportunity for the dominant side. The most common mistake on these days is trying to call a bottom or top. The correct approach is to trade in the direction of the trend or not at all.</p>`,
    related: ["balance-imbalance", "value-area", "directional-bias"]
  },

  "directional-bias": {
    term: "Directional Bias",
    category: "Core Framework",
    body: `
      <p>Directional bias is the analytical conclusion about which side of the market (buyers or sellers) currently holds structural advantage, and therefore which direction trades should be aligned with. It is established before any trade idea is formed.</p>
      <p>The bias is derived from observable evidence: which side is being consistently rewarded with forward price movement, which side is finding their aggression met with absorption, and whether the dominant side is showing signs of exhaustion or sustained control. It is not a prediction about where price will go. It is a read of which side is currently winning the ongoing auction.</p>
      <p>A key principle: when the market's actual behavior contradicts a predetermined bias, updating the bias is the correct response, not defending it. The market communicates its bias continuously through price and volume behavior. The trader's job is to read that communication accurately, not to impose a preferred interpretation on top of it.</p>`,
    related: ["day-type", "balance-imbalance", "order-flow"]
  },

  "inflection-zones": {
    term: "Inflection Zones / Key Levels",
    category: "Technical Analysis",
    body: `
      <p>Inflection zones are price areas where the market has previously made meaningful decisions — where significant volume accumulated before a directional move, where prior reversals occurred, or where structural boundaries have been established. They are locations where the probability of a meaningful market response is elevated.</p>
      <p>The term "inflection" reflects the key insight: these zones do not guarantee a specific outcome. They mark the location where the market is likely to <em>make a decision</em>, but what that decision will be is only revealed in real time by how price and order flow behave upon arrival.</p>
      <p>Zone quality is a function of: (1) how much volume built before the prior move, (2) how clean and sustained the move that followed was, and (3) how the zone has behaved on any prior revisits. High-quality zones show fast, decisive reactions. Low-quality zones show slow, grinding responses that often ultimately fail.</p>`,
    related: ["volume-profile", "hvn-lvn", "market-generated-information", "confluence"]
  },

  "confluence": {
    term: "Confluence",
    category: "Core Framework",
    body: `
      <p>Confluence describes the condition where multiple independent analytical inputs point to the same conclusion at the same location and time. In this system, a high-confidence trade setup is one where higher-timeframe structure, volume profile levels, session context, price action behavior, order flow signatures, and DOM confirmation all align simultaneously.</p>
      <p>No single input alone constitutes a trade. Confluence is what converts a zone (a potential location) into a setup (an actionable opportunity). The more layers that align, the higher the probability and the more size the setup justifies.</p>
      <p>Practically, a two-layer setup at a modest level justifies a small position. A six-layer setup at a significant HTF confluence justifies a full position. The number of aligned inputs is not a decoration — it is the sizing instruction.</p>`,
    related: ["inflection-zones", "order-flow", "directional-bias", "six-layer-model"]
  },

  "six-layer-model": {
    term: "The Six-Layer Confluence Model",
    category: "Core Framework",
    body: `
      <p>The six-layer model describes the analytical hierarchy used to construct trade ideas in the AMT system. Each layer is an independent form of evidence. When multiple layers converge at the same location simultaneously, the probability of a meaningful market response increases.</p>
      <p><strong>Layer 1:</strong> Higher-timeframe structure — daily, weekly, and five-day profile context.</p>
      <p><strong>Layer 2:</strong> Volume profile zones — HVNs, LVNs, and expansion-origin areas from prior sessions.</p>
      <p><strong>Layer 3:</strong> Session context — Globex narrative, RTH open behavior, and time of day.</p>
      <p><strong>Layer 4:</strong> Price action — bar-by-bar micro-structure as price approaches and enters the zone.</p>
      <p><strong>Layer 5:</strong> Order flow — footprint signatures confirming exhaustion, absorption, or re-engagement.</p>
      <p><strong>Layer 6:</strong> DOM confirmation — resting liquidity behavior and initiative activity confirming the setup.</p>`,
    related: ["confluence", "order-flow", "inflection-zones", "dom"]
  },

  // ── RISK / EXPECTANCY ────────────────────────────────────────────────
  "expectancy": {
    term: "Expectancy",
    category: "Risk & Performance",
    body: `
      <p>Expectancy is the average amount you expect to earn or lose per trade across a sufficiently large sample. It is calculated as: <strong>(Average Win × Win Rate) − (Average Loss × Loss Rate)</strong>.</p>
      <p>The insight expectancy provides: win rate alone tells you almost nothing meaningful about a trading system's viability. A system with a 35% win rate and a 4:1 average payoff ratio produces higher expectancy than a system with a 70% win rate and a 1:1 payoff ratio. The two feel completely different to trade — the high-win-rate system feels comfortable, the low-win-rate system feels like losing — but the math favors the asymmetric one.</p>
      <p>The implication for how losses are treated: a 1R loss in a positive-expectancy system is not a failure. It is the cost of participation, equivalent to a business's cost of goods sold. The failure state is a loss that exceeds the defined maximum (larger than 1R) — that is a process failure, not a statistical event.</p>`,
    related: ["risk-reward", "r-multiple", "win-rate"]
  },

  "r-multiple": {
    term: "R-Multiple (1R, 2R, 3R)",
    category: "Risk & Performance",
    body: `
      <p>R refers to the unit of risk on any given trade — specifically, the dollar amount risked from entry to stop loss. A 1R loss means the trade reached the stop and the defined risk amount was lost. A 2R winner means the trade produced twice the amount risked as profit. A 5R winner produced five times the risk amount.</p>
      <p>Expressing outcomes in R-multiples rather than dollars is valuable because it normalizes results across different position sizes and account sizes, making it possible to evaluate the quality of the system independently of the specific dollar amounts involved.</p>
      <p>This system targets an asymmetric distribution of R-outcomes: frequent small losses (~1R), occasional scratches (~0R), regular moderate winners (~2-3R), and infrequent but significant large winners (~3-7R). The large winners at the right tail of the distribution drive the overall system's positive expectancy. This is why cutting them short through premature exits directly damages overall performance.</p>`,
    related: ["expectancy", "risk-reward", "pyramiding"]
  },

  "pyramiding": {
    term: "Pyramiding",
    category: "Risk & Performance",
    body: `
      <p>Pyramiding is the practice of adding size to an existing winning position at structurally validated points as the trade develops in your favor. Done correctly, it is a strategic extension of correct positioning. Done incorrectly, it is emotional averaging-up that increases total risk without structural justification.</p>
      <p>The key distinction in this system: a valid pyramid add must either bring the total position to breakeven or reduce overall net risk. This is achieved by moving the stop on the original position up to the entry point of the add, so that a reversal from the new entry exits the whole position at approximately breakeven.</p>
      <p>The only basis for a pyramid add is a confirmed retrace to a structurally significant area (a prior footprint imbalance) with a fresh order-flow signature. Adding because price has continued in the desired direction without a structural retest is not pyramiding. It is chasing at elevated risk.</p>`,
    related: ["r-multiple", "expectancy", "ema-ribbon"]
  },

  "ema-ribbon": {
    term: "EMA Ribbon (9-20 EMA)",
    category: "Technical Analysis",
    body: `
      <p>The EMA ribbon in this system uses two exponential moving averages — the 9-period and 20-period — on the five-minute chart. Together, they form a dynamic band that reflects the current momentum state of the market at the session level.</p>
      <p>When price is consistently trading above the ribbon with the ribbon sloping upward, the market is in a controlled uptrend and continuation strategies have the structural tailwind. When price breaks through the ribbon and closes below it, structural momentum has shifted and the position should be reassessed.</p>
      <p>The ribbon functions as a <em>holding mechanism</em> — permission to continue holding a winning trade — rather than as a reversal signal or a stop-loss indicator. The position is held as long as: (1) the ribbon remains intact, and (2) the next structural target has not been reached. Whichever arrives first ends the trade.</p>`,
    related: ["trade-management", "pyramiding", "directional-bias"]
  },

  // ── POSITION TRADING / RSP ───────────────────────────────────────────
  "power-law-returns": {
    term: "Power-Law Distribution of Returns",
    category: "Position Trading",
    body: `
      <p>A power-law distribution describes a relationship where a small number of observations account for a disproportionately large share of the total. In equity markets, this means that a small number of stocks produce the vast majority of total market returns over any given decade, while the majority of stocks produce returns at or below the risk-free rate.</p>
      <p>Research examining US equity returns over multi-decade periods consistently shows that the entire positive return of the market is attributable to a small fraction of stocks — often the top 4% of performers. The rest, in aggregate, returned roughly zero above Treasury bills.</p>
      <p>The practical implication: broad diversification across the full stock market captures the average of a distribution where the majority of constituents do not meaningfully contribute to returns. Concentrated positioning in the right subset can capture a disproportionate share of the total available return — but only if those positions are held long enough for the power-law outcome to materialize.</p>`,
    related: ["asymmetry", "concentration"]
  },

  "asymmetry": {
    term: "Asymmetric Risk / Asymmetry",
    category: "Position Trading",
    body: `
      <p>Asymmetry in trading refers to setups or positions where the potential upside significantly exceeds the potential downside. An asymmetric position is one where being wrong costs you a small, defined amount, but being right can return a multiple of that cost.</p>
      <p>In position trading, asymmetry is the explicit goal of the selection process. A company in the early accumulation phase with improving fundamentals, in a sector benefiting from a macro theme, bought at a structural low with a clearly defined invalidation point is asymmetric: the maximum loss is the distance to invalidation, but the potential gain — if the thesis develops fully — can be several multiples of that.</p>
      <p>The philosophical framing matters: asymmetry requires accepting frequent small losses in exchange for infrequent large gains. Most people's intuition runs in the opposite direction. They prefer frequent small wins and few losses, which produces a symmetric or negative-expectancy system. Embracing asymmetry requires genuinely understanding why the math works even when the emotional experience is uncomfortable.</p>`,
    related: ["expectancy", "r-multiple", "power-law-returns"]
  },

  "corporate-lifecycle": {
    term: "Corporate Life Cycle",
    category: "Position Trading",
    body: `
      <p>Every company progresses through recognizable phases as it grows, matures, and eventually either adapts or declines. The four primary phases are <strong>early growth</strong> (high investment, low or no profit, narrative-driven valuation), <strong>high-growth expansion</strong> (operating leverage emerging, institutional coverage arriving, real cash flows developing), <strong>maturity</strong> (stable growth, predictable cash flows, capital returned to shareholders), and <strong>decline</strong> (structural competitive deterioration, revenue contraction, margin compression).</p>
      <p>The market values companies differently at each phase, which is why the same financial metrics mean different things in different contexts. A negative free cash flow is normal and expected for an early-growth technology company investing aggressively in R&D and market capture. It is a warning sign for a mature consumer staples company with no reinvestment rationale.</p>
      <p>The most consistently mispriced transitions are the inflection points: early growth to high-growth expansion (first meaningful profitability), and distressed to recovering (operational improvement before consensus recognition). Positioning before the market fully prices the phase transition is where the asymmetric return lives.</p>`,
    related: ["asymmetry", "narrative-shift", "fundamental-catalyst"]
  },

  "macro-regime": {
    term: "Macro Regime",
    category: "Position Trading",
    body: `
      <p>A macro regime describes the dominant economic environment that governs which assets, sectors, and investment styles are structurally favored at a given time. It is defined by the interplay of four primary variables: inflation (rising, falling, or stable relative to targets), growth (expanding or contracting), rates and liquidity (policy direction and credit availability), and productivity (whether technological or organizational efficiency gains are improving output per unit of input).</p>
      <p>Different regimes structurally favor different sectors. A low-rates, high-growth regime with expanding productivity tends to favor technology and growth equities. A high-rates, fiscal-expansion regime favors financials, industrials, and materials. Understanding which regime is currently operative determines which sectors are likely to attract institutional capital flows — and therefore which sectors should be the focus of equity selection efforts.</p>
      <p>Importantly, regimes change. A thesis built for one regime can be destroyed by the transition to another. One of the primary review questions applied to any open position is: has the macro regime that justified this thesis shifted materially?</p>`,
    related: ["thematic-investing", "sector-rotation", "cot-report"]
  },

  "thematic-investing": {
    term: "Thematic Investing / Umbrella Branching",
    category: "Position Trading",
    body: `
      <p>Thematic investing is the process of identifying a large, durable structural change in the economy and investing in the companies best positioned to benefit from it. Themes emerge from macro forces: technological shifts (AI, cloud computing), demographic changes (aging populations, urbanization), policy decisions (energy transition, reshoring), or geopolitical reconfigurations (supply chain restructuring).</p>
      <p>In this framework, "umbrella branching" describes the process of translating a macro theme into specific investable opportunities. The theme is identified first. Then the sectors and industries most directly exposed to the theme's benefits are identified. Then the individual companies within those industries with the strongest combination of relative strength, fundamental quality, and technical entry structure are selected.</p>
      <p>The key discipline: the theme drives the selection, not the other way around. Building a macro narrative to justify a stock you already want to own (reverse-engineering the thesis) is one of the most common analytical errors in fundamental investing.</p>`,
    related: ["macro-regime", "sector-rotation", "relative-strength-position"]
  },

  "relative-strength-position": {
    term: "Relative Strength (Position Trading)",
    category: "Position Trading",
    body: `
      <p>In the context of position trading, relative strength refers to a stock's price performance compared to its sector and the broader market over a meaningful time period. A stock exhibiting strong relative strength is outperforming — rising faster in uptrends and declining less (or rising) in downtrends.</p>
      <p>Relative strength is treated in this framework not as a simple price ratio but as a signal about institutional capital flows. When a stock is outperforming its peers, particularly during periods of general market weakness, it is because informed participants are accumulating it. They have a reason to buy when others are selling, and that reason is typically ahead of any public narrative that would make the accumulation obvious.</p>
      <p>The practical implication: relative strength should be the first technical screen applied within the sectors identified through the thematic branching process. The strongest relative strength stocks in the right sectors, at the right point in the cycle, are the primary candidates for deep fundamental analysis.</p>`,
    related: ["thematic-investing", "commercial-participants", "corporate-lifecycle"]
  },

  "fundamental-catalyst": {
    term: "Fundamental Catalyst",
    category: "Position Trading",
    body: `
      <p>A fundamental catalyst is a specific company-level event or structural change that will force Wall Street to reprice the equity — to assign it a higher (or lower) valuation multiple. It is what separates a stock that has improving financials from one that will be discovered by institutional capital because of those improving financials.</p>
      <p>Common positive catalysts include: a company's return to profitability (crossing from negative to positive earnings forces new institutional buyers who cannot own unprofitable companies), discovery by Wall Street after being ignored or under-covered (re-rating from no institutional interest to broad coverage), a new product or service that redefines the company's addressable market, or a management change that transforms the operational trajectory.</p>
      <p>The catalyst is what creates the "under-advertised to over-advertised" journey. Without a clear catalyst, a company can have strong fundamentals and still remain ignored indefinitely by institutional capital. With a catalyst, the timeline for re-rating becomes finite and the asymmetric opportunity becomes defined.</p>`,
    related: ["corporate-lifecycle", "narrative-shift", "relative-strength-position"]
  },

  "narrative-shift": {
    term: "Narrative Shift / Institutional Re-Rating",
    category: "Position Trading",
    body: `
      <p>A narrative shift occurs when the dominant institutional story about a company changes — from ignored to covered, from speculative to respectable, from "turnaround story" to "proven compounder." These shifts drive valuation re-ratings: the market assigns a higher earnings multiple because the perceived quality and durability of those earnings has improved in institutional perception.</p>
      <p>Crucially, the narrative shift almost always lags the operational reality. A company can be operationally improving for twelve to eighteen months before Wall Street initiates coverage, before index funds begin meaningful allocation, and before retail awareness arrives. Each of those events represents a new wave of demand entering at higher prices — each one a different stage of the transition from under-owned to institutionally saturated.</p>
      <p>The asymmetric return is concentrated in the period between when the operational improvement begins and when the narrative fully reflects it. Positioning during accumulation and holding through the narrative shift is the full arc of the position trading opportunity.</p>`,
    related: ["fundamental-catalyst", "corporate-lifecycle", "asymmetry"]
  },

  "kelly-criterion": {
    term: "Kelly Criterion",
    category: "Risk & Performance",
    body: `
      <p>The Kelly Criterion is a mathematical formula for determining the optimal fraction of a portfolio to allocate to a given bet or trade, given a known edge and payout ratio. The full Kelly formula maximizes the long-run geometric growth rate of the portfolio.</p>
      <p>In practice, most systematic traders use fractional Kelly (typically half or quarter Kelly) because: (1) the true edge of any trade is uncertain, and overestimating edge leads to Kelly allocating too much; (2) the full Kelly bet produces significant volatility, including drawdowns that are psychologically difficult to sustain; (3) fractional Kelly reduces volatility substantially at the cost of a modest reduction in long-run growth rate.</p>
      <p>In the RSP framework, Kelly provides the conceptual basis for position sizing: allocate more to higher-conviction setups (where the estimated edge is larger) and less to lower-conviction ones. The practical ranges given (2-8% of portfolio per position) reflect this principle applied conservatively with fractional Kelly adjustments.</p>`,
    related: ["expectancy", "r-multiple", "concentration"]
  },

  "roic": {
    term: "ROIC (Return on Invested Capital)",
    category: "Fundamental Analysis",
    body: `
      <p>Return on Invested Capital measures how efficiently a company generates profit from the capital invested in its business. It is calculated as Net Operating Profit After Tax (NOPAT) divided by total invested capital (debt + equity). When ROIC exceeds the Weighted Average Cost of Capital (WACC), the company is creating genuine economic value. When ROIC falls below WACC, the company is destroying value even if it reports positive earnings.</p>
      <p>ROIC is particularly useful for distinguishing between companies that appear similarly profitable on surface metrics but have very different capital efficiency profiles. A business that earns $10M on $50M of invested capital (20% ROIC) is fundamentally more attractive than one earning $10M on $200M of invested capital (5% ROIC).</p>
      <p>Companies with sustainably high and improving ROIC tend to be compounding machines: they reinvest their returns at high rates, generating earnings growth that is self-funding and durable. This is the financial profile of a business capable of sustaining a large structural move over years rather than quarters.</p>`,
    related: ["fundamental-catalyst", "corporate-lifecycle", "free-cash-flow"]
  },

  "free-cash-flow": {
    term: "Free Cash Flow (FCF)",
    category: "Fundamental Analysis",
    body: `
      <p>Free Cash Flow is the cash a business generates after paying for all operating expenses and capital expenditures needed to maintain or grow the business. It represents the actual cash available for discretionary uses: debt repayment, dividends, buybacks, acquisitions, or reinvestment in high-return opportunities.</p>
      <p>FCF is often considered a more reliable indicator of financial health than reported earnings because it is much harder to manipulate. Earnings can be inflated through accounting choices (revenue recognition, depreciation policies, etc.) without producing actual cash. When a company consistently reports strong earnings but weak or negative FCF, it warrants close examination of the assumptions underlying those reported earnings.</p>
      <p>In the RSP framework, the rule "Cash Flow from Operations greater than Net Income" is a basic quality filter: it screens for companies whose reported profits are backed by actual cash generation rather than accounting artifacts.</p>`,
    related: ["roic", "fundamental-catalyst", "altman-z-score"]
  },

  "altman-z-score": {
    term: "Altman Z-Score",
    category: "Fundamental Analysis",
    body: `
      <p>The Altman Z-Score is a financial health indicator developed by NYU professor Edward Altman in 1968. It combines five financial ratios into a single score that estimates the probability of a company entering financial distress within two years.</p>
      <p>The five components assess: working capital relative to assets (liquidity), retained earnings relative to assets (accumulated profitability), operating earnings relative to assets (operational efficiency), market value of equity relative to total liabilities (solvency buffer), and revenue relative to assets (asset utilization).</p>
      <p>A Z-Score above 2.99 is generally considered financially healthy (low distress probability). A score between 1.81 and 2.99 is in a "grey zone" of elevated risk. Below 1.81 suggests significant distress risk. As a simple filter for identifying structurally solvent businesses, it is particularly useful for screening potential position trade candidates — a financially fragile company may not survive long enough for a thesis to develop.</p>`,
    related: ["free-cash-flow", "fundamental-catalyst", "corporate-lifecycle"]
  },

  "short-squeeze": {
    term: "Short Squeeze",
    category: "Market Structure",
    body: `
      <p>A short squeeze occurs when a heavily shorted stock rises sharply in price, forcing short sellers to buy shares to cover their positions and limit losses. Because covering a short position requires buying shares, the covering activity itself adds upward price pressure, which forces more short sellers to cover, which adds more buying pressure — a self-reinforcing feedback loop.</p>
      <p>Short squeezes are most violent when three conditions align: high short interest relative to average trading volume (a high "days to cover" ratio), a catalyst that forces short sellers to reassess their thesis (earnings surprise, news event, or simply sustained price appreciation), and limited liquidity relative to the size of short positions that need to be covered.</p>
      <p>In the COT context, extreme speculative short positioning in equity futures creates a structural setup for squeeze dynamics: when commercial participants begin accumulating and price starts to rise, the trapped speculative shorts become forced buyers, amplifying the reversal. This is why the combination of heavy commercial accumulation and heavy speculative short exposure is so significant — the shorts are the fuel for the move.</p>`,
    related: ["speculative-participants", "commercial-participants", "cot-report"]
  },

  "risk-on-environment": {
    term: "Risk-On Environment",
    category: "Position Trading",
    body: `
      <p>A risk-on environment describes market conditions where investors are willing to accept higher risk in pursuit of higher returns. Capital flows away from safe-haven assets (government bonds, gold, defensive equities) and toward growth assets (equities, high-yield credit, commodities, emerging markets).</p>
      <p>Risk-on environments tend to develop when: central banks are accommodative or moving toward accommodation, corporate earnings are growing, geopolitical conditions are stable or improving, inflation is controlled, and consumer and business confidence is rising.</p>
      <p>In the RSP framework, risk-on conditions are not assumed or predicted — they are confirmed through COT data showing commercial accumulation and speculative shorts at extremes, combined with the S&P 500's position relative to its 20-period moving average. The signal confirms that the conditions for deploying capital aggressively into high-conviction theses are present. Without it, the framework calls for patience.</p>`,
    related: ["cot-report", "commercial-participants", "macro-regime"]
  },

  "concentration": {
    term: "Concentration / Concentrated Portfolio",
    category: "Position Trading",
    body: `
      <p>Portfolio concentration refers to holding a relatively small number of positions, each with meaningful size, rather than spreading capital across many small positions. The EightyTwentyVentures approach targets three to seven positions at any given time.</p>
      <p>The case for concentration: returns in equity markets are distributed asymmetrically. A small number of positions will produce the vast majority of gains. In a concentrated portfolio, those positions are sized large enough to move the overall portfolio meaningfully. In a diversified portfolio of twenty to thirty holdings, even a 10x position barely moves the needle.</p>
      <p>The risk management discipline that makes concentration viable: each position must have a clearly defined structural invalidation point, and the position must be exited decisively when that point is breached. Concentration with disciplined stops is fundamentally different from concentration with emotional attachment to positions.</p>`,
    related: ["asymmetry", "power-law-returns", "kelly-criterion", "premature-exit"]
  },

  "premature-exit": {
    term: "Premature Exit",
    category: "Psychology",
    body: `
      <p>A premature exit is exiting a position that is working — one where the original thesis is still intact, the fundamental trajectory is still improving, and the structural targets have not been reached — because the position has become psychologically uncomfortable to hold.</p>
      <p>This is identified as the single greatest systematic failure mode of position traders who are analytically correct. The analysis was right. The selection was right. The entry was right. But the holding behavior was wrong — the position was exited at a 40% gain rather than held to the 200% gain the thesis supported.</p>
      <p>The mechanism is well understood: a paper gain creates a psychological reference point. When normal volatility causes the position to retrace from its peak, the gap between peak and current price feels like a loss, triggering the impulse to exit and "lock in" the gain. The structural review process (is the thesis still intact? is the regime still supportive? is this still a high-conviction idea?) is the tool for distinguishing a thesis change from a fear response.</p>`,
    related: ["concentration", "corporate-lifecycle", "asymmetry"]
  },

  "mental-capital": {
    term: "Mental Capital",
    category: "Psychology",
    body: `
      <p>Mental capital refers to the finite cognitive and emotional resources available for decision-making during a trading session. Like physical energy, it depletes with use and cannot be meaningfully replenished mid-session.</p>
      <p>Mental capital depletes faster in specific conditions: active open trades requiring real-time monitoring, drawdown (each loss consumes disproportionately more than each gain restores), extended session duration, and emotional activation from external sources. The trader who enters their third hour feeling cognitively sharp is statistically unusual. Most are operating at materially reduced capacity.</p>
      <p>The practical implication is that session length is a performance variable, not a measure of dedication or work ethic. A one-hour session with sharp cognition will outperform a three-hour session where most of the decisions occur in a degraded mental state. The system is designed around bounded, focused sessions for exactly this reason.</p>`,
    related: ["process-over-outcome", "daily-profit-targets", "journaling"]
  },

  "journaling": {
    term: "Trading Journal / Behavioral Audit",
    category: "Psychology",
    body: `
      <p>A trading journal in this framework serves a specific purpose: pattern detection and behavioral audit. It is not a record of how much money was made or lost. It is a structured log of what decisions were made, in what context, with what emotional state, and whether those decisions reflected the defined process or departed from it.</p>
      <p>The distinction between outcome failures and process failures is critical. A correct trade that lost money due to normal statistical variance is not a failure — it is the cost of doing business in a probabilistic system. An incorrect trade that happened to make money despite poor process is not a success — it is a precedent for a future loss. The journal evaluates process, not outcomes.</p>
      <p>Recurring patterns in the journal — impatience at specific session times, oversizing after a winning streak, hesitation after a losing streak — are treated as technical defects to be corrected structurally. The most durable corrections come from adding rules and guardrails, not from trying harder or wanting it more.</p>`,
    related: ["mental-capital", "process-over-outcome", "feedback-loop"]
  },

  "feedback-loop": {
    term: "The Feedback Loop",
    category: "Psychology",
    body: `
      <p>The feedback loop is the mechanism by which trading performance improves over time: Trade → Journal → Review → Adjust → Execute → Repeat. Each iteration contributes either to reinforcing what is working or to identifying and eliminating what is not.</p>
      <p>Without the loop, experience accumulates without producing improvement. Patterns repeat. Behavioral errors go uncorrected. The trader gets more experienced at making the same mistakes rather than building a progressively refined process.</p>
      <p>With the loop running consistently, even unprofitable sessions contribute value: they produce data about what conditions do not produce edge, what behavioral states produce poor decisions, and what process departures are costing performance. Over twelve months of honest feedback loop operation, the trader who started it is a meaningfully different and more effective operator than they were at the beginning.</p>`,
    related: ["journaling", "mental-capital", "process-over-outcome"]
  },

  "process-over-outcome": {
    term: "Process Over Outcome",
    category: "Psychology",
    body: `
      <p>Process over outcome is the principle that the quality of a trading decision should be evaluated based on whether it followed the defined system correctly, not based on whether it produced a profit. A well-executed trade that loses and a poorly-executed trade that wins carry opposite information about edge — one confirms the system is being followed, the other suggests it is being abandoned.</p>
      <p>This principle matters because individual trade outcomes are noisy. A system with genuine positive expectancy will still produce losing streaks. Evaluating the system based on any given week's or month's results produces incorrect conclusions about its validity. Evaluating the system based on whether process is being followed consistently across hundreds of trades produces accurate conclusions.</p>
      <p>The corollary: focusing on P&L on any given day or week creates pressure to override the process in order to hit a number. Process-focus eliminates that pressure and allows the statistical edge to manifest across a sufficient sample size.</p>`,
    related: ["expectancy", "journaling", "feedback-loop", "mental-capital"]
  },

  "reflexivity": {
    term: "Reflexivity",
    category: "Position Trading",
    body: `
      <p>Reflexivity is a concept developed by George Soros describing a self-reinforcing feedback loop between market participants' perceptions and the underlying reality those perceptions are meant to reflect. In classical economics, participants observe reality and react to it. In Soros' framework, participants' beliefs and actions change reality itself, which then changes beliefs, which then changes reality further.</p>
      <p>In equity markets, this plays out as: informed participants accumulate a position. Price rises. Rising price attracts attention. Attention attracts institutional flows. Institutional flows improve the company's access to capital. Cheaper capital improves operational execution. Improved execution confirms the original thesis. Confirmation attracts more capital. The process becomes self-reinforcing in ways that extend trends far beyond what any initial valuation model would have suggested.</p>
      <p>The implication for speculation: the endpoint of a major equity move is often not where fundamental analysis said it should stop. The reflexive process continues until it exhausts itself, usually when a fundamental reality fails to meet the expectations the reflexive expansion had embedded. Recognizing when reflexivity is operating versus when a move is purely speculative and detached from any improving reality is one of the most difficult judgments in this framework.</p>`,
    related: ["narrative-shift", "asymmetry", "power-law-returns"]
  },

  "operating-leverage": {
    term: "Operating Leverage",
    category: "Fundamental Analysis",
    body: `
      <p>Operating leverage describes how sensitive a company's earnings and cash flow are to changes in revenue, given its mix of fixed and variable costs. A business with high operating leverage has a large proportion of fixed costs. When revenue grows, those fixed costs are spread across more revenue, causing profits to expand at a much faster rate than revenue itself.</p>
      <p>This concept is especially critical in commodity companies and early-growth businesses. A commodity producer with fixed costs of $40 per barrel earns zero at $40 oil and earns dramatically more at $80 oil, not proportionally more. The incremental revenue flows almost entirely to the bottom line. Small changes in commodity price translate to large changes in earnings and free cash flow.</p>
      <p>From a speculative standpoint, operating leverage is why commodity companies and early-growth companies with high fixed cost bases can produce the most explosive earnings inflections. When the revenue environment turns, the earnings response is non-linear. The speculative setup is positioning before the market has fully modeled that non-linearity.</p>`,
    related: ["free-cash-flow", "fundamental-catalyst", "corporate-lifecycle"]
  },

  "information-asymmetry": {
    term: "Information Asymmetry",
    category: "Position Trading",
    body: `
      <p>Information asymmetry in markets refers to the condition where different participants have access to meaningfully different quality and quantity of information at the same time. Classical finance theory assumes markets are informationally efficient, meaning prices already reflect all available information. In practice, information is distributed unevenly and processed at vastly different speeds and depths by different participants.</p>
      <p>Institutional participants who specialize deeply, employ industry experts, monitor alternative data sources, speak directly with supply chain participants, and dedicate significant analytical resources to a specific sector will often recognize improving conditions in a business well before that improvement is visible in public financial statements or analyst consensus estimates.</p>
      <p>This is not necessarily illegal insider knowledge, though that exists at the margins. It is the natural result of superior information processing and analytical depth. The observable manifestation of this asymmetry is price behavior that appears to "know" things before they are publicly confirmed, which is why price leadership ahead of fundamental confirmation is such a reliable feature of major equity moves.</p>`,
    related: ["commercial-participants", "reflexivity", "relative-strength-position"]
  },

  "expectation-repricing": {
    term: "Expectation Repricing / Re-Rating",
    category: "Position Trading",
    body: `
      <p>Expectation repricing occurs when the market's probability distribution for a company's future earnings, growth, or competitive positioning shifts dramatically. The stock price is not simply a reflection of current earnings, it is the present value of all future expected cash flows weighted by the probabilities the market assigns to different scenarios.</p>
      <p>When those probabilities shift, the stock price moves not in proportion to the fundamental change but in proportion to the expected value change. A company that the market assigned a 20% probability of reaching profitability suddenly being assigned a 70% probability is not a 50 percentage point improvement in one metric. It is potentially a three to five times expansion in the expected value of the equity.</p>
      <p>This is why speculative opportunities around expectation shifts can produce returns that appear disconnected from the magnitude of the underlying fundamental change. The market is not repricing the current reality. It is repricing its entire probability distribution for future scenarios. For a company emerging from distress, from analyst neglect, or from a period of operational challenge, that repricing can be enormous relative to the size of the catalyst that triggered it.</p>`,
    related: ["narrative-shift", "asymmetry", "fundamental-catalyst"]
  },

  "speculative-framework": {
    term: "Speculative Framework (vs. Investment Framework)",
    category: "Position Trading",
    body: `
      <p>The distinction between speculating and investing is not primarily about holding period or risk tolerance. It is about what the return is expected to come from. A Buffett-style investment expects its return primarily from the long-term compounding of a business's intrinsic value, the actual earnings and cash flows the business generates over many years. The business itself is the source of return.</p>
      <p>A speculative framework, in the tradition of Druckenmiller, Tudor Jones, or Soros, expects its return primarily from the market changing its assessment of future expectations. The source of return is not the business compounding for decades. It is the gap between where the market is currently pricing the probability distribution of the company's future and where that probability distribution should be once the emerging reality is more widely recognized.</p>
      <p>This distinction matters for every decision: how you use financials (as confirmation of thesis quality versus as an intrinsic value calculation), what your exit logic is (expectation fully priced versus business permanently impaired), how you size (based on asymmetry of repricing opportunity versus confidence in long-term intrinsic value), and how long you hold (as long as the expectation gap exists versus essentially forever if the business keeps compounding).</p>`,
    related: ["asymmetry", "expectation-repricing", "reflexivity"]
  },
};

// ============================================================
// PANEL CONTROLLER
// ============================================================

(function() {
  // Build panel HTML once and inject into body
  const panelHTML = `
    <div class="gl-backdrop" id="glBackdrop"></div>
    <div class="gl-panel" id="glPanel" role="dialog" aria-modal="true" aria-labelledby="glPanelTitle">
      <div class="gl-panel-header">
        <div>
          <span class="gl-category" id="glPanelCategory"></span>
          <div class="gl-panel-title" id="glPanelTitle"></div>
        </div>
        <button class="gl-panel-close" id="glPanelClose" aria-label="Close definition">&#x2715;</button>
      </div>
      <div class="gl-panel-body" id="glPanelBody"></div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', panelHTML);

  const backdrop = document.getElementById('glBackdrop');
  const panel    = document.getElementById('glPanel');
  const titleEl  = document.getElementById('glPanelTitle');
  const catEl    = document.getElementById('glPanelCategory');
  const bodyEl   = document.getElementById('glPanelBody');
  const closeBtn = document.getElementById('glPanelClose');

  let activeKey  = null;
  let activeEl   = null;

  function openPanel(key, triggerEl) {
    const entry = GLOSSARY[key];
    if (!entry) return;

    // If same term, toggle closed
    if (activeKey === key) { closePanel(); return; }

    // Build body HTML
    let html = entry.body;
    if (entry.related && entry.related.length) {
      html += `<div class="gl-related">
        <span class="gl-related-label">Related concepts</span>
        <div class="gl-chips">`;
      entry.related.forEach(rel => {
        const relEntry = GLOSSARY[rel];
        if (relEntry) {
          html += `<span class="gl-chip" data-key="${rel}">${relEntry.term}</span>`;
        }
      });
      html += '</div></div>';
    }

    titleEl.textContent = entry.term;
    catEl.textContent   = entry.category;
    bodyEl.innerHTML    = html;
    bodyEl.scrollTop    = 0;

    // Wire related chips
    bodyEl.querySelectorAll('.gl-chip').forEach(chip => {
      chip.addEventListener('click', () => openPanel(chip.dataset.key, null));
    });

    // Update active state
    if (activeEl) activeEl.classList.remove('active');
    activeKey = key;
    activeEl  = triggerEl;
    if (activeEl) activeEl.classList.add('active');

    backdrop.classList.add('visible');
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
  }

  function closePanel() {
    backdrop.classList.remove('visible');
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    if (activeEl) activeEl.classList.remove('active');
    activeKey = null;
    activeEl  = null;
  }

  // Close triggers
  backdrop.addEventListener('click', closePanel);
  closeBtn.addEventListener('click', closePanel);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });

  // Delegate click for all .gl terms
  document.addEventListener('click', e => {
    const el = e.target.closest('.gl');
    if (!el) return;
    e.stopPropagation();
    openPanel(el.dataset.key, el);
  });

})();
