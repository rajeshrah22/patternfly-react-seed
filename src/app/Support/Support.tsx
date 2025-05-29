import * as React from 'react';
import { CubesIcon } from '@patternfly/react-icons';
import {
  Title,
  TextInput,
  Fragment,
  PageSection,
} from '@patternfly/react-core';

// eslint-disable-next-line prefer-const
let Support: React.FunctionComponent<ISupportProps> = () => (
  <>
    <PageSection hasBodyWrapper={false}>
      <PageSection isWidthLimited isCenterAligned hasBodyWrapper={false}>
        <Title headingLevel="h1" size="lg">Write</Title>
      </PageSection>
    </PageSection>
    <PageSection>
      <Title headingLevel="h2" size="md">
        Description
      </Title>
      <TextInput />
    </PageSection>
  </>
);

export { Support };
