import * as React from 'react';
import {Fragment, useState } from 'react';
import {
  PageSection,
  Title,
  Button,
  Tooltip,
  Checkbox,
  TextInput,
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode,
  ClipboardCopyButton
} from '@patternfly/react-core';
import { CodeEditor, Language } from '@patternfly/react-code-editor';
import PlayIcon from '@patternfly/react-icons/dist/esm/icons/play-icon';

const CodeEditorBasic: React.FunctionComponent = () => {
  const onEditorDidMount = (editor, monaco) => {
    editor.layout();
    editor.focus();
    monaco.editor.getModels()[0].updateOptions({ tabSize: 5 });
  };

  const onChange = (value) => {
    console.log(value);
  };

  const exampleString = `interfaces:
  - name: eth0
    type: ethernet
    state: up
    mac-address: "DE:AD:BE:EF:CA:FE" # Optional: Set a specific MAC address
    mtu: 1500
    ipv4:
      enabled: true
      address:
        - ip: 192.168.1.10
          prefix-length: 24
      dhcp: false
      dns:
        server:
          - 8.8.8.8
          - 8.8.4.4
        search:
          - mydomain.local
    ipv6:
      enabled: true
      address:
        - ip: 2001:db8::10
          prefix-length: 64
      dhcp: false
  `

  return (
    <>
      <Title headingLevel="h2" size="md">
        Description
      </Title>
      <TextInput />
      <CodeEditor
        isLineNumbersVisible={true}
        isLanguageLabelVisible
        code={exampleString}
        onChange={onChange}
        language={Language.yaml}
        onEditorDidMount={onEditorDidMount}
        height="400px"
      />
    </>
  );
}

const Dashboard: React.FunctionComponent = () => (
  <>
    <PageSection isWidthLimited isCenterAligned hasBodyWrapper={false}>
      <Title headingLevel="h1" size="lg">Review</Title>
    </PageSection>
    <PageSection hasBodyWrapper={false}>
    <CodeEditorBasic />
    </PageSection>
  </>
)

export { Dashboard };
