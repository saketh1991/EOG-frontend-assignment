import { ApolloClient, ApolloLink, InMemoryCache, split } from "@apollo/client";
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from "@apollo/client/utilities";
import { HttpLink } from "apollo-link-http";
import { createClient } from 'urql';

const httpLink = new HttpLink({
  uri: "https://react.eogresources.com/graphql",
});

const wsLink = new WebSocketLink({
  uri: 'wss://react.eogresources.com/graphql',
  options: {
    reconnect: true
  }
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

export const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});


export default new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([splitLink]),
});