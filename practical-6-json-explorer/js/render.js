function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
}

function eventCard(item) {
    return `<article class="data-card">
        <div class="card-meta"><span class="category-label">${escapeHTML(item.category)}</span><span class="card-id">#${item.id}</span></div>
        <h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description)}</p>
        <p class="card-detail">${escapeHTML(item.date)} · ${escapeHTML(item.time)}</p>
        <p class="card-detail">Location: ${escapeHTML(item.location)}</p>
    </article>`;
}

function studentCard(item) {
    return `<article class="data-card">
        <div class="card-meta"><span class="category-label">${escapeHTML(item.course)}</span><span class="card-id">#${item.id}</span></div>
        <h3>${escapeHTML(item.name)}</h3><p class="card-detail">Year ${item.year} · ${escapeHTML(item.city)}</p>
        <p>${escapeHTML(item.email)}</p><div class="interest-list">${item.interests.map(x => `<span>${escapeHTML(x)}</span>`).join("")}</div>
    </article>`;
}

function faqCard(item) {
    return `<article class="data-card">
        <div class="card-meta"><span class="category-label">${escapeHTML(item.category)}</span><span class="card-id">#${item.id}</span></div>
        <h3>${escapeHTML(item.question)}</h3><p>${escapeHTML(item.answer)}</p>
    </article>`;
}

const renderers = { events: eventCard, students: studentCard, faqs: faqCard };

export function renderRecords(records, view, target) {
    if (!records.length) {
        target.innerHTML = '<div class="empty-state">No matching records. Try changing your search or filter.</div>';
        return;
    }
    target.innerHTML = records.map(renderers[view]).join("");
}
