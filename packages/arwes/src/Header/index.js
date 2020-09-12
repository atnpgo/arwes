import withStyles from '../tools/withStyles';
import {withSounds} from '../../../sounds/src/withSounds';
import Header from './Header';
import styles from './styles';

export default withStyles(styles)(withSounds()(Header));
