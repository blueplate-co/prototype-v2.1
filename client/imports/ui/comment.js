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
            expanded: false
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
            date: this.timeSince(new Date(this.props.item.create_at))
        })
    }

    render() {
        return (
            <div key={this.props.item._id} className="row post-item">
                <img src={this.state.avatar} className="commenter-avatar"/>
                <div className="col l12 m12 s12 post-container no-padding">
                    <span className="post-meta">
                        <h7 className="post-author">{this.state.name}</h7>
                        <h7 className="post-time">{this.state.date}</h7>
                    </span>
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