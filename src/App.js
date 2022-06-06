import styles from './App.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function App() {
    return (
        <div className={styles.app}>
            <div></div>
        </div>
    );
}

export default App;
