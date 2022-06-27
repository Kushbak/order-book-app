import styles from "./index.module.css";

interface StatusMessageProps {
  selectedMarket: string;
  isFeedKilled: boolean;
}

const StatusMessage: React.FC<StatusMessageProps> = ({selectedMarket = '', isFeedKilled}) => {
  return (
    <div className={styles.statusMessage}>
      {isFeedKilled ? 'Feed killed.' : `Selected market: ${selectedMarket}`}
    </div>
  );
};

export default StatusMessage;