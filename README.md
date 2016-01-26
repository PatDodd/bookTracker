# Book Store Shopping Cart
Written with JavaScript/JQuery, this was built to emulate a bookstore with a home page showing inventory, 
and a description page where you can read more about each book and add items to your shopping cart. You can also view
your shopping cart, remove single items and empty it. The total items and price update dynmically. Inventory info is stored in the lib.json file and pulled to the page using AJAX calls 
with JQuery's $.getJSON(). Shopping cart info is stored as an array of objects in the browser's session storage using JavaScript's handy 
window.sessionStorage API. It is built like a single page app, in that the index.html doc is updated to show each view (home/inventory, single book, shopping cart).

Technologies: JavaScript, JSON, JQuery(AJAX, Events, DOM manipulation), HTML, CSS
