
import styles from "../index.module.css";
import { MOBILE_WIDTH } from "../../../const";

interface PriceLevelRowProps {
  total: string;
  size: string;
  price: string;
  reversedFieldsOrder: boolean;
  windowWidth: number;
}

const PriceLevelRow: React.FC<PriceLevelRowProps> = ({
  total,
  size,
  price,
  reversedFieldsOrder = false,
  windowWidth
}) => {
  return (
    <div className={styles.priceLevelRow} data-testid='price-level-row'>
      {reversedFieldsOrder || windowWidth < MOBILE_WIDTH ?
        <>
          <span style={{ color: !reversedFieldsOrder ? '#118860' : '#bb3336' }}>{price}</span>
          <span>{size}</span>
          <span>{total}</span>
        </> :
        <>
          <span>{total}</span>
          <span>{size}</span>
          <span className='price'>{price}</span>
        </>}
    </div>
  );
};

export default PriceLevelRow;