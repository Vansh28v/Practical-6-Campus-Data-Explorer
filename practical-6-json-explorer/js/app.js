import { fetchRecords } from "./data.js";
import { renderRecords } from "./render.js";

const pageSize = 6;
const state = { view: "events", allRecords: [], filteredRecords: [], page: 1 };
const config = {
    events: { title: "Campus events", description: "Upcoming sessions and activities.", filterLabel: "All categories", filterKey: "category", keys: ["title","category","location","description"] },
    students: { title: "Student profiles", description: "Sample profiles and areas of interest.", filterLabel: "All courses", filterKey: "course", keys: ["name","course","city","email","interests"] },
    faqs: { title: "Frequently asked questions", description: "Common student questions grouped by topic.", filterLabel: "All topics", filterKey: "category", keys: ["question","category","answer"] }
};

const tabs = document.querySelectorAll(".tab");
const title = document.getElementById("sectionTitle");
const description = document.getElementById("sectionDescription");
const count = document.getElementById("recordCount");
const search = document.getElementById("searchInput");
const filter = document.getElementById("filterSelect");
const sort = document.getElementById("sortSelect");
const status = document.getElementById("statusMessage");
const results = document.getElementById("results");
const pageInfo = document.getElementById("pageInfo");
const previous = document.getElementById("previousPage");
const next = document.getElementById("nextPage");

function setStatus(message, error = false) {
    status.textContent = message;
    status.className = error ? "status-message error" : "status-message";
}

function textFor(record, keys) {
    return keys.map(key => Array.isArray(record[key]) ? record[key].join(" ") : (record[key] ?? "")).join(" ").toLowerCase();
}

function fillFilters() {
    const settings = config[state.view];
    const values = [...new Set(state.allRecords.map(record => record[settings.filterKey]))]
        .filter(Boolean).sort((a, b) => String(a).localeCompare(String(b)));
    filter.replaceChildren(new Option(settings.filterLabel, "all"));
    values.forEach(value => filter.add(new Option(value, value)));
}

function sortName(record) {
    return record.title || record.name || record.question || "";
}

function sortDate(record) {
    if (record.date) return new Date(record.date).getTime();
    return Number(record.year ?? record.id);
}

function applyControls() {
    const settings = config[state.view];
    const query = search.value.trim().toLowerCase();
    const selected = filter.value;
    let list = state.allRecords.filter(record =>
        textFor(record, settings.keys).includes(query) &&
        (selected === "all" || record[settings.filterKey] === selected)
    );

    if (sort.value === "az") list.sort((a, b) => sortName(a).localeCompare(sortName(b)));
    if (sort.value === "za") list.sort((a, b) => sortName(b).localeCompare(sortName(a)));
    if (sort.value === "dateAsc") list.sort((a, b) => sortDate(a) - sortDate(b));
    if (sort.value === "dateDesc") list.sort((a, b) => sortDate(b) - sortDate(a));

    state.filteredRecords = list;
    state.page = 1;
    renderPage();
}

function renderPage() {
    const total = state.filteredRecords.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    state.page = Math.min(state.page, pages);
    const start = (state.page - 1) * pageSize;
    renderRecords(state.filteredRecords.slice(start, start + pageSize), state.view, results);
    count.textContent = `${total} record${total === 1 ? "" : "s"} found`;
    pageInfo.textContent = `Page ${state.page} of ${pages}`;
    previous.disabled = state.page <= 1;
    next.disabled = state.page >= pages;
    setStatus(total ? `Showing ${start + 1}–${Math.min(start + pageSize, total)} of ${total} records.` : "No records match your search.");
}

async function loadView(view) {
    state.view = view;
    state.page = 1;
    title.textContent = config[view].title;
    description.textContent = config[view].description;
    results.replaceChildren();
    setStatus("Loading data…");
    count.textContent = "Loading…";
    tabs.forEach(tab => {
        const active = tab.dataset.view === view;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-selected", String(active));
    });
    search.value = "";
    sort.value = "default";
    search.disabled = filter.disabled = sort.disabled = true;

    try {
        state.allRecords = await fetchRecords(view);
        fillFilters();
        filter.value = "all";
        search.disabled = filter.disabled = sort.disabled = false;
        applyControls();
    } catch (error) {
        state.allRecords = state.filteredRecords = [];
        count.textContent = "Data unavailable";
        results.innerHTML = '<div class="empty-state">The records could not be loaded.</div>';
        setStatus(`${error.message} Run this project using VS Code Live Server.`, true);
        pageInfo.textContent = "Page 1";
        previous.disabled = next.disabled = true;
    }
}

tabs.forEach(tab => tab.addEventListener("click", () => loadView(tab.dataset.view)));
search.addEventListener("input", applyControls);
filter.addEventListener("change", applyControls);
sort.addEventListener("change", applyControls);
previous.addEventListener("click", () => { if (state.page > 1) { state.page--; renderPage(); } });
next.addEventListener("click", () => {
    if (state.page < Math.ceil(state.filteredRecords.length / pageSize)) { state.page++; renderPage(); }
});

loadView("events");
