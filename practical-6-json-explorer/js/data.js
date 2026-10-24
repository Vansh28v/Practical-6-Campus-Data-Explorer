const DATA_FILES = {
    events: "./data/events.json",
    students: "./data/students.json",
    faqs: "./data/faqs.json"
};

export async function fetchRecords(view) {
    const response = await fetch(DATA_FILES[view]);
    if (!response.ok) {
        throw new Error(`Could not load ${view} data (HTTP ${response.status}).`);
    }
    const records = await response.json();
    if (!Array.isArray(records)) {
        throw new Error("The JSON data must contain an array of records.");
    }
    return records;
}
