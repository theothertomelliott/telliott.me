# Degraded is better than down

Preventing outages by making reasonable tradeoffs.

Tell a story from Yext with multiple regions. Nobody complained when we had them down.

Example failures:
* Overload
* Bad deploys
* Maintenance downtime
* Regional or zonal outages

Can't avoid failures - we have to deploy eventually to patch CVEs.

Degradadation:
* Higher latency
* Read-only state
* Load shedding
* Rate limiting
* Slow eventual consistency
* Disabled features

What can you *not* compromise on?

---

Abstract:

Everything breaks. Bad deploys, traffic spikes, cloud outages, eventually some component will go down. When architecting a system, our instinct can be to try and eliminate any possible impact. But this can add complexity that paradoxically makes failures more likely, or make recovery harder.

Let's look at an alternative: embracing degradation to cushion against a total outage. We'll look at a real world example of multi-region routing, explore a catalogue of failure modes and trade-offs that can blunt them, and highlight when compromise isn't an option.

Fail safe without having to be failure-proof!

---

# AI notes

Generated for research / drafting. Conference target: [SREday NYC Q4 2026](https://sreday.com/2026-nyc-q4/) (Datadog HQ, Nov 7, 2026). Agenda checked against the published schedule as of this note.

## Conference agenda overlap

Agenda is heavily AI-agent / observability / LLM-ops. Classic “brownout vs blackout” reliability is underrepresented — that’s an opportunity for **Degraded is better than down**.

| Sketch topic | Overlap risk | Closest talks | Implication |
|---|---|---|---|
| **Degraded is better than down** | Low | *Paying for the Worst Day: Sizing Standby from RTO* (Experian) — regional DR / standby capacity tradeoffs; *Actionable Observability* (NYT) — SLOs / error budgets as the language for acceptable degradation | Strongest unique angle. Differentiate: feature/quality brownouts and intentional blast-radius, not just standby sizing or SLO theory. |
| **Backup plans when things break** | Low–medium | *Agents Can Write Migrations. They Shouldn’t Ship Them* (Tiger Data) — production guardrails; *Agent Toolkit… on AWS* — blast radius / auditability for agent deploys | Break-glass CI/CD and laptop deploys are largely unclaimed. Avoid framing as “AI deploy governance”; keep it human emergency process + compliance story (your Yext / Nomad / Jira pattern). |
| **Don’t page me, bro!** | Medium | *You Build It, You Run It Is Dead* (Dalton AI) — who holds the pager when the author is an agent; *Who Stops the AI Agent at 2 AM?* (Guild Systems) — intervention / kill switches | Human onboarding to paging is still distinct if you stay on training, context, and ownership — not agent governance. Expect audience to have heard adjacent “who pages?” framing that day. |
| **Battling AI complacency** | High | *SRE in the Era of AI* (Qovery); *Who Stops the AI Agent at 2 AM?*; *You Build It, You Run It Is Dead*; *Agents Can Write Migrations…*; *Green Dashboards, Wrong Cows*; *Production Has Observability. Your Coding Agent Doesn’t* | Crowded track. Only pursue if you have sharp, personal failure stories that aren’t “agents need guardrails” (already the day’s theme). |

**Recommendation for this CFP:** lead with **Degraded is better than down**. It’s the clearest gap on the agenda and fits a practitioner story (Yext multi-region). Use break-glass or onboarding as backup abstracts if needed. Soft-pedal or defer AI-complacency unless you can stake a narrow claim the other talks don’t cover.

## Degraded is better than down — expanded notes

### Structure suggestion

1. What’s failing? (cause)
2. What can we give up first? (ranked features / SLOs)
3. What must stay true? (non-negotiables)
4. Design the brownout, measure when you’re in it, practice entering it (unused degradation paths fail when you need them)

Distinguish **automatic** degradation (shed when CPU/queue high) from **intentional** tradeoffs (drain a region for blast radius / maintenance). Your Yext story is intentional *scope reduction*: localized unavailability as a controlled degradation of global availability.

### Failure → degradation pairing

| Failure / pressure | Degradations often better than down |
|---|---|
| Overload / traffic spike | Early 503 load shed; priority queues (interactive > batch); cheaper algorithms; disable enrichment; tarpitting |
| Bad deploy / bad config | Feature flags / kill switches; canary hold; shift traffic off bad shard; freeze writes / read-only while rolling back |
| Planned maintenance | Drain one AZ/region; accept sticky-session breakage; stale reads OK; reduce write fan-out |
| Regional / zonal outage | Fail over reads; cached/static; higher latency; shed non-critical writes; static stability (pre-provisioned capacity) |
| Dependency failure | Soft dependency: cache / default / null fallback; circuit open → degrade feature, keep core path |
| Data / storage pressure | Read-only; reject mutations; last-known-good; pause competing background jobs |
| Gray / partial failure | Timeouts + fail-fast; stop retry amplification; don’t keep feeding a sick backend |
| Cascading failure / retry storm | Upstream drop of retries; LIFO/CoDel for stale work; client backoff; edge admission control |
| Capacity / cost cliff | Rate limits that *throttle* (refill) vs hard cliff; tenant/priority fairness; disable expensive features first |
| Human / process failure | Documented emergency levers; known “acceptable brownout” vs full stop |

### Extra degradation types (beyond the sketch list)

* Quality reduction (smaller index, lower bitrate, less personalization)
* Freshness trade (stale cache, delayed consistency)
* Scope reduction (subset of tenants / regions / features) — Yext multi-region fit
* Mode change (read-only, browse-only, checkout-only)
* Admission control (reject new sessions; protect logged-in over anonymous)
* Fallback defaults (e.g. Netflix: start video from beginning if bookmark service is down)
* Bulkheads (isolate pools so one dependency can’t exhaust everything)
* Emergency levers (explicit ops controls to shed intentionally)

### Non-negotiables worth probing

* Auth / authorization correctness
* Money / inventory / once-only side effects
* Durability of accepted writes (don’t pretend a write succeeded)
* Safety / compliance obligations
* Recovery path: don’t pick a mitigation riskier than the outage

Related in-repo aside: `src/blog/20260320-how-friendly-are-your-rate-limits.md` — refill/throttle vs hard cliff as a user-visible degradation choice.

### Research materials

**Books / chapters**

* Google SRE book — [Addressing Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/) (load shedding vs graceful degradation), [Handling Overload](https://sre.google/sre-book/handling-overload/), [Service Best Practices](https://sre.google/sre-book/service-best-practices/)
* SRE Workbook — [Managing Load](https://sre.google/workbook/managing-load/)
* Michael Nygard — *Release It!* (circuit breaker, bulkhead, timeouts)
* *Surviving the Spike* — [Degraded Mode Design](https://earezki.com/books/surviving-the-spike/ch19/) (critical vs deferrable feature ranking)

**Architecture guides**

* Google Cloud — [Design for graceful degradation](https://docs.cloud.google.com/architecture/framework/reliability/graceful-degradation)
* AWS Well-Architected — [REL05-BP01 graceful degradation](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_mitigate_interaction_failure_graceful_degradation.html); emergency levers (REL05-BP07)
* Amazon Builders’ Library — [Static stability using Availability Zones](https://aws.amazon.com/builders-library/static-stability-using-availability-zones/) (pairs with multi-region story)
* Azure — [Throttling pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/throttling)
* arc42 — [Feature Degradation](https://quality.arc42.org/approaches/feature-degradation)

**Essays / papers / postmortems**

* Google — [20 years of SRE lessons](https://sre.google/resources/practices-and-processes/twenty-years-of-sre-lessons-learned/) (intentionally degrade; mitigation risk vs outage severity)
* Netflix Chaos Engineering paper — [arXiv](https://arxiv.org/pdf/1702.05843) (fallbacks as availability)
* James Hamilton — *On Designing and Deploying Internet-Scale Services*; Colyer: [Morning Paper](https://blog.acolyer.org/2016/09/12/on-designing-and-deploying-internet-scale-services/)
* Richard Cook — *How Complex Systems Fail*; Colyer: [Morning Paper](https://blog.acolyer.org/2016/02/10/how-complex-systems-fail/)
* Gray failure — [Morning Paper](https://blog.acolyer.org/2017/06/15/gray-failure-the-achilles-heel-of-cloud-scale-systems/)
* Meta — [2010 config/cache feedback outage](https://engineering.fb.com/2010/09/23/uncategorized/more-details-on-today-s-outage/); [2021 backbone outage](https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/) (storm drills / careful ramp-up)