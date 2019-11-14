import React from 'react';
import {
  Pane,
  Text,
  TableEv as Table,
} from '@cybercongress/gravity';
import { FormatNumber } from '../../components/index';
import withWeb3 from '../../components/web3/withWeb3';
// import { formatNumber } from '../../utils/search/utils';

const toFixedNumber = (number, toFixed) => {
  return Math.floor(number * 10 ** toFixed) / 10 ** toFixed;
};


// const Wallet = ({ address, balance, token, ...props }) => (
//   <Pane
//     display="flex"
//     flexDirection="column"
//     alignItems="flex-start"
//     {...props}
//   >
//     <Pane
//       display="flex"
//       alignItems="center"
//       flexDirection="row"
//       marginBottom={10}
//     >
//       <Text
//         display="inline-block"
//         marginRight={13}
//         color="#fff"
//         fontSize="24px"
//       >
//         {balance || 0}
//       </Text>
//       <Pane display="flex" alignItems="center">
//         {token}
//       </Pane>
//     </Pane>
//     <Text fontSize="14px" className="adress" color="#d1d1d1">
//       {address || '0x0000000000000000000000000000000000000000'}
//     </Text>
//   </Pane>
// );

class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      table: [],
    };
  }

  componentDidMount() {
    this.getAddressToMetaMask();
  }

  getAddressToMetaMask = async () => {
    const { web3, accounts } = this.props;
    const table = [];
    const row = {
      address: [],
      amount: [],
      token: [],
      keys: [],
    };

    const balance = await web3.eth.getBalance(accounts);
    row.address.push(accounts);
    row.amount.push(toFixedNumber(balance * 10 ** -18, 4));
    row.token.push('ETH');
    row.keys.push('MetaMask');
    table.push(row);
    this.setState({
      table,
    });
  };

  render() {
    const { table } = this.state;

    const rowsTable = table.map(item => (
      <Table.Row
        borderBottom="none"
        paddingLeft={20}
        height={50}
        isSelectable
        key={item.address}
      >
        <Table.TextCell>
          <Text color="#fff" fontSize="17px">
            {item.address}
          </Text>
        </Table.TextCell>
        <Table.TextCell>
          <Text color="#fff" fontSize="17px">
            <FormatNumber number={item.amount} />
          </Text>
        </Table.TextCell>
        <Table.TextCell>
          <Text color="#fff" fontSize="17px">
            {item.token}
          </Text>
        </Table.TextCell>
        <Table.TextCell>
          <Text color="#fff" fontSize="17px">
            {item.keys}
          </Text>
        </Table.TextCell>
      </Table.Row>
    ));

    return (
      <main className="block-body-home">
        <Pane
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="space-around"
        >
          <Table width="100%">
            <Table.Head
              style={{
                backgroundColor: '#000',
                borderBottom: '1px solid #ffffff80',
              }}
              paddingLeft={20}
            >
              <Table.TextHeaderCell>
                <Text color="#fff" fontSize="17px">
                  Address
                </Text>
              </Table.TextHeaderCell>
              <Table.TextHeaderCell>
                <Text color="#fff" fontSize="17px">
                  Amount
                </Text>
              </Table.TextHeaderCell>
              <Table.TextHeaderCell>
                <Text color="#fff" fontSize="17px">
                  Token
                </Text>
              </Table.TextHeaderCell>
              <Table.TextHeaderCell>
                <Text color="#fff" fontSize="17px">
                  Keys
                </Text>
              </Table.TextHeaderCell>
            </Table.Head>
            <Table.Body
              style={{ backgroundColor: '#000', overflowY: 'hidden' }}
            >
              {rowsTable}
            </Table.Body>
          </Table>
        </Pane>
      </main>
    );
  }
}

export default withWeb3(Wallet);
