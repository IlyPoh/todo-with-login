import * as yup from 'yup';
import { numberRegex } from './constants';

export const loginSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(numberRegex, 'Phone number is not valid'),
});
