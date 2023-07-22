import { GraphQLClient } from 'graphql-request'

export const API_URL = 'https://sepolia.easscan.org/graphql'

export const graphQLClient = new GraphQLClient(API_URL, { fetch })