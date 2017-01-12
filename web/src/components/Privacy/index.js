/**
 * @module Privacy
 * Privacy agreement component
 *
 **/
import styles from './style.css';

import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import classNames from 'classnames';
import Button from '../Button';
import I18Next from 'i18next';
import Error from '../Error';

class Privacy extends PureComponent {

    constructor(props) {
        super(props);
        let email = '';
        if (props.prefillData && props.prefillData.email) {
            email = props.prefillData.email;
        }
        this.state = {
            email,
            terms: true,
            error: '',
            participate: false
        };
        this._onChange = this._onChange.bind(this);
        this._participate = this._participate.bind(this);
        this._onToggleTerms = this._onToggleTerms.bind(this);
    }

    render() {
        const { prefillData } = this.props;
        return (
            <div>
            {
                !this.state.participate ?
                    <div ref="root" className="question">
                        <div
                            className={classNames({
                                [`${styles.question}`]: true,
                                'ut-label': true
                            })}
                        >{I18Next.t('privacy_label')}
                        </div>
                        <div className={styles.terms}>
                            <div className={styles.topWrapper}>
                                <div className="checkboxItem">
                                    <input
                                        type="checkbox"
                                        checked={this.state.terms}
                                        onChange={this._onToggleTerms}
                                    />
                                    <label
                                        className={classNames({
                                            'ut-terms': true
                                        })}
                                    >
                                    {I18Next.t('privacy_terms')}
                                    </label>
                                </div>
                            </div>
                            <div className={styles.bottomWrapper}>
                                <input
                                    type="text"
                                    placeholder={I18Next.t('privacy_input')}
                                    value={this.state.email}
                                    onChange={this._onChange}
                                    disabled={!this.state.terms}
                                />
                                {
                                    prefillData.privacy_policy_url ?
                                        <p
                                            className="ut-privacy-policy"
                                            dangerouslySetInnerHTML={{
                                                __html: I18Next.t('privacy_policy', {
                                                    url: prefillData.privacy_policy_url
                                                })
                                            }}
                                        >
                                        </p> : ''
                                }
                                <Button
                                    string={'participate'}
                                    onClick={this._participate}
                                    extraClass={{
                                        'ut-participate': true,
                                        [`${styles.btn}`]: true
                                    }}
                                />
                                {
                                    this.state.error ?
                                        <Error
                                            msg={I18Next.t(this.state.error)}
                                            extraClass={styles.error}
                                        /> : ''
                                }
                            </div>
                        </div>
                    </div> :
                    <div
                        className={this.props.settings.type === 'default' ?
                            styles.done : styles.doneEmbedded}
                    />
            }
            </div>
        );
    }

    _onToggleTerms() {
        this.setState({
            terms: !this.state.terms
        }, () => {
            if (this.state.terms) {
                this.setState({
                    error: ''
                });
            } else {
                this.setState({
                    error: 'error_agree_terms'
                });
            }
        });
    }

    _participate() {
        const emailFormat = /^(?=.{5,200}$)([\w\-]+)([\w\.\-]*)@([\w\-]+)\.([\w\-]*)\w+([-.]\w+)*$/;
        if (!this.state.terms) {
            this.setState({
                error: 'error_agree_terms'
            });
        } else if (!this.state.email) {
            this.setState({
                error: 'error_email_required'
            });
        } else if (!emailFormat.test(this.state.email)) {
            this.setState({
                error: 'error_email_incorrect'
            });
        } else {
            this.setState({
                error: '',
                participate: true
            });
            const privacyData = {
                privacy: {
                    input: this.state.email
                }
            };
            if (!this.props.settings.preview) {
                this.props.feedbackActions.updateFeedback(true, privacyData);
            }
            // Send 'participate' msg to client
            this.props.feedbackActions.sendMsgToClient('participate', {
                page: this.props.paging + 1
            });
        }
    }

    _onChange(e) {
        this.setState({
            email: e.target.value
        });
    }

}

Privacy.PropTypes = {
    item: PropTypes.object.isRequired,
    onChangeHandle: PropTypes.func.isRequired
};

Privacy.defaultProps = {};

export default Privacy;
