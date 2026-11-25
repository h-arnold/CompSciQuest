// Named C7 red tests; the assertions live in the per-domain case modules
// (npcTopicOverlapPairCases, -ConditionCases and -HandoffCases).
import { describe, expect, it } from 'vitest';
import {
  gNpc01,
  gNpc02,
  gNpc03,
  gNpc04,
  gNpc05,
  gNpc19,
  gNpc20,
  gNpc21,
  gNpc22,
} from './npcTopicOverlapPairCases';
import {
  gNpc06,
  gNpc07,
  gNpc08,
  gNpc09,
  gNpc10,
  gNpc11,
  gNpc12,
  gNpc13,
  gNpc14,
} from './npcTopicOverlapConditionCases';
import { gNpc15, gNpc16, gNpc17, gNpc18 } from './npcTopicOverlapHandoffCases';

const EMPTY = undefined;

describe('C7 npc topic-overlap gate (content-rules.md C7, §7)', () => {
  it('G-NPC-01: compatible ask topics with disjoint objectIds are one pair finding', async () => {
    expect(await gNpc01()).toBe(EMPTY);
  });
  it('G-NPC-02: ask/tell free text overlaps across verbs and with askTell', async () => {
    expect(await gNpc02()).toBe(EMPTY);
  });
  it('G-NPC-03: catch-all ask/tell topics are excluded by their empty objectIds', async () => {
    expect(await gNpc03()).toBe(EMPTY);
  });
  it('G-NPC-04: give/show pairs need the same verb and intersecting itemIds', async () => {
    expect(await gNpc04()).toBe(EMPTY);
  });
  it('G-NPC-05: command keyword topics overlap; special topics stay outside C7', async () => {
    expect(await gNpc05()).toBe(EMPTY);
  });
  it('G-NPC-06: a literal and its not complement are exclusive', async () => {
    expect(await gNpc06()).toBe(EMPTY);
  });
  it('G-NPC-07: single-valued position, state and node literals prove exclusivity', async () => {
    expect(await gNpc07()).toBe(EMPTY);
  });
  it('G-NPC-08: counter complements are exclusive only on the same key', async () => {
    expect(await gNpc08()).toBe(EMPTY);
  });
  it('G-NPC-09: exclusivity lifts through all/any/not without false positives', async () => {
    expect(await gNpc09()).toBe(EMPTY);
  });
  it('G-NPC-10: all: [] is always active; any: [] is never active', async () => {
    expect(await gNpc10()).toBe(EMPTY);
  });
  it('G-NPC-11: unprovable condition pairs are reported rather than guessed', async () => {
    expect(await gNpc11()).toBe(EMPTY);
  });
  it('G-NPC-12: the accepted clerk topics report the plain-trio overlap', async () => {
    expect(await gNpc12()).toBe(EMPTY);
  });
  it('G-NPC-13: a node topic is the earlier pair member in one finding', async () => {
    expect(await gNpc13()).toBe(EMPTY);
  });
  it('G-NPC-14: proven-exclusive pairs stay silent rather than blanket-reporting', async () => {
    expect(await gNpc14()).toBe(EMPTY);
  });
  it('G-NPC-15: a pair finding carries the canonical shape and wording', async () => {
    expect(await gNpc15()).toBe(EMPTY);
  });
  it('G-NPC-16: the content:validate module path enables the clerk check', async () => {
    expect(await gNpc16()).toBe(EMPTY);
  });
  it('G-NPC-17: npc-content stays deferred from boot validation', async () => {
    expect(await gNpc17()).toBe(EMPTY);
  });
  it('G-NPC-18: the message names no tie-break and runtime order is declaration order', async () => {
    expect(await gNpc18()).toBe(EMPTY);
  });
  it('G-NPC-19: give/show is not compared with free-text-class topics', async () => {
    expect(await gNpc19()).toBe(EMPTY);
  });
  it('G-NPC-20: one node list exempts a pair; two lists and actor topics do not', async () => {
    expect(await gNpc20()).toBe(EMPTY);
  });
  it('G-NPC-21: keyword overlap mirrors hasKeyword equality and phrase words', async () => {
    expect(await gNpc21()).toBe(EMPTY);
  });
  it('G-NPC-22: the C7 check is opt-in for validateCards and on for the tools', async () => {
    expect(await gNpc22()).toBe(EMPTY);
  });
});
