import * as monacoEditor from 'monaco-editor';
import React, { PureComponent } from 'react';
import MonacoEditor from 'react-monaco-editor';

interface IProps {
  content: string;
}

export default class Code extends PureComponent<IProps> {
  options: monacoEditor.editor.IEditorConstructionOptions = {
    readOnly: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false
  };

  get height() {
    return 19 * this.props.content.split('\n').length;
  }

  render() {
    const { content } = this.props;

    return (
      <MonacoEditor
        height={this.height}
        language='typescript'
        theme='vs-dark'
        value={content}
        options={this.options}
      />
    );
  }
}