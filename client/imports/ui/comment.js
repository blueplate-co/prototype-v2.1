import React, { Component } from 'react';

export default class CommentBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row">
                <div className="col l12 m12 s12 no-padding">
                    <h5>5 comments</h5>
                </div>
                <div className="col l12 m12 s12 no-padding">
                    <div className="row comment-input-wrapper">
                        <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/foody.svg" />
                        <div className="col l12 m12 s12 no-padding">
                            <div id="comment-content" contentEditable={true} className="comment-input"></div>
                            <span id="post-comment">Post as Tan Pham</span>
                        </div>
                    </div>
                </div>
                <div className="col l12 m12 s12 post-list no-padding">
                    <div className="row post-item">
                        <img src="https://tanpham.netlify.com/img/6.jpg" className="commenter-avatar"/>
                        <div className="col l12 m12 s12 no-padding">
                            <span className="post-meta">
                                <h7 className="post-author">Tan Pham</h7>
                                <i className="fa fa-circle" aria-hidden="true"></i>
                                <h7 className="post-time">5 months ago</h7>
                            </span>
                            <span className="post-content">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                <p className="post-see-more">See more</p>
                            </span>
                        </div>
                    </div>
                    <div className="row post-item">
                        <img src="https://tanpham.netlify.com/img/6.jpg" className="commenter-avatar"/>
                        <div className="col l12 m12 s12 no-padding">
                            <span className="post-meta">
                                <h7 className="post-author">Tan Pham</h7>
                                <i className="fa fa-circle" aria-hidden="true"></i>
                                <h7 className="post-time">5 months ago</h7>
                            </span>
                            <span className="post-content">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                <p className="post-see-more">See more</p>
                            </span>
                        </div>
                    </div>
                    <div className="row post-item">
                        <img src="https://tanpham.netlify.com/img/6.jpg" className="commenter-avatar"/>
                        <div className="col l12 m12 s12 no-padding">
                            <span className="post-meta">
                                <h7 className="post-author">Tan Pham</h7>
                                <i className="fa fa-circle" aria-hidden="true"></i>
                                <h7 className="post-time">5 months ago</h7>
                            </span>
                            <span className="post-content">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                <p className="post-see-more">See more</p>
                            </span>
                        </div>
                    </div>
                    <div className="row post-item">
                        <img src="https://tanpham.netlify.com/img/6.jpg" className="commenter-avatar"/>
                        <div className="col l12 m12 s12 no-padding">
                            <span className="post-meta">
                                <h7 className="post-author">Tan Pham</h7>
                                <i className="fa fa-circle" aria-hidden="true"></i>
                                <h7 className="post-time">5 months ago</h7>
                            </span>
                            <span className="post-content">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                <p className="post-see-more">See more</p>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col l12 m12 s12 post-load-more no-padding">
                    <span></span>
                    <span id="load-more">Load more comments</span>
                </div>
            </div>
        )
    }
}