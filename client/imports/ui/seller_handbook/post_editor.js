import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';

export default class PostEditor extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className = "browser-default">
      <ReactQuill
        theme="bubble"
        placeholder = "start typing your article content here. Hightlight the text when you'd like to style it."
        value={this.props.text}
        onChange={this.props.handleChange}
        format={PostEditor.formats}
        modules={PostEditor.modules}
      />
      </div>
    )
  }
}

PostEditor.modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}],
    ['bold', 'italic', 'underline', 'strike'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'align': []}],
    ['link', 'image'],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  }
}
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
PostEditor.formats = [
  'header', 'size',
  'bold', 'italic', 'underline',
  'list', 'bullet',
  'link', 'image',
]
