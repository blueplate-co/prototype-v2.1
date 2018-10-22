import React, { Component } from 'react';

export default class DisqusComment extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
            if (typeof window.DISQUS === 'undefined') {
                var disqus_config = function () {
                    this.page.url = this.props.url;
                    this.page.identifier = this.props.page;
                };
                (function() { // DON'T EDIT BELOW THIS LINE
                    var d = document, s = d.createElement('script');
                    s.src = 'https://blueplate-2.disqus.com/embed.js';
                    s.setAttribute('data-timestamp', +new Date());
                    (d.head || d.body).appendChild(s);
                })();
            } else {
                DISQUS.reset({
                    reload: true,
                    config: function () {  
                        this.page.url = this.props.url;
                        this.page.identifier = this.props.page;

                    }
                });
            }
    }

    render() {
        return (
            <div id="disqus_thread"></div>
        )
    }
}