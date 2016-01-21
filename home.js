//script.js

//id being must be available after script loads
var id = "";

var home = function(){

  var api = "";
  var description = "";


  $(function(){

        $.get("../googleBooksAPIKey.txt", function(data){
          //get api key
          api = data.trim();
        });

        //set hash to #home
        location.hash="home";


        if(location.hash == "home" || " "){
        //ajax call to retrieve info from lib.json
        $.getJSON("json/lib.json", function(data, bks){

          //store books data from lib.json
          var bks = data.books;
          //loop through books in bks
          $.each(bks, function(i){
            //create ul to hold each book
            var book = $("<ul class='book' id = " + i + ">");
            //get author and title
            var a = this.author;
            var t = this.title;

            //add author and title li to ul
            book.append("<li class='title'>" + t + "</li>");
            book.append("<li clas='author'>" + a + "</li>");

            //get book title for api call to Google Books
            var googleAPI = "https://www.googleapis.com/books/v1/volumes?q="+t+"+inauthor:"+a+"&key="+api+"&country=USA";

            //ajax call to google books api
            // $.getJSON(googleAPI, function(response){
            //
            //   // set the items from the response object
            //   var item = "";
            //   var item = response.items[0];
            //   description = item.volumeInfo.description;
            //   var shortDescription = description.slice(0,250);
            //   var image = item.volumeInfo.imageLinks.thumbnail;
            //
            //   book.prepend("<li class='image'><img src='" + image + "'>" + "</li>");
            //   book.append("<li class='description'>" + shortDescription + "<span>...MORE</span></li>");
            // });//end $.getJSON for description and image
            //append #books div in body of html
            $("#books").append(book);

        });//end $.each(bks...)
        var bookEvents = function(){

        };
        $(".book").on("mouseenter", function(){
          $(this).css({"border":"3px solid black","background-color":"grey"});
        });

        $(".book").on("mouseleave", function(){
          $(this).css({"border":"1px solid black","background-color":"transparent"});
        });

        $(".book").click(function(){
          id = $(this).attr('id');

            var bObj = $("#books");

            $(bObj).children('.book').each(function(i){
              if(i != id){
                $(this).remove();
              }
              location.hash = $(".title").html().replace(/ /g, "");

              $(this).append("<li class='description'>" + description + "</li>")
                     .css({"height":"100%","width":"700px"});


            });//end $(bObj).children('.book'...
            $(".book").unbind("click");
            $(".book").unbind("mouseenter");
            return id;

            $(window).on("hashchange", function(){
              var hash = location.hash;

              console.log(hash);
              if(location.hash != "#home" && location.hash == hash){
                $.getJSON("json/lib.json", function(data){
                  console.log(data.books[id]);
                  var holder = $("#books");
                  $(holder).children('.book').each(function(i){
                    if(i != id){
                      $(this).remove();
                    }
                    $(this).css({"height":"100%","width":"700px"});
                  });
                });

              } else if(location.hash == "#home"){
                location.reload();
              }
          });
        });//end $(".book").click(function....
      });//end getJSON to lib.json...
    }//end if(location.hash == "home" || " ")...
  });//end document.ready...
};//end home
