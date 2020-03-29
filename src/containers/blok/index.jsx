import React, { useEffect, useStatea } from 'react';
import gql from 'graphql-tag';
import { useSubscription } from '@apollo/react-hooks';
import { getGraphQLQuery } from '../../utils/search/utils';
import {
  Pane,
  Text,
  TableEv as Table,
  Icon,
  Tooltip,
} from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import { CardTemplate, MsgType, Loading, TextTable } from '../../components';
import { trimString, formatNumber, formatCurrency } from '../../utils/utils';
const dateFormat = require('dateformat');

const GET_CHARACTERS = gql`
  subscription Query {
    block(limit: 50, order_by: { height: desc }, offset: 0) {
      hash
      height
      proposer_address
      transactions_aggregate {
        aggregate {
          count
        }
      }
      pre_commits
      timestamp
    }
  }
`;

const query = `
query MyQuery {
  block(limit: 50, order_by: {height: desc}, offset: 0) {
    hash
    height
    proposer_address
    transactions_aggregate {
      aggregate {
        count
      }
    }
    pre_commits
    timestamp
  }
}
`;

const Block = () => {
  const { loading, error, data: dataTxs } = useSubscription(GET_CHARACTERS);

  if (error) {
    return `Error! ${error.message}`;
  }

  if (loading) {
    return <div>...</div>;
  }

  console.log(dataTxs);

  const blockRows = dataTxs.block.map((item, index) => (
    <Table.Row
      // borderBottom="none"
      paddingX={0}
      paddingY={5}
      borderTop={index === 0 ? 'none' : '1px solid #3ab79340'}
      borderBottom="none"
      display="flex"
      minHeight="48px"
      height="fit-content"
      key={item.txhash}
    >
      <Table.TextCell textAlign="center">
        <TextTable>{trimString(item.hash, 5, 5)}</TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="end">
        <TextTable>
          <Link to={`/network/euler-5/block/${item.height}`}>
            {formatNumber(item.height)}
          </Link>
        </TextTable>
      </Table.TextCell>
      <Table.TextCell flex={0.5} textAlign="end">
        <TextTable>
          {formatNumber(item.transactions_aggregate.aggregate.count)}
        </TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="center">
        <TextTable>{trimString(item.proposer_address, 5, 5)}</TextTable>
      </Table.TextCell>
      <Table.TextCell textAlign="center">
        <TextTable>
          {' '}
          {dateFormat(item.timestamp, 'dd/mm/yyyy, HH:MM:ss')}
        </TextTable>
      </Table.TextCell>
    </Table.Row>
  ));

  return (
    <main className="block-body">
      <Table>
        <Table.Head
          style={{
            backgroundColor: '#000',
            borderBottom: '1px solid #ffffff80',
            marginTop: '10px',
            padding: 7,
            paddingBottom: '10px',
          }}
        >
          <Table.TextHeaderCell textAlign="center">
            <TextTable>hash</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>height</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell flex={0.5} textAlign="center">
            <TextTable>tx</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>proposer address</TextTable>
          </Table.TextHeaderCell>
          <Table.TextHeaderCell textAlign="center">
            <TextTable>
              timestamp{' '}
              <Tooltip content="UTC" position="bottom">
                <Icon icon="info-sign" color="#3ab793d4" marginLeft={5} />
              </Tooltip>
            </TextTable>
          </Table.TextHeaderCell>
        </Table.Head>
        <Table.Body
          style={{
            backgroundColor: '#000',
            overflowY: 'hidden',
            padding: 7,
          }}
        >
          {blockRows}
        </Table.Body>
      </Table>
    </main>
  );
};

export default Block;
