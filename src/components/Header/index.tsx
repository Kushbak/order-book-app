import GroupingSelectBox from "../GroupSelectBox";
import styles from './index.module.css'

interface HeaderProps {
  options: number[];
}

const Header: React.FC<HeaderProps> = ({ options }) => {
  return (
    <div className={styles.header}>
      <h3>Order Book</h3>
      <GroupingSelectBox options={options} />
    </div>
  );
};

export default Header;