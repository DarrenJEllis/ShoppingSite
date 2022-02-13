var ShoppingSiteViewModel = function () {
  var self = this;

  self.AllProducts = [];
  self.Products = ko.observableArray([]);
  self.CartProducts = ko.observableArray([]);
  self.SearchTerm = ko.observable("");
  self.CartTotal = ko.computed(function() {
    return self.CartProducts().map(x => x.price).reduce(function(a, b){ return a + b;}, 0).toFixed(2);
});

  self.addToCart = function (product) {
    self.CartProducts().push(product);
    self.CartProducts(self.CartProducts());
  };

  self.removeFromCart = function (productToRemove) {
    self.CartProducts(self.CartProducts().filter(product => product.id !== productToRemove.id));
  };

  self.searchProducts = function(){
    self.Products(self.AllProducts.filter(x => x.name.toLowerCase().includes(self.SearchTerm().toLowerCase())));
  };

  self.fetchProducts = function () {
    fetch("http://localhost:8080/products")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        self.AllProducts = data;
        self.Products(data);
        // grab first few items to default in to the cart
        var cartArray = [];
        for (let i = 0; i < 3; i++) {
          cartArray.push(self.Products()[i]);
        }
        self.CartProducts(cartArray);
      });
  };

  window.addEventListener('DOMContentLoaded', self.fetchProducts());
};