import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const BASE_URL = 'https://diektech.zendesk.com/api/v2/';
const apiToken = process.env.ZENDESK_API_TOKEN || "d26ab05a6a4d1f80831d54220f8449dbf912b30abb375ce0a87771cfeb53d43d";

class TicketApi {
  baseUrl: string;
  instance: AxiosInstance;

  constructor() {
    this.baseUrl = BASE_URL;
    this.instance = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      },
    });
  }
  async createTicket(data: any) {
    let url = 'requests.json'
    let oAuthToken = await this.getOauthToken()
    oAuthToken = oAuthToken.token.full_token
    return await this.instance.post(url, data,
      {
        headers: {
          Authorization: `Bearer ${oAuthToken}`,
        },
      })
      .then(this.handleResponse)
      .catch(this.handleError)
  }

  async getOauthToken() {
    let data = {
      "token": {
        "client_id": process.env.ZENDESK_CLIENT_ID || 360000112052,
        "scopes": [
          "read",
          "write"
        ]
      }
    }
    return await this.instance.post('oauth/tokens.json', data)
      .then(this.handleResponse)
      .catch(this.handleError)
  }

  private handleResponse(response: AxiosResponse) {
    return response?.data;
  }
  private handleError(err: AxiosError) {
    // tslint:disable-next-line: no-console
    console.error('Error:', err);
  }
}

export default new TicketApi();