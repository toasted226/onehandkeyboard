// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{sync::Mutex, collections::HashMap};

pub struct DictionaryState(Mutex<Dictionary>);
#[derive(Default)]
pub struct Dictionary {
    map: HashMap<String, Vec<String>>,
}

#[derive(serde::Serialize)]
struct Words {
    index: usize,
    translated: Vec<String>
}

// This function is called from the frontend
// Takes in the text in the textarea, uses the last word typed and looks it up in the dictionary.
// If matches are found, the words are sent back as a Vec<String> / string[] along with the index of where the word begins.
#[tauri::command]
fn on_text_change(state: tauri::State<DictionaryState>, text: &str) -> Words {
    let mut index = 0;
    let trimmed_text = text.trim();

    // Find the index at which the word begins
    if let Some(i) = trimmed_text.rfind(|c: char| c == ' ' || c == '\n') { 
        index = i;
    }

    // Take the lowercase word and look it up
    let original = trimmed_text[index..].trim().to_lowercase();
    let mut translations = onehandkeyboard::get_translations(&original, &state.0.lock().unwrap().map);

    // Check if the word has uppercase characters and match returned words to that case
    let word = trimmed_text[index..].trim();
    let indices = onehandkeyboard::get_uppercase_indices(word);
    // This is an expensive operation [O(n^3)], only perform if necessary
    if indices.len() > 0 {
        translations = onehandkeyboard::change_words_case(&translations, &indices);
    }

    Words { index, translated: translations }
}

fn main() {
    tauri::Builder::default()
        .manage(DictionaryState(Default::default()))
        .invoke_handler(tauri::generate_handler![new_dictionary, on_text_change])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// This function is called first from the frontend
// Creates the dictionary by reading the words file
// Expensive operation, causes 1-2 second freeze on startup
// TODO: Optimisation
#[tauri::command]
fn new_dictionary(state: tauri::State<DictionaryState>) {
    let words = onehandkeyboard::read_words();
    state.0.lock().unwrap().map = onehandkeyboard::create_hashmap(&words);
}
