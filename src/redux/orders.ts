import { createSlice, current } from "@reduxjs/toolkit";
import { RootState } from ".";
import { addDepths, addTotalSums, applyDeltas, getMaxTotalSum, groupByTicketSize } from "../utils";

export interface OrderbookState {
  market: string;
  rawBids: number[][];
  bids: number[][];
  maxTotalBids: number;
  rawAsks: number[][];
  asks: number[][];
  maxTotalAsks: number;
  groupingSize: number;
}

const initialState: OrderbookState = {
  market: 'PI_XBTUSD', // PI_ETHUSD
  rawBids: [],
  bids: [],
  maxTotalBids: 0,
  rawAsks: [],
  asks: [],
  maxTotalAsks: 0,
  groupingSize: 0.5
};


export const orderbookSlice = createSlice({
  name: 'orderbook',
  initialState,
  reducers: {
    addBids: (state, { payload }) => {
      const currentTicketSize: number = current(state).groupingSize;
      const groupedCurrentBids: number[][] = groupByTicketSize(payload, currentTicketSize);
      const updatedBids: number[][] = addTotalSums(
        applyDeltas(
          groupByTicketSize(current(state).rawBids, currentTicketSize),
          groupedCurrentBids
        )
      );

      state.maxTotalBids = getMaxTotalSum(updatedBids);
      state.bids = addDepths(updatedBids, current(state).maxTotalBids);
    },
    addAsks: (state, { payload }) => {
      const currentTicketSize: number = current(state).groupingSize;
      const groupedCurrentAsks: number[][] = groupByTicketSize(payload, currentTicketSize);
      const updatedAsks: number[][] = addTotalSums(
        applyDeltas(
          groupByTicketSize(current(state).rawAsks, currentTicketSize),
          groupedCurrentAsks
        )
      );

      state.maxTotalAsks = getMaxTotalSum(updatedAsks);
      state.asks = addDepths(updatedAsks, current(state).maxTotalAsks);
    },
    addExistingState: (state, { payload }) => {
      const rawBids: number[][] = payload.bids;
      const rawAsks: number[][] = payload.asks;
      const bids: number[][] = addTotalSums(groupByTicketSize(rawBids, current(state).groupingSize));
      const asks: number[][] = addTotalSums(groupByTicketSize(rawAsks, current(state).groupingSize));

      state.market = payload['product_id'];
      state.rawBids = rawBids;
      state.rawAsks = rawAsks;
      state.maxTotalBids = getMaxTotalSum(bids);
      state.maxTotalAsks = getMaxTotalSum(asks);
      state.bids = addDepths(bids, current(state).maxTotalBids);
      state.asks = addDepths(asks, current(state).maxTotalAsks);
    },
    setGrouping: (state, { payload }) => {
      state.groupingSize = payload;
    },
    clearOrdersState: (state) => {
      state.bids = [];
      state.asks = [];
      state.rawBids = [];
      state.rawAsks = [];
      state.maxTotalBids = 0;
      state.maxTotalAsks = 0;
    }
  }
});

export const { addBids, addAsks, addExistingState, setGrouping, clearOrdersState } = orderbookSlice.actions;

export const selectBids = (state: RootState): number[][] => state.orderbook.bids;
export const selectAsks = (state: RootState): number[][] => state.orderbook.asks;
export const selectGrouping = (state: RootState): number => state.orderbook.groupingSize;
export const selectMarket = (state: RootState): string => state.orderbook.market;

export default orderbookSlice.reducer;