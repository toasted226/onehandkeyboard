// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::sync::Mutex;
use std::collections::HashMap;

use onehandkeyboard::KeyboardLayout;

// Global state for config, stored in json
pub struct ConfigState(Mutex<Config>);
#[derive(Default, Serialize, Deserialize)]
pub struct Config {
    #[serde(skip_serializing)]#[serde(skip_deserializing)]setup: bool,
    map: Option<HashMap<String, Vec<String>>>,
    layout: KeyboardLayout,
}

// Used by on_text_change
#[derive(serde::Serialize)]
struct Words {
    index: usize,
    translated: Vec<String>
}

// Takes in the text in the textarea, uses the last word typed and looks it up in the dictionary.
// If matches are found, the words are sent back as a Vec<String> / string[] along with the index of where the word begins.
#[tauri::command]
fn on_text_change(state: tauri::State<ConfigState>, text: &str) -> Words {
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
fn letter_to_symbol(state: tauri::State<ConfigState>, letter: char) -> Option<char> {
    onehandkeyboard::get_symbol(&letter, &state.0.lock().unwrap().layout)
}

fn main() {
    tauri::Builder::default()
        .manage(ConfigState(Default::default()))
        .invoke_handler(tauri::generate_handler![
            new_dictionary, 
            on_text_change, 
            letter_to_symbol, 
            config_setup, 
            first_time_startup, 
            set_layout
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Creates the dictionary by reading the words file
// Expensive operation, causes 1-2 second freeze on startup
// TODO: Run async?
#[tauri::command]
async fn new_dictionary(state: tauri::State<'_, ConfigState>) -> Result<(), String> {
    if !state.0.lock().unwrap().setup {
        let words = onehandkeyboard::read_words();
        let layout = state.0.lock().unwrap().layout.clone();
        state.0.lock().unwrap().map = Some(onehandkeyboard::create_hashmap(&words, &layout));
        state.0.lock().unwrap().setup = true;
    }
    Ok(())
}

// Sets the keyboard layout
// TODO: Identify the keyboard layout used
// ^ If this is done it would be platform-specific and quite painful (e.g. winapi)
// For now, ask the user which layout they would like to use
#[tauri::command]
async fn config_setup(app: tauri::AppHandle<>, state: tauri::State<'_, ConfigState>) -> Result<(), String> {
    let mut filepath = app.path_resolver().app_config_dir().unwrap();
    let path = std::path::Path::new("config.json");
    filepath.push(path);

    match fs::read_to_string(filepath) {
        Ok(s) => {
            let conf: Config = match serde_json::from_str(&s) {
                Err(e) => return Err(String::from("Error: ".to_owned() + &e.to_string())),
                Ok(s) => s
            };
            println!("{}", conf.layout);
            state.0.lock().unwrap().layout = conf.layout;
            state.0.lock().unwrap().map = conf.map;
        },
        Err(e) => return Err(String::from("Error: ".to_owned() + &e.to_string())),
    }

    Ok(())
}

#[tauri::command]
async fn set_layout(app: tauri::AppHandle<>, state: tauri::State<'_, ConfigState>, layout_id: i32) -> Result<(), String> {
    let layout = match layout_id {
        0 => Some(KeyboardLayout::Qwerty),
        1 => Some(KeyboardLayout::Dvorak),
        _ => None
    };

    state.0.lock().unwrap().layout = layout.clone().unwrap();

    let mut filepath = app.path_resolver().app_config_dir().unwrap();
    let path = std::path::Path::new("config.json");
    filepath.push(path);

    let config = Config {
        setup: false,
        map: state.0.lock().unwrap().map.clone(),
        layout: layout.unwrap(),
    };

    let json = serde_json::to_string(&config);

    match json {
        Ok(s) => {
            match fs::write(filepath, s) {
                Err(e) => return Err(String::from("Error: ".to_owned() + &e.to_string())),
                Ok(_) => return Ok(())
            }
        },
        Err(e) => return Err(String::from("Error: ".to_owned() + &e.to_string()))
    };
}

#[tauri::command]
async fn first_time_startup(app: tauri::AppHandle<>) -> Result<bool, String> {
    let mut filepath = app.path_resolver().app_config_dir().unwrap();
    let path = std::path::Path::new("config.json");
    filepath.push(path);

    if let Ok(b) = filepath.try_exists() {
        Ok(!b)
    } else {
        Err(String::from("Failed to check for file"))
    }
}
