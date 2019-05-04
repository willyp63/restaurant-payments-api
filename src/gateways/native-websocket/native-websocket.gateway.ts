export class NativeWebSocketGateway {

  private wsClients = [];

  handleConnection(client: any) {
    this.wsClients.push(client);
  }

  broadcast(event, data: any) {
    this.removeClosedClients();

    for (let client of this.wsClients) {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({ event, data }));
      }
    }
  }

  private removeClosedClients() {
    for (let i = 0; i < this.wsClients.length; i++) {
      if (this.wsClients[i].readyState === this.wsClients[i].CLOSED) {
        this.wsClients.splice(i--, 1);
      }
    }
  }

}
