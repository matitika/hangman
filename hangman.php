<?php
$categories = array(
    'vegetables' => array(
        "carrot",
        "potato",
        "tomato",
        "cucumber",
        "lettuce",
        "onion",
        "broccoli",
        "spinach",
        "bell pepper",
        "zucchini",
        "eggplant",
        "celery",
        "cabbage",
        "cauliflower",
        "green bean",
        "sweet potato",
        "radish",
        "asparagus"
    ),
    'animals' => array(
        "dog",
        "cat",
        "lion",
        "elephant",
        "tiger",
        "giraffe",
        "bear",
        "zebra",
        "monkey",
        "rabbit",
        "kangaroo",
        "penguin",
        "panda",
        "hippopotamus",
        "koala",
        "snake",
        "crocodile",
        "rhinoceros",
        "cheetah",
        "wolf"
    ),
    'countries' => array(
        "Argentina",
        "Brazil",
        "Canada",
        "China",
        "Egypt",
        "France",
        "Germany",
        "India",
        "Italy",
        "Japan",
        "Mexico",
        "Netherlands",
        "Russia",
        "Spain",
        "Sweden",
        "Turkey",
        "United Kingdom",
        "United States",
        "Australia",
        "South Africa"
    ),
    'fruits' => array(
        "apple",
        "banana",
        "orange",
        "strawberry",
        "grape",
        "watermelon",
        "pineapple",
        "kiwi",
        "peach",
        "mango",
        "pear",
        "cherry",
        "blueberry",
        "raspberry",
        "lemon",
        "lime",
        "coconut",
        "apricot",
        "fig",
        "pomegranate"
    )
);

function fetchCategories() {
    global $categories; // Access the global $categories variable
    return json_encode(array_keys($categories)); // Return the category keys
}

function generateWord($category) {
    global $categories; // Access the global $categories variable
    // Check if the category is valid
    if (isset($categories[$category])) {
        $words = $categories[$category];
        $randomIndex = array_rand($words);
        return $words[$randomIndex];
    } else {
        return false; // Invalid category
    }
}

if(isset($_GET['action']) && $_GET['action'] == 'fetchCategories') {
    echo fetchCategories();
    exit;
}

// Check if AJAX request to generate word
if(isset($_GET['action']) && $_GET['action'] == 'generateWord' && isset($_GET['category'])) {
    $category = $_GET['category'];
    echo $category;
    $word = generateWord($category);
    if ($word !== false) {
        echo json_encode(array('word' => strtoupper($word))); // Convert word to uppercase
    } else {
        echo json_encode(array('error' => 'Invalid category'));
    }
    exit;
}