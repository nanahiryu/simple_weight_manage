import { Input, InputProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

const EditRowInput = forwardRef((props: InputProps, ref) => {
  return (
    <Input w="200px" fontSize="sm" border="1px" borderColor="gray.200" bg="bg.body" rounded="lg" {...props} ref={ref} />
  );
});
EditRowInput.displayName = 'EditModalRowInput';

export default EditRowInput;
