//script.js

//id being must be available after script loads
var id = 0;
var api = "";
var d = "";
var sd = ""
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
       th = this.thumbnail;
       d = this.description;
       sd = d.slice(0,250);

      //add author and title li to ul
      book.prepend("<li class='image'><img src='" + th + "'>" + "</li>");
      book.append("<li class='title'>" + t + "</li>");
      book.append("<li clas='author'>" + a + "</li>");
      book.append("<li class='description'>" + sd + "<span>...MORE</span></li>");

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
        var newDescr = "";
        $.getJSON("json/lib.json", function(data){
          newDescr = data.books[id].description;
        });
        $(".description").replace("<li class='description'>" + newDescr + "</li>");
        $(".book").css({
                        "height":"100%",
                        "width":"700px",
                        "border":"1px solid black",
                        "background-color":"transparent"
                       });
  console.log(newDescr);

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
        var book = $("<ul class='book' id = " + value + ">").css({
                                                                 "height":"100%",
                                                                 "width":"700px",
                                                                 "border":"1px solid black",
                                                                 "background-color":"transparent"
                                                                });;
        books.append(book);
        book.append("<li class='title'>" + data.books[value].title + "</li>");
        book.append("<li clas='author'>" + data.books[value].author + "</li>");
        book.append("<li class='description'>" + data.books[value].description + "</li>")
        book.prepend("<li class='image'><img src='" + data.books[value].thumbnail + "'>" + "</li>");
      });
    }
  });
};
