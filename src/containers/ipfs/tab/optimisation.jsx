import React from 'react';
import { Pane, Rank } from '@cybercongress/gravity';
import Noitem from '../../account/noItem';
import ContentItem from '../contentItem';

const OptimisationTab = ({ data, mobile, nodeIpfs }) => {
  if (data && data.length > 0) {
    return (
      <div style={{ width: '100%' }}>
        {data.map((item, i) => {
          const cid = item.tx.value.msg[0].value.links[0].from;
          return (
            <Pane
              position="relative"
              className="hover-rank"
              display="flex"
              alignItems="center"
              marginBottom="10px"
              key={`${cid}_${i}`}
            >
              {!mobile && (
                <Pane
                  className="time-discussion rank-contentItem"
                  position="absolute"
                >
                  <Rank
                    hash={cid}
                    rank="n/a"
                    grade={{ from: 'n/a', to: 'n/a', value: 'n/a' }}
                  />
                </Pane>
              )}
              <ContentItem
                nodeIpfs={nodeIpfs}
                cid={cid}
                item={item}
                className="contentItem"
              />
            </Pane>
          );
        })}
      </div>
    );
  }
  return (
    <div className="container-contentItem">
      <Noitem text="No cyberLinks" />
    </div>
  );
};

export default OptimisationTab;
