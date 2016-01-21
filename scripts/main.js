//script.js

//id being must be available after script loads
var id = 0;
var api = "";
var description = "";
var title = "";
var hashTags = [];

//loads home
var home = function(){
  //document.ready...
  $(function(){
    //set hash to #home
    location.hash="home";

    if(location.hash == "home" || " "){
    loadBooks(bookEvents);
    }//end if(location.hash == "home" || " ")...
  });//end document.ready...
};//end home

//FUNCTIONS
//load books on #home
var loadBooks = function(bkEv){

  $.get("../googleBooksAPIKey.txt", function(data){
    //get api key
    api = data.trim();
  });

  //ajax call to retrieve info from lib.json
  $.getJSON("json/lib.json", function(data, bks){

    //store books data from lib.json
    var bks = data.books;
    //loop through books in bks
    $.each(bks, function(i){
      //create ul to hold each book
      id = this.id;
      hashTags.push(this.hash);
      console.log(id);
      var book = $("<ul class='book' id = " + id + ">");
      //get author and title
       a = this.author;
       t = this.title;

      //add author and title li to ul
      book.append("<li class='title'>" + t + "</li>");
      book.append("<li clas='author'>" + a + "</li>");

      //get book title for api call to Google Books
      var googleAPI = "https://www.googleapis.com/books/v1/volumes?q="+t+"+inauthor:"+a+"&key="+api+"&country=USA";
/*
      //ajax call to google books api
      $.getJSON(googleAPI, function(response){

        // set the items from the response object
        var item = "";
        var item = response.items[0];
        description = item.volumeInfo.description;
        var shortDescription = description.slice(0,250);
        var image = item.volumeInfo.imageLinks.thumbnail;

        book.prepend("<li class='image'><img src='" + image + "'>" + "</li>");
        book.append("<li class='description'>" + shortDescription + "<span>...MORE</span></li>");
      });//end $.getJSON for description and image
*/
      //append #books div in body of html
      $("#books").append(book);

  });//end $.each bks...
  bkEv();

});//end getJSON to lib.json...

};

//events
var bookEvents = function(){
  console.log(hashTags);
  $(".book").on("mouseenter", function(){
    $(this).css({"border":"3px solid black","background-color":"grey"});
  });

  $(".book").on("mouseleave", function(){
    $(this).css({"border":"1px solid black","background-color":"transparent"});
  });

  $(".book").click(function(){
    id = $(this).attr('id');
    var h = hashTags[id];
      var bObj = $("#books");

      $(bObj).children('.book').each(function(i){
        if(i != id){
          $(this).remove();
        }
        location.hash = h + "/" + id;

        $(this).append("<li class='description'>" + description + "</li>")
               .css({
                    "height":"100%",
                    "width":"700px",
                     "border":"1px solid black",
                     "background-color":"transparent"
                   });


      });//end $(bObj).children('.book'...
      $(".book").unbind("click");
      $(".book").unbind("mouseenter");
      return id;
  });//end $(".book").click(function....

};

var watchHashChanges = function(){
  //watch for hashchanges
  $(window).on("hashchange", function(){
    //get hash
    var hash = location.hash;

    //check hash and act accordingly
    if(location.hash == "#home"){
      $("#books").empty();
      home();
    } else if(location.hash != "#home" && hash == location.hash && $('#books .book').length !=1 ){
      $("#books").empty();

      var value = window.location.href.substring(
        window.location.href.lastIndexOf('/') + 1
      );

      $.getJSON("json/lib.json", function(data){

        var books = $("#books");
        var book = $("<ul class='book' id = " + value + ">").css({"height":"100%","width":"700px"});
        books.append(book);
        book.append("<li class='title'>" + data.books[value].title + "</li>");
        book.append("<li clas='author'>" + data.books[value].author + "</li>");
      });
    }
  });
};
