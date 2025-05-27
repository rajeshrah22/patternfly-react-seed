import * as React from 'react';
import {Fragment, useState } from 'react';
import {
  PageSection,
  Title,
  Button,
  Tooltip,
  Checkbox,
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode,
  ClipboardCopyButton
} from '@patternfly/react-core';
import { CodeEditor, Language } from '@patternfly/react-code-editor';
import PlayIcon from '@patternfly/react-icons/dist/esm/icons/play-icon';

const BasicCodeBlock: React.FunctionComponent = () => {
  const [copied, setCopied] = useState(false);
  const [isRunning, setisRunning] = useState(false);
  const runText: string = 'Run in web terminal';
  const doneRunText: string = 'Running in web terminal';

  const clipboardCopyFunc = (event, text) => {
    navigator.clipboard.writeText(text.toString());
  };

  const onClick = (event, text) => {
    clipboardCopyFunc(event, text);
    setCopied(true);
  };

  const code = String.raw`apiVersion: helm.openshift.io/v1beta1/
  kind: HelmChartRepository
  metadata:
  name: azure-sample-repo0oooo00ooo
  spec:
  connectionConfig:
  url: https://raw.githubusercontent.com/Azure-Samples/helm-charts/master/docs`;

  const actions = (
    <Fragment>
      <CodeBlockAction>
        <ClipboardCopyButton
          id="basic-copy-button"
          textId="code-content"
          aria-label="Copy to clipboard"
          onClick={(e) => onClick(e, code)}
          exitDelay={copied ? 1500 : 600}
          maxWidth="110px"
          variant="plain"
          onTooltipHidden={() => setCopied(false)}
        >
          {copied ? 'Successfully copied to clipboard!' : 'Copy to clipboard'}
        </ClipboardCopyButton>
      </CodeBlockAction>
      <CodeBlockAction>
        <Tooltip
          aria="none"
          aria-live="polite"
          content={isRunning ? doneRunText : runText}
          onTooltipHidden={() => setisRunning(false)}
        >
          <Button
            variant="plain"
            aria-label="Run in web terminal"
            icon={<PlayIcon />}
            onClick={() => setisRunning(!isRunning)}
          />
        </Tooltip>
      </CodeBlockAction>
    </Fragment>
  );

  return (
    <CodeBlock actions={actions}>
      <CodeBlockCode id="code-content">{code}</CodeBlockCode>
    </CodeBlock>
  );
}

const CodeEditorBasic: React.FunctionComponent = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isLineNumbersVisible, setIsLineNumbersVisibile] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isMinimapVisible, setIsMinimapVisible] = useState(false);

  const toggleDarkTheme = (checked) => {
    setIsDarkTheme(checked);
  };

  const toggleLineNumbers = (checked) => {
    setIsLineNumbersVisible(checked);
  };

  const toggleReadOnly = (checked) => {
    setIsReadonly(checked);
  };

  const toggleMinimap = (checked) => {
    setIsMinimapVisible(checked);
  };

  const onEditorDidMount = (editor, monaco) => {
    editor.layout();
    editor.focus();
    monaco.editor.getModels()[0].updateOptions({ tabSize: 5 });
  };

  const onChange = (value) => {
    console.log(value);
  };

  return (
    <>
      <Checkbox
        label="Dark theme"
        isChecked={isDarkTheme}
        onChange={(_event, checked) => toggleDarkTheme(checked)}
        aria-label="dark theme checkbox"
        id="toggle-theme"
        name="toggle-theme"
      />
      <Checkbox
        label="Line numbers"
        isChecked={isLineNumbersVisible}
        onChange={(_event, checked) => toggleLineNumbers(checked)}
        aria-label="line numbers checkbox"
        id="toggle-line-numbers"
        name="toggle-line-numbers"
      />
      <Checkbox
        label="Read only"
        isChecked={isReadOnly}
        onChange={(_event, checked) => toggleReadOnly(checked)}
        aria-label="read only checkbox"
        id="toggle-read-only"
        name="toggle-read-only"
      />
      <Checkbox
        label="Minimap"
        isChecked={isMinimapVisible}
        onChange={(_event, checked) => toggleMinimap(checked)}
        aria-label="display minimap checkbox"
        id="toggle-minimap"
        name="toggle-minimap"
      />
      <CodeEditor
        isDarkTheme={isDarkTheme}
        isLineNumbersVisible={isLineNumbersVisible}
        isReadOnly={isReadOnly}
        isMinimapVisible={isMinimapVisible}
        isLanguageLabelVisible
        code="Some example content"
        onChange={onChange}
        language={Language.javascript}
        onEditorDidMount={onEditorDidMount}
        height="400px"
      />
    </>
  );
}

const Dashboard: React.FunctionComponent = () => (
  <>
    {console.log("hello")}
    <PageSection hasBodyWrapper={false}>
      <Title headingLevel="h1" size="lg">Dashboard Page Title!</Title>
    </PageSection>
    {/*<BasicCodeBlock />*/}
    <CodeEditorBasic />
  </>
)

export { Dashboard };
