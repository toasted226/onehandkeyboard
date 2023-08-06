// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::{Mutex, mpsc};
use std::collections::HashMap;
use std::thread;

use onehandkeyboard::KeyboardLayout;

pub struct DictionaryState(Mutex<Dictionary>);
#[derive(Default)]
pub struct Dictionary {
    map: Option<HashMap<String, Vec<String>>>,
}

pub struct SelectedLayoutState(Mutex<SelectedLayout>);

#[derive(Default)]
pub struct SelectedLayout {
    pub layout: onehandkeyboard::KeyboardLayout
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

    // Get translations if dictionary has been created
    let mut translations = Vec::new();
    if let Some(map) = &state.0.lock().unwrap().map {
        translations = onehandkeyboard::get_translations(&original, map);
    }

    // Check if the word has uppercase characters and match returned words to that case
    let word = trimmed_text[index..].trim();
    let indices = onehandkeyboard::get_uppercase_indices(word);
    // This is an expensive operation [O(n^3)], only perform if necessary
    if indices.len() > 0 {
        translations = onehandkeyboard::change_words_case(&translations, &indices);
    }

    Words { index, translated: translations }
}

#[tauri::command]
fn letter_to_symbol(state: tauri::State<SelectedLayoutState>, letter: char) -> Option<char> {
    onehandkeyboard::get_symbol(&letter, &state.0.lock().unwrap().layout)
}

fn main() {
    tauri::Builder::default()
        .manage(DictionaryState(Default::default()))
        .invoke_handler(tauri::generate_handler![new_dictionary, on_text_change, letter_to_symbol, layout_init])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// This function is called first from the frontend
// Creates the dictionary by reading the words file
// Expensive operation, causes 1-2 second freeze on startup
// TODO: Run async?
#[tauri::command]
fn new_dictionary(state: tauri::State<DictionaryState>, layout_state: tauri::State<SelectedLayoutState>) {
    let words = onehandkeyboard::read_words();
    state.0.lock().unwrap().map = Some(onehandkeyboard::create_hashmap(&words, layout_state.0.lock().unwrap().layout));

    // let (sender, receiver) = mpsc::channel();
    // let layout = layout_state.0.lock().unwrap().layout.clone();

    // thread::spawn(move || {
    //     let words = onehandkeyboard::read_words();
    //     let hashmap = onehandkeyboard::create_hashmap(&words, &layout);

    //     // Send the created hashmap to the main thread
    //     sender.send(hashmap).unwrap();
    // });

    // let hashmap = receiver.recv().unwrap();

    // state.0.lock().unwrap().map = Some(hashmap);
}

#[tauri::command]
fn layout_init(state: tauri::State<SelectedLayoutState>) {
    state.0.lock().unwrap().layout = KeyboardLayout::Dvorak;
}
