import HTTPService from "./httpService";

export class Sample {
  constructor() {
    this.baseURL = "https://jsonplaceholder.typicode.com";
    this.httpService = new HTTPService(this.baseURL);
    this.config = {
      headers: {
        "content-type": "application/json",
      },
    };
  }

  getData = () => {
    const url = "/posts";
    return this.httpService.get(url, {}, this.config);
  };
}
