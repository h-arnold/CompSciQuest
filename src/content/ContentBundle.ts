// Canonical bundle from application-and-ui.md §3.1.
import type { ActorDefinition } from './ActorDefinition';
import type { ActorState } from '../core/npcs/ActorState';
import type { ConversationNode } from '../core/npcs/ConversationNode';
import type { ConversationTopic } from '../core/npcs/ConversationTopic';
import type { HintSequence } from '../core/hints/HintSequence';
import type { Hazard } from '../core/hazards/Hazard';
import type { Puzzle } from '../core/puzzles/Puzzle';
import type { Quiz } from '../core/combat/Quiz';
import type { QuizQuestion } from '../core/combat/QuizQuestion';
import type { SpecTopicCatalogue } from '../core/scoring/SpecTopicCatalogue';
import type { AreaDefinition } from './AreaDefinition';
import type { Catalogue } from './Catalogue';
import type { ItemDefinition } from './ItemDefinition';
import type { RoomDefinition } from './RoomDefinition';
import type { WorldDefinition } from './WorldDefinition';

export interface ContentBundle {
  readonly worlds: Catalogue<WorldDefinition>;
  readonly areas: Catalogue<AreaDefinition>;
  readonly rooms: Catalogue<RoomDefinition>;
  readonly items: Catalogue<ItemDefinition>;
  readonly actors: Catalogue<ActorDefinition>;
  readonly actorStates: Catalogue<ActorState>;
  readonly conversationTopics: Catalogue<ConversationTopic>;
  readonly nodes: Catalogue<ConversationNode>;
  readonly quizzes: Catalogue<Quiz>;
  readonly questions: Catalogue<QuizQuestion>;
  readonly puzzles: Catalogue<Puzzle>;
  readonly hazards: Catalogue<Hazard>;
  readonly hints: Catalogue<HintSequence>;
  readonly specTopics: SpecTopicCatalogue;
}
