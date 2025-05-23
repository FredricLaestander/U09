import axios from 'axios'

export const deckOfCards = axios.create({
  baseURL: 'https://deckofcardsapi.com/api/deck',
})
