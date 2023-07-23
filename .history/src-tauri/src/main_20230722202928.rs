// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{sync::Mutex, collections::HashMap};

pub struct DictionaryState(Mutex<Dictionary>);
#[derive(Default)]
pub struct Dictionary {
    map: HashMap<String, Vec<String>>,
}

#[tauri::command]
fn on_text_change(state: tauri::State<DictionaryState>, text: &str) -> String {
    let mut new_text = String::new();
    let trimmed_text = text.trim();

    if let Some(index) = trimmed_text.rfind(|c: char| c == ' ' || c == '\n') {
        let word = &trimmed_text[index + 1..].trim();
        
    }

    let translations = onehandkeyboard::get_translations(word, &state.0.lock().unwrap().map);
        new_text.push_str(translations[0].as_str());

    new_text
}

fn main() {
    tauri::Builder::default()
        .manage(DictionaryState(Default::default()))
        .invoke_handler(tauri::generate_handler![new_dictionary, on_text_change])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn new_dictionary(state: tauri::State<DictionaryState>) {
    let words = onehandkeyboard::read_words();
    state.0.lock().unwrap().map = onehandkeyboard::create_hashmap(&words);
}
