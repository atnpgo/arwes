import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import AnimationComponent from '../Animation';
import FrameComponent from '../Frame';
import LoadingComponent from '../Loading';
import createLoaderModule from '../tools/createLoader';
import createResponsiveModule from '../tools/createResponsive';
import Frame from '../Frame';

// TODO:
// - Set sizing props (loading should adjust)
// - Allow style and props customization for deep elements like the Loading.
// - Filters (set a image filter over the photo).

export default class Video extends Component {
    static propTypes = {
        Animation: PropTypes.any.isRequired,
        Frame: PropTypes.any.isRequired,
        Loading: PropTypes.any.isRequired,
        createLoader: PropTypes.any.isRequired,
        createResponsive: PropTypes.any.isRequired,

        theme: PropTypes.any.isRequired,
        classes: PropTypes.any.isRequired,

        animate: PropTypes.bool,
        show: PropTypes.bool,
        animation: PropTypes.object,

        layer: PropTypes.oneOf([
            'primary',
            'secondary',
            'header',
            'control',
            'success',
            'alert',
            'disabled'
        ]),

        /**
         * If the resources should be loaded.
         */
        loadResources: PropTypes.bool,

        /**
         * The image resource or the images resources according to device viewport.
         */
        resources: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                small: PropTypes.string.isRequired,
                medium: PropTypes.string.isRequired,
                large: PropTypes.string.isRequired,
                xlarge: PropTypes.string.isRequired
            })
        ]),

        /**
         * i18n messages.
         */
        i18n: PropTypes.shape({
            error: PropTypes.string
        }),

        /**
         * Props to pass down to the `<img />` element.
         */
        vidProps: PropTypes.object,

        /**
         * If function, receives the animation status object.
         */
        children: PropTypes.any,

        className: PropTypes.any
    };

    static defaultProps = {
        Animation: AnimationComponent,
        Frame: FrameComponent,
        Loading: LoadingComponent,
        createLoader: createLoaderModule,
        createResponsive: createResponsiveModule,
        show: true,
        layer: 'primary',
        loadResources: true,
        i18n: {
            error: 'Video error'
        },
        vidProps: {}
    };

    getDefaultState() {
        return {
            ready: false, // if active resource is loaded
            error: false, // if resource had an error
            resource: null // the active resource
        };
    }

    constructor() {
        super(...arguments);

        this.state = this.getDefaultState();

        this.loader = this.props.createLoader();
        this.responsive = this.props.createResponsive({
            getTheme: () => this.props.theme
        });
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps) {
    }

    render() {
        const {
            Animation,
            Frame,
            Loading,
            caption,
            createLoader,
            createResponsive,
            animation,
            theme,
            classes,
            animate,
            show,
            layer,
            loadResources,
            vidProps,
            i18n,
            className,
            children,
            ...etc
        } = this.props;

        const {ready, error} = this.state;

        const cls = cx(
            classes.root,
            {
                [classes.ready]: ready
            },
            className
        );

        return (
            <Animation
                animate={animate}
                show={show}
                timeout={theme.animTime}
                {...animation}
            >
                {anim => (
                    <figure className={cx(cls, classes[anim.status])} {...etc}>
                        <Frame animate={animate} show={show} layer={layer} level={3} corners={4}>
                            <div className={classes.holder}>
                                <video {...vidProps} className={cx(classes.img, vidProps.className)} onCanPlayThrough={() => this.setState({ready: true})}
                                       onError={console.error}>
                                    {children}
                                </video>
                                {error && <div className={classes.error}>{i18n.error}</div>}
                                {!ready && !error && (
                                    <Loading full animate={animate} show={show} layer={layer}/>
                                )}
                            </div>
                            {!!caption && <div className={classes.separator}/>}
                            {!!caption && (
                                <figcaption className={classes.children}>
                                    <small>
                                        {typeof caption === 'function' ? caption(anim) : caption}
                                    </small>
                                </figcaption>
                            )}
                        </Frame>
                    </figure>
                )}
            </Animation>
        );
    }
}
