# Practical 6 - Report Notes

## Problem Definition
Display event lists, student profiles, and FAQs from JSON files using the Fetch API. Implement dynamic rendering, search, filtering, sorting, and pagination.

## Key Questions / Analysis
1. **How is JSON fetched, parsed, and rendered?** `fetch()` requests the JSON file, `response.json()` parses it into JavaScript objects, and reusable rendering functions display records as HTML cards.
2. **Which array methods are used for search, filter, sort, and pagination?** `filter()` matches search terms and filters, `sort()` orders records, `map()` renders records and extracts values, `Set` removes duplicate filter choices, and `slice()` selects the current page.
3. **How are loading and error states handled?** A loading message appears during the request. Empty results show a helpful message, and `try...catch` displays an error if loading fails.
4. **How is modularity maintained in JavaScript files?** Data fetching, rendering, and application logic are separated into `data.js`, `render.js`, and `app.js` using ES module imports and exports.

## Conclusion
This practical demonstrates how JSON data can be fetched and displayed dynamically using the Fetch API and JavaScript array methods. Search, filtering, sorting, and pagination make records easier to explore. Loading and error messages improve usability, while separate JavaScript modules keep the code organised and reusable.

## Test Checklist
- [ ] Events, Students, and FAQs each load 15 records.
- [ ] Search finds matching records.
- [ ] Category/course/topic filter works.
- [ ] A–Z and Z–A sorting works.
- [ ] Pagination works and boundary buttons disable correctly.
- [ ] A search with no matches shows an empty state.
- [ ] Fetch errors show a readable message.
