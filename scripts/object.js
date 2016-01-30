//var bks = [];
$(function(){
  //var b = views.getBooks();
  //console.log(b);
  //views.getBooks;
  // console.log(views.books());
  //var x = [];
  console.log(views.getBooks());
});

var views = {
  //bks : null,
  //load books on #home

  getBooks : function(){
    var b = [];
      $.getJSON("json/lib.json", function(data){
                        b = data;
                        return b;
                      });
                      return b;
  }



};//end views object
