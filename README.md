# One Hand Keyboard

This application allows you to touch type with one hand, with only one side of the keyboard - meaning you don't have to spread your fingers across the entire keyboard layout.

### How does it work?

If you take the letters your right hand is responsible for and mirror it over those which your left hand is responsible for, you can type with only your left hand and the application will try to 'guess' what you're actually trying to write.

For example, on a Qwerty keyboard layout the left-hand letters correspond to the right-hand letters as follows:
| Original | Mapped |
|----------|--------|
| A        | ;      |
| S        | L      |
| D        | K      |
| F        | J      |

On a Dvorak layout:
| Original | Mapped |
|----------|--------|
| A        | S      |
| O        | N      |
| E        | T      |
| U        | H      |

It 'guesses' by looking up a dictionary of words in the new one-handed equivalent, and shows a list of options to choose from.

### Roadmap
- Allow the user to change keyboard layout (automatic?)
- Allow the user to add custom entries to the dictionary
- Keep track of commonly selected words to bump them to the top of the list
- Implement right-handed-typing mode
