import React, { Component } from 'react';

export default class DisqusComment extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var disqus_config = function () {
            this.page.url = this.props.url;
            this.page.identifier = this.props.page; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
        };
        (function() { // DON'T EDIT BELOW THIS LINE
            var d = document, s = d.createElement('script');
            s.src = 'https://blueplate-2.disqus.com/embed.js';
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
        })();
    }

    render() {
        return (
            <div>
                <div id="disqus_thread"></div>
            </div>
        )
    }
}