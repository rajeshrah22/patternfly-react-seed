import * as React from 'react';
import { Fragment, useState, useCallback, useEffect } from 'react';
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
import { CodeEditor, Language } from '@patternfly/react-code-editor';
import { NmstateReviewData, getNextReview, sendRating } from '../../api/api';

interface CodeEditorBasicProps {
  nmstateReviewItem: NmstateReviewData;
  setNmstateReviewItem: React.Dispatch<React.SetStateAction<NmstateReviewData>>;
  isLoading: boolean
}

const CodeEditorBasic: React.FunctionComponent<CodeEditorBasicProps> = ({ nmstateReviewItem, setNmstateReviewItem, isLoading }: CodeEditorBasicProps) => {
  const onEditorDidMount = (editor, monaco) => {
    editor.layout();
    editor.focus();
    monaco.editor.getModels()[0].updateOptions({ tabSize: 5 });
  };

  const loadingText = "Loading ..."

  const onDescriptionChange = (event, value) => {
    setNmstateReviewItem({
      ...nmstateReviewItem,
      description: value
    });
  };

  return (
    <>
      <Title headingLevel="h2" size="md">
        Description
      </Title>
      <TextInput
        value={isLoading ? loadingText : nmstateReviewItem.description}
        onChange={onDescriptionChange}
      />
      <CodeEditor
        isLineNumbersVisible={true}
        isLanguageLabelVisible
        language={Language.yaml}
        onEditorDidMount={onEditorDidMount}
        code={isLoading ? loadingText : nmstateReviewItem.nmstateYaml}
        isReadOnly
        height="400px"
      />
    </>
  );
}


const Review: React.FunctionComponent = () => {
  const [currentReviewItem, setCurrentReviewItem] = useState<NmstateReviewData>({ version: "", nmstateYaml: "", description: "" });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchNext = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getNextReview();
      if (!response) {
        console.log("No more items to review at the moment.");
      }
      setCurrentReviewItem(response);
    } catch (err) {
      console.error("Failed to fetch next review item:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNext();
  }, [fetchNext])

  const onAccept = async (event) => {
    const response = await sendRating({ nmstateReviewData: currentReviewItem, vote: 'ACCEPT' });
    fetchNext();
  }

  const onReject = async (event) => {
    const response = await sendRating({ nmstateReviewData: currentReviewItem, vote: 'REJECT' });
    fetchNext();
  }

  const onNeedFurtherReview = async (event) => {
    const response = await sendRating({ nmstateReviewData: currentReviewItem, vote: 'FURTHER_REVIEW' });
    fetchNext();
  }

  const reviewButtons = (
    <ActionList>
      <ActionListGroup>
        <ActionListItem>
          <Button
            variant="primary"
            id="single-group-next-button"
            onClick={onAccept}
          >
            Accept
          </Button>
        </ActionListItem>
        <ActionListItem>
          <Button
            variant="secondary"
            id="single-group-back-button"
            onClick={onReject}
          >
            Reject
          </Button>
        </ActionListItem>
        <ActionListItem>
          <Button
            variant="secondary"
            id="single-group-back-button"
            onClick={onNeedFurtherReview}
          >
            Need further review
          </Button>
        </ActionListItem>
      </ActionListGroup>
    </ActionList>
  );

  return (
    <Fragment>
      <PageSection isWidthLimited isCenterAligned hasBodyWrapper={false}>
        <Title headingLevel="h1" size="lg">Review</Title>
      </PageSection>
      <PageSection hasBodyWrapper={false}>
        <CodeEditorBasic
          nmstateReviewItem={currentReviewItem}
          setNmstateReviewItem={setCurrentReviewItem}
          isLoading={isLoading}
        />
      </PageSection>
      <PageSection isWidthLimited isCenterAligned hasBodyWrapper={false}>
        {reviewButtons}
      </PageSection>
    </Fragment>
  )
}

export { Review };
