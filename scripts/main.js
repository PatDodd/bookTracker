//main.js

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
    homeIconClick();

  }//end if(location.hash == "home" || " ")...

});//end document.ready...


/**************Functions***************/

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
    } else if(location.hash != "#home" && location.hash != "#cart" /*&& $('#books .book').length !=1*/ ){
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
    } else if (location.hash == "#cart") {
      loadCartView();
    }//end if watchHashChanges

  });//end window.on hashchanges

};//end watchHashChanges func

//add book to sessionStorage shopping cart and get count
var addToSessionCart = function(){

  $('.book li .cart').bind("click",function(){
    var ttl = $('.book .title').html();
    var pri = $('.book .pNum').html();
    var obj = {};
    obj = {"title":ttl, "price":pri, "quantity":1};
    var cartParsed = [];
    if(!sessionStorage.getItem('cart')){
      arr.push(obj);
      sessionStorage.setItem("cart", JSON.stringify(arr));
      $("#cartCount").html(arr.length + " items in cart");
    } else {
      cartParsed = JSON.parse(sessionStorage.getItem('cart'));
      //check for matches before adding
      cartParsed.push(obj);
      sessionStorage.setItem("cart", JSON.stringify(cartParsed));
      $("#cartCount").html(cartParsed.length + " items in cart");

    }//end if
  });//end .bind func
};//end addToSessionCart

//get cart count on home page, put up in document.ready
var getCartCount = function(){
  if(sessionStorage.getItem('cart')){
    var cart = JSON.parse(sessionStorage.getItem("cart"));
    $("#cartCount").html(cart.length + " items in cart");
  }//endif
};//end getCartCount

var loadCartViewOnClick = function(){
  $("#goToCart").bind("click", function(){
    loadCartView();

  });//end #goToCart bind func
};//end loadCartView func

var loadCartView = function(){
  var cart = [];
  var total = 0;
  location.hash = "cart";
  $("#books").empty();
  cart = getCartObject(cart);

  //sort books alphabetically by title
  cart.sort(function(a,b){
      if(a.title < b.title){ return -1;}
      if(a.title > b.title){ return 1;}
      return 0;
  });

  var booksInCart = $("#books");
  var items = $("<table class='book'>");
  booksInCart.append(items);
  for(i=0; i<cart.length; i++){
    $(items).append("<tr class='tRow'><td class='cartItem'>"+cart[i].title +"</td><td class='priceItem'>"+cart[i].price+"</td><td class='remove'><a href='javascript:void(0)'>REMOVE</a></td></tr>");
    total+=parseFloat(cart[i].price);
  }//end for
  $(items).append("<tr class='totesCost'><td class='totalCost'>Your Total:</td><td id='grandTotes'>&#36;"+total.toFixed(2)+"</td></tr>");
  $(".totesCost").css({"font-weight":"bold"});
  $(items).append("<tr><td></td><td></td><td><button id='emptyCart'>Empty Cart</button></td><tr>");
  emptyCart();
  removeItem();
};//loadCartView

var getCartObject = function(item){
  var item = [];
  if(!sessionStorage.getItem('cart')){
    $('#books').append("<p>CART IS EMPTY</p>")
  } else {
  item = JSON.parse(sessionStorage.getItem("cart"));

  }//end if
return item;
};//end getCartObject

var removeItem = function(){
  $(".book .remove").bind("click", function(){
    var seshArr = [];
    var seshObj = {};
    var p = 0;

    var total = 0;
    var pri = 0;
    var parent = $(this).parent();
    parent.remove();

    $(".book tbody tr").each(function(index, elem){
      var ttl = $(this).children("td.cartItem").html();
      pri = $(this).children(".priceItem").html();
      totes = $(this).children("#grandTotes");
      p = parseFloat(pri);

      // var itemCount = $(this).children().length;
      // console.log($(this).children().length);
      seshObj = {"title":ttl, "price":p, "quantity":1};

      if(seshObj.title != undefined && seshObj.price != undefined){
        seshArr.push(seshObj);
        sessionStorage.setItem("cart", JSON.stringify(seshArr));
      }
    });//end .each
      getCartCount();
      cart = getCartObject();
      for(i=0; i<cart.length; i++){
        total+=parseFloat(cart[i].price);
      }//end for
      $("#grandTotes").html("&#36;" + total)
      if(seshArr.length == 0){
        sessionStorage.removeItem("cart");
        $("#cartCount").html("");
        $("#grandTotes").html("&#36;" + 0.00.toFixed(2));
      }
  });//end .bind
};//end removeItem

var emptyCart = function(){
  $("#emptyCart").bind("click", function(){
    sessionStorage.removeItem("cart");
    $("table.book").empty();
    $("table.book").append("Deletion successful. Your cart is now empty.");
    $("#cartCount").html("");
  });
};

var homeIconClick = function(){
  $("#homeIcon").bind("click", function(){
    $("#books").empty();
    loadBooks(bookEvents);
  });
};
