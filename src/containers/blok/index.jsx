import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import bech32 from 'bech32';
import InformationBlock from './informationBlock';
import TableTxs from '../account/tableTxs';
import { CardTemplate } from '../../components';

const GET_CHARACTERS = gql`
  query MyQuery($blockId: Int) {
    block(where: { height: { _eq: $blockId } }) {
      height
      hash
      timestamp
      pre_commits
      proposer_address
      num_txs
      transactions {
        messages
        txhash
        code
      }
    }
  }
`;

function Block({ match }) {
  const { idBlock } = match.params;
  const { loading, error, data } = useQuery(GET_CHARACTERS, {
    variables: {
      blockId: idBlock,
    },
  });
  if (loading) {
    return 'Loading...';
  }
  if (error) {
    return `Error! ${error.message}`;
  }
  console.log(data);

  // useEffect(() => {

  // }, [idBlock]);

  return (
    <div>
      <main className="block-body">
        <InformationBlock marginBottom={20} data={data.block[0]} />
        <CardTemplate title="Transactions">
          <TableTxs data={data.block[0].transactions} />
        </CardTemplate>
      </main>
    </div>
  );
}

export default Block;
