import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectGrouping, setGrouping } from "../../redux/orders";
import styles from './index.module.css'

interface GroupingSelectBoxProps {
  options: number[]
}

export const GroupingSelectBox: React.FC<GroupingSelectBoxProps> = ({ options }) => {
  const groupingSize: number = useAppSelector(selectGrouping);
  const dispatch = useAppDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setGrouping(Number(event.target.value)));
  };

  return (
    <div className={styles.groupSelectBox}>
      <select data-testid="groupings" name="groupings" onChange={handleChange} defaultValue={groupingSize}>
        {options.map((option, idx) => <option key={idx} value={option}>Group {option}</option>)}
      </select>

    </div>
  );
};

export default GroupingSelectBox