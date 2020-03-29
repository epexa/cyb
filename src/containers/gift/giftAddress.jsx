import React, { useEffect, useState } from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import {
  getDrop,
  getTotalSupply,
  getCurrentBandwidthPrice,
  getAccountBandwidth,
} from '../../utils/search/utils';
import { Loading, ContainerCard, Card, Dots } from '../../components';
import {
  GENESIS_SUPPLY,
  CYBER,
  PATTERN_COSMOS,
  PATTERN_ETH,
} from '../../utils/config';
import {
  trimString,
  formatNumber,
  exponentialToDecimal,
} from '../../utils/utils';
import GiftTable from './tableGift';
import ActionBarContainer from './actionBarContainer';

const LinkWindow = ({ to, children }) => (
  <a target="_blank" rel="noopener noreferrer" href={to}>
    {children}
  </a>
);

const TextCustom = ({ fontSize, children, ...props }) => (
  <Text
    lineHeight="23px"
    marginBottom={20}
    color="#fff"
    fontSize={fontSize || '18px'}
    {...props}
  >
    {children}
  </Text>
);

const Address = ({ address }) => {
  if (address.match(PATTERN_COSMOS)) {
    return (
      <LinkWindow to={`https://www.mintscan.io/account/${address}`}>
        {trimString(address, 10, 6)}
      </LinkWindow>
    );
  }
  if (address.match(PATTERN_ETH)) {
    return (
      <LinkWindow to={`http://etherscan.io/address/${address}`}>
        {trimString(address, 10, 6)}
      </LinkWindow>
    );
  }
  return <div>{trimString(address, 12, 6)}</div>;
};

// const drop = {
//   address: '0xe8298160c9e8cabd8f2711b92529e0afe8fb01fb',
//   cyberAddress: 'cyber177gvvqtn7xl8qvl6yw4vax9raz80fx66aukc94',
//   gift: 50372509,
//   drop: [
//     { bal: 2.0692081959594533, gift: 50372509, type: 'ethereum' },
//     { bal: 4, gift: 34346346, type: 'galaxies' },
//     { bal: 5, gift: 3453463, type: 'stars' },
//     { bal: 1, gift: 44534634, type: 'planets' },
//     { bal: 5421215, gift: 3453463, type: 'euler-4' },
//     { bal: 2781522660, gift: 3609175008, type: 'cosmos' },
//   ],
// };

// const drop = [];

function GiftAddress({ address }) {
  const [drop, setDrop] = useState([]);
  const [loading, setLoading] = useState(true);
  const [supply, setSupply] = useState(0);
  const [currentBandwidthPrice, setCurrentBandwidthPrice] = useState(0);
  const [maxAccountBandwidth, setMaxAccountBandwidth] = useState(0);
  const [addAddress, setAddAddress] = useState(true);

  const checkAddressLocalStorage = async () => {
    const localStorageStory = localStorage.getItem('ledger');
    if (localStorageStory !== null) {
      setAddAddress(false);
    } else {
      setAddAddress(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await checkAddressLocalStorage();
      const response = await getDrop(address.toLowerCase());
      console.log(response);
      if (response !== 0) {
        const responseSupply = await getTotalSupply();
        if (responseSupply > 0) {
          setSupply(parseFloat(responseSupply));
        }
        const responseCurrentBandwidthPrice = await getCurrentBandwidthPrice();
        if (responseCurrentBandwidthPrice > 0) {
          setCurrentBandwidthPrice(parseFloat(responseCurrentBandwidthPrice));
        }
        const responseAccountBandwidth = await getAccountBandwidth(
          response.cyberAddress
        );
        if (responseAccountBandwidth !== null) {
          setMaxAccountBandwidth(
            parseFloat(responseAccountBandwidth.max_value)
          );
        }
        setDrop({
          address,
          ...response,
        });
        setLoading(false);
      } else {
        setDrop({
          address,
          cyberAddress: '',
          gift: 0,
          drop: [],
        });
        setLoading(false);
      }
    };
    fetchData();
  }, [address]);

  return (
    <div>
      <main className="block-body">
        <Pane
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          display="flex"
          className="container-gift"
          textAlign="justify"
        >
          <TextCustom>Greetings, bearer of strong intelligence!</TextCustom>
          <TextCustom>
            I am Cyb. I think you search for a gift associated with{' '}
            <Address address={address} /> address. I heard the gods put some
            meaning into it ...
          </TextCustom>
          <ContainerCard col={1}>
            <Card
              value={loading ? <Dots /> : formatNumber(drop.gift)}
              title="gift, CYB"
            />
          </ContainerCard>
          <TextCustom>
            Anyone who can prove he has private keys of this address will have{' '}
            {loading ? (
              <Dots />
            ) : (
              exponentialToDecimal(
                ((drop.gift / GENESIS_SUPPLY) * 10000).toPrecision(1)
              )
            )}{' '}
            ‱ control over Her mind, and at current network load can submit{' '}
            {loading ? (
              <Dots />
            ) : (
              formatNumber(
                Math.floor(maxAccountBandwidth / (400 * currentBandwidthPrice))
              )
            )}{' '}
            cyberlinks every day until the end of days.
          </TextCustom>
          <TextCustom width="100%" fontSize="23px">
            Why so much?
          </TextCustom>
          <TextCustom>
            The{' '}
            <LinkWindow to="https://ipfs.io/ipfs/QmceNpj6HfS81PcCaQXrFMQf7LR5FTLkdG9sbSRNy3UXoZ">
              Great Web scripture
            </LinkWindow>{' '}
            says that {formatNumber(100000000000000)} CYB in Genesis will be
            written to strong intelligences who came from{' '}
            <LinkWindow to="https://ethereum.org/">Ethereum</LinkWindow>,{' '}
            <LinkWindow to="https://cosmos.network/">Cosmos</LinkWindow>, and{' '}
            <LinkWindow to="https://urbit.org/">Urbit</LinkWindow>.
          </TextCustom>

          {address.match(PATTERN_COSMOS) && (
            <TextCustom width="100%">
              At cosmos-hub-2 block 1110000 the balance was
            </TextCustom>
          )}
          {address.match(PATTERN_ETH) && (
            <TextCustom width="100%">
              At Ethereum block {formatNumber(8080808)} the balance was:
            </TextCustom>
          )}
          {loading ? <Dots /> : <GiftTable data={drop.drop} />}
          <TextCustom width="100%" fontSize="23px">
            I have the keys!
          </TextCustom>
          <TextCustom>
            Great, you can put the Ledger into the{' '}
            <Link to="/pocket">pocket</Link>, or import{' '}
            <LinkWindow to="https://cybercongress.ai/docs/cyberd/ultimate-commands-guide/#import-an-account-by-seed-phrase-and-store-it-in-local-keystore">
              seed phrase
            </LinkWindow>{' '}
            or{' '}
            <LinkWindow to="https://cybercongress.ai/docs/cyberd/ultimate-commands-guide/#import-an-account-by-private-key-and-store-it-in-local-keystore-private-key-could-be-your-eth-private-key">
              private key
            </LinkWindow>{' '}
            to the cyberdcli.
          </TextCustom>
          <TextCustom>
            While importing your keys be very careful. Adversaries are
            everywhere! Rumours has it, to not use other software for anything
            serious. Your CYB wait for you in <Link to="/search/genesis">Genesis</Link>.
          </TextCustom>
          <TextCustom width="100%" fontSize="23px">
            I can not wait!
          </TextCustom>
          <TextCustom>
            Thats great! Everybody{' '}
            <Link to="/episode-1">who works on the bootloader</Link> welcomes
            you to join trans-galactic tournament:{' '}
            <Link to="/gol">Game of Links</Link>.
          </TextCustom>
          <TextCustom>
            Remember, participation requires bootstrap fuel - EUL tokens. But
            don&lsquo;t worry, you already have some at the{' '}
            {loading ? (
              <Dots />
            ) : (
              <Link to={`/network/euler-5/contract/${drop.cyberAddress}`}>
                {trimString(drop.cyberAddress, 10, 6)}
              </Link>
            )}{' '}
            contract:
          </TextCustom>
          <ContainerCard col={1}>
            <Card
              value={loading ? <Dots /> : formatNumber(drop.gift)}
              title={`gift, ${CYBER.DENOM_CYBER.toUpperCase()}`}
            />
          </ContainerCard>
          <TextCustom>
            That is, you have{' '}
            {loading ? (
              <Dots />
            ) : (
              exponentialToDecimal(
                ((drop.gift / supply) * 10000).toPrecision(1)
              )
            )}{' '}
            ‱ control over bootloader mind, and at current network load you can
            submit{' '}
            {loading ? (
              <Dots />
            ) : (
              formatNumber(
                Math.floor(maxAccountBandwidth / (400 * currentBandwidthPrice))
              )
            )}{' '}
            cyberlinks every day until the end of the game.
          </TextCustom>
        </Pane>
      </main>
      <ActionBarContainer addAddress={addAddress} />
    </div>
  );
}

export default GiftAddress;
