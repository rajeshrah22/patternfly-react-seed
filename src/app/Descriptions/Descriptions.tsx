import * as React from 'react';
import { CubesIcon } from '@patternfly/react-icons';
import {
  Title,
  TextInput,
  PageSection,
} from '@patternfly/react-core';

// eslint-disable-next-line prefer-const
let DescriptionsPage: React.FunctionComponent = () => (
  <React.Fragment>
    <PageSection hasBodyWrapper={false}>
      <PageSection isWidthLimited isCenterAligned hasBodyWrapper={false}>
        <Title headingLevel="h1" size="lg">Contribute descriptions for nmstate schemas</Title>
      </PageSection>
    </PageSection>
    <PageSection>
      <Title headingLevel="h2" size="md">
        Description
      </Title>
      <TextInput />
    </PageSection>
  </React.Fragment>
);

export { DescriptionsPage };
