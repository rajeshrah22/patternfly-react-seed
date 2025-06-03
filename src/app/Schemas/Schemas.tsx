import * as React from 'react';
import { Fragment, useState } from 'react';
import {
  PageSection,
  Title,
  ActionList,
  ActionListGroup,
  ActionListItem,
  Button,
  Tooltip,
  TextInput,
} from '@patternfly/react-core';
import { CodeEditor, Language, CodeEditorControl } from '@patternfly/react-code-editor';
import PlayIcon from '@patternfly/react-icons/dist/esm/icons/play-icon';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import t_global_icon_color_status_success_default from '@patternfly/react-tokens/dist/esm/t_global_icon_color_status_success_default';

/*
 * So what kind of state do we need right now?
 * We need:
 * Content of the descirption field.
 * Content of the YAML schema.
 * functions to execute when yes/no is clicked.
 */

/* More things to display:
 * Errors in validation.
 *
 * Some tooltips to talk about what each component/button does
 *   when you hover over them.
 *
 * Alerts for when things are done success or failiure.
 */

/*  Other state:
 *  is the code valid? Add a validate button.
 */

const CodeEditorBasic: React.FunctionComponent = () => {
  const onEditorDidMount = (editor, monaco) => {
    editor.layout();
    editor.focus();
    monaco.editor.getModels()[0].updateOptions({ tabSize: 5 });
  };

  const onChange = (value) => {
    console.log(value);
  };

  const customControl = (
    <CodeEditorControl
      icon={<CheckCircleIcon style={{ color: t_global_icon_color_status_success_default.var }} />}
      aria-label="Verify schema"
      tooltipProps={{ content: 'Validate schema' }}
    />
  );

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
      <CodeEditor
        isLineNumbersVisible={true}
        isLanguageLabelVisible
        code={exampleString}
        onChange={onChange}
        customControls={customControl}
        language={Language.yaml}
        onEditorDidMount={onEditorDidMount}
        height="400px"
      />
    </>
  );
}

const reviewButtons = (
  <ActionList>
    <ActionListGroup>
      <ActionListItem>
        <Button variant="primary" id="single-group-next-button">
          Validate
        </Button>
      </ActionListItem>
    </ActionListGroup>
  </ActionList>
);

const SchemasPage: React.FunctionComponent = () => (
  <React.Fragment>
    <PageSection isWidthLimited isCenterAligned hasBodyWrapper={false}>
      <Title headingLevel="h1" size="lg">Contribute nmstate schemas, validate before saving</Title>
    </PageSection>
    <PageSection hasBodyWrapper={false}>
      <CodeEditorBasic />
    </PageSection>
    <PageSection isWidthLimited isCenterAligned hasBodyWrapper={false}>
      {reviewButtons}
    </PageSection>
  </React.Fragment>
)

export { SchemasPage };
