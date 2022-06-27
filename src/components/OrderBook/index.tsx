import React, { FunctionComponent, useEffect } from 'react';
// @ts-ignore
import useWebSocket from "react-use-websocket";
import TitleRow from "./TitleRow";
import PriceLevelRow from "./PriceLevelRow";
import Spread from "../Spread";
import { useAppDispatch, useAppSelector } from '../../hooks';
import { addAsks, addBids, addExistingState, selectAsks, selectBids } from '../../redux/orders';
import { MOBILE_WIDTH, ORDERBOOK_LEVELS } from "../../const";
import Loader from "../Loader";
import DepthVisualizer from "../DepthVisualizer";
import { ProductsMap } from "../../App";
import { formatNumber } from "../../utils";
import styles from './index.module.css'

const WSS_FEED_URL: string = 'wss://www.cryptofacilities.com/ws/v1';

export enum OrderType {
  BIDS,
  ASKS
}

interface OrderBookProps {
  windowWidth: number;
  productId: string;
  isFeedKilled: boolean;
}

interface Delta {
  bids: number[][];
  asks: number[][];
}

let currentBids: number[][] = []
let currentAsks: number[][] = []

const OrderBook: FunctionComponent<OrderBookProps> = ({ windowWidth, productId, isFeedKilled }) => {
  const bids: number[][] = useAppSelector(selectBids);
  const asks: number[][] = useAppSelector(selectAsks);
  const dispatch = useAppDispatch();
  const { sendJsonMessage, getWebSocket } = useWebSocket(WSS_FEED_URL, {
    onOpen: () => console.log('WebSocket connection opened.'),
    onClose: () => console.log('WebSocket connection closed.'),
    shouldReconnect: () => true,
    onMessage: (event: WebSocketEventMap['message']) => processMessages(event)
  });

  const processMessages = (event: { data: string; }) => {
    const response = JSON.parse(event.data);
    console.log('event.data', event.data)

    if (response.numLevels) {
      dispatch(addExistingState(response));
    } else {
      process(response);
    }
  };

  useEffect(() => {
    function connect(product: string) {
      const unSubscribeMessage = {
        'event': 'unsubscribe',
        'feed': 'book_ui_1',
        'product_ids': JSON.stringify([ProductsMap[product]])
      };
      sendJsonMessage(unSubscribeMessage);

      const subscribeMessage = {
        'event': 'subscribe',
        'feed': 'book_ui_1',
        'product_ids': JSON.stringify([product])
      };
      sendJsonMessage(subscribeMessage);
    }

    if (isFeedKilled) {
      getWebSocket()?.close();
    } else {
      connect(productId);
    }
  }, [isFeedKilled, productId, sendJsonMessage, getWebSocket]);

  const process = (data: Delta) => {
    if (data?.bids?.length > 0) {
      currentBids = [...currentBids, ...data.bids];

      if (currentBids.length > ORDERBOOK_LEVELS) {
        dispatch(addBids(currentBids));
        currentBids = [];
        currentBids.length = 0;
      }
    }
    if (data?.asks?.length >= 0) {
      currentAsks = [...currentAsks, ...data.asks];

      if (currentAsks.length > ORDERBOOK_LEVELS) {
        dispatch(addAsks(currentAsks));
        currentAsks = [];
        currentAsks.length = 0;
      }
    }
  };

  const formatPrice = (arg: number): string => {
    return arg.toLocaleString("en", { useGrouping: true, minimumFractionDigits: 2 })
  };

  const buildPriceLevels = (levels: number[][], orderType: OrderType = OrderType.BIDS): React.ReactNode => {
    const sortedLevelsByPrice: number[][] = [...levels].sort(
      (currentLevel: number[], nextLevel: number[]): number => {
        let result: number = 0;
        if (orderType === OrderType.BIDS || windowWidth < MOBILE_WIDTH) {
          result = nextLevel[0] - currentLevel[0];
        } else {
          result = currentLevel[0] - nextLevel[0];
        }
        return result;
      }
    );

    return (
      sortedLevelsByPrice.map((level, idx) => {
        const calculatedTotal: number = level[2];
        const total: string = formatNumber(calculatedTotal);
        const depth = level[3];
        const size: string = formatNumber(level[1]);
        const price: string = formatPrice(level[0]);

        return (
          <div className={styles.priceLevelRowContainer} key={idx + depth}>
            <DepthVisualizer
              key={depth}
              windowWidth={windowWidth}
              depth={depth}
              orderType={orderType}
            />
            <PriceLevelRow
              key={size + total}
              total={total}
              size={size}
              price={price}
              reversedFieldsOrder={orderType === OrderType.ASKS}
              windowWidth={windowWidth}
            />
          </div>
        );
      })
    );
  };

  return (
    <div className={styles.container}>
      {bids.length && asks.length ?
        <>
          <div className={styles.tableContainer}>
            {windowWidth > MOBILE_WIDTH && <TitleRow windowWidth={windowWidth} reversedFieldsOrder={false} />}
            <div>{buildPriceLevels(bids, OrderType.BIDS)}</div>
          </div>
          <Spread bids={bids} asks={asks} />
          <div className={styles.tableContainer}>
            <TitleRow windowWidth={windowWidth} reversedFieldsOrder={true} />
            <div>
              {buildPriceLevels(asks, OrderType.ASKS)}
            </div>
          </div>
        </> :
        <Loader />}
    </div>
  )
};

export default OrderBook;