import { MOBILE_WIDTH } from "../../../const";
import styles from "../index.module.css";

interface TitleRowProps {
  reversedFieldsOrder?: boolean;
  windowWidth: number;
}

const TitleRow: React.FC<TitleRowProps> = ({reversedFieldsOrder = false, windowWidth}) => {
  return (
    <div className={styles.titleRow} data-testid='title-row'>
      {reversedFieldsOrder || windowWidth < MOBILE_WIDTH ?
        <>
          <span>PRICE</span>
          <span>SIZE</span>
          <span>TOTAL</span>
        </> :
        <>
          <span>TOTAL</span>
          <span>SIZE</span>
          <span>PRICE</span>
        </>}
    </div>
  );
};

export default TitleRow;