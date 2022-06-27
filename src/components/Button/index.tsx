import styles from './index.module.css'

interface ButtonProps {
  title: string;
  backgroundColor: string;
  callback: () => void;
}

const Button: React.FC<ButtonProps> = ({ title, backgroundColor = '#5741d9', callback }) => {
  return (
    <button
      className={styles.button}
      style={{ background: backgroundColor }}
      onClick={callback}
    >
      {title}
    </button>
  )
}

export default Button