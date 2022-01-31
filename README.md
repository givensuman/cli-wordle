# 🤯 cli-wordle
### Play wordle in your terminal!

---

To play, run:
```bash
npx cli-wordle
```

Wordle is a game designed by Josh Wardle.
The game rules are simple:
- You have six tries to guess the hidden word.
- Your guess must be 5 letters! The puzzle will always be this length.
- If a letter is in the correct space, it will appear green. If it's the correct letter in the wrong space, it will appear yellow. If it's not in the word, it'll appear black.
  
This CLI tool was built with:

- typescript
- chalk
- chalk-animation
- figlet
- gradient-string
- prompts