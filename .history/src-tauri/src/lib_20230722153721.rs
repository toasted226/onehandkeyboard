use std::fs;
use std::collections::HashMap;

const FILE_PATH = "/assets/words.txt";

pub fn read_words() -> Vec<String> {
    fs::read_to_string("words.txt")
        .unwrap()
        .lines()
        .filter(|s| s.chars().all(|x| x.is_alphabetic()))
        .map(|s| s.to_lowercase().to_string())
        .collect()
}

pub fn to_onehand_char(c: &char) -> char {
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

pub fn to_onehand_word(word: &str) -> String {
    word.chars().map(|c| to_onehand_char(&c)).collect()
}

pub fn create_hashmap(words: &[String]) -> HashMap<String, String> {
    let mut map: HashMap<String, String> = HashMap::new();

    for word in words {
        map.insert(to_onehand_word(&word), word.clone());
    }

    map
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn first_word_correct() {
        let words = read_words();
        assert_eq!(words[0], String::from("a"));
    }
}










