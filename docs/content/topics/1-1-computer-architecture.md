# Topic file: 1.1 Computer architecture — parked

**Status: parked, not briefed.** This file preserves the detail from the originally
approved bible after the user chose 1.2.1 Data representation as the first zone.
Nothing here is deleted: the area, topics, rooms, PDG nodes, IDs and aliases are
reserved for when this zone is scoped. No writer may use this file until the user
approves a bible revision that promotes it.

Overarching rules and the master ID/alias registry are in
`docs/content/content-bible.md`.

## 1. Scope

- Area ID: `area-1-1-computer-architecture`
- Purpose: the physical machine as a place — workbench, registers, cache, storage,
  peripherals and recycling.
- Pillars served: P-b (the machine is a place), P-c (competence opens doors), P-e
  (oversight matters: hardware ethics, history and e-waste).
- Not the first zone. Its former `east → room-cpu-lab` exit from
  `room-entry-interface` is now locked until this zone is briefed; the opening exits
  east to `room-switch-floor` instead.

## 2. Spec references (parked)

| Spec topic ID | Spec reference |
| --- | --- |
| `computer-components` | 1.1.1 Components: motherboard, CPU, PSU, input/output devices, expansion cards, GPU, cooling, connectivity ports |
| `von-neumann-architecture` | 1.1.1 Von Neumann architecture; address, data and control buses |
| `fetch-decode-execute` | 1.1.1 FDE cycle; CU, ALU, cache; PC, CIR, ACC, MAR, MDR |
| `cpu-performance` | 1.1.1 cache size and levels, clock speed, number of cores |
| `hardware-ethics-and-history` | 1.1.1 "should be aware of": legal, ethical and social, environmental, energy efficiency, historical development from early transistors to modern microprocessors |
| `peripheral-devices` | 1.1.2 function and appropriate use of input and output devices |
| `primary-storage` | 1.1.3 RAM, ROM, flash memory, cache memory, virtual memory |
| `secondary-storage` | 1.1.3 optical, magnetic, solid state, cloud; capacity, durability, reliability, read/write speed, cost per unit |
| `storage-technology-development` | 1.1.3 "should be aware of" developments in storage technologies and capacity over time |

`hardware-ethics-and-history` owns the full 1.1.1 historical-development treatment.
The first zone's `switch-to-bit` prologue is a separate, unscored awareness-depth
beat; do not merge the two.

## 3. Parked room cluster (hub-and-spoke)

| Room ID | Purpose | Exits |
| --- | --- | --- |
| `room-cpu-lab` | Zone hub and former `startRoomId` | `west → room-component-workbench`; `north → room-register-rail` when `bus-mapped`; `east → room-cache-vault` when `fde-decoded`; `down → room-storage-bays`; `up → room-peripheral-dock`; `south → room-hardware-recycling` when `storage-sorted`; `out → room-entry-interface` |
| `room-component-workbench` | Motherboard, PSU, expansion cards, cooling, ports | `out → room-cpu-lab` |
| `room-register-rail` | Registers, buses, Von Neumann layout | `out → room-cpu-lab` |
| `room-cache-vault` | FDE cycle, cache levels, CU/ALU | `out → room-cpu-lab` |
| `room-storage-bays` | Primary and secondary storage | `out → room-cpu-lab` |
| `room-peripheral-dock` | Input and output devices | `out → room-cpu-lab` |
| `room-hardware-recycling` | Hardware ethics, history, e-waste ("should be aware of") | `out → room-cpu-lab` |

## 4. Parked PDG sketch

| Puzzle ID | `dependsOn` | Produces |
| --- | --- | --- |
| `puzzle-map-the-bus` | — | `item-bus-map`; flag `bus-mapped`; topic `computer-components` |
| `puzzle-route-the-buses` | `puzzle-map-the-bus` | flag `buses-routed`; topic `von-neumann-architecture` |
| `puzzle-decode-fde` | `puzzle-route-the-buses` | flag `fde-decoded`; topic `fetch-decode-execute` |
| `puzzle-tune-cache` | `puzzle-decode-fde` | flag `cache-tuned`; topic `cpu-performance` |
| `puzzle-partition-memory` | `puzzle-sort-storage` | flag `memory-partitioned`; topic `primary-storage` |
| `puzzle-sort-storage` | `puzzle-map-the-bus` | flag `storage-sorted`; topic `secondary-storage` |
| `puzzle-match-peripheral` | `puzzle-map-the-bus` | flag `peripheral-matched`; topic `peripheral-devices` |
| `puzzle-audit-hardware` | `puzzle-sort-storage` | flag `hardware-audited`; topic `hardware-ethics-and-history` |

`storage-technology-development` is "should be aware of" (1.1.3) and should be a
teaching/retrieval beat attached to `puzzle-sort-storage`, not a separate scored
puzzle, unless a future brief decides otherwise.

## 5. Parked IDs

Rooms, items, puzzles, quizzes (`quiz-components`, `quiz-fde-cycle`, `quiz-storage`,
`q-ca-01` … `q-ca-18`) and hints (`hint-bus-map`, `hint-fde-cycle`,
`hint-storage-sort`) are in the root bible master registry §9 with their aliases.
No hazard was selected for this zone; choose from the game-wide palette when it is
briefed.
