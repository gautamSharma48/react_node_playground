const data = {
  name: "greeting",
  party: "Bithday",
  partyMember: ["Alex", "smith", "Johnson"],
  showMessage: function () {
    console.log(this.name, this.party);
    this.partyMember?.forEach(function (el) {
      console.log(el);
    });
  },
  mesage: () => {
    //we cannot access the this keyword in call back function
    console.log(this.name, this.party);
    this.partyMember?.forEach(function (el) {
      console.log(el);
    });
  },

  showMessages() {
    //best way to write function in json
    console.log(this.name, this.party);
    this.partyMember?.forEach((el) => {
      console.log(el);
    });
  },
};

data.showMessages();

