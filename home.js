//script.js


var home = function(){

  var api = "";

  $(function(){

        $.get("../googleBooksAPIKey.txt", function(data){
          //get api key
          api = data.trim();
        });
        
        //set hash to #home
        location.hash="home";
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
            var googleAPI = "https://www.googleapis.com/books/v1/volumes?q="+t+"+inauthor:"+a+"&key="+api;

            //ajax call to google books api
            $.getJSON(googleAPI, function(response){

              // set the items from the response object
              var item = "";
              var item = response.items[0];
              var description = item.volumeInfo.description;
              var shortDescription = description.slice(0,250);
              var image = item.volumeInfo.imageLinks.thumbnail;

              book.prepend("<li class='image'><img src='" + image + "'>" + "</li>");
              book.append("<li class='description'>" + shortDescription + "<span>...MORE</span></li>");
            });//end $.getJSON for description and image
            //append #books div in body of html
            $("#books").append(book);
        });//end $.each(bks...)
      });//end getJSON to lib.json...
    });//end document.ready
};//end home
