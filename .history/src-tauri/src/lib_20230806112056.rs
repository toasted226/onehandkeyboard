use std::fs;
use std::collections::HashMap;

#[derive(PartialEq)]
pub enum KeyboardLayout {
    Dvorak,
    Qwerty,
}

const KEYBOARD_LAYOUT: KeyboardLayout = KeyboardLayout::Dvorak;
const FILE_PATH: &str = "assets/words.txt";

// Reads and filters all the words in the words file
pub fn read_words() -> Vec<String> {
    fs::read_to_string(FILE_PATH)
        .unwrap()
        .lines()
        .map(|s| {
            if s.chars().next().unwrap().is_uppercase() {
                s.to_lowercase()
            } else {
                s.to_string()
            }
        })
        //.filter(|s| s.chars().all(|x| x.is_alphabetic()))
        .map(|s| s.to_lowercase().to_string())
        .collect()
}

// Converts char to its onehand equivalent
pub fn to_onehand_char(c: &char) -> char {
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

// Converts word to its onehand equivalent
pub fn to_onehand_word(word: &str) -> String {
    word.chars().map(|c| to_onehand_char(&c)).collect()
}

// Builds dictionary as a hashmap from words
pub fn create_hashmap(words: &[String]) -> HashMap<String, Vec<String>> {
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

pub fn get_translations(word: &str, map: &HashMap<String, Vec<String>>) -> Vec<String> {
    match map.get(word.trim()) {
        Some(word) => word.clone(),
        None => vec![word.to_string()],
    }
}


// Gets the indices of all the characters that are in uppercase
pub fn get_uppercase_indices(word: &str) -> Vec<usize> {
    let mut indices: Vec<usize> = Vec::new();
    let mut current_index: usize = 0;

    for c in word.chars() {
        if c.is_uppercase() {
            indices.push(current_index);
        }
        current_index += 1;
    }

    indices
}

// Change the case to uppercase for every word according to which indices were marked as uppercase from the original word
pub fn change_words_case(words: &[String], indices: &[usize]) -> Vec<String> {
    let mut v = Vec::new();

    for word in words {
        let mut mword = String::new();
        let mut index = 0;
        for c in word.chars() {
            if indices.contains(&index) {
                mword.push(c.to_ascii_uppercase());
            } else {
                mword.push(c);
            }
            index += 1;
        }
        v.push(mword);
    }

    v
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

    #[test]
    fn translates() {
        let words = read_words();
        let map = create_hashmap(&words);
        let translations = get_translations("ia", &map);

        assert_eq!(translations, vec!["is"]);
    }
}
