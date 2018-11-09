import React, { Component } from 'react';
import BouncingLoader from './bouncing_loader/bouncing_loader';

class PostItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar: '',
            name: '',
            date: '',
            content: '',
            expanded: false,
            kitchen: ''
        }
    }

    timeSince(date) {
        var seconds = Math.floor((new Date() - date) / 1000);
        var interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
          return interval + " years ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
          return interval + " months ago";
        }
        interval = Math.floor(seconds / 604800);
        if (interval > 1) {
          return interval + " weeks ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
          return interval + " days ago";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
          return interval + " hours ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
          return interval + " minutes ago";
        }
        return Math.floor(seconds) + " seconds ago";
    }

    componentDidMount = () => {
        this.setState({
            avatar: this.props.item.profile[0].profileImg ? this.props.item.profile[0].profileImg.medium : 'https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/foody.svg',
            name: this.props.item.profile[0].foodie_name ? this.props.item.profile[0].foodie_name : `(${this.props.item.profile[0].email})`,
            content: this.props.item.content,
            date: this.timeSince(new Date(this.props.item.create_at)),
            kitchen: this.props.item.kitchen.length > 0 ? this.props.item.kitchen[0]._id : ''
        })
    }

    render() {
        return (
            <div key={this.props.item._id} className="row post-item">
                {
                    (this.state.kitchen) ?
                        <a href={'/kitchen/'+ this.state.kitchen}>
                            <span className="chef-badge">
                                <svg width="12" height="12" viewBox="0 0 81 78" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M48.9846 75.6667H22.1488C19.4827 75.6667 17.3211 73.5127 17.3211 70.8558V46.738C17.3211 44.3551 15.7649 42.187 13.4506 41.5866C6.66554 39.8267 1.70998 33.5485 2.0132 26.1693C2.33112 18.4311 8.65681 12.0209 16.416 11.5694C18.5278 11.4465 20.549 11.7571 22.4068 12.4144C24.036 12.9911 25.8559 12.3225 26.6343 10.7836C29.1539 5.80191 34.3222 2.38235 40.3028 2.38235C46.2834 2.38235 51.4517 5.80191 53.9707 10.7836C54.7491 12.3225 56.569 12.9911 58.1988 12.4144C60.0566 11.7571 62.0778 11.4465 64.1896 11.5694C71.9482 12.0209 78.2745 18.4311 78.5924 26.1693C78.8956 33.5485 73.9395 39.8267 67.155 41.5866C64.8407 42.187 63.2845 44.3551 63.2845 46.738V70.8558C63.2845 73.5127 61.1229 75.6667 58.4568 75.6667H58.1773" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
                                </svg>
                            </span>
                            <img src={this.state.avatar} className="commenter-avatar"/>
                        </a>
                    :
                        <a href="#">
                            <img src={this.state.avatar} className="commenter-avatar"/>
                        </a>
                }
                <div className="col l12 m12 s12 post-container no-padding">
                    {
                        (this.state.kitchen) ?
                            <a href={'/kitchen/'+ this.state.kitchen}>
                                <span className="post-meta">
                                    <h7 className="post-author">{this.state.name}</h7>
                                    <h7 className="post-time">{this.state.date}</h7>
                                </span>
                            </a>
                        :
                            <a href={'/kitchen/'+ this.state.kitchen}>
                                <span className="post-meta">
                                    <h7 className="post-author">{this.state.name}</h7>
                                    <h7 className="post-time">{this.state.date}</h7>
                                </span>
                            </a>
                    }
                    <span className="post-content">
                        <p>{this.state.content}</p>
                    </span>
                </div>
            </div>
        )
    }
}

export default class CommentBox extends Component {
    constructor(props) {
        super(props);
        this.onChangeComment = this.onChangeComment.bind(this);
        this.addComment = this.addComment.bind(this);
        this.renderListComment = this.renderListComment.bind(this);
        this.loadmore = this.loadmore.bind(this);
        this.state = {
            avatar: 'https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/foody.svg',
            name: '',
            content: '',
            valid: false,
            count: 0,
            skip: 0,
            listcomment: [],
            loading: true
        }
    }

    componentDidMount() {
        Meteor.call('comment.count', this.props.articleType, this.props.articleId, (err, res) => {
            if (!err) {
                this.setState({ count: res })
            }
        });
        Meteor.call('comment.getComment', this.props.articleType, this.props.articleId, 0, (err, res) => {
            if (!err) {
                this.setState({
                    listcomment: [...this.state.listcomment, ...res],
                    loading: false
                });
            } else {
                this.setState({
                    loading: false
                });
            }
        });
        if (Meteor.userId()) {
            let profile = Profile_details.findOne({ user_id: Meteor.userId() });
            if (profile) {
                if (profile.foodie_name) {
                    this.setState({
                        name: profile.foodie_name
                    })
                }
                if (profile.profileImg) {
                    this.setState({
                        avatar: profile.profileImg.large
                    })
                }
            }
        }
    }

    renderListComment = () => {
        if (this.state.loading) {
            return <BouncingLoader />
        } else {
            if (this.state.listcomment.length == 0) {
                return <h6>There are no have any review yet! Become first user review this dish. 👏</h6>
            } else {
                return this.state.listcomment.map((item, index) => {
                    return (
                        <PostItem item={item} key={item._id} />
                    )
                });
            }
        }
    }

    onChangeComment = (event) => {
        let content = event.target.innerText.trim();
        if (content.length > 1) {
            this.setState({ valid: true, content: content })
        } else {
            this.setState({ valid: false })
        }
    }

    addComment() {
        this.setState({
            loading: true
        });
        Meteor.call('comment.insert', this.props.articleType, this.props.articleId, this.state.content, (err) => {
            if (!err) {
                document.getElementById("comment-content").innerHTML = "";
                this.setState({
                    content: '',
                    valid: false,
                    skip: 0
                },() => {
                    Meteor.call('comment.getComment', this.props.articleType, this.props.articleId, this.state.skip, (err, res) => {
                        if (!err) {
                            this.setState({
                                listcomment: res,
                                loading: false
                            });
                        } else {
                            this.setState({
                                loading: false
                            });
                        }
                    });
                    Meteor.call('comment.count', this.props.articleType, this.props.articleId, (err, res) => {
                        if (!err) {
                            this.setState({ count: res })
                        }
                    });
                    Meteor.call('comment.notification', this.props.articleType, this.props.articleType, this.state.content, (err, res) => {
                        if (err) {
                            console.log('Error when send notification')
                        }
                    });
                })
            }
        });
    }

    loadmore() {
        this.setState({
            loading: true,
            skip: this.state.skip + 5
        },() => {
            Meteor.call('comment.getComment', this.props.articleType, this.props.articleId, this.state.skip, (err, res) => {
                if (!err) {
                    this.setState({
                        listcomment: [...this.state.listcomment, ...res],
                        loading: false
                    });
                } else {
                    this.setState({
                        loading: false
                    });
                }
            });
        })
    }

    render() {
        return (
            <div className="row">
                <div className="col l12 m12 s12 no-padding">
                {
                    (this.state.count > 1) ?
                        <h5>{this.state.count} comments</h5>
                    :
                        <h5>{this.state.count} comment</h5>
                }
                </div>
                <div className="col l12 m12 s12 no-padding">
                    <div className="row comment-input-wrapper">
                        <img src={this.state.avatar} />
                        <div className="col l12 m12 s12 no-padding">
                            <div id="comment-content" contentEditable={true} className="comment-input" onInput={(event) => this.onChangeComment(event)}></div>
                            {
                                (Meteor.userId()) ?
                                    (
                                        (this.state.name.length > 0) ?
                                            (
                                                (this.state.valid) ?
                                                    (
                                                        <span onClick={this.addComment} id="post-comment">Post as {this.state.name}</span>
                                                    )
                                                :
                                                    (
                                                        <span className="disabled" id="post-comment">Post as {this.state.name}</span>
                                                    )
                                            )
                                        :
                                            (
                                                (this.state.valid) ?
                                                    (
                                                        <span onClick={this.addComment} id="post-comment">Post as anonymous (your email will be public)</span>
                                                    )
                                                :
                                                    (
                                                        <span className="disabled" id="post-comment">Post as anonymous (your email will be public)</span>
                                                    )
                                            )
                                    )
                                :
                                    (
                                        <span className="disabled" id="post-comment">Login to post</span>
                                    )
                            }
                        </div>
                    </div>
                </div>
                <div className="col l12 m12 s12 post-list no-padding">
                    {
                        this.renderListComment()
                    }
                </div>
                {
                    (this.state.count > 5 && this.state.listcomment.length < this.state.count && !this.state.loading) ?
                        (
                            <div className="col l12 m12 s12 post-load-more no-padding">
                                <span></span>
                                <span id="load-more" onClick={() => this.loadmore()}>Load more comments</span>
                            </div>
                        )
                    :
                        ''
                }
            </div>
        )
    }
}