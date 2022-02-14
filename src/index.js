#!/usr/bin/env node

import prompts from 'prompts'
import chalk from 'chalk'
import chalkAnimation from 'chalk-animation'
import figlet from 'figlet'
import gradient from 'gradient-string'
import puzzleWords from './puzzleWords.js'
import validWords from './validWords.js'

const sleep = (ms = 1500) => new Promise(r => setTimeout(r, ms))

const inputPrompt = {
    type: 'text',
    name: 'guess',
    message: 'Enter a 5 letter word:',
    validate: value => {
        if (value.length != 5) return 'Word must be 5 letters.'
        else if (!validWords.includes(value)) return 'Not a recognized word.'
        return true
    }
}

const handleYellow = (guess, index, puzzle) => {
    // as a fallback from correct guesses
    //
    // If guess has duplicates and both are in wrong position and puzzle only has one letter, mark first as yellow
    // If guess has duplicates and both are in wrong position and puzzle has duplicates, mark both as yellow
    // If guess has duplicates and one is in wrong position and one is in correct position, mark wrong position as yellow
    // If guess has duplicates and one is in wrong position and puzzle has only one, mark wrong position as black

    const guessArray = guess.split('')
    const puzzleArray = puzzle.split('')

    const letterIsInGuessBefore = () => 
        guessArray.indexOf(guess[index]) < index

    const puzzleContainsLetterMultipleTimes = () =>
        puzzleArray.filter(letter => letter === guess[index]).length > 1

    const guessContainsLetterInCorrectLocation = () => {
        let contains = false
        puzzleArray.forEach((letter, puzzleIndex) => {
            if (letter === guess[puzzleIndex] && letter === guess[index]) {
                contains = true
            }
        })
        return contains
    }

    // true sets as yellow, false fallbacks to set as black
    if (puzzle.includes(guess[index])) {
        if (puzzleContainsLetterMultipleTimes()) return true
        else if (!puzzleContainsLetterMultipleTimes()) {
            if (letterIsInGuessBefore()) return false
            if (!letterIsInGuessBefore() && guessContainsLetterInCorrectLocation()) {
                return false
            }
            return true
        }
    }
    return false
}

const check = async (input, puzzle) => {
    let results = []
    input.split('').forEach((letter, index) => {
        let formattedLetter = ' ' + letter + ' '
        if (puzzle[index] === letter) {
            results.push(chalk.black.bold.bgGreen(formattedLetter))
        } else if (handleYellow(input, index, puzzle)) {
            results.push(chalk.black.bold.bgYellowBright(formattedLetter))
        } else {
            results.push(chalk.white.bold.bgBlackBright(formattedLetter))
        }
    })
    return results
}

const hello = async () => {
    figlet.text('CLI-WORDLE', (err, data) => {
        if (err) console.error('CLI-WORDLE: Title error: ' + err)
        console.log(gradient.pastel.multiline(data))
    })
    await sleep()
}

const rules = async () => {
    console.log('You have six tries to guess the hidden word.')
    await sleep(500)
    console.log('Your guess must be 5 letters! The puzzle will always be this length.')
    await sleep(500)
    console.log(`If a letter is in the correct space, it will appear ${chalk.black.bgGreen('green')}. If it's the correct letter in the wrong space, it will appear ${chalk.black.bgYellowBright('yellow')}. If it's not in the word, it'll appear ${chalk.white.bgBlackBright('black')}.`)
    await sleep()
    console.log("Let's begin! 👾")
    await sleep()
    console.log('\n')
}

const play = async () => {
    const puzzle = puzzleWords[Math.floor(Math.random() * puzzleWords.length)].toUpperCase()
    let tries = 0
    while (tries < 6) {
        const response = await prompts(inputPrompt)
        const guess = response.guess.toUpperCase()
        await check(guess, puzzle)
            .then(res => 
                res.forEach(letter => {
                    process.stdout.write(letter)
                    process.stdout.write(' ')
                })
            )
            .catch(err => console.error(err))
        process.stdout.write('\n')

        if (guess === puzzle) {
            console.log('\n')
            chalkAnimation.rainbow('You win! 🎉')
            await sleep()
            await playAgain()
        }
        
        await sleep(250)
        tries++
        if (tries < 6) console.log(`${tries}/6`)
    }
    console.log('\n')
    console.log('Game over!')
    console.log(`The correct word was: ${chalk.white.bold.bgBlackBright(' ' + puzzle + ' ')} 🤯`)
    await sleep()
    await playAgain()
}

const playAgain = async () => {
    console.log('\n')
    const response = await prompts({
        type: 'confirm',
        name: 'value',
        message: 'Play again? 🐓',
        initial: false
    })
    if (response.value) {
        console.log('\n')
        await play()
    }
    console.log('\n')
    console.log('Thanks for playing! 😀')
    process.exit(0)
}

const loop = async () => { 
    console.clear()
    await hello()
    await rules()
    await play()
}

process.on('SIGINT', () => {
    console.log('\n')
    console.log('Thanks for playing!')
    process.exit(0)
})

loop()