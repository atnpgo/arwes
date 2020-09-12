import withStyles from '../tools/withStyles';
import {withSounds} from '../../../sounds/src/withSounds';
import Footer from './Footer';
import styles from './styles';

export default withStyles(styles)(withSounds()(Footer));
