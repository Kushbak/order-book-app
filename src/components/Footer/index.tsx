import Button from "../Button";
import styles from './index.module.css'

interface FooterProps {
  toggleFeedCallback: () => void;
  killFeedCallback: () => void;
  isFeedKilled: boolean;
}

const Footer: React.FC<FooterProps> = ({ toggleFeedCallback, killFeedCallback , isFeedKilled}) => {
  return (
    <div className={styles.footer}>
      {!isFeedKilled && <Button title={'Toggle Feed'} backgroundColor={'#5741d9'} callback={toggleFeedCallback}/>}
      <Button title={isFeedKilled ? 'Renew feed' : 'Kill Feed'} backgroundColor={'#b91d1d'} callback={killFeedCallback}/>
    </div>
  );
};

export default Footer;