import { gql } from 'graphql-request'

export const FETCH_ATTESTATIONS = gql`
  query UserAttestation($where: AttestationWhereInput) {
    attestations(where: $where) {
      id
      attester
      timeCreated
      revocationTime
    }
  }`