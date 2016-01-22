//script.js

//id being must be available after script loads
var id = 0;
var api = "";
var d = "";
var sd = ""
var title = "";
var hashTags = [];
var item = {};
var arr = [];

  //document.ready...
$(function(){
    //set hash to #home
    location.hash="home";

  if(location.hash == "home" || " "){
    loadBooks(bookEvents);
    getCartCount();
  }//end if(location.hash == "home" || " ")...

});//end document.ready...

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

      var book = $("<ul class='book' id = " + id + ">");
      //get author and title
       a = this.author;
       t = this.title;
       th = this.thumbnail;
       d = this.description;
       sd = d.slice(0,250);
       pr = this.price;

      //add author and title li to ul
      book.append("<li class='image'><img src='" + th + "'>" + "</li>");
      book.append("<li class='title'>" + t + "</li>");
      book.append("<li clas='author'>" + a + "</li>");

      book.append("<li class='price'>&#36;<span class=pNum>" + pr + " </span></li>");
      book.append("<li class='button'></li>");
      book.append("<li class='description'>" + sd + "<span>...MORE</span></li>");

      //append #books div in body of html
      $("#books").append(book);

  });//end $.each bks...
  bkEv();

});//end getJSON to lib.json...

};

//events
var bookEvents = function(){

  $(".book").on("mouseenter", function(){
    $(this).css({"border":"3px solid black","background-color":"grey"});
  });

  $(".book").on("mouseleave", function(){
    $(this).css({"border":"1px solid black","background-color":"transparent"});
  });

  $(".book").click(function(){
    console.log($(this));
    $('.button').append("<button class='cart'>Add to Cart</button>");
    addToSessionCart();
    id = $(this).attr('id');
    var h = hashTags[id];
    var bObj = $("#books");

//$(this).after("<button class='cart'>Add to cart</button>");

    $(bObj).children('.book').each(function(i){

        if(i != id){
          $(this).remove();
        }

        location.hash = h + "/" + id;

        var newDescr = "";
        $.getJSON("json/lib.json", function(data){
          newDescr = data.books[id].description;
          //console.log(newDescr);
          $(".description").html(newDescr);

      });
      $(".book").css({
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
    if(location.hash == "#home" && !location.reload()){
      //when hash is home empty books div and repopulate with home page
      $("#books").empty();
      loadBooks(bookEvents);
      //location.reload();
    } else if(location.hash != "#home" && location.hash != "#cart" && $('#books .book').length !=1 ){
      //if hash isn't #home and there too many uls, empty books div and repopulte with proper book in hashed url
      $("#books").empty();

      //pull id # from url
      var value = window.location.href.substring(
        window.location.href.lastIndexOf('/') + 1
      );

      //use value to get the right book from lib.json when users "returns" using "browser history"
      $.getJSON("json/lib.json", function(data){

        var books = $("#books");
        var book = $("<ul class='book' id = " + value + ">").css({
                                                                 "height":"100%",
                                                                 "width":"700px",
                                                                 "border":"1px solid black",
                                                                 "background-color":"transparent"
                                                                 });;
        books.append(book);
        book.append("<li class='image'><img src='" + data.books[value].thumbnail + "'>" + "</li>");
        book.append("<li class='title'>" + data.books[value].title + "</li>");
        book.append("<li class='author'>" + data.books[value].author + "</li>");
        book.append("<li class='price'>&#36;<span class=pNum>" + data.books[value].price + " </span></li>");
        book.append("<li><button class='cart'>Add to cart</button></li>");
        book.append("<li class='description'>" + data.books[value].description + "</li>");

        addToSessionCart();
      });//end getJSON for watchHashChanges
    }//end if watchHashChanges

  });//end window.on hashchanges

};//end watchHashChanges func

//add book to sessionStorage shopping cart and get count
var addToSessionCart = function(){

  $('.book li .cart').bind("click",function(){
    var ttl = $('.book .title').html();
    var auth = $('.book .author').html();
    var pri = $('.book .pNum').html();
    var obj = {};
    obj = {"title":ttl, "author":auth, "price":pri};

    if(!sessionStorage.getItem('cart')){
      arr.push(obj);
      sessionStorage.setItem("cart", JSON.stringify(arr));
      $("#cartCount").html(arr.length + " items in cart");
    } else {
      var cartParsed = JSON.parse(sessionStorage.getItem('cart'));
      cartParsed.push(obj);
      sessionStorage.setItem("cart", JSON.stringify(cartParsed));
      $("#cartCount").html(cartParsed.length + " items in cart");
    }//end if
  });//end .bind func
};//end addToSessionCart

//get cart count on home page, put up in document.ready
var getCartCount = function(){
  var cart = JSON.parse(sessionStorage.getItem("cart"));
  $("#cartCount").html(cart.length + " items in cart");
}

// console.log(window.sessionStorage["carts"]);
// sessionStorage.setItem("stuff",JSON.stringify([{"boom":"bam"},{"num": 12},{"foo":"bar"}]));
// var x = JSON.parse(sessionStorage.getItem("stuff"));
// x.push({"bing":"bong"});
// sessionStorage.setItem("stuff", JSON.stringify(x));
// for(i=0; i<x.length; i++){
//   console.log(x[i]);
// }
