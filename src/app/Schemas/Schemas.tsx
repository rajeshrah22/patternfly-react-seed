import * as React from 'react';
import { Fragment, useState, useCallback, useRef } from 'react';
import {
  PageSection,
  Title,
  ActionList,
  ActionListGroup,
  ActionListItem,
  Alert,
  Button,
} from '@patternfly/react-core';
import { CodeEditor, Language, CodeEditorControl } from '@patternfly/react-code-editor';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import t_global_icon_color_status_success_default from '@patternfly/react-tokens/dist/esm/t_global_icon_color_status_success_default';
import t_global_icon_color_status_warning_default from '@patternfly/react-tokens/dist/esm/t_global_icon_color_status_warning_default';
import { sendSchemaContribution, validateSchema } from 'src/api/api';

type SchemaValidity = 'VALID' | 'INVALID' | 'NEUTRAL' | 'LOADING'

interface CodeEditorBasicProps {
  validity: SchemaValidity;
  validateCallback: (schema: string) => void;
  updateCurrentSchema: (schema: string) => void;
}

const CodeEditorBasic: React.FunctionComponent<CodeEditorBasicProps> = ({ validity, validateCallback, updateCurrentSchema }: CodeEditorBasicProps) => {
  const onEditorDidMount = (editor, monaco) => {
    editor.layout();
    editor.focus();
    monaco.editor.getModels()[0].updateOptions({ tabSize: 5 });
  };

  const onCircleCheckClick = (code: string, event: any) => {
    validateCallback(code);
    console.log(code);
  }

  const ColoredCustomControl: React.FunctionComponent = () => {
    switch (validity) {
      case 'VALID':
        return <CheckCircleIcon style={{ color: t_global_icon_color_status_success_default.var }} />
      case 'INVALID':
        return <CheckCircleIcon style={{ color: t_global_icon_color_status_warning_default.var }} />
      case 'NEUTRAL':
        return <CheckCircleIcon />
      case 'LOADING':
        return <CheckCircleIcon />
    }
  };

  const customControl = (
    <CodeEditorControl
      icon={<ColoredCustomControl />}
      aria-label="Verify schema"
      tooltipProps={{ content: 'Validate schema' }}
      onClick={onCircleCheckClick}
    />
  );

  const onChange = (value: string) => {
    updateCurrentSchema(value);
  }

  const exampleString = `# --- Example NMState Configuration ---
  #
  # interfaces:
  #   - name: eth0
  #     type: ethernet
  #     description: "Primary interface with static IP"
  #     state: up
  #     mtu: 1500
  #     ipv4:
  #       enabled: true
  #       address:
  #         - ip: 192.168.1.100
  #           prefix-length: 24
  #       dhcp: false
  #       gateway: 192.168.1.1
  #   - name: eth1
  #     type: ethernet
  #     description: "Secondary interface with DHCP"
  #     state: up
  #     ipv4:
  #       enabled: true
  #       dhcp: true
  #       auto-dns: true
  #       auto-gateway: true
  `;

  return (
    <Fragment>
      <CodeEditor
        isLineNumbersVisible={true}
        isLanguageLabelVisible
        customControls={customControl}
        code={exampleString}
        onChange={onChange}
        language={Language.yaml}
        onEditorDidMount={onEditorDidMount}
        height="400px"
      />
    </Fragment>
  );
}


const SchemasPage: React.FunctionComponent = () => {
  const [validity, setValidity] = useState<SchemaValidity>('NEUTRAL');

  let currentSchema = useRef("");
  let updateCurrentSchema = (schema: string) => {
    currentSchema.current = schema;
  }

  const valdiateSchemaCallback = useCallback(async (schema: string) => {
    setValidity('LOADING');

    try {
      let response = await validateSchema(schema);
      if (response) {
        setValidity('VALID');
      } else {
        setValidity('INVALID');
      }
    } catch (err) {
      setValidity('INVALID');
    }
  }, []);

  const onValidateButtonClick = (event: any) => {
    valdiateSchemaCallback(currentSchema.current);
  }

  const onSubmit = async (event: any) => {
    setValidity('LOADING');

    try {
      let response = await validateSchema(currentSchema.current);
      if (response) {
        setValidity('VALID');
      } else {
        setValidity('INVALID');
        return;
      }
    } catch (err) {
      setValidity('INVALID');
      return;
    }

    sendSchemaContribution({ nmstateYaml: currentSchema.current });
  }

  const reviewButtons = (
    <ActionList>
      <ActionListGroup>
        <ActionListItem>
          <Button
            variant="primary"
            id="single-group-next-button"
            onClick={onSubmit}
          >
            Submit
          </Button>
        </ActionListItem>
        <ActionListItem>
          <Button
            variant="secondary"
            id="single-group-next-button"
            onClick={onValidateButtonClick}
          >
            Validate
          </Button>
        </ActionListItem>
      </ActionListGroup>
    </ActionList>
  );

  return (
    <Fragment>
      <PageSection isWidthLimited isCenterAligned hasBodyWrapper={false}>
        <Title headingLevel="h1" size="lg">Contribute nmstate schemas, validate before saving</Title>
      </PageSection>
      <PageSection hasBodyWrapper={false}>
        <CodeEditorBasic
          validity={validity}
          validateCallback={valdiateSchemaCallback}
          updateCurrentSchema={updateCurrentSchema}
        />
      </PageSection>
      <PageSection isWidthLimited isCenterAligned hasBodyWrapper={false}>
        {reviewButtons}
      </PageSection>
      <PageSection>
        {
          validity == 'INVALID'
            ?
            <Alert
              variant="warning"
              title="Schema invalid, please edit before trying again"
              ouiaId="WarningAlert"
              style={{ maxWidth: "50%", margin: "auto", boxShadow: "none" }}
            />
            :
            <></>
        }
      </PageSection>
    </Fragment>
  )

}
export { SchemasPage };
