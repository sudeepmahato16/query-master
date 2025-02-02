import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { useMemo, useState } from 'react';
import {
  TableEditableEditorProps,
  TableEditableContentProps,
} from './TableEditableCell';
import createTableCellType from './createTableCellType';
import deepEqual from 'deep-equal';
import Button from 'renderer/components/Button';
import Modal from 'renderer/components/Modal';
import useCodeEditorTheme from 'renderer/components/CodeEditor/useCodeEditorTheme';
import TableCellContent from 'renderer/components/ResizableTable/TableCellContent';

function TableCellJsonEditor({
  value,
  onExit,
  readOnly,
}: TableEditableEditorProps) {
  const jsonStringAfterBeautify = useMemo(() => {
    return JSON.stringify(value, undefined, 2);
  }, [value]);

  const [editValue, setEditValue] = useState(jsonStringAfterBeautify);
  const theme = useCodeEditorTheme();

  return (
    <Modal
      open
      wide
      title="JSON Editor"
      onClose={() => {
        onExit(true, undefined);
      }}
    >
      <Modal.Body noPadding>
        <CodeMirror
          minHeight="300px"
          style={{ fontSize: 20, height: '100%' }}
          value={editValue}
          onChange={setEditValue}
          readOnly={readOnly}
          maxHeight="50vh"
          theme={theme}
          extensions={[json()]}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          primary
          onClick={() => {
            onExit(false, JSON.parse(editValue));
          }}
        >
          Save
        </Button>
        <Button
          onClick={() => {
            onExit(true, undefined);
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function TableCellJsonContent({ value }: TableEditableContentProps) {
  return (
    <TableCellContent
      value={value}
      badge="json"
      mono
      displayString={value ? JSON.stringify(value) : undefined}
    />
  );
}

const TableCellJson = createTableCellType({
  diff: (prev: unknown, current: unknown) => !deepEqual(prev, current),
  content: TableCellJsonContent,
  editor: TableCellJsonEditor,
  detachEditor: true,
  onCopy: (value: string) => {
    return JSON.stringify(value);
  },
  onPaste: (value: string) => {
    try {
      return { accept: true, value: JSON.parse(value) };
    } catch {
      return { accept: false, value: undefined };
    }
  },
});

export default TableCellJson;
