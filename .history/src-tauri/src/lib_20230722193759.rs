use std::fs;
use std::collections::HashMap;
use std::sync::OnceLock;

#[derive(PartialEq)]
enum KeyboardLayout {
    Dvorak,
    Qwerty,
}

const KEYBOARD_LAYOUT: KeyboardLayout = KeyboardLayout::Dvorak;
const FILE_PATH: &str = "assets/words.txt";
static DICTIONARY: OnceLock<HashMap<String, Vec<String>>> = Once::new();

pub fn read_words() -> Vec<String> {
    fs::read_to_string(FILE_PATH)
        .unwrap()
        .lines()
        .filter(|s| s.chars().all(|x| x.is_alphabetic()))
        .map(|s| s.to_lowercase().to_string())
        .collect()
}

fn to_onehand_char(c: &char) -> char {
    if KEYBOARD_LAYOUT == KeyboardLayout::Dvorak {
        match c {
            'h' => 'u',
            't' => 'e',
            'n' => 'o',
            's' => 'a',
            'g' => 'p',
            'c' => '.',
            'r' => ',',
            'l' => '\'',
            'm' => 'k',
            'w' => 'j',
            'v' => 'q',
            'z' => ';',
            'f' => 'y',
            'd' => 'i',
            'b' => 'x',
            c => *c,
        }
    }
    else {
        match c {
            'j' => 'f',
            'k' => 'd',
            'l' => 's',
            ';' => 'a',
            'u' => 'r',
            'i' => 'e',
            'o' => 'w',
            'p' => 'q',
            'm' => 'v',
            ',' => 'c',
            '.' => 'x',
            '/' => 'z',
            'y' => 't',
            'h' => 'g',
            'n' => 'b',
            c => *c,
        }
    }
}

pub fn to_onehand_word(word: &str) -> String {
    word.chars().map(|c| to_onehand_char(&c)).collect()
}

fn create_hashmap(words: &[String]) -> HashMap<String, Vec<String>> {
    let mut map: HashMap<String, Vec<String>> = HashMap::new();

    for word in words {
        let key = to_onehand_word(&word);
        let value = word.clone();
        
        if let Some(v) = map.get_mut(&key) {
            v.push(value);
        } else {
            map.insert(key, vec![value]);
        }
    }

    map
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn reads_words() {
        let words = read_words();

        assert!(words.len() > 0);
    }

    #[test]
    fn first_word_correct() {
        let words = read_words();
        assert_eq!(words[0], String::from("a"));
    }
}
