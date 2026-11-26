---
type: "query"
date: "2026-11-26T17:49:34.211613+00:00"
question: "Does the exact option text alias work as a bare phrase during a quiz, or only as answer <option text>?"
contributor: "graphify"
outcome: "corrected"
correction: "Use answer <option text> for the exact-text regression case; do not assert a bare option phrase."
source_nodes: ["answerCommand()", "parseRaw()", "QuizSystem", "GameEvent"]
---

# Q: Does the exact option text alias work as a bare phrase during a quiz, or only as answer <option text>?

## Answer

Only answer <option text> matches the current question option (trimmed, case-insensitive); a bare option phrase without the answer verb takes the friendly unknown path. Browser observation: 'integrated circuits' -> "I don't understand that."; '  answer   VACUUM TUBES  ' advanced the quiz.

## Outcome

- Signal: corrected
- Correction: Use answer <option text> for the exact-text regression case; do not assert a bare option phrase.

## Source Nodes

- answerCommand()
- parseRaw()
- QuizSystem
- GameEvent